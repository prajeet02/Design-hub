const STORAGE_KEY = "dh_age_verified_at";

// How long we remember age verification on this device.
// Set to null to remember forever.
export const AGE_VERIFY_TTL_DAYS = 30;

export const isAgeVerified = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts) || ts <= 0) return false;
    if (AGE_VERIFY_TTL_DAYS == null) return true;
    const ttlMs = AGE_VERIFY_TTL_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - ts <= ttlMs;
  } catch {
    return false;
  }
};

export const setAgeVerified = () => {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore (private mode / storage disabled)
  }
};

export const clearAgeVerified = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
