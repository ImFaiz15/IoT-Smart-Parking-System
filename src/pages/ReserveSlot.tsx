import { useParking } from "@/contexts/ParkingContext";
import { SlotCard } from "@/components/SlotCard";
import { CalendarCheck } from "lucide-react";

export default function ReserveSlot() {
  const { slots, isLoggedIn } = useParking();
  const availableSlots = slots.filter((s) => s.status === "available");

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-3">
        <CalendarCheck className="h-12 w-12" />
        <p className="text-lg font-display">Please login to reserve a parking slot</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-foreground">Reserve a Slot</h2>
      <p className="text-muted-foreground text-sm">Choose an available slot to reserve it for your vehicle.</p>
      {availableSlots.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No slots available for reservation right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSlots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}
