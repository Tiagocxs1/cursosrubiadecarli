import { createSign, timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function base64url(value: string) {
  return Buffer.from(value).toString('base64url')
}

function makeAssertion(serviceAccount: { client_email: string; private_key: string }) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const unsigned = header + '.' + claim
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  return unsigned + '.' + signer.sign(serviceAccount.private_key, 'base64url')
}

async function getAccessToken(serviceAccount: { client_email: string; private_key: string }) {
  const assertion = makeAssertion(serviceAccount)
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  })
  const data = await response.json() as { access_token?: string; error?: string; error_description?: string }
  if (!response.ok || !data.access_token) {
    throw new Error('Google OAuth: ' + (data.error_description || data.error || 'token exchange failed'))
  }
  return data.access_token
}

async function googleJson(url: string, token: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })
  const body = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) {
    const googleError = body.error as { message?: string; status?: string } | undefined
    throw new Error('Google API ' + response.status + ': ' + (googleError?.message || JSON.stringify(body).slice(0, 500)))
  }
  return body
}

export async function GET(request: Request) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return Response.json({ error: 'not_found' }, { status: 404 })
  }

  const expected = process.env.RUBIA_GA4_AUDIT_TOKEN || ''
  const provided = new URL(request.url).searchParams.get('t') || ''
  if (!expected || !provided || expected.length !== provided.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
    return Response.json({ error: 'not_found' }, { status: 404 })
  }

  try {
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    if (!rawKey) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured in this Preview')
    const serviceAccount = JSON.parse(rawKey) as { client_email?: string; private_key?: string; project_id?: string }
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error('The configured service-account JSON is incomplete')
    }

    const token = await getAccessToken(serviceAccount as { client_email: string; private_key: string })
    const summary = await googleJson(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200',
      token,
    ) as { accountSummaries?: Array<{ account?: string; displayName?: string; propertySummaries?: Array<{ property?: string; displayName?: string } }> }

    const properties = (summary.accountSummaries || []).flatMap(account =>
      (account.propertySummaries || []).map(property => ({
        accountName: account.displayName || null,
        account: account.account || null,
        propertyName: property.displayName || null,
        property: property.property || '',
      })),
    )

    const reports = await Promise.all(properties.map(async item => {
      if (!item.property) return { ...item, reportError: 'Missing property resource name' }
      try {
        const report = await googleJson(
          'https://analyticsdata.googleapis.com/v1beta/' + item.property + ':runReport',
          token,
          {
            method: 'POST',
            body: JSON.stringify({
              dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
              metrics: [
                { name: 'totalUsers' },
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'engagedSessions' },
                { name: 'eventCount' },
                { name: 'screenPageViews' },
              ],
            }),
          },
        ) as { rows?: Array<{ metricValues?: Array<{ value?: string }> }>; rowCount?: number }
        const values = report.rows?.[0]?.metricValues || []
        const eventReport = await googleJson(
          'https://analyticsdata.googleapis.com/v1beta/' + item.property + ':runReport',
          token,
          {
            method: 'POST',
            body: JSON.stringify({
              dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
              dimensions: [{ name: 'eventName' }],
              metrics: [{ name: 'eventCount' }],
              orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
              limit: 20,
            }),
          },
        ) as { rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }> }

        return {
          ...item,
          period: 'last_28_complete_days',
          metrics: {
            totalUsers: Number(values[0]?.value || 0),
            activeUsers: Number(values[1]?.value || 0),
            sessions: Number(values[2]?.value || 0),
            engagedSessions: Number(values[3]?.value || 0),
            eventCount: Number(values[4]?.value || 0),
            screenPageViews: Number(values[5]?.value || 0),
          },
          events: (eventReport.rows || []).map(row => ({
            name: row.dimensionValues?.[0]?.value || '(not set)',
            count: Number(row.metricValues?.[0]?.value || 0),
          })),
        }
      } catch (error) {
        return { ...item, reportError: error instanceof Error ? error.message : 'Unknown GA4 report error' }
      }
    }))

    return Response.json({
      ok: true,
      serviceAccountEmail: serviceAccount.client_email,
      googleCloudProjectId: serviceAccount.project_id || null,
      accountCount: (summary.accountSummaries || []).length,
      propertyCount: properties.length,
      properties: reports,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  } catch (error) {
    return Response.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected diagnostic failure',
    }, {
      status: 502,
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  }
}
