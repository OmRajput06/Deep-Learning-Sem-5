const API_BASE = "http://localhost:5000/api";

// Auto include token
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Invalid JSON", text };
  }
}

/* ---------------- REGISTER & LOGIN ---------------- */

export function registerDoctor(data) {
  return fetchJSON(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function loginDoctor(data) {
  return fetchJSON(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/* ---------------- PATIENTS ---------------- */

export function addPatient(data) {
  return fetchJSON(`${API_BASE}/patients`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function getPatients(query = "") {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  return fetchJSON(`${API_BASE}/patients${q}`, {
    method: "GET",
    headers: authHeaders(),
  });
}
