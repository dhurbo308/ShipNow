"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Clock3, Filter, Grid2X2, List, MapPin, Package,
  Plane, Plus, Search, TrainFront, Truck,
} from "lucide-react";
import { shipmentRecords, ShipmentStatus } from "@/data/shipments/shipments";

const statuses = ["All", "Delivered", "In Transit", "Processing", "Out for Delivery"] as const;
const tableStatuses = ["All", "Completed", "Delivery", "Pending"] as const;

export function ShipmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view = params.get("view") === "table" ? "table" : "grid";
  const [status, setStatus] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => shipmentRecords
    .filter((item) => status === "All"
      || item.status === status
      || (status === "Completed" && item.status === "Delivered")
      || (status === "Delivery" && ["In Transit", "Out for Delivery"].includes(item.status))
      || (status === "Pending" && item.status === "Processing"))
    .filter((item) => `${item.id} ${item.company} ${item.origin} ${item.destination}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "Progress" ? b.progress - a.progress : sort === "Company" ? a.company.localeCompare(b.company) : b.id.localeCompare(a.id)),
  [query, sort, status]);

  function switchView(next: "grid" | "table") {
    const nextParams = new URLSearchParams(params.toString());
    if (next === "grid") nextParams.delete("view"); else nextParams.set("view", "table");
    router.replace(`${pathname}${nextParams.size ? `?${nextParams}` : ""}`, { scroll: false });
    setStatus("All");
  }

  return (
    <>
      <main className={`shipments-page ${view === "table" ? "table-view" : "grid-view"}`}>
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
        <div className="mobile-view-switcher" aria-label="Shipment view">
          <button className={view === "table" ? "active" : ""} onClick={() => switchView("table")}><List size={15} /><span>Table</span></button>
          <button className={view === "grid" ? "active" : ""} onClick={() => switchView("grid")}><Grid2X2 size={15} /><span>Cards</span></button>
        </div>

        {view === "table" && <TableMetrics />}

        {view === "grid" ? (
          <>
            <ShipmentToolbar items={statuses} status={status} setStatus={setStatus} query={query} setQuery={setQuery} sort={sort} setSort={setSort} setPage={setPage} />
            <section className="shipment-card-grid">
              {filtered.map((shipment) => <ShipmentCard key={shipment.id} shipment={shipment} />)}
            </section>
          </>
        ) : (
          <section className="shipments-table-panel">
            <div className="table-mode-toolbar">
              <div className="status-tabs">{tableStatuses.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }}>{item}</button>)}</div>
              <div className="shipment-controls">
                <label><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search id, company, etc" /></label>
                <button><Filter size={16} />Filter <ChevronDown size={13} /></button>
                <button className="mobile-new-shipment" aria-label="New shipment"><Plus size={18} /></button>
                <button><CalendarDays size={15} />This Month <ChevronDown size={13} /></button>
              </div>
            </div>
            <ShipmentTable records={filtered} />
          </section>
        )}

        {!filtered.length && <div className="shipments-empty"><Package /><h2>No shipments found</h2><p>Try changing your search or status filter.</p></div>}

        <div className="shipments-pagination">
          <p>Show <select><option>12</option><option>24</option></select> of {view === "table" ? "1,240" : "520"} results</p>
          <nav><button disabled><ChevronLeft /></button>{[1,2,3].map((item) => <button className={page === item ? "active" : ""} onClick={() => setPage(item)} key={item}>{item}</button>)}<span>…</span><button onClick={() => setPage(16)}>16</button><button onClick={() => setPage(Math.min(16, page + 1))}><ChevronRight /></button></nav>
        </div>
      </main>
      <footer className="shipments-footer"><strong>Copyright © 2025 Peterdraw</strong><span>Privacy Policy　 Term and conditions　 Contact</span><span>◉　𝕏　◎　▻　in</span></footer>
    </>
  );
}

function ShipmentToolbar({ items, status, setStatus, query, setQuery, sort, setSort, setPage }: {
  items: readonly string[]; status: string; setStatus: (value: string) => void;
  query: string; setQuery: (value: string) => void; sort: string;
  setSort: (value: string) => void; setPage: (value: number) => void;
}) {
  return <div className="shipments-toolbar">
    <div className="status-tabs">{items.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }}>{item}</button>)}</div>
    <div className="shipment-controls">
      <label><Search size={17} /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search Shipment" /></label>
      <button><Filter size={16} />Filter⌄</button>
      <button className="mobile-new-shipment" aria-label="New shipment"><Plus size={18} /></button>
      <span>Sort by:</span>
      <select value={sort} onChange={(e) => setSort(e.target.value)}><option>Newest</option><option>Progress</option><option>Company</option></select>
    </div>
  </div>;
}

function TableMetrics() {
  const cards = [
    { label: "Total Shipments", value: "1,284", note: "Up by", percent: "4.6%", icon: <Truck /> },
    { label: "Pending", value: "285", note: "Up by", percent: "8.7%", icon: <Clock3 /> },
    { label: "Delivery", value: "594", note: "Down", percent: "4.2%", icon: <Package /> },
    { label: "Completed", value: "405", note: "Up by", percent: "3.9%", icon: <CircleCheck /> },
  ];
  return <section className="shipment-metrics">{cards.map((card) => <article key={card.label}><header><i>{card.icon}</i><span>{card.label}</span><b>•••</b></header><div><strong>{card.value}</strong><small>{card.note} <b>{card.percent}</b><br />this week</small></div></article>)}</section>;
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
  return <div className="shipments-table-wrap"><table><thead><tr><th>□</th><th><button onClick={() => setAscending(!ascending)}>Shipping ID ↕</button></th><th>Company ↕</th><th>Carriers ↕</th><th>Product Category ↕</th><th>Weight ↕</th><th>Route ↕</th><th>Date ↕</th><th>Progress ↕</th><th>Status ↕</th></tr></thead><tbody>{sorted.map((item, index) => <tr key={item.id}>
    <td><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((old) => old.includes(item.id) ? old.filter((id) => id !== item.id) : [...old, item.id])} /></td>
    <td><b>#{item.id}</b><small>{modeName(item.mode)}</small></td>
    <td><span className="table-company"><i>{item.company[0]}</i><span>{item.company}<small>{item.category}</small></span></span></td>
    <td>{item.carrier}<small>{item.category}<br />{shipmentWeight(index).toLocaleString()} kg</small></td><td>{item.category}</td><td>{shipmentWeight(index).toLocaleString()} kg</td>
    <td><span className="table-route"><b>{item.origin}</b> (Origin)<strong>{item.destination}</strong> (Destination)</span></td>
    <td><span className="table-date">{item.originDate} (ATD)<strong>{item.destinationDate} (ETA)</strong></span></td>
    <td><span className="table-progress"><i><b style={{ width: `${item.progress}%` }} /></i>{item.progress}%</span></td>
    <td><span className={`table-status ${tableStatus(item.status).toLowerCase()}`}><i />{tableStatus(item.status)}</span></td>
  </tr>)}</tbody></table></div>;
}

function slug(value: ShipmentStatus) { return value.toLowerCase().replaceAll(" ", "-"); }
function modeName(mode: "air" | "road" | "rail") { return mode === "air" ? "✈ Air Freight" : mode === "rail" ? "▣ Rail Freight" : "▱ Road Freight"; }
function tableStatus(status: ShipmentStatus) { return status === "Delivered" ? "Completed" : status === "Processing" ? "Pending" : "Delivery"; }
function shipmentWeight(index: number) { return [1200,850,1450,960,1680,1100,1250,920,1375,980,1020,1080][index % 12]; }
