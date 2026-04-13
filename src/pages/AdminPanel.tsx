// ============================================================
// FILE: src/pages/AdminPanel.tsx   (NEW FILE)
// PURPOSE: Full admin panel — stats, users table, slot control
// ============================================================

import { useEffect, useState } from "react";
import { useParking } from "@/contexts/ParkingContext";
import { adminApi, AdminStats, ApiUser, ApiHistoryEntry } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Car, CircleParking, Clock,
  Trash2, ShieldCheck, TrendingUp, History,
} from "lucide-react";

const USE_API = Boolean(import.meta.env.VITE_API_URL);

// ── Mock data when no backend ─────────────────────────────────
const MOCK_STATS: AdminStats = {
  totalSlots: 6, availableSlots: 3, occupiedSlots: 2,
  reservedSlots: 1, totalUsers: 5, totalSessions: 42,
  revenueToday: 480, revenueThisMonth: 9200,
};
const MOCK_USERS: ApiUser[] = [
  { id: "1", name: "Ali Khan", email: "ali@example.com", mobile: "9876543210", vehicleNumber: "DL01AB1234", role: "user", createdAt: "2026-03-01T10:00:00Z" },
  { id: "2", name: "Priya Singh", email: "priya@example.com", mobile: "9123456789", vehicleNumber: "HR26CD5678", role: "user", createdAt: "2026-03-15T08:30:00Z" },
  { id: "3", name: "Admin User", email: "admin@iot.com", mobile: "9000000001", vehicleNumber: "UP14XX0001", role: "admin", createdAt: "2026-01-01T00:00:00Z" },
];
const MOCK_HISTORY: ApiHistoryEntry[] = [
  { id: "h1", slotId: 1, userName: "Ali Khan", vehicleNumber: "DL01AB1234", parkedAt: "2026-04-13T09:00:00Z", departedAt: "2026-04-13T11:00:00Z", duration: 120 },
  { id: "h2", slotId: 3, userName: "Priya Singh", vehicleNumber: "HR26CD5678", parkedAt: "2026-04-13T10:00:00Z", departedAt: "2026-04-13T12:30:00Z", duration: 150 },
];

export default function AdminPanel() {
  const { isAdmin, isLoggedIn, slots, refreshSlots } = useParking();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [history, setHistory] = useState<ApiHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadData();
  }, [isLoggedIn]);

  async function loadData() {
    setLoading(true);
    try {
      if (USE_API) {
        const [s, u, h] = await Promise.all([
          adminApi.getStats(),
          adminApi.getAllUsers(),
          adminApi.getAllHistory(),
        ]);
        setStats(s); setUsers(u); setHistory(h);
      } else {
        // use mock data
        setStats(MOCK_STATS);
        setUsers(MOCK_USERS);
        setHistory(MOCK_HISTORY);
      }
    } catch (e) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    try {
      if (USE_API) await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (e) {
      toast.error("Failed to delete user");
    }
  }

  async function handlePromoteUser(id: string) {
    try {
      if (USE_API) await adminApi.updateUser(id, { role: "admin" });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: "admin" } : u));
      toast.success("User promoted to admin");
    } catch (e) {
      toast.error("Failed to promote user");
    }
  }

  async function handleAddSlot() {
    try {
      if (USE_API) await adminApi.addSlot();
      await refreshSlots();
      toast.success("New slot added");
    } catch {
      toast.error("Failed to add slot");
    }
  }

  // ── Guard ──────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to access Admin Panel.</p>
      </div>
    );
  }

  if (!isAdmin && USE_API) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive font-medium">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  if (loading || !stats) {
    return <div className="p-8 text-muted-foreground">Loading admin data…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Admin Panel</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage users, slots and view system stats</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<CircleParking className="h-5 w-5 text-green-500" />} label="Available" value={stats.availableSlots} bg="bg-green-500/10" />
        <StatCard icon={<Car className="h-5 w-5 text-red-500" />} label="Occupied" value={stats.occupiedSlots} bg="bg-red-500/10" />
        <StatCard icon={<Clock className="h-5 w-5 text-yellow-500" />} label="Reserved" value={stats.reservedSlots} bg="bg-yellow-500/10" />
        <StatCard icon={<Users className="h-5 w-5 text-blue-500" />} label="Users" value={stats.totalUsers} bg="bg-blue-500/10" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-500" />} label="Sessions" value={stats.totalSessions} bg="bg-purple-500/10" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} label="Revenue Today" value={`₹${stats.revenueToday}`} bg="bg-emerald-500/10" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-teal-500" />} label="Revenue/Month" value={`₹${stats.revenueThisMonth}`} bg="bg-teal-500/10" />
        <StatCard icon={<CircleParking className="h-5 w-5 text-slate-500" />} label="Total Slots" value={stats.totalSlots} bg="bg-slate-500/10" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="slots">Slots</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>Registered Users</CardTitle></CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.mobile}</TableCell>
                      <TableCell>{u.vehicleNumber}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {u.role !== "admin" && (
                            <Button size="sm" variant="outline" onClick={() => handlePromoteUser(u.id)}
                              title="Promote to admin">
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}
                            title="Delete user">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slots Tab */}
        <TabsContent value="slots">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parking Slots</CardTitle>
              <Button size="sm" onClick={handleAddSlot}>+ Add Slot</Button>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slot #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Occupied By</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">Slot {s.id}</TableCell>
                      <TableCell>
                        <Badge variant={
                          s.status === "available" ? "outline" :
                          s.status === "occupied" ? "destructive" : "secondary"
                        }>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{s.occupiedBy || s.reservedBy || "—"}</TableCell>
                      <TableCell>{s.vehicleNumber || "—"}</TableCell>
                      <TableCell>
                        {s.parkedAt ? new Date(s.parkedAt).toLocaleTimeString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>All Parking Sessions</CardTitle></CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slot</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Parked At</TableHead>
                    <TableHead>Departed At</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>Slot {h.slotId}</TableCell>
                      <TableCell>{h.userName}</TableCell>
                      <TableCell>{h.vehicleNumber}</TableCell>
                      <TableCell>{new Date(h.parkedAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(h.departedAt).toLocaleString()}</TableCell>
                      <TableCell>{h.duration ? `${h.duration} min` : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: {
  icon: React.ReactNode; label: string; value: string | number; bg: string;
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-display font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
