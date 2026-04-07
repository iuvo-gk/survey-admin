import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = "token";

export function getAuthToken() {
  return Cookies.get(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  Cookies.set(AUTH_TOKEN_KEY, token || "", { sameSite: "lax" });
}

export function clearAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.set(AUTH_TOKEN_KEY, "", { sameSite: "lax" });
}

export function hasAuthToken() {
  return Boolean(getAuthToken());
}
