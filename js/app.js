import { products, coupons } from "./data.js";
import { formatPrice } from "../utils/format.js";
import {
  initFirebase,
  onUserChanged,
  signInEmail,
  signUpEmail,
  signInGoogle,
  signOutUser,
  saveOrder
} from "./firebase.js";
import { RAZORPAY_CONFIG, razorpayIsConfigured } from "./razorpay.js";

const state = {
  user: null,
  category: "All"
};

const icons = {
  menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/></svg>',
  cube: '<svg viewBox="0 0 24 24"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/></svg>',
  ticket: '<svg viewBox="0 0 24 24"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/></svg>',
  card: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.3.61.91 1 1.6 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 3v18"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><rect x="1" y="7" width="14" height="10" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>',
  award: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M9 14 6 22l6-3 6 3-3-8"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5 15.4 6.5"/><path d="M8.6 13.5 15.4 17.5"/></svg>'
};

const getPage = () => document.body.dataset.page || "home";
const inPages = () => location.pathname.includes("/pages/");
const root = () => (inPages() ? "../" : "./");
const path = (target) => `${root()}${target}`;
const pageHref = (file) => (file === "index.html" ? path("index.html") : path(`pages/${file}`));
const asset = (file) => (/^(https?:|data:|blob:)/.test(file) ? file : path(file));

const getStore = (key, fallback = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const setStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getCart = () => getStore("cw_cart");
const setCart = (cart) => {
  setStore("cw_cart", cart);
  updateBadges();
};
const getWish = () => getStore("cw_wishlist");
const setWish = (wish) => {
  setStore("cw_wishlist", wish);
  updateBadges();
};
const findProduct = (id) => products.find((product) => product.id === id) || products[0];

function renderHeader() {
  const mount = document.querySelector("[data-header]");
  if (!mount) return;
  const page = getPage();
  const nav = [
    ["home", "HOME", "index.html"],
    ["shop", "SHOP", "shop.html"],
    ["collections", "COLLECTIONS", "shop.html"],
    ["about", "ABOUT US", "account.html"],
    ["contact", "CONTACT", "checkout.html"]
  ];

  mount.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <button class="menu-toggle" data-menu-toggle aria-label="Open menu">${icons.menu}</button>
        <a class="brand" href="${pageHref("index.html")}" aria-label="Clad Whale home">
          <img src="${asset("images/logo.png")}" alt="Clad Whale">
          <span class="brand-word"><span>CLAD</span><span>WHALE</span></span>
        </a>
        <nav class="desktop-nav">
          ${nav.map(([id, label, href]) => `<a class="${page === id ? "is-active" : ""}" href="${pageHref(href)}">${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" data-search aria-label="Search">${icons.search}</button>
          <a class="icon-btn account-link ${page === "account" ? "is-active" : ""}" href="${pageHref("account.html")}" aria-label="Account">${icons.user}</a>
          <a class="icon-btn admin-link" href="${pageHref("admin.html")}" aria-label="Admin Dashboard">${icons.shield}</a>
          <a class="icon-btn" href="${pageHref("cart.html")}" aria-label="Cart">${icons.bag}<span class="badge" data-cart-count>0</span></a>
        </div>
      </div>
      <nav class="mobile-menu" data-mobile-menu>
        ${nav.map(([id, label, href]) => `<a class="${page === id ? "is-active" : ""}" href="${pageHref(href)}">${label}</a>`).join("")}
        <a href="${pageHref("admin.html")}">ADMIN DASHBOARD LOGIN</a>
      </nav>
    </header>
  `;
}

function renderBottomNav() {
  const mount = document.querySelector("[data-bottom-nav]");
  if (!mount) return;
  const page = getPage();
  const links = [
    ["home", "Home", "index.html", icons.home],
    ["shop", "Shop", "shop.html", icons.bag],
    ["wishlist", "Wishlist", "wishlist.html", icons.heart],
    ["cart", "Cart", "cart.html", icons.bag],
    ["account", "Account", "account.html", icons.user]
  ];
  mount.innerHTML = `
    <nav class="mobile-bottom-nav">
      ${links.map(([id, label, href, icon]) => `
        <a class="${page === id ? "is-active" : ""}" href="${pageHref(href)}">
          ${icon}
          ${id === "shop" ? '<span class="badge" data-cart-count>0</span>' : ""}
          <span>${label}</span>
        </a>
      `).join("")}
    </nav>
  `;
}

function bindShell() {
  document.addEventListener("click", (event) => {
    const menu = event.target.closest("[data-menu-toggle]");
    if (menu) document.querySelector("[data-mobile-menu]")?.classList.toggle("is-open");

    if (event.target.closest("[data-search]")) {
      const query = prompt("Search Clad Whale products");
      if (query) location.href = `${pageHref("shop.html")}?search=${encodeURIComponent(query)}`;
    }
  });
}

function updateBadges() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  });
}

