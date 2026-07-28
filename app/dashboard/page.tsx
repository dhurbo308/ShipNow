import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="placeholder-page">
      <Brand />
      <h1>Dashboard</h1>
      <p>The dashboard will be implemented from its supplied Figma frames.</p>
      <Link href="/">Back to login</Link>
    </main>
  );
}

function Brand() {
  return (
    <div className="brand brand--dark" aria-label="ShipNow">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>SHIPNOW</span>
    </div>
  );
}
