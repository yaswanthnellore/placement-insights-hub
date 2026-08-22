import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { company } = useCompany();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger className="md:hidden" aria-label="Toggle sidebar" />
          <Separator orientation="vertical" className="h-5 md:hidden" />
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Companies</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="font-medium text-foreground">
              {company?.companyName ?? "Select a company"}
            </span>
          </nav>
        </header>
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
