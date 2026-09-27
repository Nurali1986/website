const IMG = (id, w = 400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const CATS = [
  { id: "it-ozuqa", name: "It ozuqasi", icon: "🐶", bg: "#ffe9d6" },
  { id: "mushuk-ozuqa", name: "Mushuk ozuqasi", icon: "🐱", bg: "#fff1c9" },
  { id: "it-oyin", name: "It o'yinchoqlari", icon: "🦴", bg: "#ffe0ea" },
  { id: "mushuk-oyin", name: "Mushuk o'yinchoqlari", icon: "🧶", bg: "#ece3ff" },
  { id: "idish", name: "Idishlar", icon: "🥣", bg: "#dcf6e9" },
  { id: "grooming", name: "Parvarish", icon: "🧴", bg: "#dbeeff" },
  { id: "salomatlik", name: "Salomatlik", icon: "💊", bg: "#f3e3ff" },
  { id: "shirinlik", name: "Shirinliklar", icon: "🍪", bg: "#fff0d9" },
  { id: "aksessuar", name: "Aksessuarlar", icon: "🏠", bg: "#ffe4e4" },
];

// pet: it | mushuk — used for the dog / cat shelves
const PRODUCTS = [
  { id: 1, name: "Yumshoq it to'shagi", sub: "L o'lcham", cat: "aksessuar", pet: "it", img: "1581888227599-779811939961", price: 349000, old: 420000, rating: 5, reviews: 276 },
  { id: 2, name: "Premium it ozuqasi", sub: "2 kg", cat: "it-ozuqa", pet: "it", img: "1589924691995-400dc9ecc119", price: 189000, rating: 4, reviews: 389 },
  { id: 3, name: "Mushuk tirnagich ustuni", sub: "60 sm", cat: "mushuk-oyin", pet: "mushuk", img: "1545249390-6bdfa286032f", price: 159000, old: 199000, rating: 5, reviews: 310 },
  { id: 4, name: "Issiq kofta (hoodie)", sub: "S–XL", cat: "aksessuar", pet: "it", img: "1583337130417-3346a1be7dee", price: 129000, rating: 4, reviews: 218 },
  { id: 5, name: "Yumshoq fil o'yinchoq", sub: "Chiyillaydi", cat: "it-oyin", pet: "it", img: "1591946614720-90a587da4a36", price: 59000, old: 79000, rating: 5, reviews: 456 },
  { id: 6, name: "Charm bo'yinbog'", sub: "Sozlanadi", cat: "aksessuar", pet: "it", img: "1587764379873-97837921fd44", price: 89000, rating: 4, reviews: 190 },
  { id: 7, name: "Mushuk bandanasi", sub: "Paxta", cat: "aksessuar", pet: "mushuk", img: "1543852786-1cf6624b9987", price: 39000, rating: 5, reviews: 175 },
  { id: 8, name: "Mushuk yostiqchasi", sub: "Yuviladi", cat: "aksessuar", pet: "mushuk", img: "1548802673-380ab8ebc7b7", price: 199000, old: 249000, rating: 4, reviews: 280 },
  { id: 9, name: "Sayr jilovi to'plami", sub: "2 metr", cat: "aksessuar", pet: "it", img: "1546421845-6471bdcf3edf", price: 75000, rating: 4, reviews: 240 },
  { id: 10, name: "Mushuk quruq ozuqasi", sub: "1.5 kg", cat: "mushuk-ozuqa", pet: "mushuk", img: "1573865526739-10659fec78a5", price: 139000, old: 159000, rating: 5, reviews: 360 },
  { id: 11, name: "Mushuk tarog'i", sub: "Yumshoq tish", cat: "grooming", pet: "mushuk", img: "1606214174585-fe31582dc6ee", price: 45000, rating: 4, reviews: 190 },
  { id: 12, name: "Bayramona bandana", sub: "Yurakchali", cat: "aksessuar", pet: "it", img: "1612536057832-2ff7ead58194", price: 49000, rating: 5, reviews: 132 },
  { id: 13, name: "Vitamin kompleksi", sub: "60 tabletka", cat: "salomatlik", pet: "it", img: "1625316708582-7c38734be31d", price: 110000, rating: 5, reviews: 88 },
  { id: 14, name: "Mushuk shirinliklari", sub: "Tovuqli", cat: "shirinlik", pet: "mushuk", img: "1592194996308-7b43878e84a6", price: 29000, old: 35000, rating: 5, reviews: 412 },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  let cart = store.get("bz-cart", {});
  let favs = store.get("bz-favs", []);

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2500); };
  const bump = (el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

  // Header / menu
  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggleMenu = (open) => { nav.classList.toggle("open", open); burger.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
  const links = $$("a", nav);
  links.forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });
  $("#catBtn").addEventListener("click", () => $("#categories").scrollIntoView({ behavior: "smooth" }));

  // Categories
  const count = (id) => PRODUCTS.filter((p) => p.cat === id).length;
  $("#cats").innerHTML = CATS.map((c) => `<button class="cat" data-cat="${c.id}"><span style="background:${c.bg}">${c.icon}</span><b>${c.name}</b><small>${count(c.id) * 40 + 30}+ mahsulot</small></button>`).join("");
  $("#searchCat").innerHTML += CATS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");

  // Product cards
  const off = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
  const card = (p) => `
    <article class="product">
      ${off(p) ? `<span class="product__off">-${off(p)}%</span>` : ""}
      <button class="product__fav ${favs.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Sevimlilarga">❤</button>
      <div class="product__img"><img src="${IMG(p.img)}" alt="${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3><span class="sub">${p.sub}</span>
      <div class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
      <div class="stars">${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)} <small>(${p.reviews})</small></div>
      <button class="add" data-add="${p.id}">Savatga</button>
    </article>`;

  let filter = "all", query = "";
  const titles = { all: "Eng ko'p sotilganlar", sale: "Chegirmadagi mahsulotlar", it: "Itlar uchun", mushuk: "Mushuklar uchun" };
  const renderBest = () => {
    const q = query.toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const byCat = filter === "all" || (filter === "sale" ? p.old : filter === "it" || filter === "mushuk" ? p.pet === filter : p.cat === filter);
      return byCat && (!q || (p.name + " " + p.sub).toLowerCase().includes(q));
    });
    $("#bestGrid").innerHTML = list.length ? list.slice(0, 12).map(card).join("") : '<p class="empty-note">Hech narsa topilmadi 🐾</p>';
    const c = CATS.find((x) => x.id === filter);
    $("#gridTitle").textContent = q ? `"${query}" bo'yicha natijalar` : c ? c.name : titles[filter];
    $$(".cat").forEach((el) => el.classList.toggle("active", el.dataset.cat === filter));
  };
  const setFilter = (f) => { filter = f; query = ""; renderBest(); $("#bestsellers").scrollIntoView({ behavior: "smooth" }); };
  $("#dogGrid").innerHTML = PRODUCTS.filter((p) => p.pet === "it").slice(0, 4).map(card).join("");
  $("#catGrid").innerHTML = PRODUCTS.filter((p) => p.pet === "mushuk").slice(0, 4).map(card).join("");
  renderBest();

  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    filter = $("#searchCat").value;
    query = $("#searchInput").value.trim();
    renderBest();
    $("#bestsellers").scrollIntoView({ behavior: "smooth" });
  });

  // Delegated actions
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) setFilter(c.dataset.cat);
    const t = e.target.closest("[data-toast]");
    if (t) notify(t.dataset.toast);
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = +add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      saveCart(); bump($("#cartBtn"));
      add.classList.add("added"); add.textContent = "✓ Qo'shildi";
      setTimeout(() => { add.classList.remove("added"); add.textContent = "Savatga"; }, 1200);
      notify(`🐾 "${byId(id).name}" savatga qo'shildi`);
    }
    const f = e.target.closest("[data-fav]");
    if (f) {
      const id = +f.dataset.fav;
      favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
      $$(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle("on", favs.includes(id)));
      store.set("bz-favs", favs);
    }
  });

  // Cart drawer
  const drawer = $("#drawer"), overlay = $("#overlay");
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + byId(+id).price * q, 0);
  const renderCart = () => {
    const ids = Object.keys(cart);
    $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
    $("#cartSum").textContent = money(total());
    $("#drawerTotal").textContent = money(total());
    $("#drawerList").innerHTML = ids.length ? ids.map((id) => { const p = byId(+id); return `<li><img src="${IMG(p.img, 120)}" alt=""><div>${p.name}<small>${money(p.price)}</small><div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div></div><button class="rm" data-rm="${id}" aria-label="O'chirish">×</button></li>`; }).join("") : '<li class="empty">Savat bo\'sh 🐶</li>';
  };
  const saveCart = () => { store.set("bz-cart", cart); renderCart(); };
  $("#drawerList").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc]++;
    else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; }
    else if (t.dataset.rm) delete cart[t.dataset.rm];
    else return;
    saveCart();
  });
  const openCart = () => { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#cartBtn").addEventListener("click", openCart);
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeCart));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); toggleMenu(false); } });
  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(cart).length) return notify("Savat bo'sh 🐶");
    cart = {}; saveCart(); closeCart();
    notify("✔ Buyurtma qabul qilindi! Tez orada yetkazamiz 🚚");
  });
  renderCart();

  // Flash sale countdown (2 days 15 hours from first visit)
  let end = store.get("bz-flash", 0);
  if (!end || end < Date.now()) { end = Date.now() + 2 * 864e5 + 15 * 36e5; store.set("bz-flash", end); }
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const d = Math.max(0, end - Date.now());
    $('[data-t="d"]').textContent = pad(Math.floor(d / 864e5));
    $('[data-t="h"]').textContent = pad(Math.floor(d / 36e5) % 24);
    $('[data-t="m"]').textContent = pad(Math.floor(d / 6e4) % 60);
    $('[data-t="s"]').textContent = pad(Math.floor(d / 1e3) % 60);
  };
  tick(); setInterval(tick, 1000);

  $("#year").textContent = new Date().getFullYear();
});
