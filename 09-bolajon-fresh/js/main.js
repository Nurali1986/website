const IMG = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const FREE_SHIPPING = 200000;

const CATS = [
  { id: "sabzavot", name: "Sabzavotlar", img: "1518843875459-f738682238a6" },
  { id: "meva", name: "Mevalar", img: "1619566636858-adf3ef46400b" },
  { id: "kokat", name: "Ko'katlar", img: "1576045057995-568f588f82fb" },
  { id: "sut", name: "Sut va tuxum", img: "1550583724-b2692b85b150" },
  { id: "yongoq", name: "Yong'oqlar", img: "1508061253366-f7da158b6d46" },
  { id: "non", name: "Non mahsulotlari", img: "1509440159596-0249088772ff" },
];

const PRODUCTS = [
  { id: 1, name: "Organik pomidor", cat: "sabzavot", img: "1592924357228-91a4daadcfea", price: 18000, old: 24000, unit: "kg" },
  { id: 2, name: "Yangi sabzi", cat: "sabzavot", img: "1598170845058-32b9d6a5da37", price: 7000, old: 9000, unit: "kg" },
  { id: 3, name: "Yashil ismaloq", cat: "kokat", img: "1576045057995-568f588f82fb", price: 6000, unit: "bog'" },
  { id: 4, name: "Qizil olma", cat: "meva", img: "1560806887-1e4cd0b6cbd6", price: 16000, unit: "kg" },
  { id: 5, name: "Ferma tuxumi (10 dona)", cat: "sut", img: "1582722872445-44dc5f7e3c8f", price: 19000, unit: "quti" },
  { id: 6, name: "Banan", cat: "meva", img: "1571771894821-ce9b6c11b08e", price: 22000, unit: "kg" },
  { id: 7, name: "Tarvuz", cat: "meva", img: "1587049352846-4a222e784d38", price: 4000, old: 5500, unit: "kg" },
  { id: 8, name: "Qulupnay", cat: "meva", img: "1601004890684-d8cbf643f5f2", price: 45000, unit: "kg" },
  { id: 9, name: "Tabiiy sut 1 l", cat: "sut", img: "1550583724-b2692b85b150", price: 13000, unit: "dona" },
  { id: 10, name: "Qattiq pishloq", cat: "sut", img: "1486297678162-eb2a19b0a32d", price: 95000, unit: "kg" },
  { id: 11, name: "Bodom", cat: "yongoq", img: "1508061253366-f7da158b6d46", price: 120000, old: 140000, unit: "kg" },
  { id: 12, name: "Javdar noni", cat: "non", img: "1509440159596-0249088772ff", price: 9000, unit: "dona" },
  { id: 13, name: "Mandarin", cat: "meva", img: "1557800636-894a64c1696f", price: 20000, unit: "kg" },
  { id: 14, name: "Yangi bodring", cat: "sabzavot", img: "1464226184884-fa280b87c399", price: 12000, unit: "kg" },
  { id: 15, name: "Ziravorlar to'plami", cat: "kokat", img: "1596040033229-a9821ebd058d", price: 35000, unit: "to'plam" },
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
  let cart = store.get("bf-cart", {});
  let favs = store.get("bf-favs", []);

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2500); };
  $$("[data-toast]").forEach((b) => b.addEventListener("click", () => notify(b.dataset.toast)));
  const bump = (el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

  // Header / menu / search
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
  $("#searchToggle").addEventListener("click", () => {
    const open = $("#searchbar").classList.toggle("open");
    if (open) setTimeout(() => $("#searchInput").focus(), 200);
  });

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el) => revealer.observe(el));
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (now) => { const p = Math.min((now - start) / 1500, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Categories
  $("#cats").innerHTML = CATS.map((c) => `<button class="cat" data-cat="${c.id}"><img src="${IMG(c.img, 400)}" alt="${c.name}" loading="lazy"><b>${c.name}</b><small>${PRODUCTS.filter((p) => p.cat === c.id).length * 20}+ mahsulot</small></button>`).join("");

  // Products
  let filter = "all", query = "";
  const off = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
  const render = () => {
    const q = query.toLowerCase();
    const list = PRODUCTS.filter((p) => (filter === "all" || p.cat === filter) && (!q || p.name.toLowerCase().includes(q)));
    $("#products").innerHTML = list.length ? list.map((p) => `
      <article class="product">
        ${off(p) ? `<span class="product__off">-${off(p)}%</span>` : ""}
        <button class="product__fav ${favs.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Sevimlilarga"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg></button>
        <div class="product__img"><img src="${IMG(p.img, 400)}" alt="${p.name}" loading="lazy"></div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)} <small>/ ${p.unit}</small>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
        <button class="add" data-add="${p.id}">Savatga</button>
      </article>`).join("") : '<p class="empty-note">Hech narsa topilmadi 🥲</p>';
    const cat = CATS.find((c) => c.id === filter);
    $("#picksTitle").textContent = q ? `"${query}" bo'yicha natijalar` : cat ? cat.name : "Siz uchun tanlanganlar";
    $$(".cat").forEach((c) => c.classList.toggle("active", c.dataset.cat === filter));
  };
  render();
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) { filter = c.dataset.cat; query = ""; $("#searchInput").value = ""; render(); $("#picks").scrollIntoView({ behavior: "smooth" }); }
  });
  $("#searchInput").addEventListener("input", (e) => {
    query = e.target.value.trim(); filter = "all"; render();
    if (query) $("#picks").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const track = $("#products");
  const stepPx = () => (track.querySelector(".product")?.offsetWidth || 200) + 16;
  $("#pPrev").addEventListener("click", () => track.scrollBy({ left: -stepPx() }));
  $("#pNext").addEventListener("click", () => {
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    end ? track.scrollTo({ left: 0 }) : track.scrollBy({ left: stepPx() });
  });

  // Cart
  const drawer = $("#drawer"), overlay = $("#overlay");
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + byId(+id).price * q, 0);
  const renderCart = () => {
    const ids = Object.keys(cart);
    $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
    $("#drawerList").innerHTML = ids.length ? ids.map((id) => { const p = byId(+id); return `<li><img src="${IMG(p.img, 120)}" alt=""><div>${p.name}<small>${money(p.price)} / ${p.unit}</small><div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div></div><button class="rm" data-rm="${id}" aria-label="O'chirish">×</button></li>`; }).join("") : '<li class="empty">Savat hozircha bo\'sh 🧺</li>';
    const t = total();
    $("#drawerTotal").textContent = money(t);
    const left = FREE_SHIPPING - t;
    $("#freeText").textContent = left > 0 ? `Bepul yetkazish uchun yana ${money(left)}` : "🎉 Sizga bepul yetkazib berish!";
    $("#freeBar").style.width = Math.min(100, (t / FREE_SHIPPING) * 100) + "%";
    store.set("bf-cart", cart);
  };
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = +add.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      renderCart(); bump($("#cartBtn"));
      add.classList.add("added"); add.textContent = "✓ Qo'shildi";
      setTimeout(() => { add.classList.remove("added"); add.textContent = "Savatga"; }, 1200);
      notify(`🧺 ${byId(id).name} savatga qo'shildi`);
    }
    const f = e.target.closest("[data-fav]");
    if (f) {
      const id = +f.dataset.fav;
      favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
      f.classList.toggle("on", favs.includes(id));
      store.set("bf-favs", favs);
    }
  });
  $("#drawerList").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc]++;
    else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; }
    else if (t.dataset.rm) delete cart[t.dataset.rm];
    else return;
    renderCart();
  });
  const openCart = () => { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#cartBtn").addEventListener("click", openCart);
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeCart));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); toggleMenu(false); } });
  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(cart).length) return notify("Savat bo'sh 🧺");
    cart = {}; renderCart(); closeCart();
    notify("✔ Buyurtma qabul qilindi! 2 soat ichida yetkazamiz 🚚");
  });
  renderCart();

  // Deal timer: counts down to midnight
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    const d = end - now;
    $("#dealTimer").textContent = `${pad(Math.floor(d / 36e5))}:${pad(Math.floor(d / 6e4) % 60)}:${pad(Math.floor(d / 1e3) % 60)}`;
  };
  tick(); setInterval(tick, 1000);

  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("✔ Obuna bo'ldingiz! 🍃"); });
  $("#year").textContent = new Date().getFullYear();
});
