import { useParking } from "@/contexts/ParkingContext";
import { History, Car } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const { history, isLoggedIn } = useParking();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-3">
        <History className="h-12 w-12" />
        <p className="text-lg font-display">Please login to view your parking history</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-foreground">Parking History</h2>
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-3">
          <Car className="h-12 w-12" />
          <p>No parking history yet. Park and depart to see records here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-foreground">Parking History</h2>
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="glass-card p-4 flex items-center justify-between animate-slide-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Slot {entry.slotId}</p>
                <p className="text-sm text-muted-foreground">{entry.vehicleNumber}</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-foreground">{format(entry.departedAt, "MMM d, yyyy")}</p>
              <p className="text-muted-foreground">
                {format(entry.parkedAt, "HH:mm")} → {format(entry.departedAt, "HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
