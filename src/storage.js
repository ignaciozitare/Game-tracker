export const getLocal = (key) => {
  try { return window.localStorage.getItem(key); } catch { return null; }
};

export const setLocal = (key, val) => {
  try { window.localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
};

export const readJSON = (raw, fb) => {
  try { return raw !== null && raw !== undefined ? JSON.parse(raw) : fb; } catch { return fb; }
};

export const tryGet = async (key, fb) => {
  if (window.storage?.get) {
    try {
      const r = await window.storage.get(key);
      if (r?.value !== undefined) return readJSON(r.value, fb);
    } catch {}
  }

  return readJSON(getLocal(key), fb);
};

export const trySave = (key, val) => {
  const payload = JSON.stringify(val);
  setLocal(key, val);

  if (window.storage?.set) {
    window.storage.set(key, payload).catch(() => {});
  }
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
export const now = (locale = "es-AR") => new Date().toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
