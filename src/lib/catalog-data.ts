import {
  CatalogCategoryPageData,
  ProductDetailPageData,
  ProductListingPageData,
  SearchCatalogProduct,
} from "@/lib/types";

export const catalogCategoryPages: CatalogCategoryPageData[] = [
  {
    slug: "electrical",
    title: "Electrical",
    description:
      "Industrial electrical supply for maintenance, controls, and power distribution.",
    subcategories: [
      { id: "sc-1", label: "Circuit Breakers", slug: "circuit-breakers", count: 3240 },
      { id: "sc-2", label: "Contactors and Starters", slug: "contactors-starters", count: 2175 },
      { id: "sc-3", label: "Control Transformers", slug: "control-transformers", count: 890 },
      { id: "sc-4", label: "Wire and Cable", slug: "wire-cable", count: 4820 },
      { id: "sc-5", label: "Panel Components", slug: "panel-components", count: 1960 },
      { id: "sc-6", label: "Electrical Enclosures", slug: "electrical-enclosures", count: 1340 },
      { id: "sc-7", label: "Sensors", slug: "sensors", count: 2280 },
      { id: "sc-8", label: "Lighting and Ballasts", slug: "lighting-ballasts", count: 2750 },
    ],
    featuredSubcategories: [
      { id: "fsc-1", label: "Motor Controls", image: "/images/category-tile.svg" },
      { id: "fsc-2", label: "Industrial Lighting", image: "/images/category-tile.svg" },
      { id: "fsc-3", label: "PLC Accessories", image: "/images/category-tile.svg" },
      { id: "fsc-4", label: "Power Distribution", image: "/images/category-tile.svg" },
      { id: "fsc-5", label: "Disconnect Switches", image: "/images/category-tile.svg" },
      { id: "fsc-6", label: "Relays and Timers", image: "/images/category-tile.svg" },
    ],
    relatedCategories: [
      { id: "rc-1", label: "Automation", slug: "automation" },
      { id: "rc-2", label: "Tools", slug: "tools" },
      { id: "rc-3", label: "Safety", slug: "safety" },
      { id: "rc-4", label: "Motors", slug: "motors" },
    ],
    featuredProducts: [
      {
        id: "cp-1",
        title: "Siemens SIRIUS 3RT Contactor 24V DC",
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
        id: "cp-2",
        title: "Allen-Bradley 100-C23 IEC Contactor",
        sku: "100-C23D10",
        itemNumber: "44M302",
        manufacturer: "Rockwell",
        thumbnail: "/images/product-thumb.svg",
        price: "$126.75",
        uom: "Each",
        status: "limited",
        leadTime: "2-3 days",
      },
      {
        id: "cp-3",
        title: "Eaton Molded Case Circuit Breaker",
        sku: "FD3100",
        itemNumber: "10A547",
        manufacturer: "Eaton",
        thumbnail: "/images/product-thumb.svg",
        price: "$289.00",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
      },
      {
        id: "cp-4",
        title: "Schneider Harmony Push Button",
        sku: "XB5AA31",
        itemNumber: "28P611",
        manufacturer: "Schneider",
        thumbnail: "/images/product-thumb.svg",
        price: "$12.80",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
      },
    ],
  },
  {
    slug: "fasteners",
    title: "Fasteners",
    description: "Bulk industrial hardware and fastening solutions for plant upkeep.",
    subcategories: [
      { id: "f-1", label: "Hex Head Cap Screws", slug: "hex-head-cap-screws", count: 5240 },
      { id: "f-2", label: "Socket Head Screws", slug: "socket-head-screws", count: 2800 },
      { id: "f-3", label: "Nuts and Washers", slug: "nuts-washers", count: 6120 },
      { id: "f-4", label: "Anchors", slug: "anchors", count: 1980 },
      { id: "f-5", label: "Rivets", slug: "rivets", count: 870 },
      { id: "f-6", label: "Threaded Rod", slug: "threaded-rod", count: 540 },
    ],
    featuredSubcategories: [
      { id: "ff-1", label: "Stainless Hardware", image: "/images/category-tile.svg" },
      { id: "ff-2", label: "Metric Fasteners", image: "/images/category-tile.svg" },
      { id: "ff-3", label: "Anchor Systems", image: "/images/category-tile.svg" },
      { id: "ff-4", label: "Retaining Rings", image: "/images/category-tile.svg" },
      { id: "ff-5", label: "Thread Repair", image: "/images/category-tile.svg" },
      { id: "ff-6", label: "Bulk Bin Packs", image: "/images/category-tile.svg" },
    ],
    relatedCategories: [
      { id: "fr-1", label: "Raw Materials", slug: "raw-materials" },
      { id: "fr-2", label: "Tools", slug: "tools" },
      { id: "fr-3", label: "Safety", slug: "safety" },
      { id: "fr-4", label: "Material Handling", slug: "material-handling" },
    ],
    featuredProducts: [],
  },
];

