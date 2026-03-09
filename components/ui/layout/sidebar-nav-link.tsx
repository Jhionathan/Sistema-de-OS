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
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconName =
  | "dashboard"
  | "customers"
  | "units"
  | "equipment"
  | "visits"
  | "technicians";

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
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}