const IMG = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const CATS = [
  { id: "soat", name: "Soatlar", img: "1524592094714-0f0654e20314" },
  { id: "audio", name: "Quloqchinlar", img: "1505740420928-5e560c06d30e" },
  { id: "kozoynak", name: "Ko'zoynaklar", img: "1572635196237-14b3f281503f" },
  { id: "sumka", name: "Sumkalar", img: "1584917865442-de89df76afd3" },
  { id: "zargarlik", name: "Zargarlik", img: "1535632066927-ab7c9ab60908" },
  { id: "poyabzal", name: "Krossovkalar", img: "1542291026-7eec264c27ff" },
  { id: "hamyon", name: "Hamyonlar", img: "1627123424574-724758594e93" },
  { id: "kepka", name: "Kepkalar", img: "1588850561407-ed78c282e89b" },
];

const PRODUCTS = [
  { id: 1, name: "Klassik charm tasmali soat", cat: "soat", img: "1524592094714-0f0654e20314", price: 690000, old: 890000, rating: 5, reviews: 128, hot: true },
  { id: 2, name: "Aqlli soat Series X", cat: "soat", img: "1579586337278-3befd40fd17a", price: 2490000, old: 2990000, rating: 4, reviews: 312, hot: true },
  { id: 3, name: "Minimal oq soat", cat: "soat", img: "1523275335684-37898b6baf30", price: 450000, rating: 4, reviews: 64, isNew: true },
  { id: 4, name: "Simsiz quloqchin Pro", cat: "audio", img: "1505740420928-5e560c06d30e", price: 790000, old: 1190000, rating: 5, reviews: 540, hot: true },
  { id: 5, name: "Shovqinni bosuvchi quloqchin", cat: "audio", img: "1583394838336-acd977736f90", price: 1190000, old: 1490000, rating: 5, reviews: 211 },
  { id: 6, name: "Simsiz quloqchinlar (juft)", cat: "audio", img: "1590658268037-6bf12165a8df", price: 590000, rating: 4, reviews: 390, isNew: true, hot: true },
  { id: 7, name: "Dumaloq quyosh ko'zoynagi", cat: "kozoynak", img: "1511499767150-a48a237f0083", price: 290000, old: 390000, rating: 4, reviews: 87 },
  { id: 8, name: "Klassik qora ko'zoynak", cat: "kozoynak", img: "1572635196237-14b3f281503f", price: 350000, rating: 5, reviews: 156, isNew: true },
  { id: 9, name: "Qizil charm sumka", cat: "sumka", img: "1584917865442-de89df76afd3", price: 890000, old: 1190000, rating: 5, reviews: 78 },
  { id: 10, name: "Gulli ayollar sumkasi", cat: "sumka", img: "1591561954557-26941169b49e", price: 990000, rating: 4, reviews: 45, isNew: true },
  { id: 11, name: "Shahar ryukzagi", cat: "sumka", img: "1553062407-98eeb64c6a62", price: 450000, old: 550000, rating: 5, reviews: 950 },
  { id: 12, name: "Kumush sirg'alar", cat: "zargarlik", img: "1535632066927-ab7c9ab60908", price: 520000, old: 690000, rating: 5, reviews: 63 },
  { id: 13, name: "Marvarid marjon", cat: "zargarlik", img: "1515562141207-7a88fb7ce338", price: 1290000, rating: 5, reviews: 34 },
  { id: 14, name: "Tilla rang zanjir", cat: "zargarlik", img: "1590548784585-643d2b9f2925", price: 390000, old: 490000, rating: 4, reviews: 58 },
  { id: 15, name: "Sport krossovka Red", cat: "poyabzal", img: "1542291026-7eec264c27ff", price: 890000, old: 1200000, rating: 5, reviews: 128 },
  { id: 16, name: "Yengil yugurish krossovkasi", cat: "poyabzal", img: "1491553895911-0055eca6402d", price: 750000, rating: 4, reviews: 97, isNew: true },
  { id: 17, name: "Charm hamyon", cat: "hamyon", img: "1627123424574-724758594e93", price: 250000, old: 320000, rating: 5, reviews: 204 },
  { id: 18, name: "Oq beysbolka", cat: "kepka", img: "1588850561407-ed78c282e89b", price: 120000, rating: 4, reviews: 71 },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const off = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  let cart = store.get("ba-cart", {});
  let wish = store.get("ba-wish", []);

  // Toast
  const toast = $("#toast");
  let tTimer;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tTimer); tTimer = setTimeout(() => toast.classList.remove("show"), 2600); };
  $$("[data-toast]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); notify(b.dataset.toast); }));
  const bump = (el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

  // Menu
  const burger = $("#burger"), nav = $("#nav");
  const toggleMenu = (open) => { nav.classList.toggle("open", open); burger.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  const allcats = $(".allcats");
  $("#allCatsBtn").addEventListener("click", (e) => { e.stopPropagation(); allcats.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (!allcats.contains(e.target)) allcats.classList.remove("open"); });

  // Categories everywhere
  const count = (id) => PRODUCTS.filter((p) => p.cat === id).length;
  $("#allCatsMenu").innerHTML = CATS.map((c) => `<button data-cat="${c.id}">${c.name} <small>${count(c.id)}</small></button>`).join("");
  $("#searchCat").innerHTML += CATS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  $("#categories").innerHTML = CATS.slice(0, 6).map((c) => `<button class="circle" data-cat="${c.id}"><div class="circle__img"><img src="${IMG(c.img, 300)}" alt="${c.name}" loading="lazy"><span>${c.name}</span></div></button>`).join("");
  $("#chips").innerHTML = CATS.map((c) => `<button class="chip" data-cat="${c.id}"><img src="${IMG(c.img, 120)}" alt="" loading="lazy">${c.name}</button>`).join("");

  // Product card templates
  const stars = (p) => `<div class="stars">${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)} <small>(${p.reviews})</small></div>`;
  const priceHtml = (p) => `<div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>`;
  const actions = (p) => `<div class="product__actions"><button class="add" data-add="${p.id}">Savatga</button><button class="wish ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Sevimlilarga"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg></button></div>`;
  const card = (p) => `
    <article class="product">
      ${off(p) ? `<span class="product__tag">-${off(p)}%</span>` : ""}${p.isNew ? '<span class="product__tag product__tag--new">YANGI</span>' : ""}
      <div class="product__img"><img src="${IMG(p.img)}" alt="${p.name}" loading="lazy"></div>
      <div class="product__body"><h3>${p.name}</h3>${stars(p)}${priceHtml(p)}${actions(p)}</div>
    </article>`;

  $("#hotGrid").innerHTML = PRODUCTS.filter((p) => p.hot).slice(0, 4).map(card).join("");
  $("#specialList").innerHTML = PRODUCTS.filter((p) => p.old).slice(4, 9).map((p) => `<li data-add="${p.id}" title="Savatga qo'shish"><img src="${IMG(p.img, 120)}" alt="" loading="lazy"><p>${p.name}<br><b>${money(p.price)}</b><s>${money(p.old)}</s></p></li>`).join("");
  $("#recommended").innerHTML = card(byId(5));

  // Fashion grid filtering
  let filter = "all", query = "";
  const renderFashion = () => {
    const q = query.toLowerCase();
    const list = PRODUCTS.filter((p) => (filter === "all" || p.cat === filter) && (!q || p.name.toLowerCase().includes(q)));
    $("#fashionGrid").innerHTML = list.length ? list.slice(0, 9).map(card).join("") : '<p class="empty-note">Hech narsa topilmadi 😕</p>';
    $$("[data-cat]").forEach((el) => el.classList.toggle("active", el.dataset.cat === filter));
  };
  const setFilter = (f, scroll = true) => {
    filter = f; query = "";
    renderFashion();
    if (scroll) $("#fashion").scrollIntoView({ behavior: "smooth" });
  };
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) { allcats.classList.remove("open"); toggleMenu(false); setFilter(c.dataset.cat); }
    const link = e.target.closest("[data-cat-link]");
    if (link) { e.preventDefault(); setFilter(link.dataset.catLink); }
  });
  $("#resetFilter").addEventListener("click", () => setFilter("all", false));
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    filter = $("#searchCat").value;
    query = $("#searchInput").value.trim();
    renderFashion();
    $("#fashion").scrollIntoView({ behavior: "smooth" });
  });
  renderFashion();

  // Cart & wishlist
  const drawer = $("#drawer"), overlay = $("#overlay");
  let mode = "cart";
  const cartTotal = () => Object.entries(cart).reduce((s, [id, q]) => s + byId(+id).price * q, 0);
  const updateBadges = () => {
    $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
    $("#cartSum").textContent = money(cartTotal());
    $("#wishCount").textContent = wish.length;
  };
  const renderDrawer = () => {
    $("#drawerTitle").textContent = mode === "cart" ? "Savat" : "Sevimlilar";
    $("#drawerFoot").hidden = mode !== "cart";
    const list = $("#drawerList");
    if (mode === "wish") {
      list.innerHTML = wish.length ? wish.map((id) => { const p = byId(id); return `<li><img src="${IMG(p.img, 120)}" alt=""><div>${p.name}<small>${money(p.price)}</small></div><button class="rm" data-add="${id}" aria-label="Savatga">🛒</button></li>`; }).join("") : '<li class="empty">Sevimlilar ro\'yxati bo\'sh</li>';
      return;
    }
    const ids = Object.keys(cart);
    list.innerHTML = ids.length ? ids.map((id) => { const p = byId(+id); return `<li><img src="${IMG(p.img, 120)}" alt=""><div>${p.name}<small>${money(p.price)}</small><div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div></div><button class="rm" data-rm="${id}" aria-label="O'chirish">×</button></li>`; }).join("") : '<li class="empty">Savat bo\'sh 🛍️</li>';
    $("#drawerTotal").textContent = money(cartTotal());
  };
  const save = () => { store.set("ba-cart", cart); store.set("ba-wish", wish); updateBadges(); if (drawer.classList.contains("open")) renderDrawer(); };
  const openDrawer = (m) => { mode = m; renderDrawer(); drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#cartBtn").addEventListener("click", () => openDrawer("cart"));
  $("#wishBtn").addEventListener("click", () => openDrawer("wish"));
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); toggleMenu(false); } });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = +add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      save(); bump($("#cartBtn"));
      if (add.classList.contains("add")) { add.classList.add("added"); add.textContent = "Qo'shildi ✓"; setTimeout(() => { add.classList.remove("added"); add.textContent = "Savatga"; }, 1300); }
      notify(`🛒 "${byId(id).name}" savatga qo'shildi`);
    }
    const w = e.target.closest("[data-wish]");
    if (w) {
      const id = +w.dataset.wish;
      wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
      $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", wish.includes(id)));
      save(); bump($("#wishBtn"));
    }
  });
  $("#drawerList").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc]++;
    else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; }
    else if (t.dataset.rm) delete cart[t.dataset.rm];
    else return;
    save();
  });
  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(cart).length) return notify("Savat bo'sh");
    cart = {}; save(); closeDrawer();
    notify("✔ Buyurtmangiz qabul qilindi! Operator tez orada bog'lanadi.");
  });
  updateBadges();

  // Hero slider
  const slides = $$(".slide"), dotsBox = $("#sliderDots");
  let cur = 0, timer;
  dotsBox.innerHTML = slides.map((_, i) => `<button aria-label="${i + 1}-slayd"></button>`).join("");
  const dots = $$("button", dotsBox);
  const go = (i) => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === cur));
    dots.forEach((d, k) => d.classList.toggle("active", k === cur));
    clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  $("#slidePrev").addEventListener("click", () => go(cur - 1));
  $("#slideNext").addEventListener("click", () => go(cur + 1));
  go(0);

  // Countdown to end of today
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const now = new Date(), end = new Date(now); end.setHours(23, 59, 59, 999);
    const d = end - now + 2 * 864e5;
    $('[data-t="d"]').textContent = pad(Math.floor(d / 864e5));
    $('[data-t="h"]').textContent = pad(Math.floor(d / 36e5) % 24);
    $('[data-t="m"]').textContent = pad(Math.floor(d / 6e4) % 60);
    $('[data-t="s"]').textContent = pad(Math.floor(d / 1e3) % 60);
  };
  tick(); setInterval(tick, 1000);

  // Active nav link
  const links = $$("a", nav);
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });

  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("✔ Obuna bo'ldingiz!"); });
  $("#year").textContent = new Date().getFullYear();
});
