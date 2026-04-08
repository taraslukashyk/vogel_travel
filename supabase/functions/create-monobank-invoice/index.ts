import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      amount,
      ccy,
      merchantPaymInfo,
      redirectUrl,
      webHookUrl,
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      serviceTitle,
    } = await req.json()

    // Create Supabase client with service role for DB writes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const reference = merchantPaymInfo?.reference || `payment_${Date.now()}`

    // 1. Create payment record in DB
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        status: 'pending',
        amount,
        ccy: ccy || 980,
        service_id: serviceId || null,
        service_title: serviceTitle || null,
        customer_name: customerName || 'Unknown',
        customer_email: customerEmail || null,
        customer_phone: customerPhone || null,
        reference,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      // Continue even if DB fails — payment flow should not be blocked
    }

    // 2. Call Monobank API
    const token = Deno.env.get('MONOBANK_TOKEN')

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Monobank token not configured (MONOBANK_TOKEN env var is missing)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        ccy,
        merchantPaymInfo: {
          ...merchantPaymInfo,
          reference,
        },
        redirectUrl,
        webHookUrl,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Monobank API error:', data)

      // Update payment status to failure
      if (payment?.id) {
        await supabase
          .from('payments')
          .update({ status: 'failure', failure_reason: data.errText || 'Monobank API error', updated_at: new Date().toISOString() })
          .eq('id', payment.id)
      }

      return new Response(
        JSON.stringify({ error: data.errText || 'Monobank API error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Update payment with invoice_id
    if (payment?.id && data.invoiceId) {
      await supabase
        .from('payments')
        .update({ invoice_id: data.invoiceId, updated_at: new Date().toISOString() })
        .eq('id', payment.id)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
