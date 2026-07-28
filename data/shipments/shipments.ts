export type ShipmentStatus = "Delivered" | "In Transit" | "Processing" | "Out for Delivery";

export type Shipment = {
  id: string;
  company: string;
  category: string;
  origin: string;
  destination: string;
  originDate: string;
  destinationDate: string;
  carrier: string;
  progress: number;
  status: ShipmentStatus;
  mode: "air" | "road" | "rail";
};

export const shipmentRecords: Shipment[] = [
  ["SH9283746","TechGear Inc.","Electronics","Los Angeles, CA","Chicago, IL","Mar 20, 2035 – 10:00 AM","Mar 23, 2035 – 03:00 PM","FedEx",60,"In Transit","air"],
  ["SH9182635","StyleHub Co.","Apparel","New York, NY","Atlanta, GA","Mar 19, 2035 – 11:30 AM","Mar 22, 2035 – 01:00 PM","DHL",75,"Out for Delivery","road"],
  ["SH9037821","FreshNest","Home & Kitchen","Dallas, TX","Miami, FL","Mar 18, 2035 – 09:00 AM","Mar 21, 2035 – 06:00 PM","UPS",100,"Delivered","rail"],
  ["SH9374652","FitPlus Gear","Sports & Outdoors","Seattle, WA","Denver, CO","Mar 21, 2035 – 08:45 AM","Mar 25, 2035 – 04:30 PM","USPS",40,"Processing","rail"],
  ["SH8821349","EcoLights","Electronics","Austin, TX","Phoenix, AZ","Mar 19, 2035 – 12:00 PM","Mar 21, 2035 – 05:00 PM","FedEx",90,"Out for Delivery","road"],
  ["SH9457830","AutoParts Pro","Automotive","Detroit, MI","San Diego, CA","Mar 20, 2035 – 07:15 AM","Mar 26, 2035 – 02:00 PM","Aramex",100,"Delivered","air"],
  ["SH8967432","GreenHaven","Home & Garden","Portland, OR","Salt Lake City, UT","Mar 18, 2035 – 02:45 PM","Mar 22, 2035 – 11:00 AM","USPS",65,"In Transit","road"],
  ["SH8893247","ModaWear","Apparel","Boston, MA","Charlotte, NC","Mar 20, 2035 – 01:00 PM","Mar 23, 2035 – 08:00 AM","DHL",80,"Out for Delivery","road"],
  ["SH9018723","SunCore Panels","Electronics","San Diego, CA","Reno, NV","Mar 21, 2035 – 09:30 AM","Mar 24, 2035 – 01:30 PM","UPS",30,"Processing","rail"],
  ["SH9113471","QuickParts","Automotive","Tampa, FL","Houston, TX","Mar 20, 2035 – 04:00 PM","Mar 23, 2035 – 12:00 PM","Aramex",90,"In Transit","road"],
  ["SH8881190","VitaFresh","Food & Beverage","Nashville, TN","Jacksonville, FL","Mar 21, 2035 – 06:00 AM","Mar 22, 2035 – 10:00 AM","Local Courier",85,"Out for Delivery","road"],
  ["SH8776103","StyleDepot","Fashion","Minneapolis, MN","Kansas City, MO","Mar 19, 2035 – 10:15 AM","Mar 22, 2035 – 03:30 PM","FedEx",60,"In Transit","air"],
].map(([id, company, category, origin, destination, originDate, destinationDate, carrier, progress, status, mode]) => ({
  id, company, category, origin, destination, originDate, destinationDate, carrier, progress, status, mode,
})) as Shipment[];
