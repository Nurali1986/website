const IMG = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const SERVICES = [
  { icon: "✨", name: "Tish oqartirish", text: "Zoom texnologiyasi — 60 daqiqada 8 tongacha oqroq.", from: "1 200 000 so'm" },
  { icon: "🦷", name: "Implantatsiya", text: "Shveytsariya implantlari, 10 yil kafolat.", from: "4 500 000 so'm" },
  { icon: "😬", name: "Breket va elayner", text: "Tishlarni tekislash — ko'rinmas elaynerlar ham bor.", from: "6 000 000 so'm" },
  { icon: "🪥", name: "Professional tozalash", text: "Ultratovush + Air Flow, tosh va dog'larsiz.", from: "350 000 so'm" },
  { icon: "🩹", name: "Karies davolash", text: "Og'riqsiz, zamonaviy fotopolimer plomba.", from: "400 000 so'm" },
  { icon: "👑", name: "Vinir va koronka", text: "Keramik vinirlar bilan Gollivud tabassumi.", from: "3 000 000 so'm" },
];

const CALC = [
  { name: "Ko'rik va konsultatsiya", note: "Bepul", price: 0, fixed: true },
  { name: "Panoramik rentgen", note: "50% chegirma", price: 75000, fixed: true },
  { name: "Professional tozalash", note: "Butun og'iz", price: 350000, fixed: true },
  { name: "Tish oqartirish (Zoom)", note: "1 seans", price: 1200000, fixed: true },
  { name: "Karies plomba", note: "1 tish", price: 400000 },
  { name: "Implant (koronka bilan)", note: "1 tish", price: 6500000 },
  { name: "Keramik vinir", note: "1 tish", price: 3000000 },
];

const CASES = [
  { img: "1609840114035-3c981b782dfe", note: "💡 Oqartirish: 1 seans, 60 daqiqa, sezuvchanliksiz." },
  { img: "1598256989800-fe5f95da9787", note: "💡 Elayner: 9 oy davomida ko'rinmas kapalar bilan tekislandi." },
  { img: "1606811841689-23dfddce3e95", note: "💡 Professional tozalash: tosh va choy dog'lari 40 daqiqada." },
];

const FAQ = [
  ["Davolash og'riqlimi?", "Yo'q. Kompyuterli anesteziya tizimi ishlatiladi — ukol deyarli sezilmaydi. Bolalar uchun oldin og'riqsizlantiruvchi gel qo'yiladi."],
  ["Implant qancha vaqtga yetadi?", "To'g'ri parvarishda umrbod xizmat qiladi. Implantlarga 10 yillik rasmiy kafolat beraman."],
  ["Oqartirish tishga zarar qiladimi?", "Zoom tizimi emalga zarar bermaydi. Protseduradan so'ng remineralizatsiya geli qo'yiladi."],
  ["Bo'lib to'lash mumkinmi?", "Ha, 6 oygacha 0% ustama bilan bo'lib to'lash mavjud. Uzcard va Humo kartalari qabul qilinadi."],
  ["Bolalarni ham qabul qilasizmi?", "Albatta, 3 yoshdan boshlab. Birinchi tashrif — tanishuv va o'yin, qo'rquvsiz."],
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";

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

  // Content
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `<article class="svc reveal" data-svc="${i}"><span class="svc__icon">${s.icon}</span><div><h3>${s.name}</h3><p>${s.text}</p><em>${s.from} dan</em></div></article>`).join("");
  $("#faqList").innerHTML = FAQ.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("");

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; revealer.observe(el); });
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (now) => { const p = Math.min((now - start) / 1600, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Before / after slider
  const ba = $("#ba"), range = $("#baRange"), before = $("#baBefore"), handle = $("#baHandle"), beforeImg = $("#baBeforeImg");
  const syncWidth = () => { beforeImg.style.width = ba.clientWidth + "px"; };
  const setPos = (v) => { before.style.width = v + "%"; handle.style.left = v + "%"; };
  range.addEventListener("input", () => setPos(range.value));
  window.addEventListener("resize", syncWidth);
  syncWidth();
  const showCase = (i) => {
    $$("#caseTabs button").forEach((b) => b.classList.toggle("active", +b.dataset.case === i));
    $("#baAfter").src = IMG(CASES[i].img);
    beforeImg.src = IMG(CASES[i].img);
    $("#caseNote").textContent = CASES[i].note;
    range.value = 50; setPos(50);
  };
  $("#caseTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showCase(+b.dataset.case); });
  showCase(0);

  // Price calculator
  const state = CALC.map(() => ({ on: false, qty: 1 }));
  state[0].on = true;
  $("#calcList").innerHTML = CALC.map((c, i) => `
    <div class="calc-row">
      <input type="checkbox" id="c${i}" ${state[i].on ? "checked" : ""} data-i="${i}">
      <label for="c${i}"><b>${c.name}</b><small>${c.note}</small></label>
      ${c.fixed ? "<span></span>" : `<div class="qty"><button type="button" data-dec="${i}" aria-label="Kamaytirish">−</button><span id="q${i}">1</span><button type="button" data-inc="${i}" aria-label="Ko'paytirish">+</button></div>`}
      <em>${c.price ? money(c.price) : "Bepul"}</em>
    </div>`).join("");
  const renderTotal = () => {
    let sum = 0;
    const lines = [];
    state.forEach((s, i) => {
      if (!s.on) return;
      const cost = CALC[i].price * s.qty;
      sum += cost;
      lines.push(`<p><span>${CALC[i].name}${s.qty > 1 ? " × " + s.qty : ""}</span><span>${cost ? money(cost) : "Bepul"}</span></p>`);
    });
    $("#calcSum").textContent = money(sum);
    $("#calcLines").innerHTML = lines.join("") || '<p class="muted">Hali hech narsa tanlanmadi</p>';
    const inst = $("#installment").checked && sum > 0;
    $("#monthly").hidden = !inst;
    if (inst) $("#monthly").textContent = `≈ ${money(Math.ceil(sum / 6 / 1000) * 1000)} / oyiga`;
  };
  $("#calcList").addEventListener("change", (e) => { const i = e.target.dataset.i; if (i !== undefined) { state[i].on = e.target.checked; renderTotal(); } });
  $("#calcList").addEventListener("click", (e) => {
    const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
    const i = inc ?? dec;
    if (i === undefined) return;
    state[i].qty = Math.max(1, Math.min(28, state[i].qty + (inc !== undefined ? 1 : -1)));
    state[i].on = true;
    $("#c" + i).checked = true;
    $("#q" + i).textContent = state[i].qty;
    renderTotal();
  });
  $("#installment").addEventListener("change", renderTotal);
  renderTotal();

  // Booking
  const modal = $("#modal"), form = $("#bookForm"), success = $("#bookSuccess");
  const reasons = ["Oqartirish", "Implant", "Breket / elayner", "Bepul ko'rik", "Tish og'rig'i", "Bepul ko'rik"];
  const openBook = (i) => {
    form.hidden = false; success.hidden = true;
    if (typeof i === "number") $("#bookReason").value = reasons[i];
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => openBook()));
  $("#servicesGrid").addEventListener("click", (e) => { const s = e.target.closest("[data-svc]"); if (s) openBook(+s.dataset.svc); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  $("#year").textContent = new Date().getFullYear();
});
