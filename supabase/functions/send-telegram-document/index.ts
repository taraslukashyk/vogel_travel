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
    let message = ''
    let documentBase64 = ''
    let filename = 'invoice.pdf'

    try {
      const body = await req.json()
      message = body.message || ''
      documentBase64 = body.document || ''
      filename = body.filename || 'invoice.pdf'
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!message || !documentBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message and document are required' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: `Missing env vars` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('telegram_bot_token, telegram_chat_id')
      .single()

    if (settingsError) {
      return new Response(
        JSON.stringify({ success: false, error: `DB error: ${settingsError.message}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Telegram Token або Chat ID не заповнені в налаштуваннях сайту' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Decode base64 to binary
    const binaryStr = atob(documentBase64)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }

    // Send document via Telegram sendDocument (multipart/form-data)
    const formData = new FormData()
    formData.append('chat_id', settings.telegram_chat_id)
    formData.append('caption', message.substring(0, 1024)) // Telegram caption limit
    formData.append('parse_mode', 'HTML')
    formData.append('document', new Blob([bytes], { type: 'application/pdf' }), filename)

    const tgRes = await fetch(
      `https://api.telegram.org/bot${settings.telegram_bot_token}/sendDocument`,
      { method: 'POST', body: formData }
    )

    const tgData = await tgRes.json()

    if (!tgRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Telegram API: ${tgData.description || 'Unknown error'}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
