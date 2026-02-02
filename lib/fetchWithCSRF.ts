function getCSRFTokenFromCookie() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

export async function fetchWithCSRF(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = getCSRFTokenFromCookie();

  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": token || "",
      ...(init.headers || {}),
    },
  });
}
