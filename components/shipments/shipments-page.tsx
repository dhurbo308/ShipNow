"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Clock3, Filter, Grid2X2, List,
  MapPin, Package, Plane, Plus, Search, TrainFront, Truck,
} from "lucide-react";
import { Shipment, shipmentRecords, ShipmentStatus } from "@/data/shipments/shipments";

const statuses = ["All", "Delivered", "In Transit", "Processing", "Out for Delivery"] as const;
const tableStatuses = ["All", "Completed", "Delivery", "Pending"] as const;
type FreightMode = "all" | Shipment["mode"];

export function ShipmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view = params.get("view") === "table" ? "table" : "grid";
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [mode, setMode] = useState<FreightMode>("all");
  const [dateRange, setDateRange] = useState("All dates");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const filtered = useMemo(() => shipmentRecords
    .filter((item) => status === "All"
      || item.status === status
      || (status === "Completed" && item.status === "Delivered")
      || (status === "Delivery" && ["In Transit", "Out for Delivery"].includes(item.status))
      || (status === "Pending" && item.status === "Processing"))
    .filter((item) => `${item.id} ${item.company} ${item.category} ${item.carrier} ${item.origin} ${item.destination}`.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((item) => mode === "all" || item.mode === mode)
    .filter((item) => dateRange === "All dates"
      || (dateRange === "Mar 18–19" && /Mar (18|19)/.test(item.originDate))
      || (dateRange === "Mar 20–21" && /Mar (20|21)/.test(item.originDate)))
    .sort((a, b) => sort === "Progress" ? b.progress - a.progress : sort === "Company" ? a.company.localeCompare(b.company) : b.id.localeCompare(a.id)),
  [dateRange, mode, query, sort, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function switchView(next: "grid" | "table") {
    const nextParams = new URLSearchParams(params.toString());
    if (next === "grid") nextParams.delete("view"); else nextParams.set("view", "table");
    router.replace(`${pathname}${nextParams.size ? `?${nextParams}` : ""}`, { scroll: false });
    setStatus("All");
    setPage(1);
  }

  return (
    <main className={`shipments-page ${view === "table" ? "table-view" : "grid-view"}`}>
      <header className="shipments-heading">
        <div>
          <h1>Shipments</h1>
          <div className="breadcrumb-row">
            <span><b>Dashboard</b> / Shipments</span>
            <ViewSwitcher view={view} switchView={switchView} />
          </div>
        </div>
        <button className="new-shipment" onClick={() => router.push("/shipments/new")}><Plus size={18} />New Shipment</button>
      </header>
      <div className="mobile-view-switcher"><ViewSwitcher view={view} switchView={switchView} labels /></div>

      {view === "table" && <TableMetrics />}

      {view === "grid" ? (
        <>
          <ShipmentToolbar
            items={statuses} status={status} setStatus={setStatus} query={query} setQuery={setQuery}
            sort={sort} setSort={setSort} mode={mode} setMode={setMode} setPage={setPage}
            onNew={() => router.push("/shipments/new")}
          />
          <section className="shipment-card-grid" aria-live="polite">
            {visibleRecords.map((shipment) => <ShipmentCard key={shipment.id} shipment={shipment} />)}
          </section>
        </>
      ) : (
        <section className="shipments-table-panel">
          <div className="table-mode-toolbar">
            <div className="status-tabs">{tableStatuses.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }}>{item}</button>)}</div>
            <div className="shipment-controls">
              <label><Search size={17} /><input aria-label="Search shipments" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search id, company, etc" /></label>
              <label className="control-select filter-control"><Filter size={16} /><span className="control-label">Filter</span><span className="sr-only">Freight type</span><select value={mode} onChange={(e) => { setMode(e.target.value as FreightMode); setPage(1); }}><option value="all">All freight</option><option value="road">Road</option><option value="rail">Rail</option><option value="air">Air</option></select></label>
              <button className="mobile-new-shipment" aria-label="New shipment" onClick={() => router.push("/shipments/new")}><Plus size={18} /></button>
              <label className="control-select date-control"><CalendarDays size={15} /><span className="control-label">This Month</span><span className="sr-only">Shipment date range</span><select value={dateRange} onChange={(e) => { setDateRange(e.target.value); setPage(1); }}><option>All dates</option><option>Mar 18–19</option><option>Mar 20–21</option></select></label>
            </div>
          </div>
          <ShipmentTable records={visibleRecords} />
        </section>
      )}

      {!filtered.length && <div className="shipments-empty" role="status"><Package /><h2>No shipments found</h2><p>Try changing your search or filters.</p></div>}

      {!!filtered.length && (
        <div className="shipments-pagination">
          <p>Show <select aria-label="Results per page" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select> of {filtered.length} results</p>
          <nav aria-label="Shipment pages">
            <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button aria-current={currentPage === item ? "page" : undefined} className={currentPage === item ? "active" : ""} onClick={() => setPage(item)} key={item}>{item}</button>)}
            <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight /></button>
          </nav>
        </div>
      )}
    </main>
  );
}

function ViewSwitcher({ view, switchView, labels = false }: { view: "grid" | "table"; switchView: (view: "grid" | "table") => void; labels?: boolean }) {
  return <div className={labels ? "" : "view-switcher"} role="group" aria-label="Shipment view">
    <button className={view === "table" ? "active" : ""} onClick={() => switchView("table")} aria-pressed={view === "table"}><List size={15} />{labels && <span>Table</span>}</button>
    <button className={view === "grid" ? "active" : ""} onClick={() => switchView("grid")} aria-pressed={view === "grid"}><Grid2X2 size={15} />{labels && <span>Cards</span>}</button>
  </div>;
}

