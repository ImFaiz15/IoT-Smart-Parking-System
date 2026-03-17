import { useParking } from "@/contexts/ParkingContext";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

export default function View360() {
  const { slots } = useParking();

  const statusColors = {
    available: "bg-slot-available",
    occupied: "bg-slot-occupied",
    reserved: "bg-slot-reserved",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">360° Parking View</h2>
        <p className="text-muted-foreground text-sm mt-1">Visual overview of the parking lot</p>
      </div>

      <div className="glass-card p-8">
        <div className="max-w-lg mx-auto">
          {/* Parking lot visualization */}
          <div className="border-2 border-border rounded-xl p-6 bg-muted/30">
            <div className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider font-medium">
              Entrance
            </div>
            <div className="grid grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "aspect-[3/4] rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2 border-dashed",
                    slot.status === "available" && "border-slot-available/50 bg-slot-available-bg",
                    slot.status === "occupied" && "border-slot-occupied/50 bg-slot-occupied-bg",
                    slot.status === "reserved" && "border-slot-reserved/50 bg-slot-reserved-bg"
                  )}
                >
                  <Car className={cn("h-8 w-8", 
                    slot.status === "available" && "text-slot-available",
                    slot.status === "occupied" && "text-slot-occupied",
                    slot.status === "reserved" && "text-slot-reserved"
                  )} />
                  <span className="text-sm font-semibold text-foreground">S{slot.id}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium text-primary-foreground",
                    statusColors[slot.status]
                  )}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground mt-4 uppercase tracking-wider font-medium">
              Exit
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6">
            {[
              { label: "Available", color: "bg-slot-available" },
              { label: "Occupied", color: "bg-slot-occupied" },
              { label: "Reserved", color: "bg-slot-reserved" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={cn("h-3 w-3 rounded-full", item.color)} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
