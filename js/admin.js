import { products as seedProducts, coupons as seedCoupons } from "./data.js";
import { ADMIN_EMAIL } from "../firebase/firebase-config.js";
import { formatPrice, slugify } from "../utils/format.js";
import {
  initFirebase,
  onUserChanged,
  signInEmail,
  signInGoogle,
  signOutUser,
  isAdminUser,
  fetchCollection,
  upsertDocument,
  deleteDocument,
  uploadProductImage
} from "./firebase.js";

let products = [...seedProducts];
let coupons = [...seedCoupons];
let orders = [];
let adminUser = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function productRows() {
  $("#admin-products").innerHTML = products.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.stock ?? 0}</td>
      <td class="inline-actions">
        <button class="btn" data-edit-product="${product.id}">Edit</button>
        <button class="btn btn-dark" data-delete-product="${product.id}">Delete</button>
      </td>
    </tr>
  `).join("");
}

function orderRows() {
  const fallback = [
    { id: "CW-1001", customer: { name: "Arjun Verma", email: "arjunverma@example.com" }, totals: { total: 5996 }, status: "COD Confirmed", items: [{ qty: 1 }, { qty: 1 }, { qty: 1 }] }
  ];
  const rows = orders.length ? orders : fallback;
  $("#admin-orders").innerHTML = rows.map((order) => `
    <tr>
      <td>${order.id || "Pending"}</td>
      <td>${order.customer?.name || order.customer?.email || "Customer"}</td>
      <td>${order.items?.reduce((sum, item) => sum + Number(item.qty || 1), 0) || 0}</td>
      <td>${formatPrice(order.totals?.total || 0)}</td>
      <td>${order.status || "New"}</td>
      <td><button class="btn" data-view-order="${order.id || ""}">View Detail</button></td>
    </tr>
  `).join("");
}

function couponRows() {
  $("#admin-coupons").innerHTML = coupons.map((coupon) => `
    <tr>
      <td>${coupon.code}</td>
      <td>${coupon.type}</td>
      <td>${coupon.value}</td>
      <td>${coupon.active ? "Active" : "Inactive"}</td>
      <td><button class="btn btn-dark" data-delete-coupon="${coupon.code}">Delete</button></td>
    </tr>
  `).join("");
}

function metrics() {
  const revenue = orders.reduce((sum, order) => sum + Number(order.totals?.total || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 5).length;
  $("#metric-orders").textContent = orders.length || 1;
  $("#metric-revenue").textContent = formatPrice(revenue || 5996);
  $("#metric-low-stock").textContent = lowStock;
}

function setDashboardReady() {
  $("#admin-login").classList.add("hidden");
  $("#admin-dashboard").classList.remove("hidden");
  $("#admin-email").textContent = adminUser?.email || ADMIN_EMAIL;
  productRows();
  orderRows();
  couponRows();
  metrics();
}

async function loadRemoteData() {
  const remoteProducts = await fetchCollection("products");
  const remoteCoupons = await fetchCollection("coupons");
  const remoteOrders = await fetchCollection("orders");
  products = remoteProducts.length ? remoteProducts : products;
  coupons = remoteCoupons.length ? remoteCoupons : coupons;
  orders = remoteOrders;
}

function bindLogin() {
  $("#admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const result = await signInEmail(data.get("email"), data.get("password"));
      if (!(await isAdminUser(result.user))) throw new Error("This account is not authorized for the Clad Whale dashboard.");
      adminUser = result.user;
      await loadRemoteData();
      setDashboardReady();
    } catch (error) {
      alert(error.message);
    }
  });

  $("#admin-google").addEventListener("click", async () => {
    try {
      const result = await signInGoogle();
      if (!(await isAdminUser(result.user))) throw new Error("This account is not authorized for the Clad Whale dashboard.");
      adminUser = result.user;
      await loadRemoteData();
      setDashboardReady();
    } catch (error) {
      alert(error.message);
    }
  });
}

function bindTabs() {
  $$(".admin-sidebar [data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".admin-sidebar .is-active").forEach((item) => item.classList.remove("is-active"));
      $$(".admin-section.is-active").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      $(`#${button.dataset.section}`).classList.add("is-active");
    });
  });
}

