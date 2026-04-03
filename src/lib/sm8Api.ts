// Centralised helper for calling the SM8 edge-function proxy

function getEdgeFunctionUrl(action: string, params: Record<string, string> = {}): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const qs = new URLSearchParams({ action, ...params }).toString();
  return `${supabaseUrl}/functions/v1/sm8-proxy?${qs}`;
}

function authHeaders(): Record<string, string> {
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return {
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };
}

export async function sm8Get(action: string, params: Record<string, string> = {}) {
  const res = await fetch(getEdgeFunctionUrl(action, params), {
    headers: authHeaders(),
  });
  return res;
}

export async function sm8Post(action: string, body: unknown) {
  const res = await fetch(getEdgeFunctionUrl(action), {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}