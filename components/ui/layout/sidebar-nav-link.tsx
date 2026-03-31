"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPinned,
  Wrench,
  ClipboardList,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconName =
  | "dashboard"
  | "customers"
  | "units"
  | "equipment"
  | "visits"
  | "technicians"
  | "users";

type SidebarNavLinkProps = {
  href: string;
  icon: IconName;
  children: React.ReactNode;
};

const iconMap = {
  dashboard: LayoutDashboard,
  customers: Users,
  units: MapPinned,
  equipment: Wrench,
  visits: ClipboardList,
  technicians: UserCog,
  users: Shield,
};

export function SidebarNavLink({
  href,
  icon,
  children,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const Icon = iconMap[icon];

  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:shadow-sm"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
      <span>{children}</span>
    </Link>
  );
}