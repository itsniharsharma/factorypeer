import {
  Category,
  CategoryTile,
  Department,
  Product,
  PromoBanner,
  PromoStripItem,
  ServiceOffering,
  SpecRow,
  SupportCTA,
  TrustPoint,
} from "@/lib/types";

export const utilityLinks = [
  "Contract Pricing",
  "Bulk RFQ",
  "Fleet Programs",
  "Branch Pickup",
  "Help Center",
];

export const topCategories = [
  "Fasteners",
  "Power Transmission",
  "Hydraulics",
  "Electrical",
  "Safety",
  "Facility",
  "MRO",
  "Pneumatics",
  "Janitorial",
];

export const featuredCategories: Category[] = [
  { id: "cat-1", name: "Industrial Fasteners", segment: "Hardware", skuCount: 12480 },
  { id: "cat-2", name: "Motor Controls", segment: "Electrical", skuCount: 7830 },
  { id: "cat-3", name: "Hydraulic Hoses", segment: "Fluid Power", skuCount: 5942 },
  { id: "cat-4", name: "PPE and Safety", segment: "Compliance", skuCount: 14620 },
];

export const featuredProducts: Product[] = [
  {
    id: "prod-1",
    title: "SKF Deep Groove Ball Bearing 6205-2RS",
    sku: "SKF-6205-2RS",
    manufacturer: "SKF",
    price: "$18.40",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships same day",
  },
  {
    id: "prod-2",
    title: "Allen-Bradley 100-C23 Contactor 24V DC",
    sku: "AB-100C23D10",
    manufacturer: "Rockwell",
    price: "$126.75",
    uom: "Each",
    status: "limited",
    leadTime: "2-3 business days",
  },
  {
    id: "prod-3",
    title: "Eaton Vickers Hydraulic Directional Valve DG4V",
    sku: "EAT-DG4V-3-2A-M",
    manufacturer: "Eaton",
    price: "$489.00",
    uom: "Each",
    status: "backorder",
    leadTime: "Factory backorder",
  },
];

export const referenceSpecs: SpecRow[] = [
  { label: "Voltage", value: "480V AC" },
  { label: "Current", value: "12.5A" },
  { label: "Ingress Protection", value: "IP65" },
  { label: "Operating Temp", value: "-20 C to 55 C" },
  { label: "Compliance", value: "UL, CE, RoHS" },
];

export const promoStripItems: PromoStripItem[] = [
  { id: "promo-1", label: "Contract Savings", value: "Up to 18% on core MRO SKUs" },
  { id: "promo-2", label: "Branch Pickup", value: "Ready in 60 minutes at select hubs" },
  { id: "promo-3", label: "Inventory Programs", value: "VMI and scheduled replenishment" },
];

export const heroBanner = {
  eyebrow: "Plant and Facility Procurement",
  title: "Industrial Supply Coverage for Every Shift",
  description:
    "Source production-critical parts, safety essentials, and maintenance stock from one enterprise procurement workspace.",
  primaryAction: "Browse Industrial Catalog",
  secondaryAction: "Submit Bulk RFQ",
};

export const industrialDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Electrical",
    description: "Control panels, wiring, motor controls, and power distribution components.",
    skuCount: 21430,
  },
  {
    id: "dept-2",
    name: "Mechanical",
    description: "Bearings, drives, couplings, and core repair and replacement parts.",
    skuCount: 18420,
  },
  {
    id: "dept-3",
    name: "Safety",
    description: "PPE, lockout-tagout kits, and compliant plant floor protection.",
    skuCount: 16210,
  },
  {
    id: "dept-4",
    name: "Fasteners",
    description: "Industrial bolts, threaded hardware, anchors, and retention products.",
    skuCount: 25890,
  },
  {
    id: "dept-5",
    name: "Pneumatics",
    description: "Actuators, valves, FRL systems, fittings, and compressed-air tooling.",
    skuCount: 9470,
  },
  {
    id: "dept-6",
    name: "Hydraulics",
    description: "Hydraulic pumps, hoses, fittings, manifolds, and control valves.",
    skuCount: 8840,
  },
  {
    id: "dept-7",
    name: "Automation",
    description: "Sensors, PLC accessories, HMI parts, and production-line controls.",
    skuCount: 13350,
  },
  {
    id: "dept-8",
    name: "Material Handling",
    description: "Carts, storage, hoists, conveyors, and warehouse movement systems.",
    skuCount: 12060,
  },
];

