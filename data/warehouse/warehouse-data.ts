export const inventory = [
  { category: "Electronics", percent: 25, packages: 2500, color: "#8064ed" },
  { category: "Apparel", percent: 20, packages: 2000, color: "#8064ed" },
  { category: "Home & Kitchen", percent: 18, packages: 1800, color: "#292929" },
  { category: "Beauty & Health", percent: 15, packages: 1500, color: "#292929" },
  { category: "Automotive Parts", percent: 12, packages: 1200, color: "#858585" },
  { category: "Sports Equipment", percent: 10, packages: 1000, color: "#858585" },
];

export const storageRows = [
  { floor: 1, section: "A1 – A10", category: "Electronics", used: 80, available: 20 },
  { floor: 2, section: "B1 – B10", category: "Apparel", used: 60, available: 40 },
  { floor: 1, section: "C1 – C10", category: "Home & Kitchen", used: 90, available: 10 },
  { floor: 3, section: "D1 – D10", category: "Automotive Parts", used: 50, available: 50 },
  { floor: 2, section: "E1 – E10", category: "Beauty & Health", used: 70, available: 30 },
];

export const packages = [
  { id: "PKG-HK77420", date: "March 20, 2035 – 05:30 PM", status: "Sent" },
  { id: "PKG-A50812", date: "March 21, 2035 – 01:45 PM", status: "Received" },
  { id: "PKG-E10293", date: "March 22, 2035 – 09:00 AM", status: "Expected" },
];

export const mapAreas = [
  { name: "Electronics", codes: ["A1","A2","A3"], available: 20 },
  { name: "Home & Kitchen", codes: ["C1","C2","C3"], available: 10 },
  { name: "Automotive Parts", codes: ["D1","D2","D3"], available: 50 },
  { name: "Sports Equipment", codes: ["F1","F2","F3"], available: 45 },
  { name: "Apparel", codes: ["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10"], available: 20, wide: true },
  { name: "Beauty & Health", codes: ["E1","E2","E3","E4"], available: 30 },
];

export const warehouseActivities = [
  { person: "Leo Fernandez", text: "confirmed receipt of 40 units of Winter Jacket Series in Section B3 (Apparel)", time: "01:45 PM", icon: "✓" },
  { person: "Ava Martinez", text: "added 25 units of Smart Router Kit to Section A1 (Electronics)", time: "09:15 AM", icon: "≡" },
  { person: "Oscar Liem", text: "dispatched 18 units of Stainless Steel Cookware Set from Section C5 (Home & Kitchen)", time: "05:30 PM", icon: "▱" },
  { person: "Dina Choi", text: "created a shipment entry for Brake Pad Sets in Section D2 (Automotive Parts)", time: "04:10 PM", icon: "♧" },
];
