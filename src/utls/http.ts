import { refereshToken } from "../services/authService/authService";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  url: string,
  method: HttpMethod,
  body?: any,
  retry = true
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    body: body ? JSON.stringify(body) : undefined,
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
      // ❌ refresh bhi fail → logout
      localStorage.clear();
      window.location.href = "/login";
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
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
