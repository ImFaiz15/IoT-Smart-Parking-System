// ============================================================
// FILE: src/lib/api.ts
// PURPOSE: Central API service — all HTTP calls go here
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ── Helper ────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("parking_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API error");
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export interface LoginPayload { email: string; password: string }
export interface SignupPayload {
  name: string; email: string; mobile: string;
  vehicleNumber: string; password: string;
}
export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; mobile: string; vehicleNumber: string; role: "user" | "admin" };
}

export const authApi = {
  login: (data: LoginPayload) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  signup: (data: SignupPayload) =>
    request<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),

  me: () =>
    request<AuthResponse["user"]>("/auth/me"),
};

// ── Parking Slots ─────────────────────────────────────────────
export interface ApiSlot {
  id: number; status: "available" | "occupied" | "reserved";
  occupiedBy?: string; reservedBy?: string;
  vehicleNumber?: string; parkedAt?: string;
  sensorActive?: boolean;
}

export const slotsApi = {
  getAll: () => request<ApiSlot[]>("/slots"),
  getById: (id: number) => request<ApiSlot>(`/slots/${id}`),
  park: (slotId: number) =>
    request<ApiSlot>(`/slots/${slotId}/park`, { method: "POST" }),
  depart: (slotId: number) =>
    request<ApiSlot>(`/slots/${slotId}/depart`, { method: "POST" }),
  reserve: (slotId: number) =>
    request<ApiSlot>(`/slots/${slotId}/reserve`, { method: "POST" }),
};

// ── History ───────────────────────────────────────────────────
export interface ApiHistoryEntry {
  id: string; slotId: number; userName: string;
  vehicleNumber: string; parkedAt: string; departedAt: string;
  duration?: number; // minutes
}

export const historyApi = {
  getAll: () => request<ApiHistoryEntry[]>("/history"),
  getMine: () => request<ApiHistoryEntry[]>("/history/me"),
};

// ── Admin ─────────────────────────────────────────────────────
export interface ApiUser {
  id: string; name: string; email: string; mobile: string;
  vehicleNumber: string; role: "user" | "admin"; createdAt: string;
}

export interface AdminStats {
  totalSlots: number; availableSlots: number;
  occupiedSlots: number; reservedSlots: number;
  totalUsers: number; totalSessions: number;
  revenueToday: number; revenueThisMonth: number;
}

export const adminApi = {
  getStats: () => request<AdminStats>("/admin/stats"),
  getAllUsers: () => request<ApiUser[]>("/admin/users"),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
  updateUser: (id: string, data: Partial<ApiUser>) =>
    request<ApiUser>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getAllHistory: () => request<ApiHistoryEntry[]>("/admin/history"),
  updateSlot: (id: number, data: Partial<ApiSlot>) =>
    request<ApiSlot>(`/admin/slots/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  addSlot: () =>
    request<ApiSlot>("/admin/slots", { method: "POST" }),
  removeSlot: (id: number) =>
    request<{ message: string }>(`/admin/slots/${id}`, { method: "DELETE" }),
};
