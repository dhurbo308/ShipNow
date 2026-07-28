"use client";

import {
  ArrowUpRight, CalendarRange, CircleDollarSign, Clock3, MoreHorizontal,
  PackageCheck, Plus, Search, SlidersHorizontal, Truck, Weight,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
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
            <button className="primary-button"><Plus size={18} /><span>Add New Shipping</span></button>
          </div>
        </header>

        <section className="metric-grid">
          <Metric label="Active Shipments" value="1,284" suffix="shipments" trend="+8.7%" note="from last week" icon={<Truck />} />
          <Metric label="Delivery Performance" value="94.3%" suffix="on-time" trend="-1.2%" note="from last week" icon={<CalendarRange />} />
          <Metric label="Revenue" value="$82,450" trend="+12.4%" note="from last month" icon={<CircleDollarSign />} />
        </section>

        <div className="dashboard-grid">
          <Panel className="shipment-chart" title="Shipment Statistic" action="Last Year">
            <div className="panel-total"><strong>4,352</strong><span>↗ +8.7%</span></div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyData}>
                <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="shipments" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((_, i) => <Cell key={i} fill={i === 4 ? "#8064ed" : "#e3e3e3"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel className="profit-chart" title="Profit Summary" action="Last 8 Months">
            <div className="panel-total"><strong>$624,550</strong><span>↗ 5.62%</span></div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyData} barGap={2}>
                <CartesianGrid vertical={false} stroke="#eee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#ded7ff" radius={[5, 5, 0, 0]} />
                <Bar dataKey="cost" fill="#eeeeee" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel className="type-panel" title="Shipment Type">
            <div className="donut-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={shipmentTypes} dataKey="value" innerRadius={63} outerRadius={83} startAngle={90} endAngle={-270} stroke="none">
                    {shipmentTypes.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div><small>Total Shipment</small><strong>2,500</strong></div>
            </div>
            <div className="type-legend">
              {shipmentTypes.map((item) => <div key={item.name}><b style={{ background: item.color }}>{item.percent}%</b><span><strong>{item.name}</strong><small>{item.value.toLocaleString()} shipments</small></span></div>)}
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
      <Footer />
    </>
  );
}

function Metric({ label, value, suffix, trend, note, icon }: { label: string; value: string; suffix?: string; trend: string; note: string; icon: React.ReactNode }) {
  return <article className="metric-card"><div><p>{label}</p><h2>{value} <small>{suffix}</small></h2><span>⌁ {trend}</span> <em>{note}</em></div><i>{icon}</i></article>;
}

function Panel({ title, action, className = "", children }: { title: React.ReactNode; action?: string; className?: string; children: React.ReactNode }) {
  return <section className={`dash-panel ${className}`}><header><h2>{title}</h2>{action ? <button>{action}⌄</button> : <button aria-label="More options"><MoreHorizontal size={18} /></button>}</header>{children}</section>;
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
  return <Panel className="alerts-panel" title="Shipment Alerts">
    <div className="alert-count"><strong>12</strong><span>Delays Detected</span></div>
    <div className="alert-summaries"><div><b>5</b>Customs<br />Clearance Delay</div><div><b>4</b>Incorrect<br />Address Provided</div><div><b>3</b>Weather-<br />Related Hold</div></div>
    <div className="alert-list">{alerts.map((alert, i) => <div key={alert.id}><i>{i === 2 ? "☁" : "⌑"}</i><span><strong>{alert.title}</strong><small><b>{alert.id}</b> · {alert.type} · {alert.date}</small></span><ArrowUpRight size={15} /></div>)}</div>
  </Panel>;
}

function RecentShipments() {
  return <Panel className="recent-panel" title={<>Recent Shipment<span className="desktop-plural">s</span></>}>
    <div className="table-tools"><label><Search size={15} /><input placeholder="Search shipment" /></label><button><SlidersHorizontal size={15} /></button><button><MoreHorizontal size={15} /></button></div>
    <div className="table-scroll"><table><thead><tr><th>□</th><th>Shipping ID ↕</th><th>Company ↕</th><th>Carriers ↕</th><th>Route ↕</th><th>Shipping Date ↕</th><th>Status ↕</th></tr></thead>
      <tbody>{shipments.map((shipment) => <tr key={shipment.id}><td>□</td><td><b>#{shipment.id}</b></td><td>{shipment.company}<small>{shipment.category}</small></td><td>{shipment.carrier}</td><td>{shipment.route}</td><td>{shipment.date}</td><td><span className={`status ${shipment.status.toLowerCase().replaceAll(" ", "-")}`}>{shipment.status}</span></td></tr>)}</tbody>
    </table></div>
  </Panel>;
}

function ActivityPanel() {
  return <Panel className="activity-panel" title="Recent Activity"><div className="activity-list">{activities.map((item, i) => <div key={i}><i>{item.icon === "check" ? "✓" : item.icon === "refresh" ? "⟳" : item.icon === "tag" ? "◇" : "□"}</i><span><p>{item.text}</p><small>{item.time}</small></span></div>)}</div></Panel>;
}

function Footer() {
  return <footer className="app-footer"><strong>Copyright © 2025 Peterdraw</strong><nav><a>Privacy Policy</a><a>Term and conditions</a><a>Contact</a></nav><div>◉　𝕏　◎　▻　in</div></footer>;
}