export const popularProductCategories: Category[] = [
  { id: "pop-cat-1", name: "Circuit Breakers", segment: "Electrical", skuCount: 3240 },
  { id: "pop-cat-2", name: "Safety Gloves", segment: "Safety", skuCount: 4890 },
  { id: "pop-cat-3", name: "Metric Fasteners", segment: "Fasteners", skuCount: 7310 },
  { id: "pop-cat-4", name: "Pneumatic Fittings", segment: "Pneumatics", skuCount: 2590 },
  { id: "pop-cat-5", name: "Hydraulic Cylinders", segment: "Hydraulics", skuCount: 1790 },
  { id: "pop-cat-6", name: "Photoelectric Sensors", segment: "Automation", skuCount: 2280 },
  { id: "pop-cat-7", name: "Roller Bearings", segment: "Mechanical", skuCount: 3150 },
  { id: "pop-cat-8", name: "Warehouse Ladders", segment: "Material Handling", skuCount: 960 },
];

export const trendingIndustrialProducts: Product[] = [
  {
    id: "trend-1",
    title: "Siemens SIRIUS 3RT Contactor 24V DC",
    sku: "SIE-3RT2025-1BB40",
    manufacturer: "Siemens",
    price: "$94.25",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
  },
  {
    id: "trend-2",
    title: "Parker Push-Lok Hose 3/8 in x 50 ft",
    sku: "PRK-801-6-BLU",
    manufacturer: "Parker",
    price: "$212.40",
    uom: "Roll",
    status: "limited",
    leadTime: "1-2 business days",
  },
  {
    id: "trend-3",
    title: "Honeywell Uvex Bionic Face Shield",
    sku: "HON-S8500",
    manufacturer: "Honeywell",
    price: "$39.90",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
  },
  {
    id: "trend-4",
    title: "Bosch Rexroth Hydraulic Pump A10VSO",
    sku: "BRX-A10VSO45",
    manufacturer: "Bosch Rexroth",
    price: "$1,485.00",
    uom: "Each",
    status: "backorder",
    leadTime: "Factory lead: 4 weeks",
  },
];

export const industrySolutions: ServiceOffering[] = [
  {
    id: "sol-1",
    title: "Inventory Management",
    detail: "Min-max controls, bin labeling, and replenishment governance by location.",
  },
  {
    id: "sol-2",
    title: "Safety Compliance Programs",
    detail: "Site assessments and standards-aligned PPE and lockout product bundles.",
  },
  {
    id: "sol-3",
    title: "Technical Sourcing Desk",
    detail: "Cross-reference support for hard-to-find MRO and replacement components.",
  },
  {
    id: "sol-4",
    title: "Emergency Fulfillment",
    detail: "Priority fulfillment channels for downtime-critical operations.",
  },
];

export const trustPoints: TrustPoint[] = [
  {
    id: "trust-1",
    title: "15+ Regional Distribution Nodes",
    detail: "Coverage for same-day and next-day delivery across major industrial corridors.",
  },
  {
    id: "trust-2",
    title: "Contract and Project Pricing",
    detail: "Negotiated terms for recurring MRO demand and capital project buys.",
  },
  {
    id: "trust-3",
    title: "Procurement-Grade Catalog Data",
    detail: "Structured specs, compliance data, and manufacturer traceability on SKUs.",
  },
  {
    id: "trust-4",
    title: "Dedicated Account Support",
    detail: "Named reps for plant-level sourcing, substitutions, and escalation handling.",
  },
];

export const procurementSupportCTAs: SupportCTA[] = [
  {
    id: "cta-1",
    title: "Need high-volume quotes?",
    description: "Upload your BOM or line-item sheet for contract-aligned pricing.",
    action: "Start RFQ",
  },
  {
    id: "cta-2",
    title: "Need immediate sourcing help?",
    description: "Connect with a procurement specialist for cross-reference assistance.",
    action: "Contact Support",
  },
];

export const homepagePromoBanners: PromoBanner[] = [
  {
    id: "home-banner-1",
    title: "Electrical Essentials",
    subtitle: "Switchgear and motor control inventory",
    image: "/images/landing-top-1.jpg",
  },
  {
    id: "home-banner-2",
    title: "Plant Safety Readiness",
    subtitle: "PPE and compliance products in stock",
    image: "/images/landing-top-2.jpg",
  },
  {
    id: "home-banner-3",
    title: "Fastener Bulk Supply",
    subtitle: "High-volume hardware replenishment",
    image: "/images/landing-top-3.jpg",
  },
];

