export const products = [
  {
    id: "fracture-hoodie",
    name: "Fracture Hoodie",
    category: "Hoodies",
    price: 2199,
    size: "L",
    color: "Black",
    badge: "NEW",
    image: "images/products/fracture-hoodie.png",
    description: "A heavyweight black hoodie carrying the fractured Clad Whale mark across the back.",
    features: ["Premium Fleece Cotton", "Oversized Fit", "360 GSM Heavyweight", "Front Pocket", "Pre-Shrunk"],
    stock: 8
  },
  {
    id: "ocean-depths-tee",
    name: "Ocean Depths Tee",
    category: "T-Shirts",
    price: 1299,
    size: "M",
    color: "Black",
    badge: "NEW DROP 2024",
    image: "images/products/ocean-depths-tee.png",
    detailImage: "images/products/ocean-depths-detail.png",
    description: "Dive into the unknown. The Ocean Depths Tee features a bold shark graphic inspired by the deep, the dark, and the fearless.",
    features: ["100% Premium Cotton", "Oversized Fit", "240 GSM Heavyweight", "Front & Back Print", "Pre-Shrunk"],
    stock: 14
  },
  {
    id: "stone-wash-tee",
    name: "Stone Wash Tee",
    category: "T-Shirts",
    price: 1199,
    size: "M",
    color: "Black",
    image: "images/products/stone-wash-tee.png",
    description: "A washed black everyday tee with sharp front branding and a relaxed premium fit.",
    features: ["100% Premium Cotton", "Stone Wash Finish", "220 GSM Fabric", "Front Print", "Pre-Shrunk"],
    stock: 22
  },
  {
    id: "nightfall-cargo",
    name: "Nightfall Cargo",
    category: "Bottoms",
    price: 2399,
    size: "32",
    color: "Black",
    image: "images/products/nightfall-cargo.png",
    description: "Utility cargo pants with a deep black finish, structured pockets, and street-ready taper.",
    features: ["Cotton Twill Blend", "Utility Pockets", "Elastic Cuffs", "Adjustable Waist", "Relaxed Taper"],
    stock: 5
  },
  {
    id: "glacier-zip-hoodie",
    name: "Glacier Zip Hoodie",
    category: "Jackets",
    price: 2499,
    size: "L",
    color: "Black",
    image: "images/products/glacier-zip-hoodie.png",
    description: "A clean zip layer with a compact Clad Whale chest mark and cold blue detailing.",
    features: ["Premium Fleece", "Metal Zip", "Ribbed Cuffs", "Regular Fit", "Pre-Shrunk"],
    stock: 3
  },
  {
    id: "crest-tee",
    name: "Abyss Crest Tee",
    category: "T-Shirts",
    price: 1399,
    size: "M",
    color: "Black",
    image: "images/products/crest-tee.png",
    description: "A black tee with the signature fractured crest printed boldly across the front.",
    features: ["100% Premium Cotton", "Oversized Fit", "240 GSM Heavyweight", "Front Print", "Pre-Shrunk"],
    stock: 18
  }
];

export const coupons = [
  { code: "WHALE10", type: "percent", value: 10, active: true },
  { code: "DROP200", type: "fixed", value: 200, active: true }
];
