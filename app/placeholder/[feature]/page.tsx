import Link from "next/link";

export default async function PlaceholderPage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  const title = feature
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="placeholder-page">
      <section>
        <p>ShipNow</p>
        <h1>{title}</h1>
        <Link href="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  );
}
