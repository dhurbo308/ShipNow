"use client";

import Link from "next/link";
import {
  BarChart3, Bell, Boxes, CalendarDays, LayoutDashboard, MapPin,
  MessageSquare, PackageSearch, ReceiptText, Settings, Truck,
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
          {nav.map(([label, Icon, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}>
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
      <div className="app-main">{children}</div>
    </div>
  );
}
