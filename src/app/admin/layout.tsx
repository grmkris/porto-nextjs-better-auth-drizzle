import Link from "next/link";
import { LayoutDashboard, Users, Activity, Shield, LogOut } from "lucide-react";
import {SignOutButton} from "@/components/auth/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/sessions", icon: Activity, label: "Sessions" },
    { href: "/admin/activity", icon: Shield, label: "Activity Logs" },
  ];

  // If not authenticated or not admin, render children without sidebar
  if (!isAuthenticated || !isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">Porto Wallet Manager</p>
        </div>
        
        <nav className="flex-1 px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-2 border-t">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}