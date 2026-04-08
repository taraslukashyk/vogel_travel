import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

// Cache the public key in memory
let cachedPubKey: string | null = null

async function getMonobankPublicKey(token: string): Promise<string> {
  const response = await fetch('https://api.monobank.ua/api/merchant/pubkey', {
    headers: { 'X-Token': token },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch Monobank public key: ${response.status}`)
  }
  const data = await response.json()
  return data.key
}

async function verifySignature(pubKeyBase64: string, xSignBase64: string, body: Uint8Array): Promise<boolean> {
  try {
    // Decode the base64 public key to PEM
    const pubKeyPem = new TextDecoder().decode(
      Uint8Array.from(atob(pubKeyBase64), c => c.charCodeAt(0))
    )

    // Extract the base64 content between PEM headers
    const pemContent = pubKeyPem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '')

    const pubKeyBytes = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0))

    // Import the ECDSA public key
    const cryptoKey = await crypto.subtle.importKey(
      'spki',
      pubKeyBytes.buffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    )

    // Decode the signature
    const signature = Uint8Array.from(atob(xSignBase64), c => c.charCodeAt(0))

    // Hash the body with SHA-256 and verify
    const isValid = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      cryptoKey,
      signature,
      body
    )

    return isValid
  } catch (err) {
    console.error('Signature verification error:', err)
    return false
  }
}

async function sendTelegramMessage(supabase: any, message: string) {
  try {
    const { data: settings } = await supabase
      .from('settings')
      .select('telegram_bot_token, telegram_chat_id')
      .single()

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      console.error('Telegram settings not configured')
      return
    }

    await fetch(
      `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegram_chat_id,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )
  } catch (err) {
    console.error('Telegram notification error:', err)
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const token = Deno.env.get('MONOBANK_TOKEN')
    if (!token) {
      console.error('MONOBANK_TOKEN not configured')
      return new Response('OK', { status: 200 })
    }

    // Read raw body for signature verification
    const rawBody = new Uint8Array(await req.arrayBuffer())
    const xSign = req.headers.get('X-Sign')

    if (!xSign) {
      console.error('Missing X-Sign header')
      return new Response('OK', { status: 200 })
    }

    // Verify signature
    if (!cachedPubKey) {
      cachedPubKey = await getMonobankPublicKey(token)
    }

    let isValid = await verifySignature(cachedPubKey, xSign, rawBody)

    // If verification fails, try refreshing the public key
    if (!isValid) {
      console.log('Signature verification failed, refreshing public key...')
      cachedPubKey = await getMonobankPublicKey(token)
      isValid = await verifySignature(cachedPubKey, xSign, rawBody)
    }

    if (!isValid) {
      console.error('Webhook signature verification failed')
      return new Response('OK', { status: 200 })
    }

    // Parse the webhook body
    const bodyText = new TextDecoder().decode(rawBody)
    const webhookData = JSON.parse(bodyText)

    const {
      invoiceId,
      status,
      amount,
      finalAmount,
      failureReason,
      modifiedDate,
      reference,
      paymentInfo,
    } = webhookData

    console.log(`Webhook received: invoiceId=${invoiceId}, status=${status}`)

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update payment record
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (finalAmount !== undefined) updateData.final_amount = finalAmount
    if (failureReason) updateData.failure_reason = failureReason
    if (modifiedDate) updateData.monobank_modified_date = modifiedDate
    if (paymentInfo) updateData.payment_info = paymentInfo

    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('invoice_id', invoiceId)
      .select('customer_name, customer_email, customer_phone, service_title, amount')
      .single()

    if (updateError) {
      console.error('DB update error:', updateError)
    }

    // Send Telegram notification
    if (status === 'success' && payment) {
      const amountUAH = (payment.amount / 100).toFixed(2)
      const telegramMessage = `
<b>✅ ОПЛАТА УСПІШНА</b>
<b>Сервіс:</b> ${payment.service_title || 'N/A'}
<b>Сума:</b> ${amountUAH} грн
<b>Клієнт:</b> ${payment.customer_name}
<b>Телефон:</b> ${payment.customer_phone || 'N/A'}
<b>Email:</b> ${payment.customer_email || 'N/A'}
<b>Invoice:</b> ${invoiceId}
${paymentInfo?.maskedPan ? `<b>Картка:</b> ${paymentInfo.maskedPan}` : ''}`.trim()

      await sendTelegramMessage(supabase, telegramMessage)
    } else if (status === 'failure' && payment) {
      const amountUAH = (payment.amount / 100).toFixed(2)
      const telegramMessage = `
<b>❌ ОПЛАТА НЕ ВДАЛАСЯ</b>
<b>Сервіс:</b> ${payment.service_title || 'N/A'}
<b>Сума:</b> ${amountUAH} грн
<b>Клієнт:</b> ${payment.customer_name}
<b>Причина:</b> ${failureReason || 'Невідома'}
<b>Invoice:</b> ${invoiceId}`.trim()

      await sendTelegramMessage(supabase, telegramMessage)
    } else if (status === 'reversed' && payment) {
      const amountUAH = (payment.amount / 100).toFixed(2)
      const telegramMessage = `
<b>↩️ ПОВЕРНЕННЯ КОШТІВ</b>
<b>Сервіс:</b> ${payment.service_title || 'N/A'}
<b>Сума:</b> ${amountUAH} грн
<b>Клієнт:</b> ${payment.customer_name}
<b>Invoice:</b> ${invoiceId}`.trim()

      await sendTelegramMessage(supabase, telegramMessage)
    }

    // Always return 200 to acknowledge the webhook
    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Return 200 even on error to prevent Monobank retries for non-recoverable errors
    return new Response('OK', { status: 200 })
  }
})
