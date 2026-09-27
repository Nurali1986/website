const SERVICES = [
  { icon: "🔬", name: "Videoendoskopiya", text: "Burun, tomoq va hiqildoqni ekranda ko'rib, aniq tashxis.", price: 250000, organ: 1 },
  { icon: "👂", name: "Audiometriya", text: "Eshitish qobiliyatini kompyuterda tekshirish.", price: 180000, organ: 0 },
  { icon: "💧", name: "Quloqni yuvish", text: "Oltingugurt tiqinini og'riqsiz olib tashlash.", price: 120000, organ: 0 },
  { icon: "🌬️", name: "Sinusit davolash", text: "Punksiyasiz, zamonaviy \"kukushka\" usuli.", price: 200000, organ: 1 },
  { icon: "🗣️", name: "Tonzillit va ovoz", text: "Bodomcha bezlari va ovoz boylamlarini davolash.", price: 180000, organ: 2 },
  { icon: "🧒", name: "Bolalar LOR", text: "Adenoid, otit — bolalarga mos muloyim yondashuv.", price: 200000, organ: 0 },
];

const SYMPTOMS = [
  ["Quloq og'rig'i", 0], ["Eshitish pasaygan", 0], ["Quloqda shovqin", 0], ["Bosh aylanishi", 0],
  ["Burun bitishi", 1], ["Burundan suyuqlik", 1], ["Hid sezmaslik", 1], ["Peshona/yuz og'rig'i", 1], ["Xurrak", 1],
  ["Tomoq og'rig'i", 2], ["Ovoz xirillashi", 2], ["Yutinish qiyin", 2], ["Harorat 38°+", 3],
];
const ADVICE = [
  { title: "👂 Quloq tekshiruvi tavsiya etiladi", items: ["Otoskopiya — quloqni ko'rik", "Audiometriya — eshitish testi", "Kerak bo'lsa: timpanometriya"] },
  { title: "👃 Burun va sinuslar tekshiruvi", items: ["Videoendoskopiya", "Sinuslar rentgeni yoki KT (kerak bo'lsa)", "Allergolog maslahati (surunkali holatda)"] },
  { title: "🗣️ Tomoq va hiqildoq ko'rigi", items: ["Faringoskopiya", "Hiqildoq endoskopiyasi", "Kerak bo'lsa: surtma tahlili"] },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";

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

  // Services, prices, booking options
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `<article class="svc reveal" data-svc="${i}"><span>${s.icon}</span><h3>${s.name}</h3><p>${s.text}</p></article>`).join("");
  $("#priceList").innerHTML = [["Birlamchi konsultatsiya", 150000], ["Takroriy qabul (14 kun ichida)", 80000], ...SERVICES.map((s) => [s.name, s.price])].map(([n, p]) => `<div class="price-row"><span>${n}</span><b>${money(p)}</b></div>`).join("");
  $("#bookService").innerHTML = ["Birlamchi konsultatsiya", ...SERVICES.map((s) => s.name)].map((n) => `<option>${n}</option>`).join("");

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
    const step = (now) => { const p = Math.min((now - start) / 1700, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.4 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Symptom checker
  const picked = new Set();
  $("#symptoms").innerHTML = SYMPTOMS.map(([n], i) => `<button type="button" data-sym="${i}" aria-pressed="false">${n}</button>`).join("");
  const renderAdvice = () => {
    if (!picked.size) { $("#advice").innerHTML = '<p class="muted">👆 Kamida bitta belgini tanlang</p>'; return; }
    const groups = new Set([...picked].map((i) => SYMPTOMS[i][1]).filter((g) => g < 3));
    const fever = [...picked].some((i) => SYMPTOMS[i][1] === 3);
    const blocks = [...groups].map((g) => `<h3>${ADVICE[g].title}</h3><ul>${ADVICE[g].items.map((x) => `<li>✓ ${x}</li>`).join("")}</ul>`).join("") || "<h3>🩺 Umumiy LOR ko'rigi tavsiya etiladi</h3>";
    $("#advice").innerHTML = blocks + (fever ? '<p class="warn">⚠️ Yuqori harorat bo\'lsa, qabulni kechiktirmang.</p>' : "") + '<button class="btn btn--navy" id="adviceBook" style="margin-top:10px">Shu tekshiruvga yozilish ↗</button>';
    $("#adviceBook").addEventListener("click", () => openBook());
  };
  $("#symptoms").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sym]");
    if (!b) return;
    const i = +b.dataset.sym;
    picked.has(i) ? picked.delete(i) : picked.add(i);
    b.classList.toggle("on", picked.has(i));
    b.setAttribute("aria-pressed", picked.has(i));
    renderAdvice();
  });

  // Organ cards jump to the checker with matching symptoms
  $$("[data-organ]").forEach((c) => c.addEventListener("click", () => {
    const g = +c.dataset.organ;
    picked.clear();
    SYMPTOMS.forEach(([, grp], i) => { if (grp === g && picked.size < 2) picked.add(i); });
    $$("#symptoms button").forEach((b) => { const on = picked.has(+b.dataset.sym); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    renderAdvice();
    $("#check").scrollIntoView({ behavior: "smooth" });
  }));

  // Booking
  const modal = $("#modal"), form = $("#bookForm"), success = $("#bookSuccess"), date = $("#bookDate");
  date.min = new Date().toISOString().split("T")[0];
  function openBook(i) {
    form.hidden = false; success.hidden = true;
    if (typeof i === "number") $("#bookService").selectedIndex = i + 1;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => openBook()));
  $("#servicesGrid").addEventListener("click", (e) => { const s = e.target.closest("[data-svc]"); if (s) openBook(+s.dataset.svc); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new Date(date.value);
    if (d.getDay() === 0) return notify("Yakshanba — dam olish kuni. Boshqa sanani tanlang.");
    form.hidden = true; success.hidden = false; form.reset();
  });

  $("#year").textContent = new Date().getFullYear();
});
