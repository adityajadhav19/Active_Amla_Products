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
  const isFormData = init.body instanceof FormData;

  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.headers || {}),
      "x-csrf-token": token || "",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });
}
