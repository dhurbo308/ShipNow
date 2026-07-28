export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`app-brand ${compact ? "app-brand--compact" : ""}`} aria-label="ShipNow">
      <span className="app-brand-mark" aria-hidden="true"><i /><i /></span>
      {!compact && <span>SHIPNOW</span>}
    </div>
  );
}
