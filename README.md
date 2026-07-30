# ShipNow

ShipNow is a responsive logistics and shipment-management frontend built from the supplied high-fidelity Figma designs. It uses local mock data only; there is no backend, API, server route, or database.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript
- SCSS with shared design tokens and responsive rules
- Recharts
- Lucide React icons

No pre-styled component library or dashboard template is used.

## Local setup

Requirements:

- Node.js 20.9 or newer
- npm

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run typecheck
npm run build
```

## Live demo

live demo link-`https://ship-now-two.vercel.app/`

## Routes

- `/` — Login
- `/dashboard` — Dashboard
- `/shipments` — Shipment card view
- `/shipments?view=table` — Shipment table view
- `/shipments/new` — Create New Shipment
- `/invoices` — Invoices & Billing
- `/warehouse` — Warehouse
- `/placeholder/[feature]` — Placeholder pages for navigation items outside the supplied screen set

## Screen status

| Screen | Status | Notes |
| --- | --- | --- |
| Login | Complete | Required/email/password validation, show-password control, remember-me state and simulated session navigation |
| Dashboard | Complete | Responsive metrics, Recharts charts, tracking panel, alerts, recent shipments and activity |
| Shipments — cards | Complete | Search, status and freight filters, sorting, real pagination, page size and responsive card layout |
| Shipments — table | Complete | Search, filters, date range, sortable columns, select-all/row selection, real pagination and horizontal table access on small screens |
| Shipment view switcher | Complete | Both views share `/shipments`; URL query state changes without a full reload |
| Create New Shipment | Complete | Responsive multi-section form, error-state styling, required field/email/phone/numeric validation and errors that clear as fields are corrected |
| Invoices & Billing | Complete | Searchable master-detail list, row selection, responsive detail presentation and calculated line-item totals |
| Warehouse | Complete | Metrics, inventory/capacity charts, storage table, package status filters, floor tabs/map and activity log |

## Mock data

Mock data is separated by domain:

- `data/dashboard`
- `data/shipments`
- `data/invoices`
- `data/warehouse`

Shipment data includes enough records to exercise page-size changes and pagination. Invoice totals are calculated from each invoice's line items.

## Responsive behavior

- Desktop: expanded sidebar and multi-column layouts
- Tablet: icon-only navigation rail and reflowed two-column layouts
- Mobile: sticky app bar, hamburger drawer and single-column layouts

Wide data tables remain fully accessible inside horizontal scroll containers rather than clipping columns or causing page-level horizontal overflow.

## Accessibility

The implementation uses semantic headings, forms and tables; labelled inputs; alternative text; visible focus states; accessible drawer state; labelled icon controls; and keyboard-accessible buttons and links.



