export const monthlyData = [
  { month: "Jan", shipments: 1800, revenue: 42000, cost: 28000 },
  { month: "Feb", shipments: 2200, revenue: 35000, cost: 30000 },
  { month: "Mar", shipments: 1600, revenue: 55000, cost: 42000 },
  { month: "Apr", shipments: 2500, revenue: 70000, cost: 36000 },
  { month: "May", shipments: 3124, revenue: 87524, cost: 45680 },
  { month: "Jun", shipments: 3400, revenue: 78000, cost: 43000 },
  { month: "Jul", shipments: 3700, revenue: 62000, cost: 52000 },
  { month: "Aug", shipments: 4352, revenue: 68000, cost: 35000 },
];

export const shipmentTypes = [
  { name: "Road Freight", value: 1150, percent: 46, color: "#8064ed" },
  { name: "Air Freight", value: 700, percent: 28, color: "#292929" },
  { name: "Ocean Freight", value: 425, percent: 17, color: "#777" },
  { name: "Rail Freight", value: 225, percent: 9, color: "#dedede" },
];

export const categories = [
  { name: "Electronics", products: 240, percent: 24, color: "#8064ed" },
  { name: "Home & Kitchen", products: 200, percent: 20, color: "#ded7ff" },
  { name: "Apparel", products: 180, percent: 18, color: "#292929" },
  { name: "Beauty & Health", products: 140, percent: 14, color: "#858585" },
  { name: "Sports & Outdoors", products: 120, percent: 12, color: "#d9d9d9" },
  { name: "Automotive", products: 120, percent: 12, color: "#ededed" },
];

export const shipments = [
  { id: "SH9283746", company: "TechGear Inc.", category: "Electronics", carrier: "FedEx", route: "Los Angeles, CA → Chicago, IL", date: "Mar 20, 2035", status: "In Transit" },
  { id: "SH9182635", company: "StyleHub Co.", category: "Apparel", carrier: "DHL", route: "New York, NY → Atlanta, GA", date: "Mar 19, 2035", status: "Out for Delivery" },
  { id: "SH9037821", company: "FreshNest", category: "Home & Kitchen", carrier: "UPS", route: "Dallas, TX → Miami, FL", date: "Mar 18, 2035", status: "Delivered" },
  { id: "SH9374652", company: "FitPlus Gear", category: "Sports & Outdoors", carrier: "USPS", route: "Seattle, WA → Denver, CO", date: "Mar 21, 2035", status: "Processing" },
  { id: "SH9457830", company: "AutoParts Pro", category: "Automotive", carrier: "Aramex", route: "Detroit, MI → San Diego, CA", date: "Mar 20, 2035", status: "In Transit" },
];

export const alerts = [
  { title: "Customs Clearance Delay", id: "#SH8743921", type: "Ocean Freight", date: "Mar 20" },
  { title: "Incorrect Address Provided", id: "#SH8725810", type: "Road Freight", date: "Mar 20" },
  { title: "Weather-Related Hold", id: "#SH8790043", type: "Air Freight", date: "Mar 19" },
  { title: "Incorrect Address Provided", id: "#SH8716654", type: "Rail Freight", date: "Mar 18" },
];

export const activities = [
  { text: <>User <b>@TechGuru99</b> submitted a bulk shipment request</>, time: "12:00 PM", icon: "box" },
  { text: <>Customer Support <b>@SupportKen</b> added a priority tag to Order ID 77889JKL</>, time: "11:30 AM", icon: "tag" },
  { text: <>User <b>@SallyMae88</b> initiated a return process for Order ID 44556GH</>, time: "11:00 AM", icon: "refresh" },
  { text: <>Administrator <b>@AdminLisa</b> resolved a delivery issue for Order ID 12345XYZ</>, time: "10:15 AM", icon: "check" },
];
