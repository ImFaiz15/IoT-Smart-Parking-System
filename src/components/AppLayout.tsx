import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { AuthPanel } from "./AuthPanel";
import { FeedbackForm } from "./FeedbackForm";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="flex-1 flex">
            <main className="flex-1 p-6 overflow-auto">{children}</main>
            <aside className="hidden lg:block w-72 p-4 space-y-4 border-l border-border bg-card overflow-auto">
              <AuthPanel />
              <FeedbackForm />
            </aside>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}