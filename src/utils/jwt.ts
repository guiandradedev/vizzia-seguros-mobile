import { jwtDecode } from "jwt-decode";

export function decodeJWT<T>(token: string): T | false {
  try {
    const decoded = jwtDecode(token) as T;
    return decoded
  } catch (err) {
    return false;
  }
}