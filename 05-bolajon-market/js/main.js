const IMG = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const CATEGORIES = [
  { id: "yozuv", name: "Yozuv qurollari", img: "1452860606245-08befc0ff44b" },
  { id: "daftar", name: "Daftar va bloknotlar", img: "1531346878377-a5be20888e57" },
  { id: "sumka", name: "Ryukzak va sumkalar", img: "1553062407-98eeb64c6a62" },
  { id: "texnika", name: "Ofis texnikasi", img: "1612815154858-60aa4c59eaa6" },
  { id: "mebel", name: "Ofis mebeli", img: "1580480055273-228ff5388ef8" },
  { id: "kitob", name: "Kitoblar", img: "1497633762265-9d179a990aa6" },
  { id: "stol", name: "Ish stoli", img: "1518455027359-f3f8164ba6bd" },
];

const PRODUCTS = [
  { id: 1, name: "Rangli qalamlar to'plami (24 dona)", cat: "yozuv", img: "1568205612837-017257d2310a", price: 45000, old: 59000, rating: 4.8, reviews: 1245, badge: "Xit" },
  { id: 2, name: "Maktab ryukzagi Navy", cat: "sumka", img: "1553062407-98eeb64c6a62", price: 289000, old: 349000, rating: 4.9, reviews: 1036, badge: "-17%" },
  { id: 3, name: "Spiral daftar A5, 100 varaq", cat: "daftar", img: "1581431886211-6b932f8367f2", price: 18000, rating: 4.7, reviews: 785, badge: "Yangi", isNew: true },
  { id: 4, name: "Ilmiy kalkulyator", cat: "texnika", img: "1587145820266-a5951ee6f620", price: 125000, old: 149000, rating: 4.6, reviews: 950, badge: "-16%" },
  { id: 5, name: "Ergonomik ofis kreslosi", cat: "mebel", img: "1592078615290-033ee584e267", price: 890000, old: 1090000, rating: 4.8, reviews: 645, badge: "-18%" },
  { id: 6, name: "Premium sharikli ruchka", cat: "yozuv", img: "1585336261022-680e295ce3fe", price: 65000, rating: 4.9, reviews: 432, badge: "Yangi", isNew: true },
  { id: 7, name: "Rangli lazer printer", cat: "texnika", img: "1612815154858-60aa4c59eaa6", price: 2450000, old: 2790000, rating: 4.7, reviews: 211 },
  { id: 8, name: "Yumshoq kutish kreslosi", cat: "mebel", img: "1580480055273-228ff5388ef8", price: 1250000, rating: 4.5, reviews: 98 },
  { id: 9, name: "Grafit qalamlar (12 dona)", cat: "yozuv", img: "1513542789411-b6a5d4f31634", price: 38000, old: 45000, rating: 4.8, reviews: 1520, badge: "-15%" },
  { id: 10, name: "Kanselyariya to'plami", cat: "yozuv", img: "1452860606245-08befc0ff44b", price: 75000, old: 99000, rating: 4.9, reviews: 870, badge: "-24%" },
  { id: 11, name: "Katak daftar, 96 varaq", cat: "daftar", img: "1531346878377-a5be20888e57", price: 12000, rating: 4.6, reviews: 2104 },
  { id: 12, name: "Eko xarid sumkasi", cat: "sumka", img: "1544816155-12df9643f363", price: 35000, rating: 4.4, reviews: 156, badge: "Yangi", isNew: true },
  { id: 13, name: "Klassik adabiyot to'plami", cat: "kitob", img: "1497633762265-9d179a990aa6", price: 210000, old: 260000, rating: 4.9, reviews: 312, badge: "-19%" },
  { id: 14, name: "Ish stoli to'plami", cat: "stol", img: "1518455027359-f3f8164ba6bd", price: 1690000, rating: 4.7, reviews: 76 },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/ |,/g, " ") + " so'm";
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  // Per-viewer persistence (optional)
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let cart = store.get("bm-cart", {});
  let wish = store.get("bm-wish", []);

  // Header
  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggleMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  const links = $$(".nav > .nav__link, .dropdown > .nav__link");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });

  // Toast
  const toast = $("#toast");
  let tTimer;
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tTimer);
    tTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };
  $$("[data-toast]").forEach((b) => b.addEventListener("click", () => notify(b.dataset.toast)));
  const bump = (el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

  // Categories (carousel + dropdown)
  const catTrack = $("#catTrack");
  catTrack.innerHTML = CATEGORIES.map((c) => `
    <button class="cat" data-cat="${c.id}"><div class="cat__img"><img src="${IMG(c.img, 300)}" alt="${c.name}" loading="lazy"></div><span>${c.name}</span></button>`).join("");
  $("#catMenu").innerHTML = CATEGORIES.map((c) => `<a href="#bestsellers" data-cat="${c.id}">${c.name}</a>`).join("");
  const step = () => catTrack.querySelector(".cat").offsetWidth + 20;
  $("#catPrev").addEventListener("click", () => catTrack.scrollBy({ left: -step() }));
  $("#catNext").addEventListener("click", () => {
    const end = catTrack.scrollLeft + catTrack.clientWidth >= catTrack.scrollWidth - 5;
    end ? catTrack.scrollTo({ left: 0 }) : catTrack.scrollBy({ left: step() });
  });
  $$("[data-cat]").forEach((el) => el.addEventListener("click", () => {
    setFilter(el.dataset.cat);
    $("#bestsellers").scrollIntoView({ behavior: "smooth" });
    toggleMenu(false);
  }));
  $(".dropdown > .nav__link").addEventListener("click", (e) => {
    if (window.innerWidth <= 920) { e.preventDefault(); e.currentTarget.parentElement.classList.toggle("open"); }
  });

  // Products grid with filter tabs
  const tabs = [{ id: "all", name: "Barchasi" }, { id: "sale", name: "Chegirmada" }, ...CATEGORIES.slice(0, 5)];
  $("#tabs").innerHTML = tabs.map((t) => `<button class="tab" data-tab="${t.id}">${t.name}</button>`).join("");
  let filter = "all";

  const card = (p) => `
    <article class="product">
      ${p.badge ? `<span class="product__badge ${p.isNew ? "product__badge--new" : ""}">${p.badge}</span>` : ""}
      <button class="product__wish ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Sevimlilarga"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg></button>
      <div class="product__img"><img src="${IMG(p.img)}" alt="${p.name}" loading="lazy"></div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <div class="rating">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <small>(${p.reviews.toLocaleString("ru-RU")})</small></div>
        <div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
        <button class="add" data-add="${p.id}"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg> Savatga</button>
      </div>
    </article>`;

  const renderProducts = () => {
    const list = PRODUCTS.filter((p) => filter === "all" || (filter === "sale" ? p.old : p.cat === filter));
    $("#products").innerHTML = list.length ? list.slice(0, 10).map(card).join("") : '<p class="empty-note">Bu kategoriyada hozircha mahsulot yo\'q.</p>';
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === filter));
  };
  const setFilter = (f) => {
    filter = f;
    renderProducts();
  };
  $("#tabs").addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) setFilter(t.dataset.tab); });
  $("[data-filter-sale]").addEventListener("click", () => setFilter("sale"));

  // Delegated product actions (grid + search)
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = +add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      saveCart();
      add.classList.add("added");
      add.lastChild.textContent = " Qo'shildi";
      setTimeout(() => { add.classList.remove("added"); add.lastChild.textContent = " Savatga"; }, 1400);
      notify(`🛒 "${byId(id).name}" savatga qo'shildi`);
    }
    const w = e.target.closest("[data-wish]");
    if (w) {
      const id = +w.dataset.wish;
      wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
      store.set("bm-wish", wish);
      w.classList.toggle("on", wish.includes(id));
      updateBadges();
      bump($("#wishBtn"));
      notify(wish.includes(id) ? "❤ Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi");
    }
  });

  // Drawer: cart / wishlist
  const drawer = $("#drawer"), overlay = $("#overlay");
  let drawerMode = "cart";
  const updateBadges = () => {
    $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
    $("#wishCount").textContent = wish.length;
  };
  const saveCart = () => {
    store.set("bm-cart", cart);
    updateBadges();
    bump($("#cartBtn"));
    if (drawer.classList.contains("open")) renderDrawer();
  };
  const renderDrawer = () => {
    const list = $("#drawerList");
    $("#drawerTitle").textContent = drawerMode === "cart" ? "Savat" : "Sevimlilar";
    $("#drawerFoot").hidden = drawerMode !== "cart";
    if (drawerMode === "wish") {
      list.innerHTML = wish.length ? wish.map((id) => {
        const p = byId(id);
        return `<li><img src="${IMG(p.img, 120)}" alt=""><div class="name">${p.name}<small>${money(p.price)}</small></div><button class="rm" data-add="${p.id}" aria-label="Savatga">🛒</button></li>`;
      }).join("") : '<li class="empty">Sevimlilar ro\'yxati bo\'sh</li>';
      return;
    }
    const ids = Object.keys(cart).map(Number);
    let total = 0;
    list.innerHTML = ids.length ? ids.map((id) => {
      const p = byId(id), q = cart[id];
      total += p.price * q;
      return `<li><img src="${IMG(p.img, 120)}" alt=""><div class="name">${p.name}<small>${money(p.price)}</small><div class="qty"><button data-dec="${id}" aria-label="Kamaytirish">−</button><span>${q}</span><button data-inc="${id}" aria-label="Ko'paytirish">+</button></div></div><button class="rm" data-rm="${id}" aria-label="O'chirish">×</button></li>`;
    }).join("") : '<li class="empty">Savat bo\'sh 🛍️</li>';
    $("#cartTotal").textContent = money(total);
    const left = 500000 - total;
    $("#shipHint").textContent = !ids.length ? "" : left > 0 ? `Bepul yetkazish uchun yana ${money(left)} xarid qiling` : "✔ Sizga bepul yetkazib berish!";
  };
  $("#drawerList").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc]++;
    else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; }
    else if (t.dataset.rm) delete cart[t.dataset.rm];
    else return;
    store.set("bm-cart", cart);
    updateBadges();
    renderDrawer();
  });
  const openDrawer = (mode) => {
    drawerMode = mode;
    renderDrawer();
    drawer.classList.add("open"); overlay.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  };
  const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#cartBtn").addEventListener("click", () => openDrawer("cart"));
  $("#wishBtn").addEventListener("click", () => openDrawer("wish"));
  $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", closeDrawer));
  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(cart).length) return notify("Savat bo'sh — avval mahsulot tanlang");
    cart = {};
    store.set("bm-cart", cart);
    updateBadges();
    closeDrawer();
    notify("✔ Buyurtmangiz qabul qilindi! Operator tez orada qo'ng'iroq qiladi.");
  });

  // Search overlay
  const search = $("#search"), input = $("#searchInput"), results = $("#searchResults");
  const renderSearch = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = '<li class="hint">Masalan: daftar, ruchka, kreslo</li>'; return; }
    const found = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || CATEGORIES.find((c) => c.id === p.cat).name.toLowerCase().includes(q));
    results.innerHTML = found.length ? found.map((p) => `<li data-add="${p.id}"><img src="${IMG(p.img, 120)}" alt=""><div class="meta">${p.name}<small>${money(p.price)}</small></div><b>+ 🛒</b></li>`).join("") : '<li class="hint">Hech narsa topilmadi 😕</li>';
  };
  const openSearch = () => { search.classList.add("open"); search.setAttribute("aria-hidden", "false"); renderSearch(); setTimeout(() => input.focus(), 50); };
  const closeSearch = () => { search.classList.remove("open"); search.setAttribute("aria-hidden", "true"); };
  $("#searchBtn").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", closeSearch);
  search.addEventListener("click", (e) => { if (e.target === search) closeSearch(); });
  input.addEventListener("input", renderSearch);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeSearch(); closeDrawer(); }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); openSearch(); }
  });

  // Countdown (ends in 3 days from first visit, persisted per viewer)
  let end = store.get("bm-sale-end", 0);
  if (!end || end < Date.now()) { end = Date.now() + 3 * 864e5 + 5 * 36e5; store.set("bm-sale-end", end); }
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const d = Math.max(0, end - Date.now());
    $('[data-t="d"]').textContent = pad(Math.floor(d / 864e5));
    $('[data-t="h"]').textContent = pad(Math.floor(d / 36e5) % 24);
    $('[data-t="m"]').textContent = pad(Math.floor(d / 6e4) % 60);
    $('[data-t="s"]').textContent = pad(Math.floor(d / 1e3) % 60);
  };
  tick();
  setInterval(tick, 1000);

  // Counters
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now();
      const stepFn = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU");
        if (p < 1) requestAnimationFrame(stepFn);
      };
      requestAnimationFrame(stepFn);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Reveal
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealer.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  $$(".reveal").forEach((el) => revealer.observe(el));

  // Newsletter
  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("✔ Obuna bo'ldingiz! Birinchi xaridga 10% promo-kod emailingizda."); });

  $("#year").textContent = new Date().getFullYear();
  renderProducts();
  updateBadges();
});
