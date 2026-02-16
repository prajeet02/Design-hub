const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

export const apiFetch = async (path, options = {}) => {
  const { token, headers, body, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { success: false, message: text };
  }

  // Keep API contract (success/message) but throw for unexpected non-2xx
  if (!res.ok && data && data.success !== false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

