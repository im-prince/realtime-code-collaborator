const BASE = import.meta.env.VITE_API_URL;

export function saveToken(token) {
  if (!token) throw new Error('No token in the auth response');
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function shortId(roomId) {
  return roomId.slice(0, 8);
}

async function readError(res) {
  let message = `Request failed (${res.status})`;

  try {
    const body = await res.json();
    message = body.detail || body.title || message;
  } catch {
    // no JSON body on this response — keep the fallback message
  }

  const err = new Error(message);
  err.status = res.status;
  return err;
}

function bounceToSignin() {
  clearToken();
  location.href = '/signin';
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (options.body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;

  try {
    res = await fetch(BASE + path, { ...options, headers });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }

  if ((res.status === 401 || res.status === 403) && token) {
    bounceToSignin();
    return null;
  }

  if (!res.ok) throw await readError(res);
  if (res.status === 204) return null;

  return res.json();
}

export function signup(username, email, password) {
  return request('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export function login(email, password) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function createRoom(name, language, guestsCanEdit) {
  return request('/api/v1/rooms', {
    method: 'POST',
    body: JSON.stringify({ name, language, guestsCanEdit }),
  });
}

export function getRoom(roomId) {
  return request(`/api/v1/rooms/${roomId}`);
}

export function getMyRooms() {
  return request('/api/v1/rooms/mine');
}

export function deleteRoom(roomId) {
  return request(`/api/v1/rooms/${roomId}`, { method: 'DELETE' });
}

export async function getSnapshot(roomId) {
  const res = await fetch(`${BASE}/api/v1/rooms/${roomId}/snapshot`);

  if (!res.ok) throw await readError(res);
  if (res.status === 204) return null;

  const { content, version } = await res.json();
  const binary = atob(content);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return { bytes, version };
}

export async function saveSnapshot(roomId, bytes) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/octet-stream' };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}/api/v1/rooms/${roomId}/snapshot`, {
    method: 'PUT',
    headers,
    body: bytes,
  });

  if (!res.ok) throw await readError(res);

  return Number(res.headers.get('X-Snapshot-Version'));
}