export const homepageCategoryTiles: CategoryTile[] = [
  { id: "tile-1", label: "Electrical", image: "/images/category-tile.svg" },
  { id: "tile-2", label: "Mechanical", image: "/images/category-tile.svg" },
  { id: "tile-3", label: "Safety", image: "/images/category-tile.svg" },
  { id: "tile-4", label: "Fasteners", image: "/images/category-tile.svg" },
  { id: "tile-5", label: "Pneumatics", image: "/images/category-tile.svg" },
  { id: "tile-6", label: "Hydraulics", image: "/images/category-tile.svg" },
  { id: "tile-7", label: "Automation", image: "/images/category-tile.svg" },
  { id: "tile-8", label: "Material Handling", image: "/images/category-tile.svg" },
  { id: "tile-9", label: "Power Transmission", image: "/images/category-tile.svg" },
  { id: "tile-10", label: "Tools", image: "/images/category-tile.svg" },
  { id: "tile-11", label: "Facility Maintenance", image: "/images/category-tile.svg" },
  { id: "tile-12", label: "Welding", image: "/images/category-tile.svg" },
];

export const homepageFeaturedProducts: Product[] = [
  {
    id: "home-prod-1",
    title: "Siemens SIRIUS Contactor 24V DC",
    sku: "3RT2025-1BB40",
    itemNumber: "61U443",
    manufacturer: "Siemens",
    thumbnail: "/images/product-thumb.svg",
    price: "$94.25",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
  },
  {
    id: "home-prod-2",
    title: "Parker Push-Lok Hose 3/8 in",
    sku: "801-6-BLU",
    itemNumber: "24R992",
    manufacturer: "Parker",
    thumbnail: "/images/product-thumb.svg",
    price: "$212.40",
    uom: "Roll",
    status: "limited",
    leadTime: "1-2 days",
  },
  {
    id: "home-prod-3",
    title: "Honeywell Uvex Face Shield",
    sku: "S8500",
    itemNumber: "33H110",
    manufacturer: "Honeywell",
    thumbnail: "/images/product-thumb.svg",
    price: "$39.90",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
  },
  {
    id: "home-prod-4",
    title: "SKF Deep Groove Bearing 6205-2RS",
    sku: "6205-2RS",
    itemNumber: "19B447",
    manufacturer: "SKF",
    thumbnail: "/images/product-thumb.svg",
    price: "$18.40",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
  },
  {
    id: "home-prod-5",
    title: "Eaton Hydraulic Valve DG4V",
    sku: "DG4V-3-2A-M",
    itemNumber: "42E103",
    manufacturer: "Eaton",
    thumbnail: "/images/product-thumb.svg",
    price: "$489.00",
    uom: "Each",
    status: "backorder",
    leadTime: "Factory lead",
  },
];

export const homepageSupportCards = [
  {
    id: "support-1",
    title: "Bulk Ordering and RFQ",
    detail: "Upload line-item lists and receive contract pricing support.",
    cta: "Start RFQ",
  },
  {
    id: "support-2",
    title: "Inventory Management Programs",
    detail: "Scheduled replenishment, min-max, and plant-level stocking plans.",
    cta: "Explore Programs",
  },
  {
    id: "support-3",
    title: "Technical Product Support",
    detail: "Cross-reference alternatives and sourcing help for downtime events.",
    cta: "Contact Specialist",
  },
];

export const megaMenuUtilityLinks = [
  "Purchased Products",
  "Custom Product Center",
  "Replacement Parts",
  "Digital Catalogs",
];

export const megaMenuCategoryColumns = [
  [
    "All Product Categories",
    "Abrasives",
    "Adhesives, Sealants and Tape",
    "Cleaning and Janitorial",
    "Electrical",
    "Electronics and Batteries",
    "Fasteners",
    "Fleet and Vehicle Maintenance",
    "HVAC and Refrigeration",
    "Hardware",
  ],
  [
    "Hydraulics",
    "Lab Supplies",
    "Lighting",
    "Lubrication",
    "Machining",
    "Material Handling",
    "Motors",
    "Office Supplies",
    "Outdoor Equipment",
    "Packaging and Shipping",
  ],
  [
    "Plumbing",
    "Pneumatics",
    "Power Transmission",
    "Pumps",
    "Raw Materials",
    "Safety",
    "Security",
    "Test Instruments",
    "Tools",
    "Welding",
  ],
  [
    "Automation and Control",
    "Bearings",
    "Conveyors",
    "Drum Handling",
    "Facility Maintenance",
    "Filtration",
    "Generators",
    "Hoists and Cranes",
    "Pipe, Hose, Tube and Fittings",
    "Workbenches and Storage",
  ],
];

export const navQuickLinks = ["Bulk Order", "My Account", "Cart (2)"];
