import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParking } from "@/contexts/ParkingContext";
import { Car, CircleParking } from "lucide-react";

export function TopBar() {
  const { availableCount } = useParking();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <CircleParking className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-semibold text-foreground">
            Smart Parking System
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slot-available-bg text-slot-available px-4 py-1.5 rounded-full text-sm font-medium">
        <Car className="h-4 w-4" />
        <span>{availableCount} Slots Available</span>
      </div>
    </header>
  );
}