function bindProductForm() {
  $("#product-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const file = event.currentTarget.querySelector("[name=imageFile]").files[0];
    let image = data.imageUrl || data.existingImage || "images/products/ocean-depths-tee.png";
    if (file) image = await uploadProductImage(file);
    const id = data.id || slugify(data.name);
    const product = {
      id,
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      size: data.size,
      color: data.color,
      image,
      description: data.description,
      features: String(data.features || "").split("\n").filter(Boolean)
    };
    await upsertDocument("products", id, product);
    products = products.filter((item) => item.id !== id).concat(product);
    event.currentTarget.reset();
    productRows();
    metrics();
  });

  document.addEventListener("click", async (event) => {
    const edit = event.target.closest("[data-edit-product]");
    const del = event.target.closest("[data-delete-product]");
    if (edit) {
      const product = products.find((item) => item.id === edit.dataset.editProduct);
      const form = $("#product-form");
      Object.entries({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        size: product.size,
        color: product.color,
        imageUrl: product.image,
        description: product.description,
        features: (product.features || []).join("\n")
      }).forEach(([key, value]) => {
        if (form.elements[key]) form.elements[key].value = value || "";
      });
      location.hash = "products";
    }
    if (del && confirm("Delete this product?")) {
      await deleteDocument("products", del.dataset.deleteProduct);
      products = products.filter((item) => item.id !== del.dataset.deleteProduct);
      productRows();
      metrics();
    }
  });
}

function bindCoupons() {
  $("#coupon-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const coupon = { code: data.code.toUpperCase(), type: data.type, value: Number(data.value), active: true };
    await upsertDocument("coupons", coupon.code, coupon);
    coupons = coupons.filter((item) => item.code !== coupon.code).concat(coupon);
    event.currentTarget.reset();
    couponRows();
  });

  document.addEventListener("click", async (event) => {
    const del = event.target.closest("[data-delete-coupon]");
    if (!del) return;
    await deleteDocument("coupons", del.dataset.deleteCoupon);
    coupons = coupons.filter((item) => item.code !== del.dataset.deleteCoupon);
    couponRows();
  });
}

function bindBanners() {
  $("#banner-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    await upsertDocument("site", "banner", data);
    localStorage.setItem("cw_banner", JSON.stringify(data));
    alert("Website banner saved. The home page can now read this document from Firebase.");
  });
}

function bindExports() {
  $("#export-orders").addEventListener("click", () => {
    const rows = (orders.length ? orders : []).map((order) => ({
      Order: order.id,
      Customer: order.customer?.name || order.customer?.email,
      Status: order.status,
      Items: order.items?.length || 0,
      Total: order.totals?.total || 0
    }));

    if (window.XLSX) {
      const sheet = window.XLSX.utils.json_to_sheet(rows);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, sheet, "Orders");
      window.XLSX.writeFile(workbook, "clad-whale-orders.xlsx");
      return;
    }

    const csv = ["Order,Customer,Status,Items,Total", ...rows.map((row) => Object.values(row).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clad-whale-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
}

function bindAdminAccounts() {
  $("#admin-account-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email").toLowerCase();
    await upsertDocument("admins", email, { email, active: true, addedBy: adminUser?.email || ADMIN_EMAIL });
    const admins = JSON.parse(localStorage.getItem("cw_admins") || "[]");
    localStorage.setItem("cw_admins", JSON.stringify([...new Set([...admins, email])]));
    event.currentTarget.reset();
    alert(`${email} can now be used as an admin account after Firebase rules allow it.`);
  });

  $("#admin-logout").addEventListener("click", async () => {
    await signOutUser();
    location.reload();
  });
}

async function boot() {
  await initFirebase();
  bindLogin();
  bindTabs();
  bindProductForm();
  bindCoupons();
  bindBanners();
  bindExports();
  bindAdminAccounts();

  onUserChanged(async (user) => {
    if (user && await isAdminUser(user)) {
      adminUser = user;
      await loadRemoteData();
      setDashboardReady();
    }
  });
}

boot();
