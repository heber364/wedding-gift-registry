const COOKIE_NAME = "wedding_guest";
const COOKIE_DAYS = 365;

export interface GuestIdentity {
  name: string;
  phone: string;
}

function setCookie(value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(): string | null {
  if (typeof document === "undefined") return null;
  const name = COOKIE_NAME + "=";
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name)) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
}

export function saveGuestIdentity(identity: GuestIdentity) {
  setCookie(JSON.stringify(identity), COOKIE_DAYS);
}

export function loadGuestIdentity(): GuestIdentity | null {
  const raw = getCookie();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.name && parsed.phone) return parsed as GuestIdentity;
    return null;
  } catch {
    return null;
  }
}

export function clearGuestIdentity() {
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
