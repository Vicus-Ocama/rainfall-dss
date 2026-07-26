"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, CloudRain, BarChart3, Thermometer, Sprout,
  History, FileText, MapPin, Bell, User, Settings, Leaf,
} from "lucide-react";

const MAIN_ITEMS = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Forecast", href: "/forecast", icon: CloudRain },
  { label: "SHAP Explanations", href: "/shap-explanations", icon: BarChart3 },
  { label: "Weather Conditions", href: "/weather-conditions", icon: Thermometer },
  { label: "Agro-Advisories", href: "/agro-advisories", icon: Sprout },
  { label: "History", href: "/history", icon: History },
  { label: "Reports", href: "/reports", icon: FileText },
];

const SETTINGS_ITEMS = [
  { label: "Locations", href: "/locations", icon: MapPin },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "User Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavItem({
  label, href, icon: Icon, active,
}: { label: string; href: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm transition-colors ${
        active
          ? "bg-brand-500 font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-300" />
      )}
      <Icon
        size={18}
        strokeWidth={active ? 2.25 : 1.75}
        className={active ? "text-white" : "text-sidebar-text-muted group-hover:text-white"}
      />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar px-3 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-400 to-brand-600 shadow-[0_2px_6px_rgba(42,120,214,0.35)]">
          <Leaf className="text-white" size={20} strokeWidth={2.25} />
        </div>
        <div className="text-sm font-bold leading-tight tracking-tight text-white">
          Rainfall Forecast &<br />Agricultural Decision Support
        </div>
      </div>

      <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-text-muted">
        Main
      </div>
      <nav className="space-y-1">
        {MAIN_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.href} />
        ))}
      </nav>

      <div className="px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-wider text-sidebar-text-muted">
        Settings
      </div>
      <nav className="space-y-1">
        {SETTINGS_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.href} />
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 rounded-lg border border-sidebar-line bg-sidebar-hover px-3 py-3 text-xs text-sidebar-text">
        <Leaf className="text-brand-300" size={16} />
        AI for Climate-Smart Agriculture © 2026
      </div>
    </aside>
  );
}
