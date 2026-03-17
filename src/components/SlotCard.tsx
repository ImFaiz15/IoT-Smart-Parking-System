import { useParking, ParkingSlot } from "@/contexts/ParkingContext";
import { Button } from "@/components/ui/button";
import { Car, LogOut, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slot: ParkingSlot;
}

export function SlotCard({ slot }: SlotCardProps) {
  const { isLoggedIn, user, parkSlot, departSlot, reserveSlot } = useParking();

  const statusConfig = {
    available: {
      bg: "bg-slot-available-bg",
      border: "border-slot-available/30",
      badge: "bg-slot-available text-primary-foreground",
      label: "Available",
      animate: "animate-pulse-green",
    },
    occupied: {
      bg: "bg-slot-occupied-bg",
      border: "border-slot-occupied/30",
      badge: "bg-slot-occupied text-primary-foreground",
      label: "Occupied",
      animate: "",
    },
    reserved: {
      bg: "bg-slot-reserved-bg",
      border: "border-slot-reserved/30",
      badge: "bg-slot-reserved text-primary-foreground",
      label: "Reserved",
      animate: "",
    },
  };

  const config = statusConfig[slot.status];
  const isMySlot = slot.occupiedBy === user?.name || slot.reservedBy === user?.name;

  const requireLogin = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to use parking features");
      return true;
    }
    return false;
  };

  const handlePark = () => {
    if (requireLogin()) return;
    parkSlot(slot.id);
    toast.success(`Parked in Slot ${slot.id}`);
  };

  const handleDepart = () => {
    if (requireLogin()) return;
    departSlot(slot.id);
    toast.success(`Departed from Slot ${slot.id}. Added to history.`);
  };

  const handleReserve = () => {
    if (requireLogin()) return;
    reserveSlot(slot.id);
    toast.success(`Reserved Slot ${slot.id}`);
  };

  return (
    <div
      className={cn(
        "glass-card p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-slide-in",
        config.bg,
        `border ${config.border}`
      )}
      style={{ animationDelay: `${slot.id * 80}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground text-lg">
          Slot {slot.id}
        </h3>
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", config.badge)}>
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Car className="h-4 w-4" />
        {slot.status === "occupied" && (
          <span>{slot.vehicleNumber} • {slot.occupiedBy}</span>
        )}
        {slot.status === "reserved" && (
          <span>Reserved by {slot.reservedBy}</span>
        )}
        {slot.status === "available" && <span>Ready to park</span>}
      </div>

      <div className="flex gap-2">
        {slot.status === "available" && (
          <>
            <Button size="sm" onClick={handlePark} className="flex-1 gap-1">
              <Car className="h-3.5 w-3.5" /> Park
            </Button>
            <Button size="sm" variant="outline" onClick={handleReserve} className="flex-1 gap-1">
              <CalendarCheck className="h-3.5 w-3.5" /> Reserve
            </Button>
          </>
        )}
        {slot.status === "occupied" && isMySlot && (
          <Button size="sm" variant="destructive" onClick={handleDepart} className="flex-1 gap-1">
            <LogOut className="h-3.5 w-3.5" /> Depart
          </Button>
        )}
        {slot.status === "reserved" && isMySlot && (
          <Button size="sm" onClick={() => { parkSlot(slot.id); toast.success("Parked!"); }} className="flex-1 gap-1">
            <Car className="h-3.5 w-3.5" /> Park Now
          </Button>
        )}
      </div>
    </div>
  );
}
