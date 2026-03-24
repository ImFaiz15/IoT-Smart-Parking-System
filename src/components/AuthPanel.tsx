import { useState } from "react";
import { useParking } from "@/contexts/ParkingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, LogOut, UserPlus, User } from "lucide-react";
import { toast } from "sonner";

export function AuthPanel() {
  const { user, isLoggedIn, login, signup, logout } = useParking();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    vehicleNumber: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const ok = login(form.email, form.password);
      if (ok) toast.success("Logged in successfully!");
      else toast.error("Invalid credentials");
    } else {
      if (!form.name || !form.email || !form.password || !form.vehicleNumber) {
        toast.error("Please fill all fields");
        return;
      }
      const ok = signup(
        { name: form.name, email: form.email, mobile: form.mobile, vehicleNumber: form.vehicleNumber },
        form.password
      );
      if (ok) toast.success("Account created!");
      else toast.error("Email already exists");
    }
  };

  if (isLoggedIn && user) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Vehicle: <span className="font-medium text-foreground">{user.vehicleNumber}</span></p>
          {user.mobile && <p>Mobile: <span className="font-medium text-foreground">{user.mobile}</span></p>}
        </div>
        <Button onClick={logout} variant="outline" className="w-full gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "login" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("login")}
          className="flex-1 gap-1"
        >
          <LogIn className="h-4 w-4" /> Login
        </Button>
        <Button
          variant={mode === "signup" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("signup")}
          className="flex-1 gap-1"
        >
          <UserPlus className="h-4 w-4" /> Sign Up
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <>
            <div>
              <Label htmlFor="name" className="text-xs">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="user name" />
            </div>
            <div>
              <Label htmlFor="mobile" className="text-xs">Mobile</Label>
              <Input id="mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 1234567890" />
            </div>
            <div>
              <Label htmlFor="vehicle" className="text-xs">Vehicle Number</Label>
              <Input id="vehicle" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="HR-00-AB-0000" />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="email" className="text-xs">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="abc@email.com" />
        </div>
        <div>
          <Label htmlFor="password" className="text-xs">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full">
          {mode === "login" ? "Login" : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
