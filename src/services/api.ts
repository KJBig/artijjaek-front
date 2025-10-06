export async function subscribeToNewsletter(payload: {
  companyIds: string[]
  email: string
  nickname: string
}): Promise<{ ok: boolean; error?: string }> {
  // 실제로는 여기서 fetch/axios 로 서버에 POST
  // 예:
  // const res = await fetch('/api/subscriptions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  // return await res.json()

  // 목 응답
  await new Promise(r => setTimeout(r, 600))
  if (payload.email.endsWith('@example.com')) {
    return { ok: false, error: '이미 가입된 이메일입니다.' }
  }
  return { ok: true }
}
