"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Bell, Boxes, CalendarDays, LayoutDashboard, MapPin,
  ChevronLeft, Menu, MessageSquare, PackageSearch, ReceiptText, Settings, Truck,
  UserRound, Warehouse,
} from "lucide-react";
import { Brand } from "@/components/brand";

const nav = [
  ["Dashboard", LayoutDashboard, "/dashboard"],
  ["Analytics", BarChart3, "#"],
  ["Calendar", CalendarDays, "#"],
  ["Shipments", Truck, "/shipments"],
  ["Tracking", MapPin, "#"],
  ["Warehouse", Warehouse, "/warehouse"],
  ["Fleets", PackageSearch, "#"],
  ["Drivers", UserRound, "#"],
  ["Invoices & Billing", ReceiptText, "/invoices"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCreateShipment = pathname === "/shipments/new";
  const pageTitle = isCreateShipment ? "Create New Shipment" : pathname.startsWith("/shipments") ? "Shipments" : pathname.startsWith("/warehouse") ? "Warehouse" : "Dashboard";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <button className="profile-card">
          <span className="avatar">JD</span>
          <span><strong>John Doe</strong><small>Admin</small></span>
          <span>⌄</span>
        </button>
        <nav aria-label="Main navigation">
          {nav.map(([label, Icon, href]) => (
            <Link className={href !== "#" && pathname.startsWith(href) ? "active" : ""} href={href} key={label}>
              <Icon size={19} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-secondary">
          <Link href="#"><MessageSquare size={18} /><span>Message</span><em>19</em></Link>
          <Link href="#"><Bell size={18} /><span>Notification</span><em>5</em></Link>
          <Link href="#"><Settings size={18} /><span>Settings</span></Link>
        </div>
        <div className="upgrade-card">
          <Boxes size={37} />
          <strong>Loving<br />ShipNow<br />Free?</strong>
          <p>Go Pro to access priority support, real-time tracking, and full analytics.</p>
          <button>Go Pro Today</button>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-appbar">
          {isCreateShipment ? <Link className="mobile-back" href="/shipments" aria-label="Back to shipments"><ChevronLeft size={22} /></Link> : <Brand compact />}
          <strong>{pageTitle}</strong>
          <button aria-label="Open navigation"><Menu size={21} /></button>
        </header>
        {children}
      </div>
    </div>
  );
}
