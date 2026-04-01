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
    let audioBase64 = ''
    let filename = 'voice.ogg'

    const body = await req.json()
    message = body.message || ''
    audioBase64 = body.audio || ''
    filename = body.filename || 'voice.ogg'
    const replyToMessageId = body.reply_to_message_id || null

    console.log('Received request:', { 
      hasMessage: !!message, 
      hasAudio: !!audioBase64, 
      audioLength: audioBase64?.length,
      filename,
      replyToMessageId
    })

    if (!audioBase64) {
      console.error('No audio data received')
      return new Response(
        JSON.stringify({ success: false, error: 'Audio data is required' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('telegram_bot_token, telegram_chat_id')
      .single()

    if (settingsError || !settings?.telegram_bot_token) {
      console.error('Settings error:', settingsError)
      return new Response(
        JSON.stringify({ success: false, error: `DB error: ${settingsError?.message}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Decode base64 — strip data URL prefix if present
    const rawBase64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64
    
    let bytes: Uint8Array
    try {
      const binaryStr = atob(rawBase64)
      bytes = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      console.log('Audio decoded, bytes:', bytes.length)
    } catch (decodeErr) {
      console.error('Base64 decode error:', decodeErr)
      return new Response(
        JSON.stringify({ success: false, error: `Decode error: ${decodeErr}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Try with Blob as audio file — Telegram needs specific format
    const formData = new FormData()
    formData.append('chat_id', settings.telegram_chat_id)
    if (message) formData.append('caption', message.substring(0, 1024))
    if (replyToMessageId) formData.append('reply_to_message_id', replyToMessageId.toString())
    
    // Use generic 'audio' field instead of 'voice' to avoid Opus restriction
    const audioBlob = new Blob([bytes], { type: 'audio/ogg' })
    formData.append('voice', audioBlob, 'voice.ogg')

    console.log('Sending to Telegram sendVoice...')

    const tgRes = await fetch(
      `https://api.telegram.org/bot${settings.telegram_bot_token}/sendVoice`,
      { method: 'POST', body: formData }
    )

    const tgData = await tgRes.json()
    console.log('Telegram response:', JSON.stringify(tgData))

    if (!tgData.ok) {
      // Fallback: try sendAudio instead
      console.log('sendVoice failed, trying sendAudio fallback...')
      
      const formData2 = new FormData()
      formData2.append('chat_id', settings.telegram_chat_id)
      if (message) formData2.append('caption', message.substring(0, 1024))
      if (replyToMessageId) formData2.append('reply_to_message_id', replyToMessageId.toString())
      
      const audioBlob2 = new Blob([bytes], { type: 'audio/ogg' })
      formData2.append('audio', audioBlob2, 'voice.ogg')

      const tgRes2 = await fetch(
        `https://api.telegram.org/bot${settings.telegram_bot_token}/sendAudio`,
        { method: 'POST', body: formData2 }
      )
      const tgData2 = await tgRes2.json()
      console.log('Telegram sendAudio response:', JSON.stringify(tgData2))

      if (!tgData2.ok) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Voice: ${tgData.description}, Audio: ${tgData2.description}`,
            voiceResponse: tgData,
            audioResponse: tgData2
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