export const productListingPages: ProductListingPageData[] = [
  {
    slug: "circuit-breakers",
    title: "Circuit Breakers",
    breadcrumbs: ["All Products", "Electrical", "Circuit Breakers"],
    resultCount: 248,
    filters: [
      {
        id: "brand",
        label: "Brand",
        options: [
          { id: "b1", label: "Schneider Electric", count: 52 },
          { id: "b2", label: "Eaton", count: 71 },
          { id: "b3", label: "Siemens", count: 49 },
          { id: "b4", label: "ABB", count: 31 },
        ],
      },
      {
        id: "pole",
        label: "Poles",
        options: [
          { id: "p1", label: "1-Pole", count: 81 },
          { id: "p2", label: "2-Pole", count: 68 },
          { id: "p3", label: "3-Pole", count: 99 },
        ],
      },
      {
        id: "amperage",
        label: "Amperage",
        options: [
          { id: "a1", label: "15A-30A", count: 76 },
          { id: "a2", label: "31A-60A", count: 93 },
          { id: "a3", label: "61A+", count: 79 },
        ],
      },
    ],
    products: [
      {
        id: "plp-1",
        title: "Eaton Molded Case Circuit Breaker FD3100 3-Pole 100A",
        sku: "FD3100",
        itemNumber: "10A547",
        manufacturer: "Eaton",
        thumbnail: "/images/product-thumb.svg",
        price: "$289.00",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
        shortSpec: "480V AC, Thermal Magnetic, 14kAIC",
      },
      {
        id: "plp-2",
        title: "Siemens Sentron Circuit Breaker 3VL 3-Pole 125A",
        sku: "3VL1712",
        itemNumber: "21S330",
        manufacturer: "Siemens",
        thumbnail: "/images/product-thumb.svg",
        price: "$345.50",
        uom: "Each",
        status: "limited",
        leadTime: "2-3 days",
        shortSpec: "600V AC, Adjustable Trip, 18kAIC",
      },
      {
        id: "plp-3",
        title: "Schneider PowerPact H-Frame Breaker 3-Pole 80A",
        sku: "HJA36080",
        itemNumber: "33H981",
        manufacturer: "Schneider",
        thumbnail: "/images/product-thumb.svg",
        price: "$318.75",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
        shortSpec: "600V AC, Bolt-On, 25kAIC",
      },
      {
        id: "plp-4",
        title: "ABB SACE Tmax XT1 Circuit Breaker 3-Pole 60A",
        sku: "XT1N160",
        itemNumber: "52T110",
        manufacturer: "ABB",
        thumbnail: "/images/product-thumb.svg",
        price: "$272.10",
        uom: "Each",
        status: "backorder",
        leadTime: "Factory lead",
        shortSpec: "415V AC, Fixed Thermal Magnetic, 36kAIC",
      },
      {
        id: "plp-5",
        title: "Square D QO Miniature Breaker 2-Pole 30A",
        sku: "QO230",
        itemNumber: "65Q209",
        manufacturer: "Square D",
        thumbnail: "/images/product-thumb.svg",
        price: "$29.95",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
        shortSpec: "120/240V AC, Plug-On, 10kAIC",
      },
      {
        id: "plp-6",
        title: "General Electric THQB Breaker 3-Pole 50A",
        sku: "THQB350",
        itemNumber: "91G507",
        manufacturer: "GE",
        thumbnail: "/images/product-thumb.svg",
        price: "$92.40",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
        shortSpec: "240V AC, Bolt-On, 10kAIC",
      },
    ],
  },
];