function addToCart(id, qty = 1) {
  const product = findProduct(id);
  const cart = getCart();
  const current = cart.find((item) => item.id === id);
  if (current) current.qty += qty;
  else cart.push({ id, qty, size: product.size, color: product.color });
  setCart(cart);
}

function toggleWishlist(id) {
  const wish = getWish();
  const next = wish.includes(id) ? wish.filter((item) => item !== id) : [...wish, id];
  setWish(next);
  document.querySelectorAll(`[data-wish="${id}"]`).forEach((button) => button.classList.toggle("is-active", next.includes(id)));
}

function productCard(product, options = {}) {
  const wish = getWish();
  return `
    <article class="product-card" data-category="${product.category}">
      ${product.badge && options.showBadge ? `<span class="tag">${product.badge === "NEW DROP 2024" ? "NEW" : product.badge}</span>` : ""}
      <button class="wish-btn ${wish.includes(product.id) ? "is-active" : ""}" data-wish="${product.id}" aria-label="Add ${product.name} to wishlist">${icons.heart}</button>
      <a class="product-link" href="${pageHref(`product.html?id=${product.id}`)}">
        <div class="product-media"><img src="${asset(product.image)}" alt="${product.name}"></div>
        <h3>${product.name}</h3>
        <div class="price">${formatPrice(product.price)}</div>
      </a>
      <button class="add-btn" data-add="${product.id}" aria-label="Add ${product.name} to cart">${icons.plus}</button>
    </article>
  `;
}

function bindProductActions() {
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      addToCart(add.dataset.add);
      add.animate([{ transform: "scale(1)" }, { transform: "scale(1.16)" }, { transform: "scale(1)" }], { duration: 220 });
    }

    const wish = event.target.closest("[data-wish]");
    if (wish) {
      event.preventDefault();
      toggleWishlist(wish.dataset.wish);
    }
  });
}

function renderHome() {
  const grid = document.querySelector("[data-featured-products]");
  if (!grid) return;
  const featured = ["ocean-depths-tee", "fracture-hoodie", "stone-wash-tee", "nightfall-cargo"].map(findProduct);
  grid.innerHTML = featured.map((product) => productCard(product)).join("");
}

function renderShop() {
  const grid = document.querySelector("[data-shop-products]");
  const pills = document.querySelector("[data-category-pills]");
  if (!grid || !pills) return;
  const categories = ["All", "T-Shirts", "Hoodies", "Bottoms", "Jackets", "Accessories"];
  const params = new URLSearchParams(location.search);
  const query = (params.get("search") || "").toLowerCase();

  pills.innerHTML = categories.map((category) => `<button class="pill ${category === state.category ? "is-active" : ""}" data-category="${category}">${category}</button>`).join("");

  const draw = () => {
    const visible = products.filter((product) => {
      const categoryMatch = state.category === "All" || product.category === state.category;
      const queryMatch = !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
    grid.innerHTML = visible.map((product, index) => productCard(product, { showBadge: index === 0 })).join("");
    document.querySelector("[data-product-count]").textContent = `${visible.length || 0} Products`;
  };

  pills.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    pills.querySelector(".is-active")?.classList.remove("is-active");
    button.classList.add("is-active");
    draw();
  });

  document.querySelector("[data-filter]")?.addEventListener("click", () => {
    alert("Use the category tabs to filter products. Price and stock filters can be connected in Firebase as catalog fields grow.");
  });

  draw();
}

