import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ShipmentsPage } from "@/components/shipments/shipments-page";

export default function Page() {
  return <AppShell><Suspense><ShipmentsPage /></Suspense></AppShell>;
}