export const productDetailPages: ProductDetailPageData[] = [
  {
    slug: "eaton-fd3100-breaker",
    title: "Eaton Molded Case Circuit Breaker FD3100 3-Pole 100A",
    brand: "Factorypeer",
    sku: "FD3100",
    itemNumber: "10A547",
    manufacturerModel: "Eaton FD3100",
    availability: "In Stock",
    leadTime: "Ships same day",
    price: "$289.00",
    uom: "Each",
    images: [
      "/images/product-thumb.svg",
      "/images/product-thumb.svg",
      "/images/product-thumb.svg",
      "/images/product-thumb.svg",
    ],
    description:
      "Thermal magnetic molded case circuit breaker for industrial distribution panels and machinery feeders. Designed for dependable protection in heavy-duty electrical environments.",
    specificationRows: [
      { label: "Voltage Rating", value: "480V AC" },
      { label: "Current Rating", value: "100A" },
      { label: "Poles", value: "3-Pole" },
      { label: "Interrupt Rating", value: "14kAIC at 480V" },
      { label: "Trip Type", value: "Thermal Magnetic" },
      { label: "Mounting", value: "Panel Mount, Bolt-On" },
      { label: "Terminal Type", value: "Lug Terminals" },
      { label: "Standards", value: "UL 489, CSA C22.2" },
      { label: "Operating Temperature", value: "-25 C to 70 C" },
      { label: "Weight", value: "3.2 lb" },
    ],
    documents: [
      { id: "doc-1", name: "Product Data Sheet", type: "PDF" },
      { id: "doc-2", name: "Installation Instructions", type: "PDF" },
      { id: "doc-3", name: "UL Certification", type: "PDF" },
    ],
    relatedProducts: [
      {
        id: "rp-1",
        title: "Eaton Molded Case Breaker FD3200 3-Pole 200A",
        sku: "FD3200",
        itemNumber: "10A548",
        manufacturer: "Eaton",
        thumbnail: "/images/product-thumb.svg",
        price: "$356.00",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
      },
      {
        id: "rp-2",
        title: "Siemens Sentron Breaker 3VL 3-Pole 100A",
        sku: "3VL1706",
        itemNumber: "21S331",
        manufacturer: "Siemens",
        thumbnail: "/images/product-thumb.svg",
        price: "$338.20",
        uom: "Each",
        status: "limited",
        leadTime: "2-3 days",
      },
      {
        id: "rp-3",
        title: "Schneider PowerPact Breaker H-Frame 100A",
        sku: "HJA36100",
        itemNumber: "33H982",
        manufacturer: "Schneider",
        thumbnail: "/images/product-thumb.svg",
        price: "$342.00",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
      },
    ],
    accessories: [
      {
        id: "ac-1",
        title: "Auxiliary Contact Block for FD Series",
        sku: "FD-AUX-1NO1NC",
        itemNumber: "54A118",
        manufacturer: "Eaton",
        thumbnail: "/images/product-thumb.svg",
        price: "$46.90",
        uom: "Each",
        status: "in-stock",
        leadTime: "Ships today",
      },
      {
        id: "ac-2",
        title: "Shunt Trip Module 24V DC",
        sku: "FD-SHUNT24",
        itemNumber: "54A120",
        manufacturer: "Eaton",
        thumbnail: "/images/product-thumb.svg",
        price: "$78.50",
        uom: "Each",
        status: "limited",
        leadTime: "2-3 days",
      },
    ],
  },
  {
    slug: "siemens-3vl1712-breaker",
    title: "Siemens Sentron Circuit Breaker 3VL 3-Pole 125A",
    brand: "Factorypeer",
    sku: "3VL1712",
    itemNumber: "21S330",
    manufacturerModel: "Siemens 3VL1712",
    availability: "Limited Stock",
    leadTime: "2-3 business days",
    price: "$345.50",
    uom: "Each",
    images: ["/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg"],
    description:
      "Industrial molded case breaker for feeder and distribution protection in electrical control assemblies.",
    specificationRows: [
      { label: "Voltage Rating", value: "600V AC" },
      { label: "Current Rating", value: "125A" },
      { label: "Poles", value: "3-Pole" },
      { label: "Interrupt Rating", value: "18kAIC" },
      { label: "Trip Type", value: "Adjustable Thermal Magnetic" },
      { label: "Mounting", value: "Panel Mount" },
      { label: "Standards", value: "UL 489, IEC 60947-2" },
      { label: "Weight", value: "3.6 lb" },
    ],
    documents: [
      { id: "doc-s1", name: "Technical Data Sheet", type: "PDF" },
      { id: "doc-s2", name: "Wiring Diagram", type: "PDF" },
    ],
    relatedProducts: [],
    accessories: [],
  },
  {
    slug: "schneider-hja36080-breaker",
    title: "Schneider PowerPact H-Frame Breaker 3-Pole 80A",
    brand: "Factorypeer",
    sku: "HJA36080",
    itemNumber: "33H981",
    manufacturerModel: "Schneider HJA36080",
    availability: "In Stock",
    leadTime: "Ships same day",
    price: "$318.75",
    uom: "Each",
    images: ["/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg"],
    description:
      "PowerPact molded case breaker for industrial switchboards and machinery branch circuit protection.",
    specificationRows: [
      { label: "Voltage Rating", value: "600V AC" },
      { label: "Current Rating", value: "80A" },
      { label: "Poles", value: "3-Pole" },
      { label: "Interrupt Rating", value: "25kAIC" },
      { label: "Trip Type", value: "Thermal Magnetic" },
      { label: "Mounting", value: "Bolt-On" },
      { label: "Standards", value: "UL 489, CSA" },
      { label: "Weight", value: "3.4 lb" },
    ],
    documents: [
      { id: "doc-p1", name: "Specification Sheet", type: "PDF" },
      { id: "doc-p2", name: "Installation Guide", type: "PDF" },
    ],
    relatedProducts: [],
    accessories: [],
  },
  {
    slug: "square-d-qo230-breaker",
    title: "Square D QO Miniature Breaker 2-Pole 30A",
    brand: "Factorypeer",
    sku: "QO230",
    itemNumber: "65Q209",
    manufacturerModel: "Square D QO230",
    availability: "In Stock",
    leadTime: "Ships same day",
    price: "$29.95",
    uom: "Each",
    images: ["/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg", "/images/product-thumb.svg"],
    description:
      "Miniature branch circuit breaker for panelboard protection in commercial and light industrial systems.",
    specificationRows: [
      { label: "Voltage Rating", value: "120/240V AC" },
      { label: "Current Rating", value: "30A" },
      { label: "Poles", value: "2-Pole" },
      { label: "Interrupt Rating", value: "10kAIC" },
      { label: "Trip Type", value: "Thermal Magnetic" },
      { label: "Mounting", value: "Plug-On" },
      { label: "Standards", value: "UL 489" },
      { label: "Weight", value: "0.5 lb" },
    ],
    documents: [
      { id: "doc-q1", name: "Product Bulletin", type: "PDF" },
      { id: "doc-q2", name: "Safety Instructions", type: "PDF" },
    ],
    relatedProducts: [],
    accessories: [],
  },
];

