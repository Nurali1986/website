const IMG = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PLANTS = [
  { name: "Aloe vera", type: "kaktus", img: "1509423350716-97f9360b4e09", price: 65000, light: "☀️ Yorug'", water: "💧 Haftada 1", tag: "Oson parvarish" },
  { name: "Mini sukkulent", type: "kaktus", img: "1485955900006-10f4d324d411", price: 45000, light: "☀️ Yorug'", water: "💧 2 haftada 1" },
  { name: "Kaktus (sopol tuvakda)", type: "kaktus", img: "1459411552884-841db9b3cc2a", price: 55000, light: "☀️ Quyosh", water: "💧 Oyda 2", tag: "Xit" },
  { name: "Fikus ko'chati", type: "uy", img: "1501004318641-b39e6451bec6", price: 120000, light: "🌤 Yarim soya", water: "💧 Haftada 2" },
  { name: "Bonsay daraxtchasi", type: "uy", img: "1512428813834-c702c7702b78", price: 390000, light: "🌤 Yorug'", water: "💧 Har kuni", tag: "Premium" },
  { name: "Potos (tilla lianasi)", type: "uy", img: "1591958911259-bee2173bdccc", price: 85000, light: "🌥 Soya", water: "💧 Haftada 1" },
  { name: "Buxus (shakl berilgan)", type: "bog", img: "1520412099551-62b6bafeb5bb", price: 290000, light: "☀️ Quyosh", water: "💧 Haftada 2" },
  { name: "Ko'chatlar to'plami (12 ta)", type: "bog", img: "1523348837708-15d4a09cfac2", price: 75000, light: "☀️ Quyosh", water: "💧 Har kuni", tag: "Yangi" },
];

const EVENTS = [
  { d: "04", m: "OKT", title: "Kuzgi ekish master-klassi", place: "Qibray bog'i · 10:00" },
  { d: "12", m: "OKT", title: "Urug' almashinuv bayrami", place: "Yunusobod · 11:00" },
  { d: "26", m: "OKT", title: "Uy o'simliklari parvarishi", place: "Onlayn · 19:00" },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";

  // Toast
  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2800); };

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

  // Reveal
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; revealer.observe(el); });

  // Events
  $("#eventsList").innerHTML = EVENTS.map((e, i) => `<li><span class="date">${e.d}<small>${e.m}</small></span><div><b>${e.title}</b><br><small>${e.place}</small></div><button data-join="${i}">Qatnashaman</button></li>`).join("");
  $("#eventsList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-join]");
    if (!b) return;
    const on = b.classList.toggle("joined");
    b.textContent = on ? "✓ Yozildingiz" : "Qatnashaman";
    if (on) notify(`🌱 "${EVENTS[b.dataset.join].title}" tadbiriga yozildingiz`);
  });

  // Plants shop
  const renderPlants = (f = "all") => {
    $("#plants").innerHTML = PLANTS.filter((p) => f === "all" || p.type === f).map((p) => `
      <article class="plant">
        <div class="plant__img"><img src="${IMG(p.img)}" alt="${p.name}" loading="lazy">${p.tag ? `<span class="plant__tag">${p.tag}</span>` : ""}</div>
        <h3>${p.name}</h3>
        <div class="plant__care"><span>${p.light}</span><span>${p.water}</span></div>
        <div class="plant__foot"><b>${money(p.price)}</b><button data-buy="${p.name}">Buyurtma</button></div>
      </article>`).join("");
  };
  renderPlants();
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#filters button").forEach((x) => x.classList.toggle("active", x === b));
    renderPlants(b.dataset.f);
  });
  $("#plants").addEventListener("click", (e) => {
    const b = e.target.closest("[data-buy]");
    if (!b) return;
    b.textContent = "✓ Qo'shildi";
    setTimeout(() => (b.textContent = "Buyurtma"), 1400);
    notify(`🪴 "${b.dataset.buy}" buyurtmaga qo'shildi. Menejer qo'ng'iroq qiladi.`);
  });

  // Quote modal with live estimate
  const modal = $("#modal"), form = $("#quoteForm"), success = $("#quoteSuccess");
  const svc = $("#qService"), area = $("#qArea");
  const calc = () => {
    $("#qAreaVal").textContent = area.value;
    $("#qPrice").textContent = money(+svc.value * +area.value);
  };
  svc.addEventListener("change", calc);
  area.addEventListener("input", calc);
  const openModal = (service) => {
    if (service) [...svc.options].forEach((o) => { if (o.text === service) svc.value = o.value; });
    form.hidden = false; success.hidden = true;
    calc();
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-quote]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openModal(b.dataset.quote); }));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  // Lightbox
  const lb = $("#lightbox"), lbImg = $("#lbImg"), items = $$(".g");
  let li = 0;
  const show = (i) => { li = (i + items.length) % items.length; lbImg.src = IMG(items[li].dataset.src, 1600); lbImg.alt = items[li].querySelector("img").alt; };
  items.forEach((g, i) => g.addEventListener("click", () => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }));
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => show(li - 1));
  $("#lbNext").addEventListener("click", () => show(li + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeLb(); toggleMenu(false); }
    if (lb.classList.contains("open") && e.key === "ArrowRight") show(li + 1);
    if (lb.classList.contains("open") && e.key === "ArrowLeft") show(li - 1);
  });

  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("🌿 Obuna bo'ldingiz! Mavsumiy maslahatlarni kuting."); });
  $("#year").textContent = new Date().getFullYear();
});