function renderWishlist() {
  const grid = document.querySelector("[data-wishlist]");
  if (!grid) return;
  const wish = getWish();
  const items = products.filter((product) => wish.includes(product.id));
  grid.innerHTML = items.length
    ? items.map((product) => productCard(product)).join("")
    : `<div class="panel" style="padding:28px"><h2 class="section-title">Wishlist Empty</h2><p class="price">Save your favorite pieces from the shop.</p><a class="btn btn-primary" href="${pageHref("shop.html")}">Shop Now</a></div>`;
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
  const shipping = subtotal > 0 && subtotal < 1999 ? 99 : 0;
  const discount = subtotal > 0 ? Number(localStorage.getItem("cw_discount") || 0) : 0;
  return { subtotal, shipping, discount, total: Math.max(0, subtotal + shipping - discount) };
}

function clearDiscount() {
  localStorage.removeItem("cw_discount");
}

function renderCart() {
  const list = document.querySelector("[data-cart-list]");
  if (!list) return;
  const cart = getCart();
  document.querySelector("[data-cart-count-label]").textContent = `${cart.reduce((sum, item) => sum + item.qty, 0)} Items in your cart`;

  list.innerHTML = cart.length
    ? cart.map((item) => {
      const product = findProduct(item.id);
      return `
        <article class="cart-item">
          <a class="cart-thumb" href="${pageHref(`product.html?id=${product.id}`)}"><img src="${asset(product.image)}" alt="${product.name}"></a>
          <div>
            <h3>${product.name}</h3>
            <div class="cart-meta"><b>Size:</b> ${item.size} &nbsp; &bull; &nbsp; <b>Color:</b> ${item.color}</div>
            <div class="price" style="font-size:22px;margin-top:10px">${formatPrice(product.price)}</div>
            <div class="qty">
              <button data-dec="${product.id}" aria-label="Decrease quantity">${icons.minus}</button>
              <span>${item.qty}</span>
              <button data-inc="${product.id}" aria-label="Increase quantity">${icons.plus}</button>
            </div>
          </div>
          <div class="cart-actions">
            <div class="icon-row">
              <button data-move-wish="${product.id}" aria-label="Move to wishlist">${icons.heart}</button>
              <button data-remove="${product.id}" aria-label="Remove item">${icons.trash}</button>
            </div>
            <strong class="price">${formatPrice(product.price * item.qty)}</strong>
          </div>
        </article>
      `;
    }).join("")
    : `<div class="panel" style="padding:28px"><h2 class="section-title">Your Cart Is Empty</h2><p class="price">Premium drops are waiting in the shop.</p><a class="btn btn-primary" href="${pageHref("shop.html")}">Continue Shopping</a></div>`;
  renderSummary();
}

