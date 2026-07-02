import crypto from 'crypto'

export async function getGoogleAccessToken(creds, scope = 'https://www.googleapis.com/auth/spreadsheets') {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({alg: 'RS256', typ: 'JWT'})).toString('base64url')
  const claim = Buffer.from(
    JSON.stringify({
      iss: creds.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  ).toString('base64url')
  const signInput = `${header}.${claim}`
  const signature = crypto.createSign('RSA-SHA256').update(signInput).sign(creds.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${signInput}.${signature}`,
    }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error(`Google auth failed: ${JSON.stringify(json)}`)
  return json.access_token
}

export async function fetchSheetValues(token, spreadsheetId, tab, range) {
  const a1 = `'${tab}'!${range}`
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(a1)}`,
    {headers: {Authorization: `Bearer ${token}`}},
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Sheets API ${res.status}`)
  return data.values || []
}

export function colLetter(index) {
  let n = index + 1
  let s = ''
  while (n > 0) {
    const rem = (n - 1) % 26
    s = String.fromCharCode(65 + rem) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

export function cellRef(tab, row1, col0) {
  return `'${tab}'!${colLetter(col0)}${row1}`
}
