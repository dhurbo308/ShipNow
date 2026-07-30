"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight, ChevronUp, CircleCheck, CircleDollarSign, CircleX, Clock3, CloudSun, FileX2, MoreHorizontal,
  PackageCheck, Plus, RotateCcw, Search, SlidersHorizontal, Square, Tag, Truck, Weight,
} from "lucide-react";
import {
  Cell, Pie, PieChart, ResponsiveContainer,
} from "recharts";
import {
  activities, alerts, categories, monthlyData, shipments, shipmentTypes,
} from "@/data/dashboard/dashboard-data";

export function Dashboard() {
  return (
    <>
      <main className="dashboard">
        <header className="dashboard-header">
          <div><p>Hello John!</p><h1>Good Morning</h1></div>
          <div className="header-actions">
            <label className="global-search"><Search size={18} /><input placeholder="Search anything" /></label>
            <Link className="primary-button" href="/shipments/new"><Plus size={18} /><span>Add New Shipping</span></Link>
          </div>
        </header>

        <section className="metric-grid">
          <Metric label="Active Shipments" value="1,284" suffix="shipments" trend="+8.7%" note="from last week" icon={<Truck />} />
          <Metric label="Delivery Performance" value="94.3%" suffix="on-time" trend="-1.2%" note="from last week" icon={<DeliveryPerformanceIcon />} />
          <Metric label="Revenue" value="$82,450" trend="+12.4%" note="from last month" icon={<CircleDollarSign />} />
        </section>

        <div className="dashboard-grid">
          <ShipmentStatistic />

          <ProfitSummary />

          <Panel className="type-panel" title="Shipment Type">
            <div className="donut-wrap">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={shipmentTypes} dataKey="value" innerRadius={73} outerRadius={94} startAngle={90} endAngle={-270} stroke="none">
                    {shipmentTypes.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div><small>Total Shipment</small><strong>2,500</strong></div>
            </div>
            <div className="type-legend">
              {[shipmentTypes[0], shipmentTypes[2], shipmentTypes[1], shipmentTypes[3]].map((item) => <div key={item.name}><b style={{ background: item.color }}>{item.percent}%</b><span><strong>{item.name}</strong><small>{item.value.toLocaleString()} {item.name === "Road Freight" ? "shipment" : "shipments"}</small></span></div>)}
            </div>
          </Panel>

          <Panel className="categories-panel" title="Product Categories">
            <div className="category-total"><span>Total Products</span><strong>1,000</strong></div>
            <div className="stacked-bar">{categories.map((item) => <i key={item.name} style={{ width: `${item.percent}%`, background: item.color }} />)}</div>
            <div className="category-list">
              {categories.map((item) => <div key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><small>{item.products} products</small><b>{item.percent}%</b></div>)}
            </div>
          </Panel>

          <TrackingPanel />
          <AlertsPanel />
          <RecentShipments />
          <ActivityPanel />
        </div>
      </main>
    </>
  );
}

function Metric({ label, value, suffix, trend, note, icon }: { label: string; value: string; suffix?: string; trend: string; note: string; icon: React.ReactNode }) {
  return <article className="metric-card"><div><p>{label}</p><h2>{value} <small>{suffix}</small></h2><div className="metric-trend"><span><b><ChevronUp /></b>{trend}</span><em>{note}</em></div></div><i>{icon}</i></article>;
}

function DeliveryPerformanceIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 14v-3m4 3V8m4 6v-5M9 20l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function Panel({ title, action, className = "", children }: { title: React.ReactNode; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return <section className={`dash-panel ${className}`}><header><h2>{title}</h2>{action ? (typeof action === "string" ? <button>{action}⌄</button> : action) : <button aria-label="More options"><MoreHorizontal size={18} /></button>}</header>{children}</section>;
}

const statisticPeriods = {
  "Last Year": monthlyData,
  "Last 6 Months": monthlyData.slice(2),
  "Last 3 Months": monthlyData.slice(5),
} as const;

function ShipmentStatistic() {
  const [period, setPeriod] = useState<keyof typeof statisticPeriods>("Last Year");
  const data = statisticPeriods[period];
  const [activeIndex, setActiveIndex] = useState(4);
  const total = data[data.length - 1].shipments;
  const chartWidth = 420;
  const chartHeight = 188;
  const plotTop = 34;
  const plotBottom = 157;
  const plotLeft = 42;
  const plotRight = 410;
  const max = 4800;
  const step = (plotRight - plotLeft) / data.length;
  const barWidth = Math.min(47, step);
  const y = (value: number) => plotBottom - (value / max) * (plotBottom - plotTop);
  const safeActiveIndex = Math.min(activeIndex, data.length - 1);
  const activeItem = data[safeActiveIndex];

  function changePeriod(next: keyof typeof statisticPeriods) {
    const nextData = statisticPeriods[next];
    const mayIndex = nextData.findIndex((item) => item.month === "May");
    setPeriod(next);
    setActiveIndex(mayIndex >= 0 ? mayIndex : nextData.length - 1);
  }

  return (
    <Panel
      className="shipment-chart"
      title="Shipment Statistic"
      action={
        <label className="statistic-period">
          <span className="sr-only">Shipment statistic period</span>
          <select value={period} onChange={(event) => changePeriod(event.target.value as keyof typeof statisticPeriods)}>
            {Object.keys(statisticPeriods).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      }
    >
      <div className="panel-total statistic-total"><strong>{total.toLocaleString()}</strong><span>↗ +8.7%</span></div>
      <div className="statistic-chart" role="img" aria-label={`Shipment statistics for ${period}`}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="shipment-neutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dedede" />
              <stop offset="100%" stopColor="#fafafa" />
            </linearGradient>
            <linearGradient id="shipment-highlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8064ed" />
              <stop offset="100%" stopColor="#f8f6ff" />
            </linearGradient>
          </defs>
          {[0, 1200, 2400, 3600, 4800].map((tick) => {
            const tickY = y(tick);
            return <g key={tick}>
              <line x1={plotLeft} x2={plotRight} y1={tickY} y2={tickY} stroke="#e7e7e7" strokeDasharray="3 4" />
              <text x="0" y={tickY + 4} fill="#858585" fontSize="10">{tick === 0 ? "0K" : `${tick / 1000}K`}</text>
            </g>;
          })}
          {data.map((item, index) => {
            const x = plotLeft + index * step + (step - barWidth) / 2;
            const top = y(item.shipments);
            const active = index === safeActiveIndex;
            return <g className="statistic-bar" role="button" aria-label={`${item.month}: ${item.shipments.toLocaleString()} shipments`} tabIndex={0} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} key={`${period}-${item.month}`}>
              <rect x={x} y={top} width={barWidth} height={plotBottom - top} fill={active ? "url(#shipment-highlight)" : "url(#shipment-neutral)"} />
              <line x1={x} x2={x + barWidth} y1={top} y2={top} stroke="#292929" strokeWidth="2.2" />
              <text x={x + barWidth / 2} y="181" textAnchor="middle" fill="#777" fontSize="10">{item.month}</text>
            </g>;
          })}
          {activeItem && (() => {
            const x = plotLeft + safeActiveIndex * step + step / 2;
            const top = y(activeItem.shipments);
            const tooltipY = Math.max(4, top - 72);
            const tooltipX = Math.max(plotLeft + 39, Math.min(plotRight - 39, x));
            return <g>
              <circle cx={x} cy={top} r="7" fill="#292929" stroke="#fff" strokeWidth="2" />
              <g className="statistic-tooltip">
                <rect x={tooltipX - 39} y={tooltipY} width="78" height="57" rx="10" fill="#ded7ff" />
                <text x={tooltipX} y={tooltipY + 22} textAnchor="middle" fill="#777" fontSize="10">{activeItem.month} 2030</text>
                <text x={tooltipX} y={tooltipY + 45} textAnchor="middle" fill="#292929" fontSize="15" fontWeight="700">{activeItem.shipments.toLocaleString()}</text>
              </g>
            </g>;
          })()}
        </svg>
      </div>
    </Panel>
  );
}

const profitPeriods = {
  "Last 8 Months": monthlyData,
  "Last 6 Months": monthlyData.slice(2),
  "Last 3 Months": monthlyData.slice(5),
} as const;

function ProfitSummary() {
  const [period, setPeriod] = useState<keyof typeof profitPeriods>("Last 8 Months");
  const [activeIndex, setActiveIndex] = useState(4);
  const data = profitPeriods[period].map((item, index) => ({
    ...item,
    displayMonth: period === "Last 8 Months" && index === 5 ? "Jan" : item.month,
  }));
  const displayedTotal = period === "Last 8 Months"
    ? 624550
    : data.reduce((sum, item) => sum + item.revenue, 0);
  const chartWidth = 500;
  const chartHeight = 190;
  const plotLeft = 48;
  const plotRight = 495;
  const plotTop = 17;
  const plotBottom = 157;
  const step = (plotRight - plotLeft) / data.length;
  const barWidth = Math.min(18, step * .32);
  const safeActiveIndex = Math.min(activeIndex, data.length - 1);
  const activeItem = data[safeActiveIndex];
  const y = (value: number) => plotBottom - (value / 100000) * (plotBottom - plotTop);

  function changeProfitPeriod(next: keyof typeof profitPeriods) {
    const nextData = profitPeriods[next];
    const mayIndex = nextData.findIndex((item) => item.month === "May");
    setPeriod(next);
    setActiveIndex(mayIndex >= 0 ? mayIndex : nextData.length - 1);
  }

  return (
    <Panel
      className="profit-chart"
      title="Profit Summary"
      action={
        <label className="profit-period">
          <span className="sr-only">Profit summary period</span>
          <select value={period} onChange={(event) => changeProfitPeriod(event.target.value as keyof typeof profitPeriods)}>
            {Object.keys(profitPeriods).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      }
    >
      <div className="panel-total profit-total"><strong>${displayedTotal.toLocaleString()}</strong><span>↗ 5.62%</span></div>
      <div className="profit-legend" aria-label="Chart legend"><span><i />Revenue</span><span><i />Cost</span></div>
      <div className="profit-bars" role="img" aria-label={`Profit summary for ${period}`}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {[0, 25000, 50000, 75000, 100000].map((tick) => {
            const tickY = y(tick);
            return <g key={tick}><line x1={plotLeft} x2={plotRight} y1={tickY} y2={tickY} stroke="#eeeeee" /><text x="0" y={tickY + 4} fill="#777" fontSize="10">{tick === 0 ? "$0" : `$${tick / 1000}K`}</text></g>;
          })}
          {data.map((item, index) => {
            const center = plotLeft + index * step + step / 2;
            const active = index === safeActiveIndex;
            return <g className="profit-bar-group" role="button" tabIndex={0} aria-label={`${item.month}: revenue $${item.revenue.toLocaleString()}, cost $${item.cost.toLocaleString()}`} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} key={`${period}-${item.month}`}>
              <path d={`M${center - barWidth - 2},${plotBottom} V${y(item.revenue) + 5} Q${center - barWidth - 2},${y(item.revenue)} ${center - barWidth + 3},${y(item.revenue)} H${center - 5} Q${center},${y(item.revenue)} ${center},${y(item.revenue) + 5} V${plotBottom} Z`} fill={active ? "#8064ed" : "#ded7ff"} />
              <path d={`M${center + 3},${plotBottom} V${y(item.cost) + 5} Q${center + 3},${y(item.cost)} ${center + 8},${y(item.cost)} H${center + barWidth} Q${center + barWidth + 5},${y(item.cost)} ${center + barWidth + 5},${y(item.cost) + 5} V${plotBottom} Z`} fill={active ? "#292929" : "#eeeeee"} />
              <text x={center} y="183" textAnchor="middle" fill="#777" fontSize="10">{item.displayMonth}</text>
            </g>;
          })}
          {activeItem && (() => {
            const center = plotLeft + safeActiveIndex * step + step / 2;
            const tooltipWidth = 112;
            const tooltipX = Math.max(plotLeft, Math.min(plotRight - tooltipWidth, center - 30));
            const tooltipY = Math.max(5, Math.min(y(activeItem.revenue) - 4, 65));
            return <g className="profit-svg-tooltip">
              <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="58" rx="9" fill="#f2f2f2" />
              <rect x={tooltipX + 10} y={tooltipY + 13} width="7" height="7" rx="2" fill="#8064ed" />
              <text x={tooltipX + 23} y={tooltipY + 20} fill="#777" fontSize="10">Revenue</text>
              <text x={tooltipX + 103} y={tooltipY + 20} textAnchor="end" fill="#292929" fontSize="10" fontWeight="700">${activeItem.revenue.toLocaleString()}</text>
              <rect x={tooltipX + 10} y={tooltipY + 38} width="7" height="7" rx="2" fill="#292929" />
              <text x={tooltipX + 23} y={tooltipY + 45} fill="#777" fontSize="10">Cost</text>
              <text x={tooltipX + 103} y={tooltipY + 45} textAnchor="end" fill="#292929" fontSize="10" fontWeight="700">${activeItem.cost.toLocaleString()}</text>
            </g>;
          })()}
        </svg>
      </div>
    </Panel>
  );
}

function TrackingPanel() {
  return <Panel className="tracking-panel" title="">
    <div className="map-search"><input placeholder="Search by Shipping ID..." /><Search size={17} /></div>
    <div className="map-controls"><button>+</button><button>−</button></div>
    <div className="route-line"><span>➤</span></div>
    <article className="tracking-card">
      <header><strong>#SH8743921</strong><small>Courier:<b>Daniel Cooper</b>SkyLogix Express</small></header>
      <div><span>In Transit</span> On Schedule</div>
      <div className="progress"><i /><b>▣</b><i /></div>
      <footer><span><strong>San Francisco, CA, USA</strong><small>Mar 19, 2035 – 10:30 AM</small></span><span><strong>New York, NY, USA</strong><small>Mar 23, 2035 – 03:00 PM (estimated)</small></span></footer>
    </article>
  </Panel>;
}

function AlertsPanel() {
  const alertIcons = [FileX2, CircleX, CloudSun, FileX2];
  return <Panel className="alerts-panel" title="Shipment Alerts">
    <div className="alert-count"><strong>12</strong><span>Delays Detected</span></div>
    <div className="alert-summaries"><div><b>5</b><span>Customs<br />Clearance<br />Delay</span></div><div><b>4</b><span>Incorrect<br />Address<br />Provided</span></div><div><b>3</b><span>Weather-<br />Related<br />Hold</span></div></div>
    <div className="alert-list">{alerts.map((alert, i) => {
      const AlertIcon = alertIcons[i];
      return <div key={alert.id}><i><AlertIcon size={15} /></i><span><strong>{alert.title}</strong><small><b>{alert.id}</b><em>·</em>{alert.type}<em>·</em>{alert.date}</small></span><button aria-label={`View ${alert.title}`}><ArrowUpRight size={15} /></button></div>;
    })}</div>
  </Panel>;
}

function RecentShipments() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const statusFilters = ["All", "In Transit", "Out for Delivery", "Delivered", "Processing"];
  const filteredShipments = useMemo(() => shipments.filter((shipment) => {
    const matchesQuery = `${shipment.id} ${shipment.company} ${shipment.category} ${shipment.carrier} ${shipment.route} ${shipment.date} ${shipment.status}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesQuery && (status === "All" || shipment.status === status);
  }), [query, status]);
  const allSelected = filteredShipments.length > 0 && filteredShipments.every((shipment) => selected.includes(shipment.id));

  return <Panel className="recent-panel" title={<>Recent Shipment<span className="desktop-plural">s</span></>}>
    <div className="table-tools">
      <label><Search size={15} /><input aria-label="Search recent shipments" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search shipment" /></label>
      <button className={status !== "All" ? "filter-active" : ""} aria-label={`Change recent shipment filter. Current filter: ${status}`} title={`Filter: ${status}`} onClick={() => setStatus(statusFilters[(statusFilters.indexOf(status) + 1) % statusFilters.length])}><SlidersHorizontal size={15} /></button>
      <button aria-label="More recent shipment options"><MoreHorizontal size={15} /></button>
    </div>
    <div className="table-scroll" tabIndex={0} aria-label="Scrollable recent shipments table"><table><thead><tr><th><input aria-label="Select all visible shipments" type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filteredShipments.map((shipment) => shipment.id))} /></th><th>Shipping ID ↕</th><th>Company ↕</th><th>Carriers ↕</th><th>Route ↕</th><th>Shipping Date ↕</th><th>Status ↕</th></tr></thead>
      <tbody>{filteredShipments.map((shipment) => <tr key={shipment.id}><td><input aria-label={`Select ${shipment.id}`} type="checkbox" checked={selected.includes(shipment.id)} onChange={() => setSelected((current) => current.includes(shipment.id) ? current.filter((id) => id !== shipment.id) : [...current, shipment.id])} /></td><td><b>#{shipment.id}</b></td><td>{shipment.company}<small>{shipment.category}</small></td><td>{shipment.carrier}</td><td>{shipment.route}</td><td>{shipment.date}</td><td><span className={`status ${shipment.status.toLowerCase().replaceAll(" ", "-")}`}>{shipment.status}</span></td></tr>)}</tbody>
    </table>{!filteredShipments.length && <div className="recent-empty" role="status">No shipments match your search and filter.</div>}</div>
  </Panel>;
}

function ActivityPanel() {
  const icons = { box: Square, tag: Tag, refresh: RotateCcw, check: CircleCheck };
  return <Panel className="activity-panel" title="Recent Activity"><div className="activity-list">{activities.slice(0, 4).map((item, i) => {
    const ActivityIcon = icons[item.icon as keyof typeof icons];
    return <div className={`activity-${item.icon}`} key={i}><i><ActivityIcon size={15} /></i><span><p>{item.text}</p><small>{item.time}</small></span></div>;
  })}</div></Panel>;
}
