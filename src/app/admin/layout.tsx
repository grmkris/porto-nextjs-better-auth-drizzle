import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  // If not authenticated or not admin, render children without sidebar
  if (!isAuthenticated || !isAdmin) {
    return <>{children}</>;
  }

  // Read sidebar state from cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Admin Panel</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}