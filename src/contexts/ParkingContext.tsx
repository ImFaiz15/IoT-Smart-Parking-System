import React, { createContext, useContext, useState, useCallback } from "react";

export type SlotStatus = "available" | "occupied" | "reserved";

export interface ParkingSlot {
  id: number;
  status: SlotStatus;
  occupiedBy?: string;
  reservedBy?: string;
  vehicleNumber?: string;
  parkedAt?: Date;
}

export interface HistoryEntry {
  id: string;
  slotId: number;
  userName: string;
  vehicleNumber: string;
  parkedAt: Date;
  departedAt: Date;
}

export interface User {
  name: string;
  email: string;
  mobile: string;
  vehicleNumber: string;
}

interface ParkingContextType {
  slots: ParkingSlot[];
  history: HistoryEntry[];
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (user: User, password: string) => boolean;
  logout: () => void;
  parkSlot: (slotId: number) => boolean;
  departSlot: (slotId: number) => boolean;
  reserveSlot: (slotId: number) => boolean;
  availableCount: number;
}

const ParkingContext = createContext<ParkingContextType | null>(null);

const initialSlots: ParkingSlot[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  status: "available" as SlotStatus,
}));

// Simple in-memory user store
const userStore: Map<string, { user: User; password: string }> = new Map();

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const isLoggedIn = user !== null;
  const availableCount = slots.filter((s) => s.status === "available").length;

  const login = useCallback((email: string, password: string) => {
    const stored = userStore.get(email);
    if (stored && stored.password === password) {
      setUser(stored.user);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((newUser: User, password: string) => {
    if (userStore.has(newUser.email)) return false;
    userStore.set(newUser.email, { user: newUser, password });
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const parkSlot = useCallback(
    (slotId: number) => {
      if (!user) return false;
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId && s.status === "available"
            ? {
                ...s,
                status: "occupied" as SlotStatus,
                occupiedBy: user.name,
                vehicleNumber: user.vehicleNumber,
                parkedAt: new Date(),
              }
            : s
        )
      );
      return true;
    },
    [user]
  );

  const departSlot = useCallback(
    (slotId: number) => {
      if (!user) return false;
      setSlots((prev) => {
        const slot = prev.find((s) => s.id === slotId);
        if (slot && slot.status === "occupied" && slot.occupiedBy === user.name) {
          setHistory((h) => [
            {
              id: crypto.randomUUID(),
              slotId,
              userName: user.name,
              vehicleNumber: slot.vehicleNumber || user.vehicleNumber,
              parkedAt: slot.parkedAt || new Date(),
              departedAt: new Date(),
            },
            ...h,
          ]);
          return prev.map((s) =>
            s.id === slotId
              ? { id: s.id, status: "available" as SlotStatus }
              : s
          );
        }
        return prev;
      });
      return true;
    },
    [user]
  );

  const reserveSlot = useCallback(
    (slotId: number) => {
      if (!user) return false;
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId && s.status === "available"
            ? {
                ...s,
                status: "reserved" as SlotStatus,
                reservedBy: user.name,
              }
            : s
        )
      );
      return true;
    },
    [user]
  );

  return (
    <ParkingContext.Provider
      value={{
        slots,
        history,
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        parkSlot,
        departSlot,
        reserveSlot,
        availableCount,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used within ParkingProvider");
  return ctx;
}
