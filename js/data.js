export const fallbackBanners = [
  {
    title: "Clad In Black. Built To Bite.",
    eyebrow: "New drop, all sizes, all genders",
    subtitle: "Oversized tees, heavyweight hoodies and streetwear staples cut for every body. One tribe, no labels.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=85",
    cta: "Shop New Arrivals",
    link: "products/"
  },
  {
    title: "Monochrome Pack Is Live",
    eyebrow: "Limited run, unisex fits",
    subtitle: "Deep black, bone white and steel grey — engineered layers for everyday armor.",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1800&q=85",
    cta: "Explore Best Sellers",
    link: "products/?tag=best-seller"
  },
  {
    title: "Weekend Uniform, Sorted",
    eyebrow: "Comfort meets attitude",
    subtitle: "Relaxed joggers, boxy hoodies and caps that move from the street to the studio.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1800&q=85",
    cta: "Shop The Edit",
    link: "products/?category=hoodies"
  }
];

export const categories = [
  { name: "Oversized Tees", slug: "oversized-tees", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" },
  { name: "Hoodies", slug: "hoodies", image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=900&q=80" },
  { name: "Joggers", slug: "joggers", image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=80" },
  { name: "Jackets", slug: "jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80" },
  { name: "Caps", slug: "caps", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80" },
  { name: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80" }
];

export const fallbackProducts = [
  {
    id: "cw-orca-tee",
    name: "Orca Bite Oversized Tee",
    slug: "orca-bite-oversized-tee",
    category: "oversized-tees",
    tags: ["new-arrival", "best-seller", "featured"],
    price: 1499,
    salePrice: 999,
    stock: 60,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Off White"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Heavyweight cotton oversized tee with the Clad Whale orca graphic across the chest. Cut unisex, built for everyone."
  },
  {
    id: "cw-deep-hoodie",
    name: "Deep Water Pullover Hoodie",
    slug: "deep-water-pullover-hoodie",
    category: "hoodies",
    tags: ["best-seller", "featured"],
    price: 2799,
    salePrice: 1999,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    images: [
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Brushed fleece hoodie with a boxy unisex fit, dropped shoulders and a kangaroo pocket built for cold city nights."
  },
  {
    id: "cw-fin-jogger",
    name: "Finline Cargo Jogger",
    slug: "finline-cargo-jogger",
    category: "joggers",
    tags: ["new-arrival", "featured"],
    price: 1999,
    salePrice: 1499,
    stock: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Steel Grey"],
    images: [
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Tapered cargo jogger with reinforced pockets and an adjustable waist, made to move with everyone."
  },
  {
    id: "cw-shell-jacket",
    name: "Blackwater Shell Jacket",
    slug: "blackwater-shell-jacket",
    category: "jackets",
    tags: ["new-arrival", "best-seller", "featured"],
    price: 3999,
    salePrice: 2999,
    stock: 22,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Water-resistant unisex shell jacket with a structured hood and clean matte hardware."
  },
  {
    id: "cw-fin-cap",
    name: "Whale Fin Snapback Cap",
    slug: "whale-fin-snapback-cap",
    category: "caps",
    tags: ["best-seller"],
    price: 899,
    salePrice: 649,
    stock: 70,
    sizes: ["One Size"],
    colors: ["Black", "White"],
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Structured snapback with an embroidered fin mark, adjustable strap, one size fits all."
  },
  {
    id: "cw-tide-sneaker",
    name: "Tidebreak Low Sneaker",
    slug: "tidebreak-low-sneaker",
    category: "footwear",
    tags: ["new-arrival"],
    price: 3499,
    salePrice: 2799,
    stock: 30,
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black/White", "Triple Black"],
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Low-top unisex sneaker with a cushioned sole and monochrome finish for everyday wear."
  }
];

export const reviews = [
  { name: "Rohan", city: "Nashik", text: "Fit is genuinely oversized in the right way. Fabric feels heavy and premium, not a basic tee.", rating: 5 },
  { name: "Aisha", city: "Mumbai", text: "Ordered the hoodie for myself and my brother — unisex sizing actually works for both of us.", rating: 5 },
  { name: "Devansh", city: "Pune", text: "Packaging felt premium, COD was smooth and the jacket looks even better in person.", rating: 5 }
];
