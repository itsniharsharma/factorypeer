import { CatalogCategoryPageData } from "@/lib/types";

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
    featuredProducts: [],
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
