export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";
export type InvoiceItem = { description: string; shipmentType: string; service: string; price: number; quantity: number };
export type Invoice = {
  id: string; company: string; shipmentId: string; issued: string; due: string;
  amount: number; status: InvoiceStatus; email: string; address: string; phone: string;
  items: InvoiceItem[];
};

const companyDetails: Record<string, [string,string,string]> = {
  "TechGear Inc.": ["billing@techgear.com","402 Tech Avenue, Austin, TX 78701, USA","+1 512-555-0180"],
  "StyleHub Co.": ["accounts@stylehub.co","76 Madison Avenue, New York, NY 10016, USA","+1 212-555-0132"],
  "FreshNest": ["billing@freshnest.com","218 Market Street, Miami, FL 33101, USA","+1 305-555-0146"],
  "FitPlus Gear": ["finance@fitplusgear.com","842 Pine Street, Denver, CO 80203, USA","+1 720-555-0192"],
  "AutoParts Pro": ["accounts@autopartspro.com","45 Motor Drive, Detroit, MI 48201, USA","+1 313-555-0105"],
  "EcoLights": ["billing@ecolights.com","650 Green Road, Phoenix, AZ 85001, USA","+1 602-555-0164"],
  "GreenHaven": ["finance@greenhaven.com","1120 Birch Street, Portland, OR 97205, USA","+1 408-555-7210"],
  "ModaWear": ["billing@modawear.com","89 Franklin St, Boston, MA 02110, USA","+1 617-555-2290"],
  "SunCore Panels": ["billing@suncore.com","410 Solar Lane, Reno, NV 89501, USA","+1 775-555-0172"],
  "VitaFresh": ["accounts@vitafresh.com","92 Harvest Way, Nashville, TN 37201, USA","+1 615-555-0187"],
  "SmartAppliance": ["billing@smartappliance.com","170 Home Drive, Chicago, IL 60601, USA","+1 312-555-0199"],
};

const base = [
  ["INV-1001","TechGear Inc.","SH9283746","Mar 15, 2035","Mar 22, 2035",1250,"Paid"],
  ["INV-1002","StyleHub Co.","SH9182635","Mar 16, 2035","Mar 23, 2035",980,"Unpaid"],
  ["INV-1003","FreshNest","SH9037821","Mar 14, 2035","Mar 21, 2035",1320,"Paid"],
  ["INV-1004","FitPlus Gear","SH9374652","Mar 17, 2035","Mar 24, 2035",1150,"Unpaid"],
  ["INV-1005","AutoParts Pro","SH9457830","Mar 15, 2035","Mar 22, 2035",1480,"Overdue"],
  ["INV-1006","EcoLights","SH8821349","Mar 13, 2035","Mar 20, 2035",790,"Paid"],
  ["INV-1007","GreenHaven","SH8967432","Mar 14, 2035","Mar 21, 2035",875,"Paid"],
  ["INV-1008","ModaWear","SH8893247","Mar 16, 2035","Mar 23, 2035",910,"Unpaid"],
  ["INV-1009","SunCore Panels","SH9018723","Mar 17, 2035","Mar 24, 2035",1600,"Unpaid"],
  ["INV-1010","VitaFresh","SH8881190","Mar 15, 2035","Mar 22, 2035",1120,"Overdue"],
  ["INV-1011","SmartAppliance","SH8233752","Mar 18, 2035","Mar 25, 2035",1050,"Paid"],
] as const;

const itemSets: InvoiceItem[][] = [
  [{description:"Wireless Sensor Kit",shipmentType:"Air Freight",service:"Express",price:240,quantity:3},{description:"Network Hub Package",shipmentType:"Road Freight",service:"Standard",price:180,quantity:2}],
  [{description:"Spring Apparel Set",shipmentType:"Road Freight",service:"Standard",price:170,quantity:3},{description:"Premium Shoe Pack",shipmentType:"Air Freight",service:"Express",price:205,quantity:2}],
  [{description:"Kitchen Storage Set",shipmentType:"Ocean Freight",service:"Standard",price:250,quantity:3},{description:"Organic Linen Pack",shipmentType:"Road Freight",service:"Express",price:180,quantity:2}],
  [{description:"Fitness Equipment Set",shipmentType:"Rail Freight",service:"Standard",price:290,quantity:2},{description:"Performance Apparel",shipmentType:"Road Freight",service:"Express",price:190,quantity:2}],
  [{description:"Brake Pad Collection",shipmentType:"Rail Freight",service:"Standard",price:310,quantity:3},{description:"Engine Components",shipmentType:"Road Freight",service:"Express",price:230,quantity:2}],
  [{description:"Smart Lighting Pack",shipmentType:"Air Freight",service:"Express",price:195,quantity:2},{description:"LED Fixture Set",shipmentType:"Road Freight",service:"Standard",price:160,quantity:2}],
  [{description:"Garden Tool Collection",shipmentType:"Road Freight",service:"Standard",price:225,quantity:2},{description:"Planter Set",shipmentType:"Rail Freight",service:"Express",price:175,quantity:2}],
  [{description:"Lightweight Hoodie Pack",shipmentType:"Road Freight",service:"Express",price:120,quantity:3},{description:"Autumn Jacket Set",shipmentType:"Road Freight",service:"Standard",price:180,quantity:2},{description:"Lightweight Hoodie Pack",shipmentType:"Road Freight",service:"Express",price:95,quantity:2}],
];

export const invoices: Invoice[] = base.map((row, index) => {
  const [id, company, shipmentId, issued, due, amount, status] = row;
  const [email,address,phone] = companyDetails[company];
  return { id, company, shipmentId, issued, due, amount, status, email, address, phone, items: itemSets[index % itemSets.length] };
});