function renderSummary() {
  const totalMounts = document.querySelectorAll("[data-summary]");
  if (!totalMounts.length) return;
  const totals = cartTotals();
  totalMounts.forEach((mount) => {
    mount.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(totals.subtotal)}</strong></div>
      <div class="summary-row"><span>Shipping</span><strong>${totals.shipping ? formatPrice(totals.shipping) : "FREE"}</strong></div>
      <div class="summary-row"><span>Discount</span><strong style="color:var(--green)">-${formatPrice(totals.discount)}</strong></div>
      <div class="summary-row summary-total"><span>Total<br><small style="color:var(--muted);font-size:17px">(Incl. of all taxes)</small></span><strong>${formatPrice(totals.total)}</strong></div>
    `;
  });
}

function bindCart() {
  document.addEventListener("click", (event) => {
    const cart = getCart();
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    const remove = event.target.closest("[data-remove]");
    const clear = event.target.closest("[data-clear-cart]");
    const moveWish = event.target.closest("[data-move-wish]");

    if (moveWish) {
      const id = moveWish.dataset.moveWish;
      const wish = getWish();
      if (!wish.includes(id)) setWish([...wish, id]);
      setCart(cart.filter((entry) => entry.id !== id));
      renderCart();
    }

    if (inc || dec) {
      const id = (inc || dec).dataset[inc ? "inc" : "dec"];
      const item = cart.find((entry) => entry.id === id);
      if (item) item.qty += inc ? 1 : -1;
      setCart(cart.filter((entry) => entry.qty > 0));
      renderCart();
    }

    if (remove) {
      setCart(cart.filter((entry) => entry.id !== remove.dataset.remove));
      renderCart();
    }

    if (clear && confirm("Clear all items from cart?")) {
      setCart([]);
      clearDiscount();
      renderCart();
    }
  });
}

function renderProductDetail() {
  const mount = document.querySelector("[data-product-detail]");
  if (!mount) return;
  const id = new URLSearchParams(location.search).get("id") || "ocean-depths-tee";
  const product = findProduct(id);
  mount.innerHTML = `
    <div class="crumbs page-shell"><a href="${pageHref("index.html")}">Home</a><span>›</span><a href="${pageHref("shop.html")}">Shop</a><span>›</span><b>${product.name}</b></div>
    <section class="detail-hero">
      <img src="${asset(product.detailImage || product.image)}" alt="${product.name}">
      <div class="float-actions">
        <button data-wish="${product.id}" aria-label="Wishlist">${icons.heart}</button>
        <button data-share aria-label="Share">${icons.share}</button>
      </div>
    </section>
    <div class="dot-row"><span></span><span></span><span></span><span></span></div>
    <section class="detail-content">
      ${product.badge ? `<span class="pill is-active" style="height:auto;padding:5px 12px">${product.badge}</span>` : ""}
      <h1>${product.name}</h1>
      <div class="price">${formatPrice(product.price)}</div>
      <div style="color:var(--muted);font-size:18px;margin-top:4px">Inclusive of all taxes</div>
      <p>${product.description}</p>
      <ul>${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
      <p><strong>Color:</strong> ${product.color}</p>
      <div class="swatches"><button class="swatch is-active"></button><button class="swatch white"></button><button class="swatch gray"></button></div>
      <div class="detail-buy-row">
        <div>
          <p><strong>Size:</strong> Select Size</p>
          <div class="sizes">${["S", "M", "L", "XL", "XXL"].map((size) => `<button class="size ${size === "S" ? "is-active" : ""}" data-size="${size}">${size}</button>`).join("")}</div>
        </div>
        <div class="qty"><button data-detail-dec>${icons.minus}</button><span data-detail-qty>1</span><button data-detail-inc>${icons.plus}</button></div>
      </div>
      <div class="detail-buttons">
        <button class="btn" data-detail-add="${product.id}">${icons.bag} Add To Cart</button>
        <button class="btn btn-dark" data-wish="${product.id}">${icons.heart} Add To Wishlist</button>
      </div>
      <div class="mini-features">${featuresMarkup()}</div>
    </section>
  `;
}

function bindProductDetail() {
  let qty = 1;
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-share]")) navigator.clipboard?.writeText(location.href).then(() => alert("Product link copied."));
    if (event.target.closest("[data-detail-inc]")) qty += 1;
    if (event.target.closest("[data-detail-dec]")) qty = Math.max(1, qty - 1);
    document.querySelector("[data-detail-qty]") && (document.querySelector("[data-detail-qty]").textContent = qty);

    const size = event.target.closest("[data-size]");
    if (size) {
      document.querySelector(".size.is-active")?.classList.remove("is-active");
      size.classList.add("is-active");
    }

    const add = event.target.closest("[data-detail-add]");
    if (add) addToCart(add.dataset.detailAdd, qty);
  });
}

function featuresMarkup() {
  const data = [
    [icons.award, "Premium Quality", "Finest fabrics & materials"],
    [icons.truck, "Fast Delivery", "Pan India shipping"],
    [icons.cube, "Easy Returns", "Hassle free returns"],
    [icons.lock, "Secure Payments", "100% secure checkout"]
  ];
  return data.map(([icon, title, text]) => `<div class="feature">${icon}<div><strong>${title}</strong><span>${text}</span></div></div>`).join("");
}

function renderAccount() {
  const stats = document.querySelector("[data-account-stats]");
  if (!stats) return;
  stats.innerHTML = `
    <div class="stat">${icons.bag}<strong>12</strong><span>Orders</span></div>
    <div class="stat">${icons.heart}<strong>${getWish().length}</strong><span>Wishlist</span></div>
    <div class="stat">${icons.ticket}<strong>${coupons.length}</strong><span>Coupons</span></div>
    <div class="stat">${icons.pin}<strong>2</strong><span>Addresses</span></div>
  `;

  const list = document.querySelector("[data-account-menu]");
  list.innerHTML = [
    [icons.cube, "My Orders", "Track and view your orders"],
    [icons.heart, "Wishlist", "View items you've saved"],
    [icons.pin, "Addresses", "Manage your delivery addresses"],
    [icons.card, "Payment Methods", "Manage cards and wallets"],
    [icons.ticket, "Coupons", "View your available coupons"],
    [icons.settings, "Account Settings", "Manage your account preferences"],
    [icons.logout, "Logout", "Sign out from your account"]
  ].map(([icon, title, text]) => `<button data-account-action="${title}">${icon}<span><strong>${title}</strong><span>${text}</span></span><b>›</b></button>`).join("");

  list.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-account-action]")?.dataset.accountAction;
    if (!action) return;
    if (action === "Wishlist") location.href = pageHref("wishlist.html");
    else if (action === "Logout") {
      await signOutUser();
      location.href = pageHref("login.html");
    } else alert(`${action} will show live Firebase data after customer records are added.`);
  });

  document.querySelector("[data-edit-profile]")?.addEventListener("click", () => {
    alert("Profile editing will connect once Firebase profile fields are added.");
  });
}

function bindAuth() {
  const form = document.querySelector("[data-auth-form]");
  if (!form) return;
  const modeInput = document.querySelector("[data-auth-mode]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    try {
      if (modeInput.value === "signup") await signUpEmail(data.get("email"), data.get("password"), data.get("name"));
      else await signInEmail(data.get("email"), data.get("password"));
      location.href = pageHref("account.html");
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelector("[data-google-login]")?.addEventListener("click", async () => {
    try {
      await signInGoogle();
      location.href = pageHref("account.html");
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelector("[data-toggle-auth]")?.addEventListener("click", () => {
    const signup = modeInput.value !== "signup";
    modeInput.value = signup ? "signup" : "login";
    document.querySelector("[data-name-field]").classList.toggle("hidden", !signup);
    document.querySelector("[data-auth-title]").textContent = signup ? "Create Account" : "Login";
    document.querySelector("[data-auth-submit]").textContent = signup ? "Sign Up" : "Login";
    document.querySelector("[data-toggle-auth]").textContent = signup ? "Already have an account? Login" : "Create a new account";
  });
}

function bindCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;
  renderSummary();

  document.querySelector("[data-apply-coupon]")?.addEventListener("click", () => {
    const code = document.querySelector("[data-coupon]").value.trim().toUpperCase();
    const coupon = coupons.find((item) => item.code === code && item.active);
    if (!coupon) return alert("Coupon not found.");
    const { subtotal } = cartTotals();
    const discount = coupon.type === "percent" ? Math.round(subtotal * coupon.value / 100) : coupon.value;
    localStorage.setItem("cw_discount", String(discount));
    renderSummary();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) return alert("Your cart is empty.");
    const data = Object.fromEntries(new FormData(form));
    const totals = cartTotals();
    const order = {
      customer: data,
      paymentMethod: data.paymentMethod,
      items: cart.map((item) => ({ ...item, product: findProduct(item.id) })),
      totals,
      status: data.paymentMethod === "cod" ? "COD Confirmed" : "Payment Pending"
    };

    if (data.paymentMethod === "online") {
      if (!razorpayIsConfigured() || !window.Razorpay) {
        alert("Razorpay structure is ready. Add your Razorpay Key ID in js/razorpay.js and include the live checkout script when keys are available.");
        return;
      }

      const instance = new window.Razorpay({
        key: RAZORPAY_CONFIG.keyId,
        amount: totals.total * 100,
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.companyName,
        description: RAZORPAY_CONFIG.description,
        handler: async (response) => {
          order.razorpay = response;
          order.status = "Paid";
          await saveOrder(order);
          setCart([]);
          clearDiscount();
          location.href = pageHref("account.html#orders");
        }
      });
      instance.open();
      return;
    }

    await saveOrder(order);
    setCart([]);
    clearDiscount();
    alert("Order placed successfully.");
    location.href = pageHref("account.html#orders");
  });
}

async function initAuthState() {
  await initFirebase();
  onUserChanged((user) => {
    state.user = user;
    document.querySelectorAll("[data-user-name]").forEach((node) => {
      node.textContent = user?.displayName || user?.email?.split("@")[0] || "Arjun Verma";
    });
    document.querySelectorAll("[data-user-email]").forEach((node) => {
      node.textContent = user?.email || "arjunverma@example.com";
    });
  });
}

function boot() {
  renderHeader();
  renderBottomNav();
  bindShell();
  bindProductActions();
  bindCart();
  renderHome();
  renderShop();
  renderWishlist();
  renderCart();
  renderProductDetail();
  bindProductDetail();
  renderAccount();
  bindAuth();
  bindCheckout();
  updateBadges();
  initAuthState();
}

boot();
