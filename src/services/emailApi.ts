const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const jsonHeaders = { "Content-Type": "application/json" };

export type ApiResponse<T = unknown> = {
  isSuccess: boolean;
  message?: string;
  data?: T;
};

export async function sendSubscribeMail(email: string): Promise<ApiResponse> {
  const res = await fetch("/api/v1/subscribe/mail", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifySubscribeAuth(email: string, code: string): Promise<ApiResponse> {
  const res = await fetch("/api/v1/subscribe/auth", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, code }),
  });
  return res.json();
}