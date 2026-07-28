"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Filter, Grid2X2, List, MapPin, Package,
  Plane, Plus, Search, TrainFront, Truck,
} from "lucide-react";
import { shipmentRecords, ShipmentStatus } from "@/data/shipments/shipments";

const statuses = ["All", "Delivered", "In Transit", "Processing", "Out for Delivery"] as const;

export function ShipmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view = params.get("view") === "table" ? "table" : "grid";
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => shipmentRecords
    .filter((item) => status === "All" || item.status === status)
    .filter((item) => `${item.id} ${item.company} ${item.origin} ${item.destination}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "Progress" ? b.progress - a.progress : sort === "Company" ? a.company.localeCompare(b.company) : b.id.localeCompare(a.id)),
  [query, sort, status]);

  function switchView(next: "grid" | "table") {
    const nextParams = new URLSearchParams(params.toString());
    if (next === "grid") nextParams.delete("view"); else nextParams.set("view", "table");
    router.replace(`${pathname}${nextParams.size ? `?${nextParams}` : ""}`, { scroll: false });
  }

  return (
    <>
      <main className="shipments-page">
        <header className="shipments-heading">
          <div>
            <h1>Shipments</h1>
            <div className="breadcrumb-row">
              <span><b>Dashboard</b> / Shipments</span>
              <div className="view-switcher" aria-label="Shipment view">
                <button className={view === "table" ? "active" : ""} onClick={() => switchView("table")} aria-label="Table view"><List size={15} /></button>
                <button className={view === "grid" ? "active" : ""} onClick={() => switchView("grid")} aria-label="Grid view"><Grid2X2 size={15} /></button>
              </div>
            </div>
          </div>
          <button className="new-shipment"><Plus size={18} />New Shipment</button>
        </header>

        <div className="shipments-toolbar">
          <div className="status-tabs">{statuses.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }}>{item}</button>)}</div>
          <div className="shipment-controls">
            <label><Search size={17} /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search Shipment" /></label>
            <button><Filter size={16} />Filter⌄</button>
            <button className="mobile-new-shipment" aria-label="New shipment"><Plus size={18} /></button>
            <span>Sort by:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}><option>Newest</option><option>Progress</option><option>Company</option></select>
          </div>
        </div>

        {view === "grid" ? (
          <section className="shipment-card-grid">
            {filtered.map((shipment) => <ShipmentCard key={shipment.id} shipment={shipment} />)}
          </section>
        ) : <ShipmentTable records={filtered} />}

        {!filtered.length && <div className="shipments-empty"><Package /><h2>No shipments found</h2><p>Try changing your search or status filter.</p></div>}

        <div className="shipments-pagination">
          <p>Show <select><option>12</option><option>24</option></select> of 520 results</p>
          <nav><button disabled><ChevronLeft /></button>{[1,2,3].map((item) => <button className={page === item ? "active" : ""} onClick={() => setPage(item)} key={item}>{item}</button>)}<span>…</span><button onClick={() => setPage(16)}>16</button><button onClick={() => setPage(Math.min(16, page + 1))}><ChevronRight /></button></nav>
        </div>
      </main>
      <footer className="shipments-footer"><strong>Copyright © 2025 Peterdraw</strong><span>Privacy Policy　 Term and conditions　 Contact</span><span>◉　𝕏　◎　▻　in</span></footer>
    </>
  );
}

function ShipmentCard({ shipment }: { shipment: (typeof shipmentRecords)[number] }) {
  const ModeIcon = shipment.mode === "air" ? Plane : shipment.mode === "rail" ? TrainFront : Truck;
  return <article className="shipment-card">
    <header><div><strong>#{shipment.id}</strong><span className={`shipment-status ${slug(shipment.status)}`}>{shipment.status}</span></div><i><ModeIcon size={20} /></i></header>
    <div className="shipment-company"><b>{shipment.company.slice(0, 1)}</b><span><strong>{shipment.company}</strong><small>{shipment.category}</small></span></div>
    <div className="shipment-route">
      <div><i /><span>Origin</span><strong>{shipment.origin}</strong><small>{shipment.originDate}</small></div>
      <div><MapPin size={15} /><span>Destination</span><strong>{shipment.destination}</strong><small>{shipment.destinationDate}</small></div>
    </div>
    <footer><div><span>Progress <b>{shipment.progress}%</b></span><span>Carriers <b>{shipment.carrier}</b></span></div><progress value={shipment.progress} max="100" /></footer>
  </article>;
}

function ShipmentTable({ records }: { records: typeof shipmentRecords }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [ascending, setAscending] = useState(true);
  const sorted = [...records].sort((a,b) => (ascending ? 1 : -1) * a.id.localeCompare(b.id));
  return <div className="shipments-table-wrap"><table><thead><tr><th>□</th><th><button onClick={() => setAscending(!ascending)}>Shipping ID ↕</button></th><th>Company</th><th>Route</th><th>Carrier</th><th>Progress</th><th>Status</th></tr></thead><tbody>{sorted.map((item) => <tr key={item.id}><td><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((old) => old.includes(item.id) ? old.filter((id) => id !== item.id) : [...old, item.id])} /></td><td><b>#{item.id}</b></td><td>{item.company}<small>{item.category}</small></td><td>{item.origin} → {item.destination}</td><td>{item.carrier}</td><td>{item.progress}%</td><td><span className={`shipment-status ${slug(item.status)}`}>{item.status}</span></td></tr>)}</tbody></table></div>;
}

function slug(value: ShipmentStatus) { return value.toLowerCase().replaceAll(" ", "-"); }
