// ============================================================
// FILE: src/contexts/ParkingContext.tsx   (REPLACE existing file)
// PURPOSE: Same interface as before, but now calls real API.
//          Falls back to localStorage-mock if VITE_API_URL is not set.
// ============================================================

import React, {
  createContext, useContext, useState,
  useCallback, useEffect,
} from "react";
import { authApi, slotsApi, historyApi, ApiSlot, ApiHistoryEntry } from "@/lib/api";
import { toast } from "sonner";

export type SlotStatus = "available" | "occupied" | "reserved";

export interface ParkingSlot {
  id: number; status: SlotStatus;
  occupiedBy?: string; reservedBy?: string;
  vehicleNumber?: string; parkedAt?: Date;
  sensorActive?: boolean;
}

export interface HistoryEntry {
  id: string; slotId: number; userName: string;
  vehicleNumber: string; parkedAt: Date; departedAt: Date;
}

export interface User {
  id?: string;
  name: string; email: string; mobile: string;
  vehicleNumber: string; role?: "user" | "admin";
}

interface ParkingContextType {
  slots: ParkingSlot[]; history: HistoryEntry[];
  user: User | null; isLoggedIn: boolean; isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (user: User, password: string) => Promise<boolean>;
  logout: () => void;
  parkSlot: (slotId: number) => Promise<boolean>;
  departSlot: (slotId: number) => Promise<boolean>;
  reserveSlot: (slotId: number) => Promise<boolean>;
  availableCount: number;
  refreshSlots: () => Promise<void>;
}

const ParkingContext = createContext<ParkingContextType | null>(null);

// ── mock helpers (used when no backend) ──────────────────────
const USE_API = Boolean(import.meta.env.VITE_API_URL);

const mockSlots: ParkingSlot[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1, status: "available",
}));

type MockStore = Map<string, { user: User; password: string }>;
const userStore: MockStore = new Map();

function toSlot(s: ApiSlot): ParkingSlot {
  return {
    ...s,
    status: s.status as SlotStatus,
    parkedAt: s.parkedAt ? new Date(s.parkedAt) : undefined,
  };
}

function toHistory(h: ApiHistoryEntry): HistoryEntry {
  return {
    ...h,
    parkedAt: new Date(h.parkedAt),
    departedAt: new Date(h.departedAt),
  };
}

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<ParkingSlot[]>(mockSlots);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === "admin";
  const availableCount = slots.filter((s) => s.status === "available").length;

  // ── restore session on mount ──────────────────────────────
  useEffect(() => {
    if (!USE_API) return;
    const token = localStorage.getItem("parking_token");
    if (!token) return;
    authApi.me().then((u) => setUser(u)).catch(() => {
      localStorage.removeItem("parking_token");
    });
  }, []);

  // ── load slots on mount ───────────────────────────────────
  const refreshSlots = useCallback(async () => {
    if (!USE_API) return;
    try {
      const data = await slotsApi.getAll();
      setSlots(data.map(toSlot));
    } catch (e) {
      console.error("Failed to load slots", e);
    }
  }, []);

  useEffect(() => { refreshSlots(); }, [refreshSlots]);

  // ── auth ──────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    if (!USE_API) {
      const stored = userStore.get(email);
      if (stored && stored.password === password) { setUser(stored.user); return true; }
      return false;
    }
    try {
      const { token, user: u } = await authApi.login({ email, password });
      localStorage.setItem("parking_token", token);
      setUser(u);
      // load history after login
      historyApi.getMine().then((h) => setHistory(h.map(toHistory))).catch(() => {});
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Login failed");
      return false;
    }
  }, []);

  const signup = useCallback(async (newUser: User, password: string) => {
    if (!USE_API) {
      if (userStore.has(newUser.email)) return false;
      userStore.set(newUser.email, { user: newUser, password });
      setUser(newUser);
      return true;
    }
    try {
      const { token, user: u } = await authApi.signup({ ...newUser, password });
      localStorage.setItem("parking_token", token);
      setUser(u);
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Signup failed");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    if (USE_API) {
      authApi.logout().catch(() => {});
      localStorage.removeItem("parking_token");
    }
    setUser(null);
    setHistory([]);
  }, []);

  // ── slot actions ──────────────────────────────────────────
  const parkSlot = useCallback(async (slotId: number) => {
    if (!user) return false;
    if (!USE_API) {
      setSlots((prev) => prev.map((s) =>
        s.id === slotId && s.status === "available"
          ? { ...s, status: "occupied", occupiedBy: user.name, vehicleNumber: user.vehicleNumber, parkedAt: new Date() }
          : s
      ));
      return true;
    }
    try {
      const updated = await slotsApi.park(slotId);
      setSlots((prev) => prev.map((s) => s.id === slotId ? toSlot(updated) : s));
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to park");
      return false;
    }
  }, [user]);

  const departSlot = useCallback(async (slotId: number) => {
    if (!user) return false;
    if (!USE_API) {
      setSlots((prev) => {
        const slot = prev.find((s) => s.id === slotId);
        if (slot?.status === "occupied" && slot.occupiedBy === user.name) {
          setHistory((h) => [{
            id: crypto.randomUUID(), slotId, userName: user.name,
            vehicleNumber: slot.vehicleNumber || user.vehicleNumber,
            parkedAt: slot.parkedAt || new Date(), departedAt: new Date(),
          }, ...h]);
          return prev.map((s) => s.id === slotId ? { id: s.id, status: "available" } : s);
        }
        return prev;
      });
      return true;
    }
    try {
      const updated = await slotsApi.depart(slotId);
      setSlots((prev) => prev.map((s) => s.id === slotId ? toSlot(updated) : s));
      historyApi.getMine().then((h) => setHistory(h.map(toHistory))).catch(() => {});
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to depart");
      return false;
    }
  }, [user]);

  const reserveSlot = useCallback(async (slotId: number) => {
    if (!user) return false;
    if (!USE_API) {
      setSlots((prev) => prev.map((s) =>
        s.id === slotId && s.status === "available"
          ? { ...s, status: "reserved", reservedBy: user.name }
          : s
      ));
      return true;
    }
    try {
      const updated = await slotsApi.reserve(slotId);
      setSlots((prev) => prev.map((s) => s.id === slotId ? toSlot(updated) : s));
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to reserve");
      return false;
    }
  }, [user]);

  return (
    <ParkingContext.Provider value={{
      slots, history, user, isLoggedIn, isAdmin, isLoading,
      login, signup, logout,
      parkSlot, departSlot, reserveSlot,
      availableCount, refreshSlots,
    }}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used within ParkingProvider");
  return ctx;
}