export const searchCatalogProducts: SearchCatalogProduct[] = productDetailPages.map((product) => ({
  id: product.slug,
  slug: product.slug,
  title: product.title,
  sku: product.sku,
  itemNumber: product.itemNumber,
  manufacturer: product.manufacturerModel.split(" ")[0] ?? "Industrial",
  mpn: product.manufacturerModel,
  shortSpec: product.specificationRows.slice(0, 2).map((row) => `${row.label}: ${row.value}`).join(", "),
  price: product.price,
  uom: product.uom,
  thumbnail: product.images[0],
  availability: product.availability,
}));

export function getCatalogCategoryBySlug(slug: string) {
  return catalogCategoryPages.find((page) => page.slug === slug);
}

export function getProductListingBySlug(slug: string) {
  return productListingPages.find((page) => page.slug === slug);
}

export function getProductDetailBySlug(slug: string) {
  return productDetailPages.find((page) => page.slug === slug);
}

function normalizeSearchQuery(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getExactCatalogProductMatch(query: string) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return undefined;

  return searchCatalogProducts.find((product) => {
    return (
      product.sku.toLowerCase() === normalized ||
      product.itemNumber.toLowerCase() === normalized ||
      product.mpn.toLowerCase() === normalized
    );
  });
}

export function searchCatalogProductsByQuery(query: string) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  return searchCatalogProducts.filter((product) => {
    const haystack = [
      product.title,
      product.sku,
      product.itemNumber,
      product.manufacturer,
      product.mpn,
      product.shortSpec,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function getSearchSuggestions(query: string) {
  return searchCatalogProductsByQuery(query).slice(0, 6);
}
