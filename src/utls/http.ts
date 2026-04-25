import { refereshToken } from "../services/authService/authService";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  url: string,
  method: HttpMethod,
  body?: any,
  retry = true
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");

  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
  };

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // 🔁 ACCESS TOKEN EXPIRED
  if (response.status === 401 && retry) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      // 🔁 refresh token API call
      const refreshRes = await refereshToken({
        refreshToken,
      });

      // 🔐 save new access token
      localStorage.setItem(
        "accessToken",
        refreshRes.accessToken
      );

      // 🔁 retry original request
      return request<T>(url, method, body, false);
    } catch (err) {
      // ❌ refresh bhi fail → logout only if on client side
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie = "accessToken=; Max-Age=0; path=/";
        document.cookie = "refreshToken=; Max-Age=0; path=/";
        // Emit storage event to notify other components
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "refreshToken",
            newValue: null,
          })
        );
      }
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  // 204 No Content (e.g. DELETE / soft-delete) — no body to parse
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as unknown as T;
  }

  return response.json();
}

/* ---------- Export helpers ---------- */

export const getApi = <T = any>(url: string) =>
  request<T>(url, "GET");

export const postApi = <T = any>(url: string, payload?: any) =>
  request<T>(url, "POST", payload);

export const putApi = <T = any>(url: string, payload?: any) =>
  request<T>(url, "PUT", payload);

export const patchApi = <T = any>(url: string, payload?: any) =>
  request<T>(url, "PATCH", payload);

export const deleteApi = <T = any>(url: string) =>
  request<T>(url, "DELETE");
