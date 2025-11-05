const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const jsonHeaders = { "Content-Type": "application/json" };

export type ApiResponse<T = unknown> = {
  isSuccess: boolean;
  message?: string;
  data?: T;
};

export interface SubscribeMemberPayload {
  companyIds: number[];
  categoryIds: number[];
  email: string;
  nickname: string;
}

export interface ChangeSubscribeMemberPayload {
  companyIds: number[];
  categoryIds: number[];
  email: string;
  nickname: string;
  token: string;
}

export interface UnsubscriptionMemberPaload {
  email: string;
  token: string;
  reason: string;
  detail: string;
}

export async function subscribeMember(payload: SubscribeMemberPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/member/register`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // 서버가 에러 메시지 바디를 내려줄 수 있으니 최대한 뽑아서 던짐
      let message = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        message = errJson?.message ?? message;
      } catch {}
      throw new Error(message);
    }

    // 서버 응답 래핑 형태가 { data: ... } 일 수도 있으므로 그대로 반환
    return await res.json();
  } catch (err) {
    console.error("[subscribeMember] Error:", err);
    throw err; // 컴포넌트에서 try/catch로 처리
  }
}

export async function getMySubscription(email: string, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/member/data?email=${email}&token=${token}`, {
      method: "GET",
      headers: jsonHeaders,
    });

    if (!res.ok) {
      // 서버가 에러 메시지 바디를 내려줄 수 있으니 최대한 뽑아서 던짐
      let message = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        message = errJson?.message ?? message;
      } catch {}
      throw new Error(message);
    }

    // 서버 응답 래핑 형태가 { data: ... } 일 수도 있으므로 그대로 반환
    return await res.json();
  } catch (err) {
    console.error("[getMySubscription] Error:", err);
    throw err; // 컴포넌트에서 try/catch로 처리
  }
}

export async function updateMySubscription(payload: ChangeSubscribeMemberPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/member/subscription`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // 서버가 에러 메시지 바디를 내려줄 수 있으니 최대한 뽑아서 던짐
      let message = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        message = errJson?.message ?? message;
      } catch {}
      throw new Error(message);
    }

    // 서버 응답 래핑 형태가 { data: ... } 일 수도 있으므로 그대로 반환
    return await res.json();
  } catch (err) {
    console.error("[updateMySubscription] Error:", err);
    throw err; // 컴포넌트에서 try/catch로 처리
  }
}

export async function unsubscribeMember(payload: UnsubscriptionMemberPaload) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/member/unsubscription`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // 서버가 에러 메시지 바디를 내려줄 수 있으니 최대한 뽑아서 던짐
      let message = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        message = errJson?.message ?? message;
      } catch {}
      throw new Error(message);
    }

    // 서버 응답 래핑 형태가 { data: ... } 일 수도 있으므로 그대로 반환
    return await res.json();
  } catch (err) {
    console.error("[unsubscribeMember] Error:", err);
    throw err; // 컴포넌트에서 try/catch로 처리
  }
}