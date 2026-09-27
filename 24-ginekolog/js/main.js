const SERVICES = [
  { icon: "🤰", name: "Homiladorlikni kuzatish", text: "Birinchi haftadan tug'ruqqacha — rejali ko'riklar, tahlillar va UZI.", price: "Paket: 3 900 000 so'm" },
  { icon: "🌱", name: "Homiladorlikni rejalashtirish", text: "Juftlik tekshiruvi, vitaminlar va sog'lom boshlanish.", price: "350 000 so'm dan" },
  { icon: "🩺", name: "Profilaktik ko'rik", text: "Yillik ko'rik, surtma, onkotsitologiya.", price: "250 000 so'm" },
  { icon: "🖥️", name: "Ginekologik UZI", text: "Kabinetning o'zida, ekspert klass apparatda.", price: "180 000 so'm" },
  { icon: "🌙", name: "Sikl buzilishlari", text: "Og'riqli yoki notekis sikl sabablarini aniqlash va davolash.", price: "300 000 so'm" },
  { icon: "🌸", name: "Menopauza davri", text: "Yengil o'tishi uchun zamonaviy yondashuv.", price: "300 000 so'm" },
];

const SIZES = [
  [4, "🌱", "ko'knori urug'i"], [6, "🫐", "no'xat donasi"], [8, "🍇", "malina"], [10, "🍓", "qulupnay"],
  [12, "🍋", "limon"], [14, "🍑", "shaftoli"], [16, "🥑", "avokado"], [20, "🍌", "banan"],
  [24, "🌽", "makkajo'xori"], [28, "🍆", "baqlajon"], [32, "🥥", "kokos"], [36, "🍈", "qovun"], [40, "🍉", "tarvuz"],
];
const VISITS = [[6, "Birinchi tashrif va tasdiqlovchi UZI"], [12, "1-skrining (UZI + qon tahlili)"], [20, "2-skrining, anatomik UZI"], [28, "Glyukoza testi, qon tahlili"], [32, "3-skrining, doppler"], [36, "Tug'ruqqa tayyorgarlik"], [40, "Taxminiy tug'ruq sanasi"]];

const FAQ = [
  ["Birinchi qabulga qachon kelish kerak?", "Test ijobiy bo'lgach 1–2 hafta ichida (homiladorlikning 5–7-haftasi). Rejalashtirish bosqichida esa — homiladorlikdan 3 oy oldin."],
  ["Qabul qancha vaqt oladi?", "Birlamchi qabul 40–60 daqiqa: suhbat, ko'rik va kerak bo'lsa UZI. Shoshilmasdan, barcha savollaringizga javob beraman."],
  ["Hamroh bilan kelsam bo'ladimi?", "Albatta. Turmush o'rtog'ingiz yoki onangiz UZI paytida yoningizda bo'lishi mumkin."],
  ["Ma'lumotlarim maxfiy saqlanadimi?", "Ha, tibbiy sir qonun bilan himoyalangan. Natijalar faqat sizga — shaxsan yoki shifrlangan kanal orqali beriladi."],
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const fmt = (d) => d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });

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
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `<article class="svc reveal" data-svc="${i}"><span>${s.icon}</span><h3>${s.name}</h3><p>${s.text}</p><em>${s.price}</em></article>`).join("");
  $("#faqList").innerHTML = FAQ.map(([q, a], i) => `<details ${i ? "" : "open"}><summary>${q}</summary><p>${a}</p></details>`).join("");
  $("#bookTopic").innerHTML = [...SERVICES.map((s) => s.name), "Boshqa"].map((n) => `<option>${n}</option>`).join("");

  // Pregnancy calculator
  const lmp = $("#lmp"), cycle = $("#cycle");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  lmp.max = today.toISOString().split("T")[0];
  lmp.min = new Date(today.getTime() - 300 * 864e5).toISOString().split("T")[0];
  cycle.addEventListener("input", () => ($("#cycleOut").textContent = cycle.value));
  $("#pregForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const start = new Date(lmp.value);
    const shift = (+cycle.value - 28) * 864e5;
    const due = new Date(start.getTime() + 280 * 864e5 + shift);
    const days = Math.floor((today - start - shift) / 864e5);
    if (days < 14) {
      $("#pregResult").innerHTML = `<div class="empty"><span>🌷</span><p>Homiladorlik hali juda erta bosqichda yoki sana xato kiritilgan. Test ijobiy bo'lsa, 1–2 haftadan so'ng qabulga keling.</p></div>`;
      return;
    }
    const week = Math.floor(days / 7), day = days % 7;
    const tri = week < 13 ? "1-trimestr" : week < 27 ? "2-trimestr" : "3-trimestr";
    const left = Math.max(0, Math.ceil((due - today) / 864e5));
    const size = [...SIZES].reverse().find(([w]) => week >= w) || SIZES[0];
    const nextIdx = VISITS.findIndex(([w]) => w > week);
    $("#pregResult").innerHTML = `
      <div class="ring" style="--p:${Math.min(100, (days / 280) * 100)}"><div><b>${Math.min(week, 42)}</b><small>hafta ${day ? "+ " + day + " kun" : ""}</small></div></div>
      <div class="res-grid"><div><small>Trimestr</small><b>${tri}</b></div><div><small>Tug'ruq sanasi</small><b>${fmt(due)}</b></div><div><small>Qoldi</small><b>${left} kun</b></div></div>
      <div class="fruit"><span>${size[1]}</span><p>Chaqaloq hozir taxminan <b>${size[2]}</b> kattaligida. ${week >= 20 ? "U tovushlarni eshitadi va harakatlari seziladi!" : "Barcha a'zolar shakllanmoqda."}</p></div>
      <ul class="visits">${VISITS.map(([w, t], i) => `<li class="${w <= week ? "done" : i === nextIdx ? "next" : ""}">${w}-hafta — ${t}</li>`).join("")}</ul>
      <button class="btn btn--rose btn--block" id="pregBook" style="margin-top:14px">Kuzatuvga yozilish</button>`;
    $("#pregBook").addEventListener("click", () => openBook("Homiladorlikni kuzatish"));
  });

  // Booking
  const modal = $("#modal"), form = $("#bookForm"), ok = $("#bookOk");
  $("#bookDate").min = today.toISOString().split("T")[0];
  function openBook(topic) {
    form.hidden = false; ok.hidden = true;
    if (topic) $("#bookTopic").value = topic;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => openBook()));
  $("#servicesGrid").addEventListener("click", (e) => { const s = e.target.closest("[data-svc]"); if (s) openBook(SERVICES[s.dataset.svc].name); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; ok.hidden = false; form.reset(); });

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
    const step = (t) => { const p = Math.min((t - start) / 1600, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  $("#year").textContent = new Date().getFullYear();
});
