const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ServiceAccountKey {
  client_email: string
  private_key: string
}

async function generateJWT(key: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const b64url = (str: string) =>
    btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const headerB64 = b64url(JSON.stringify(header))
  const payloadB64 = b64url(JSON.stringify(payload))
  const signingInput = `${headerB64}.${payloadB64}`

  const pem = key.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
  const binaryKey = Uint8Array.from(atob(pem), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  const sigB64 = b64url(String.fromCharCode(...new Uint8Array(signature)))
  return `${signingInput}.${sigB64}`
}

async function getAccessToken(key: ServiceAccountKey): Promise<string> {
  const jwt = await generateJWT(key)
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`OAuth2 error: ${JSON.stringify(data)}`)
  return data.access_token
}

function dateRange(days: number) {
  return [{ startDate: `${days}daysAgo`, endDate: 'today' }]
}

Deno.serve(async (req) => {
  console.log(`[GA4] Request received: ${req.method}`)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const propertyId = Deno.env.get('GA4_PROPERTY_ID')
    const keyRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || Deno.env.get('GA4_SERVICE_ACCOUNT_KEY')
    const b64Key = Deno.env.get('GA4_SERVICE_ACCOUNT_B64')

    if (!propertyId || (!keyRaw && !b64Key)) {
      console.error('[GA4] Error: Missing environment variables (GA4_PROPERTY_ID or key)')
      return new Response(
        JSON.stringify({ configured: false, error: 'Missing environment variables' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[GA4] Parsing JSON key...')
    const body = await req.json().catch(() => ({}))
    const days: number = Number(body.days) || 30

    let serviceKey: ServiceAccountKey
    try {
      if (b64Key) {
        // Decode base64
        const decoded = atob(b64Key)
        const utf8 = new TextDecoder().decode(Uint8Array.from(decoded, c => c.charCodeAt(0)))
        serviceKey = JSON.parse(utf8)
      } else {
        serviceKey = JSON.parse(keyRaw!)
      }
    } catch (e) {
      console.error('[GA4] JSON Parse Error:', String(e))
      throw new Error(`Invalid JSON in service account key: ${String(e)}`)
    }

    console.log('[GA4] Authenticating with Google...')
    const accessToken = await getAccessToken(serviceKey)
    console.log('[GA4] Google Auth successful')

    const range = dateRange(days)
    console.log(`[GA4] Fetching reports for ${days} days...`)

    const req1 = fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              dateRanges: range,
              metrics: [
                { name: 'sessions' },
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
                { name: 'engagementRate' },
                { name: 'averageSessionDuration' },
              ],
            },
            // 1: Dynamics by days
            {
              dateRanges: range,
              dimensions: [{ name: 'date' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
            },
            {
              dateRanges: range,
              dimensions: [{ name: 'sessionDefaultChannelGroup' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            },
            {
              dateRanges: range,
              dimensions: [{ name: 'country' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
              limit: 8,
            },
            {
              dateRanges: range,
              dimensions: [{ name: 'deviceCategory' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            },
          ],
        }),
      }
    )

    const req2 = fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            // 0: Cities
            {
              dateRanges: range,
              dimensions: [{ name: 'city' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
              limit: 8,
            },
            // 1: Events
            {
              dateRanges: range,
              dimensions: [{ name: 'eventName' }],
              metrics: [{ name: 'eventCount' }],
              orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
              limit: 10,
            },
          ],
        }),
      }
    )

    const [reportsRes1, reportsRes2] = await Promise.all([req1, req2])

    if (!reportsRes1.ok || !reportsRes2.ok) {
      const errText = !reportsRes1.ok ? await reportsRes1.text() : await reportsRes2.text()
      console.error(`[GA4] API Error:`, errText)
      throw new Error(`GA4 API error: ${errText}`)
    }

    const reportsData1 = await reportsRes1.json()
    const reportsData2 = await reportsRes2.json()
    
    console.log('[GA4] Data received successfully')
    const reports = reportsData1.reports as Array<{ rows?: Array<{ dimensionValues?: Array<{value: string}>, metricValues: Array<{value: string}> }> }>
    const  reportsPart2 = reportsData2.reports as Array<{ rows?: Array<{ dimensionValues?: Array<{value: string}>, metricValues: Array<{value: string}> }> }>

    // --- Parse KPI ---
    const kpiRow = reports[0]?.rows?.[0]
    const kpis = {
      sessions: Number(kpiRow?.metricValues[0]?.value ?? 0),
      users: Number(kpiRow?.metricValues[1]?.value ?? 0),
      pageViews: Number(kpiRow?.metricValues[2]?.value ?? 0),
      engagementRate: Number(kpiRow?.metricValues[3]?.value ?? 0),
      avgSessionDuration: Number(kpiRow?.metricValues[4]?.value ?? 0),
    }

    // --- Parse Dynamics by days ---
    const dailyDynamics = (reports[1]?.rows ?? []).map(row => {
      const dateStr = row.dimensionValues?.[0]?.value ?? ''
      // Convert YYYYMMDD to DD.MM
      const formattedDate = dateStr.length === 8 
        ? `${dateStr.substring(6, 8)}.${dateStr.substring(4, 6)}` 
        : dateStr
      return {
        date: formattedDate,
        sessions: Number(row.metricValues[0]?.value ?? 0),
      }
    })

    // --- Parse Channels ---
    const totalSessionsChannels = (reports[2]?.rows ?? []).reduce((s, r) => s + Number(r.metricValues[0]?.value ?? 0), 0)
    const channels = (reports[2]?.rows ?? []).map(row => ({
      name: row.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: Number(row.metricValues[0]?.value ?? 0),
      pct: totalSessionsChannels > 0
        ? Math.round(Number(row.metricValues[0]?.value ?? 0) / totalSessionsChannels * 100)
        : 0,
    }))

    // --- Parse Countries ---
    const totalSessionsCountries = (reports[3]?.rows ?? []).reduce((s, r) => s + Number(r.metricValues[0]?.value ?? 0), 0)
    const countries = (reports[3]?.rows ?? []).map(row => ({
      name: row.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: Number(row.metricValues[0]?.value ?? 0),
      pct: totalSessionsCountries > 0
        ? Math.round(Number(row.metricValues[0]?.value ?? 0) / totalSessionsCountries * 100)
        : 0,
    }))

    // --- Parse Devices ---
    const totalSessionsDevices = (reports[4]?.rows ?? []).reduce((s, r) => s + Number(r.metricValues[0]?.value ?? 0), 0)
    const devices = (reports[4]?.rows ?? []).map(row => ({
      name: row.dimensionValues?.[0]?.value ?? 'unknown',
      sessions: Number(row.metricValues[0]?.value ?? 0),
      pct: totalSessionsDevices > 0
        ? Math.round(Number(row.metricValues[0]?.value ?? 0) / totalSessionsDevices * 100)
        : 0,
    }))

    // --- Parse Cities ---
    const totalSessionsCities = (reportsPart2[0]?.rows ?? []).reduce((s, r) => s + Number(r.metricValues[0]?.value ?? 0), 0)
    const cities = (reportsPart2[0]?.rows ?? []).map(row => ({
      name: row.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: Number(row.metricValues[0]?.value ?? 0),
      pct: totalSessionsCities > 0
        ? Math.round(Number(row.metricValues[0]?.value ?? 0) / totalSessionsCities * 100)
        : 0,
    }))

    // --- Parse Events ---
    const events = (reportsPart2[1]?.rows ?? []).map(row => ({
      name: row.dimensionValues?.[0]?.value ?? 'Unknown',
      count: Number(row.metricValues[0]?.value ?? 0),
    }))

    return new Response(
      JSON.stringify({ configured: true, kpis, dailyDynamics, channels, countries, devices, cities, events }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[GA4] Critical Error:', String(err))
    return new Response(
      JSON.stringify({ configured: true, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
