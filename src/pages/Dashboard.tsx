import { useParking } from "@/contexts/ParkingContext";
import { SlotCard } from "@/components/SlotCard";
import { Car, CircleParking, Clock } from "lucide-react";

export default function Dashboard() {
  const { slots, availableCount } = useParking();
  const occupied = slots.filter((s) => s.status === "occupied").length;
  const reserved = slots.filter((s) => s.status === "reserved").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Parking Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Monitor and manage parking slots in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slot-available-bg flex items-center justify-center">
            <CircleParking className="h-5 w-5 text-slot-available" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{availableCount}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slot-occupied-bg flex items-center justify-center">
            <Car className="h-5 w-5 text-slot-occupied" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{occupied}</p>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slot-reserved-bg flex items-center justify-center">
            <Clock className="h-5 w-5 text-slot-reserved" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{reserved}</p>
            <p className="text-xs text-muted-foreground">Reserved</p>
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
