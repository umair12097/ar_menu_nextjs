import Cookies from "js-cookie";
import { User } from "./types";

const TOKEN_KEY = "ar_menu_token";
const USER_KEY  = "ar_menu_user";

export const authUtils = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, { expires: 1, sameSite: "strict" });
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  setUser(user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  logout() {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated(): boolean {
    return !!Cookies.get(TOKEN_KEY);
  },
};
