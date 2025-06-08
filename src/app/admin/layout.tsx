import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/context/settings-context";
import { AuthProvider } from "@/providers/auth";
import { TopNav } from "./_components/top-nav";
import { Sidebar } from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <SettingsProvider>
          <TooltipProvider delayDuration={0}>
            <div className="min-h-screen flex">
              <Sidebar />
              <div className="flex-1">
                <TopNav />
                <div className="container mx-auto p-6 max-w-7xl">
                  <main className="w-full">{children}</main>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </SettingsProvider>
      </main>
    </AuthProvider>
  );
}
