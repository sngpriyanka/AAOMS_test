// data/productsData.js
export const products = [
  {
    id: 1,
    slug: "burnt-sienna-active-mesh-tshirt",
    name: "Burnt Sienna: Active Mesh T-Shirt",
    price: 1275,
    sku: "BTOSTHO5-S",
    category: "t-shirts",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Burnt Sienna", code: "#c75b39" },
    ],
    description: {
      tagline: "TRAIN HARDER. MOVE FASTER. STAY COOLER.",
    },
    productInfo: [
      { label: "Material", value: "100% Polyester Mesh" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: 2,
    slug: "sunday-race-club-cap",
    name: "Sunday Race Club: Motorsport Baseball Cap",
    price: 899,
    sku: "BTCAP01",
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    ],
    sizes: ["One Size"],
    colors: [{ name: "Black", code: "#000" }],
    description: { tagline: "RACE DAY READY." },
    productInfo: [
      { label: "Material", value: "Cotton Twill" },
    ],
  },
  {
    id: 3,
    slug: "teal-topography-tshirt",
    name: "Teal Topography: Active Mesh T-Shirt",
    price: 1275,
    sku: "BTOSTHO6",
    category: "t-shirts",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Teal", code: "#008080" }],
    description: { tagline: "TRAIN HARDER. MOVE FASTER. STAY COOLER." },
    productInfo: [
      { label: "Material", value: "100% Polyester Mesh" },
    ],
  },
  {
    id: 4,
    slug: "mountains-calling-patch",
    name: "Mountains Are Calling Iron-On Embroidery Patch",
    price: 149,
    sku: "BTPATCH01",
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600",
    ],
    sizes: [],
    colors: [],
    description: { tagline: "THE MOUNTAINS ARE CALLING." },
    productInfo: [
      { label: "Size", value: "3 inches" },
    ],
  },
  {
    id: 5,
    slug: "snow-peaks-tshirt",
    name: "Snow Peaks: Active Mesh T-Shirt",
    price: 1275,
    sku: "BTOSTHO7",
    category: "t-shirts",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "White", code: "#fff" }],
    description: { tagline: "TRAIN HARDER. MOVE FASTER. STAY COOLER." },
    productInfo: [
      { label: "Material", value: "100% Polyester Mesh" },
    ],
  },
  {
    id: 6,
    slug: "trooper-cargo-pants",
    name: "TrooperGo: 2-in-1 Utility Cargo Pants",
    price: 4250,
    sku: "BTCARGO01",
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Olive", code: "#2d4a3e" },
      { name: "Navy", code: "#1a2a4a" },
      { name: "Rust", code: "#c75b39" },
      { name: "Mustard", code: "#f5c518" },
    ],
    description: { tagline: "UTILITY MEETS STYLE." },
    badge: { type: "bestseller", text: "Bestseller" },
    productInfo: [
      { label: "Material", value: "Cotton-Nylon Blend" },
    ],
  },
  {
    id: 7,
    slug: "denim-cargo-hoppers",
    name: "9-Pockets Denim Cargo Max Hoppers",
    price: 2875,
    sku: "BTHOP01",
    category: "hoppers",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
    ],
    sizes: ["28", "30", "32", "34"],
    colors: [],
    description: { tagline: "MAXIMUM POCKETS. MAXIMUM STYLE." },
    productInfo: [
      { label: "Material", value: "Premium Denim" },
    ],
  },
  {
    id: 8,
    slug: "desert-tan-hoppers",
    name: "Desert Tan Oversized Pockets Cargo Max Hoppers",
    price: 2875,
    sku: "BTHOP02",
    category: "hoppers",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [],
    description: { tagline: "DESERT READY." },
    badge: { type: "bestseller", text: "Bestseller" },
    productInfo: [
      { label: "Material", value: "Cotton Twill" },
    ],
  },
  {
    id: 9,
    slug: "premium-medical-apron",
    name: "Premium Medical Apron",
    price: 1599,
    sku: "BTAPRON01",
    category: "apron",
    images: [
      "https://images.unsplash.com/photo-1604154894610-df63bc536371?w=600",
      "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=600",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "White", code: "#ffffff" },
      { name: "Navy", code: "#1a2a4a" },
      { name: "Sage Green", code: "#9caf88" },
    ],
    description: {
      tagline: "PROFESSIONAL COMFORT AND STYLE.",
    },
    productInfo: [
      { label: "Material", value: "100% Cotton Blend" },
      { label: "Pockets", value: "Dual Front Pockets" },
      { label: "Care", value: "Machine wash warm" },
    ],
  },
  {
    id: 10,
    slug: "hospital-medical-scrub",
    name: "Hospital Medical Scrub Set",
    price: 2299,
    sku: "BTSCRUB01",
    category: "scrub",
    images: [
      "https://images.unsplash.com/photo-1576091160568-112173f7f869?w=600",
      "https://images.unsplash.com/photo-1631217314997-e302ff503936?w=600",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Ceil Blue", code: "#0080ff" },
      { name: "Hunter Green", code: "#355c3d" },
      { name: "Burgundy", code: "#800020" },
    ],
    description: {
      tagline: "COMFORT MEETS DURABILITY.",
    },
    badge: { type: "bestseller", text: "Bestseller" },
    productInfo: [
      { label: "Material", value: "65% Polyester, 35% Cotton" },
      { label: "Fit", value: "Standard Fit" },
      { label: "Care", value: "Machine wash warm" },
    ],
  },
];

// ==================== EMBROIDERY OPTIONS ====================
export const embroideryOptions = [
  {
    id: 1,
    name: "Standard Embroidery",
    logo: "https://images.unsplash.com/photo-1578926078328-123456789012?w=80",
    price: 0,
  },
  {
    id: 2,
    name: "Premium Gold Thread",
    logo: "https://images.unsplash.com/photo-1578926078328-222222222222?w=80",
    price: 199,
  },
  {
    id: 3,
    name: "Custom Logo Embroidery",
    logo: "https://images.unsplash.com/photo-1578926078328-333333333333?w=80",
    price: 399,
  },
  {
    id: 4,
    name: "Luxury Silver Thread",
    logo: "https://images.unsplash.com/photo-1578926078328-444444444444?w=80",
    price: 299,
  },
];

export const getRelatedProducts = (category, excludeId, limit = 4) => {
  return products
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
};

export const getRecentlyViewed = (excludeId, limit = 4) => {
  return products
    .filter(p => p.id !== excludeId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};