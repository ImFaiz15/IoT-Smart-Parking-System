// ============================================================
// FILE: src/App.tsx   (REPLACE existing file)
// Changes: Added /admin route → AdminPanel
// ============================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ParkingProvider } from "@/contexts/ParkingContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import ReserveSlot from "./pages/ReserveSlot";
import View360 from "./pages/View360";
import ContactPage from "./pages/ContactPage";
import AdminPanel from "./pages/AdminPanel";   // ← NEW
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ParkingProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/reserve" element={<ReserveSlot />} />
              <Route path="/360-view" element={<View360 />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPanel />} />   {/* ← NEW */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </ParkingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
