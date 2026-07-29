"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, Users, Activity, Settings, Shield,
  LayoutDashboard, UserCog,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils";

const adminTabs = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/admins", label: "Admins", icon: Shield },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/system", label: "System", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }
    if (!isLoading && user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading || !user || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          {user.role === "super_admin" ? "Super Admin" : "Admin"} — RoleMate control centre
        </p>
      </div>
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {adminTabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href) && tab.href !== "/admin";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
