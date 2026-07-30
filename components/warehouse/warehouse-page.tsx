"use client";

import { useMemo, useState } from "react";
import { Box, FilePlus2, Filter, ListPlus, MoreHorizontal, Plane, ShipWheel, SquareCheck, TrainFront, TrendingUp, Truck } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { inventory, mapAreas, packages, storageRows, warehouseActivities } from "@/data/warehouse/warehouse-data";

export function WarehousePage() {
  const [freight, setFreight] = useState("Road Freight");
  const [packageTab, setPackageTab] = useState("All");
  const [floor, setFloor] = useState(1);
  const [sort, setSort] = useState("Section");
  const [storageCategory, setStorageCategory] = useState("All");
  const filteredPackages = packageTab === "All" ? packages : packages.filter((item) => item.status === packageTab);
  const rows = useMemo(() => storageRows
    .filter((row) => storageCategory === "All" || row.category === storageCategory)
    .sort((a,b) => sort === "Floor" ? a.floor - b.floor : a.section.localeCompare(b.section)), [sort, storageCategory]);

  return <>
    <main className="warehouse-page">
      <header className="warehouse-heading">
        <div><h1>Warehouse</h1><p><b>Dashboard</b> / Warehouse</p></div>
        <div className="freight-tabs">{[
          ["Road Freight", Truck],["Rail Freight", TrainFront],["Ocean Freight", ShipWheel],["Air Freight", Plane],
        ].map(([label, Icon]) => <button key={label as string} className={freight === label ? "active" : ""} onClick={() => setFreight(label as string)}><Icon size={17} />{label as string}</button>)}</div>
      </header>

      <div className="warehouse-layout">
        <section className="warehouse-stats">
          <Stat label="Total SKU" value="285" trend="+2.58%" />
          <Stat label="Quantity on Hand" value="12,450" suffix="units" trend="+4.37%" />
          <Stat label="Capacity Usage" value="62.5%" suffix="Full" trend="+1.54%" />
        </section>
        <InventoryPanel />
        <CapacityPanel />
        <StoragePanel rows={rows} sort={sort} setSort={setSort} category={storageCategory} setCategory={setStorageCategory} />
        <PackagePanel items={filteredPackages} tab={packageTab} setTab={setPackageTab} />
        <WarehouseMap floor={floor} setFloor={setFloor} />
        <ActivityLog />
      </div>
    </main>
  </>;
}

function Stat({ label, value, suffix, trend }: { label: string; value: string; suffix?: string; trend: string }) {
  return <article><p>{label}</p><div><span className="warehouse-stat-value"><strong>{value}</strong>{suffix && <span>{suffix}</span>}</span><b><TrendingUp />{trend}</b></div></article>;
}

function PanelHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return <header><h2>{title}</h2>{children || <button aria-label="More options"><MoreHorizontal /></button>}</header>;
}

function InventoryPanel() {
  return <section className="warehouse-panel inventory-panel"><PanelHeader title="Warehouse Inventory" /><h3>10,000 <small>packages</small></h3><div className="inventory-bars">{inventory.map((item, index) => <div className={`inventory-item inventory-item-${index + 1}`} key={item.category}><span>{item.category}</span><i><b style={{ height: `${item.percent * 2.1}px` }} /></i><strong>{item.percent}% <small>· {item.packages.toLocaleString()}</small></strong></div>)}</div></section>;
}

function CapacityPanel() {
  return <section className="warehouse-panel capacity-panel"><PanelHeader title="Capacity Usage" /><div className="capacity-chart"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={[{ value: 62.5 },{ value: 37.5 }]} dataKey="value" innerRadius={67} outerRadius={84} startAngle={90} endAngle={-270} stroke="none"><Cell fill="#8064ed" /><Cell fill="#fff" /></Pie></PieChart></ResponsiveContainer><span>Total Usage<strong>62.5%</strong></span></div><footer><span>Loaded<strong>40 shelves</strong></span><span>Empty<strong>24 shelves</strong></span></footer></section>;
}

function StoragePanel({ rows, sort, setSort, category, setCategory }: { rows: typeof storageRows; sort: string; setSort: (value: string) => void; category: string; setCategory: (value: string) => void }) {
  const categories = ["All", ...Array.from(new Set(storageRows.map((row) => row.category)))];
  return <section className="warehouse-panel storage-panel"><PanelHeader title="Warehouse Storage"><div className="storage-controls"><label><Filter /><span className="sr-only">Filter storage category</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><span>Sort by:</span><select aria-label="Sort warehouse storage" value={sort} onChange={(e) => setSort(e.target.value)}><option>Section</option><option>Floor</option></select></div></PanelHeader><div className="warehouse-table"><table><thead><tr><th>Floor ↕</th><th>Section ↕</th><th>Category ↕</th><th>Storage Used ↕</th><th>Percentage ↕</th><th>Available Space ↕</th></tr></thead><tbody>{rows.map((row) => <tr key={row.section}><td>{row.floor}</td><td>{row.section}</td><td>{row.category}</td><td><i><b style={{ width: `${row.used}%` }} /></i><small>{row.used}% · {row.available}/100</small></td><td>{row.used}%</td><td>{row.available}/100</td></tr>)}</tbody></table>{!rows.length && <p role="status">No storage rows match this filter.</p>}</div></section>;
}

function PackagePanel({ items, tab, setTab }: { items: typeof packages; tab: string; setTab: (value: string) => void }) {
  return <section className="warehouse-panel package-panel"><PanelHeader title="Package Status" /><div className="package-tabs">{["All","Expected","Received","Sent"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div><div className="package-list">{items.map((item) => <div key={item.id}><i><Box /></i><span><strong>{item.id}</strong><small>{item.date}</small></span><b className={item.status.toLowerCase()}>{item.status}</b></div>)}</div></section>;
}

function WarehouseMap({ floor, setFloor }: { floor: number; setFloor: (value: number) => void }) {
  return <section className="warehouse-panel warehouse-map"><PanelHeader title="Warehouse Map"><div className="floor-tabs">{[1,2,3].map((item) => <button key={item} className={floor === item ? "active" : ""} onClick={() => setFloor(item)}>Floor {item}</button>)}</div></PanelHeader><div className="map-grid">{mapAreas.map((area) => <article className={area.wide ? "wide" : ""} key={area.name}><h3>{area.name}</h3><div>{area.codes.map((code, i) => <span className={(i + floor) % 3 === 0 ? "full" : ""} key={code}>{code}</span>)}</div><small>Available Space <b>{area.available}/100</b></small></article>)}</div><footer><span><i />Available</span><span><i />Full</span></footer></section>;
}

function ActivityLog() {
  const icons = [SquareCheck, ListPlus, Truck, FilePlus2];
  return <section className="warehouse-panel warehouse-activity"><PanelHeader title="Warehouse Activity Log" /><div>{warehouseActivities.map((item, index) => {
    const ActivityIcon = icons[index];
    return <article key={item.person}><i><ActivityIcon /></i><p><b>{item.person}</b> {item.text}<small>{item.time}</small></p></article>;
  })}</div></section>;
}
