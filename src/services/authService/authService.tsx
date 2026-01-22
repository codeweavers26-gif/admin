import { URL_UTILITY } from "../../utls/urlUtls";
import { postApi } from "../../utls/http";

export async function userRegisterApi(payload: any) {
  const url = URL_UTILITY.authUrl + "register";
  return await postApi(url, payload);
}

export async function adminLogin(payload: {
  email: string;
  password: string;
}) {
  const url = URL_UTILITY.authUrl + "login";
  return await postApi(url, payload);
}

export async function refereshToken(payload: {
  refreshToken: string;
}) {
  const url = URL_UTILITY.authUrl + "refresh";
  return await postApi(url, payload);
}

export async function adminlogout(payload: {
  message: string;
}) {
  const url = URL_UTILITY.authUrl + "logout";
  return await postApi(url, payload);
}
