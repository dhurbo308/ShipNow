"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronsUpDown, CircleDashed, Clock3, FileX2, Search, SlidersHorizontal } from "lucide-react";
import { Invoice, invoices, InvoiceStatus } from "@/data/invoices/invoice-data";

export function InvoicesPage() {
  const [selectedId, setSelectedId] = useState("INV-1008");
  const [detailOpen, setDetailOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | InvoiceStatus>("All");
  const filtered = useMemo(() => invoices.filter((invoice) => (status === "All" || invoice.status === status) && `${invoice.id} ${invoice.company} ${invoice.shipmentId}`.toLowerCase().includes(query.toLowerCase())), [query,status]);
  const selected = invoices.find((invoice) => invoice.id === selectedId) || invoices[0];
  const cycleStatus = () => {
    const options: Array<"All" | InvoiceStatus> = ["All","Paid","Unpaid","Overdue"];
    setStatus(options[(options.indexOf(status) + 1) % options.length]);
  };

  return <>
    <main className="invoices-page">
      <header className="invoices-heading"><div><h1>Invoices &amp; Billing</h1><p><b>Dashboard</b> / Invoices &amp; Billing</p></div><label><Search /><input placeholder="Search anything" /></label></header>
      <InvoiceMetrics />
      <div className="invoice-master-detail">
        <section className="invoice-list-panel">
          <header><h2>Invoices</h2><div><label><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search invoices" /></label><button onClick={cycleStatus} aria-label={`Filter invoices. Current filter: ${status}`} title={`Filter: ${status}`}><SlidersHorizontal /></button><button>New Invoice</button></div></header>
          <InvoiceTable records={filtered} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setDetailOpen(true); }} />
        </section>
        <button className={`invoice-backdrop ${detailOpen ? "open" : ""}`} onClick={() => setDetailOpen(false)} aria-label="Close invoice details" />
        <InvoiceDetail invoice={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
      </div>
    </main>
    <footer className="shipments-footer"><strong>Copyright © 2025 Peterdraw</strong><span>Privacy Policy　 Term and conditions　 Contact</span><span>◉　𝕏　◎　▻　in</span></footer>
  </>;
}

function InvoiceMetrics() {
  const cards = [
    ["Paid Invoices","$28,890","350",BadgeCheck],["Unpaid Invoices","$16,700","120",FileX2],["Pending Invoices","$8,050","80",CircleDashed],["Overdue Invoices","$22,110","245",Clock3],
  ] as const;
  return <section className="invoice-metrics">{cards.map(([label,value,count,Icon]) => <article key={label}><i><Icon /></i><div><span>{label}</span><strong>{value}</strong><small>from <b>{count}</b> Invoices</small></div></article>)}</section>;
}

function InvoiceTable({ records, selectedId, onSelect }: { records: Invoice[]; selectedId: string; onSelect: (id: string) => void }) {
  const [ascending,setAscending] = useState(true);
  const sorted = [...records].sort((a,b) => (ascending ? 1 : -1) * a.id.localeCompare(b.id));
  return <div className="invoice-table-wrap"><table><thead><tr><th><span className="invoice-select-all">−</span></th><th><button onClick={() => setAscending(!ascending)}>Invoice ID <ChevronsUpDown aria-hidden="true" /></button></th><th>Company ↕</th><th>Shipping ID ↕</th><th>Date ↕</th><th>Amount ↕</th><th>Status ↕</th></tr></thead><tbody>{sorted.map((invoice) => <tr className={selectedId === invoice.id ? "selected" : ""} onClick={() => onSelect(invoice.id)} key={invoice.id}><td><input type="checkbox" checked={selectedId === invoice.id} onChange={() => onSelect(invoice.id)} /></td><td><span className="invoice-id-cell"><b>{invoice.id}</b><i>↧</i></span></td><td><span className="invoice-company"><i>{invoice.company[0]}</i>{invoice.company}</span></td><td>#{invoice.shipmentId}</td><td><span className="invoice-date"><span>{invoice.issued} <small>(Issued)</small></span><strong>{invoice.due} <small>(Due)</small></strong></span></td><td>${invoice.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</td><td><em className={invoice.status.toLowerCase()}>{invoice.status}</em></td></tr>)}</tbody></table>{!records.length && <p className="invoice-empty">No invoices found.</p>}</div>;
}

function InvoiceDetail({ invoice, open, onClose }: { invoice: Invoice; open: boolean; onClose: () => void }) {
  const subtotal = invoice.items.reduce((sum,item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * .08;
  const fee = 10;
  const total = subtotal + tax + fee;
  return <aside className={`invoice-detail-panel ${open ? "open" : ""}`}><header><div className="invoice-detail-title"><button onClick={onClose} aria-label="Close invoice details"><ChevronLeft /></button><h2>Invoice Details</h2></div><div><button>Edit</button><button>Hold</button><button>Send Invoice</button></div></header><section className="invoice-document">
    <div className="invoice-document-heading"><div><strong>Invoice <b>#{invoice.id}</b></strong><em className={invoice.status.toLowerCase()}>{invoice.status}</em></div><p>Issue Date <b>{invoice.issued}</b><br />Due Date <b>{invoice.due}</b></p></div>
    <div className="billing-addresses"><address><span>Bill From</span><strong>{invoice.company}</strong><small>{invoice.email}</small>{invoice.address}<br /><br />{invoice.phone}</address><address><span>Bill To</span><strong>ShipNow Logistics</strong><small>accounts@shipnow.com</small>901 Distribution Ave, Charlotte, NC 28217, USA<br /><br />+1 704-555-9911</address></div>
    <h3>Package Summary</h3><div className="invoice-items"><table><thead><tr><th>Description ↕</th><th>Shipment Type ↕</th><th>Price ↕</th><th>Qty ↕</th><th>Amount ↕</th></tr></thead><tbody>{invoice.items.map((item,index) => <tr key={`${item.description}-${index}`}><td>{item.description}</td><td>{item.shipmentType}<small>{item.service}</small></td><td>${item.price.toFixed(2)}</td><td>{item.quantity}</td><td>${(item.price * item.quantity).toFixed(2)}</td></tr>)}</tbody><tfoot><tr><td colSpan={4}>Sub Total</td><td>${subtotal.toFixed(2)}</td></tr><tr><td colSpan={4}>Tax (8%)</td><td>${tax.toFixed(2)}</td></tr><tr><td colSpan={4}>Fee</td><td>${fee.toFixed(2)}</td></tr><tr><th colSpan={4}>Total</th><th>${total.toFixed(2)}</th></tr></tfoot></table></div>
    <div className="invoice-note"><span>Note</span><p>Please process payment by the due date to avoid delivery disruption. Late fees may apply after 3 business days past due.</p></div>
  </section></aside>;
}