function ShipmentToolbar({ items, status, setStatus, query, setQuery, sort, setSort, mode, setMode, setPage, onNew }: {
  items: readonly string[]; status: string; setStatus: (value: string) => void;
  query: string; setQuery: (value: string) => void; sort: string; setSort: (value: string) => void;
  mode: FreightMode; setMode: (value: FreightMode) => void; setPage: (value: number) => void; onNew: () => void;
}) {
  return <div className="shipments-toolbar">
    <div className="status-tabs">{items.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }}>{item}</button>)}</div>
    <div className="shipment-controls">
      <label><Search size={17} /><input aria-label="Search shipments" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search Shipment" /></label>
      <label className="control-select"><Filter size={16} /><span className="sr-only">Freight type</span><select value={mode} onChange={(e) => { setMode(e.target.value as FreightMode); setPage(1); }}><option value="all">All freight</option><option value="road">Road</option><option value="rail">Rail</option><option value="air">Air</option></select></label>
      <button className="mobile-new-shipment" aria-label="New shipment" onClick={onNew}><Plus size={18} /></button>
      <span>Sort by:</span>
      <select aria-label="Sort shipments" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}><option>Newest</option><option>Progress</option><option>Company</option></select>
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

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const ModeIcon = shipment.mode === "air" ? Plane : shipment.mode === "rail" ? TrainFront : Truck;
  return <article className="shipment-card">
    <header><div><strong>#{shipment.id}</strong><span className={`shipment-status ${slug(shipment.status)}`}>{shipment.status}</span></div><i><ModeIcon size={20} /></i></header>
    <div className="shipment-company"><b>{shipment.company.slice(0, 1)}</b><span><strong>{shipment.company}</strong><small>{shipment.category}</small></span></div>
    <div className="shipment-route">
      <div><i /><span>Origin</span><strong>{shipment.origin}</strong><small>{shipment.originDate}</small></div>
      <div><MapPin size={15} /><span>Destination</span><strong>{shipment.destination}</strong><small>{shipment.destinationDate}</small></div>
    </div>
    <footer><div><span>Progress <b>{shipment.progress}%</b></span><span>Carriers <b>{shipment.carrier}</b></span></div><progress aria-label={`${shipment.progress}% complete`} value={shipment.progress} max="100" /></footer>
  </article>;
}

type SortKey = "id" | "company" | "carrier" | "category" | "weight" | "origin" | "originDate" | "progress" | "status";

function ShipmentTable({ records }: { records: Shipment[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [ascending, setAscending] = useState(true);
  const indexed = records.map((item) => ({ item, weight: shipmentWeight(shipmentRecords.findIndex((record) => record.id === item.id)) }));
  const sorted = indexed.sort((a, b) => {
    const av = sortKey === "weight" ? a.weight : a.item[sortKey];
    const bv = sortKey === "weight" ? b.weight : b.item[sortKey];
    return (ascending ? 1 : -1) * (typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv)));
  });
  const allSelected = records.length > 0 && records.every((item) => selected.includes(item.id));
  function sortBy(key: SortKey) {
    if (sortKey === key) setAscending((value) => !value); else { setSortKey(key); setAscending(true); }
  }
  const heading = (label: string, key: SortKey) => <button onClick={() => sortBy(key)} aria-sort={sortKey === key ? (ascending ? "ascending" : "descending") : "none"}>{label} ↕</button>;

  return <div className="shipments-table-wrap" tabIndex={0} aria-label="Scrollable shipment table"><table>
    <thead><tr>
      <th><input aria-label="Select all visible shipments" type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : records.map((item) => item.id))} /></th>
      <th>{heading("Shipping ID", "id")}</th><th>{heading("Company", "company")}</th><th>{heading("Carriers", "carrier")}</th>
      <th>{heading("Product Category", "category")}</th><th>{heading("Weight", "weight")}</th><th>{heading("Route", "origin")}</th>
      <th>{heading("Date", "originDate")}</th><th>{heading("Progress", "progress")}</th><th>{heading("Status", "status")}</th>
    </tr></thead>
    <tbody>{sorted.map(({ item, weight }) => <tr key={item.id}>
      <td><input aria-label={`Select ${item.id}`} type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((old) => old.includes(item.id) ? old.filter((id) => id !== item.id) : [...old, item.id])} /></td>
      <td><b>#{item.id}</b><small>{modeName(item.mode)}</small></td>
      <td><span className="table-company"><i>{item.company[0]}</i><span>{item.company}<small>{item.category}</small></span></span></td>
      <td>{item.carrier}<small>{item.category}<br />{weight.toLocaleString()} kg</small></td><td>{item.category}</td><td>{weight.toLocaleString()} kg</td>
      <td><span className="table-route"><b>{item.origin}</b> (Origin)<strong>{item.destination}</strong> (Destination)</span></td>
      <td><span className="table-date">{item.originDate} (ATD)<strong>{item.destinationDate} (ETA)</strong></span></td>
      <td><span className="table-progress"><i><b style={{ width: `${item.progress}%` }} /></i>{item.progress}%</span></td>
      <td><span className={`table-status ${tableStatus(item.status).toLowerCase()}`}><i />{tableStatus(item.status)}</span></td>
    </tr>)}</tbody>
  </table></div>;
}

function slug(value: ShipmentStatus) { return value.toLowerCase().replaceAll(" ", "-"); }
function modeName(mode: Shipment["mode"]) { return mode === "air" ? "✈ Air Freight" : mode === "rail" ? "▣ Rail Freight" : "▱ Road Freight"; }
function tableStatus(status: ShipmentStatus) { return status === "Delivered" ? "Completed" : status === "Processing" ? "Pending" : "Delivery"; }
function shipmentWeight(index: number) { return [1200,850,1450,960,1680,1100,1250,920,1375,980,1020,1080][Math.max(0, index) % 12]; }
