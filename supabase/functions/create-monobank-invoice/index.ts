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
    const { amount, ccy, merchantPaymInfo, redirectUrl, webHookUrl } = await req.json()

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
        merchantPaymInfo,
        redirectUrl,
        webHookUrl,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Monobank API error:', data)
      return new Response(
        JSON.stringify({ error: data.errText || 'Monobank API error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
