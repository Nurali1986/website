const AREAS = [
  { icon: "👪", name: "Oilaviy huquq", text: "Nikoh, ajrim va farzand bilan bog'liq nizolar.", items: ["Ajrashish va mol-mulk taqsimoti", "Aliment undirish", "Farzand yashash joyini belgilash"] },
  { icon: "🏠", name: "Uy-joy va mulk", text: "Ko'chmas mulk bitimlarini xavfsiz qilish.", items: ["Oldi-sotdi shartnomasini tekshirish", "Kadastr va ro'yxatga olish", "Ijara nizolari"] },
  { icon: "📜", name: "Meros", text: "Merosni rasmiylashtirish va nizolarni hal qilish.", items: ["Vasiyatnoma tuzish", "Meros ulushini aniqlash", "Merosni sud orqali qabul qilish"] },
  { icon: "💼", name: "Biznes huquqi", text: "Tadbirkorlar uchun doimiy yuridik hamkor.", items: ["MChJ ochish va ustav", "Shartnomalar ekspertizasi", "Qarzdorlikni undirish"] },
  { icon: "🛡", name: "Jinoiy ishlar", text: "Tergov va sudning barcha bosqichlarida himoya.", items: ["Tergovda ishtirok", "Sudda himoya", "Apellyatsiya va kassatsiya"] },
  { icon: "👷", name: "Mehnat nizolari", text: "Xodim va ish beruvchi huquqlarini himoya qilish.", items: ["Noqonuniy bo'shatish", "Ish haqi undirish", "Mehnat shartnomasi"] },
];

// duty/fee in BHM (bazaviy hisoblash miqdori); pct = share of contract value
const BHM = 375000;
const DOCS = [
  { name: "Ishonchnoma (oddiy)", duty: 0.1, fee: 0.4 },
  { name: "Ishonchnoma (avtomobil)", duty: 0.5, fee: 0.8 },
  { name: "Hujjat nusxasini tasdiqlash (1 bet)", duty: 0.01, fee: 0.05 },
  { name: "Tarjima to'g'riligini tasdiqlash", duty: 0.05, fee: 0.3 },
  { name: "Vasiyatnoma", duty: 0.2, fee: 1 },
  { name: "Uy-joy oldi-sotdisi", pct: 0.01, fee: 3, value: true },
  { name: "Avtomobil oldi-sotdisi", pct: 0.01, fee: 1.5, value: true },
  { name: "Hadya shartnomasi", pct: 0.005, fee: 2, value: true },
  { name: "Merosga guvohnoma", pct: 0.005, fee: 2, value: true },
];

const FAQ = [
  ["Birinchi konsultatsiya pullikmi?", "Birinchi 15 daqiqa bepul — vaziyatni tinglab, qaysi yo'nalishda harakat qilish kerakligini aytaman. To'liq konsultatsiya (60 daqiqa) — 400 000 so'm."],
  ["Aytgan gaplarim sir saqlanadimi?", "Ha. Advokatlik siri qonun bilan himoyalangan — sizning roziligingizsiz hech kimga, jumladan, davlat organlariga ham ma'lumot berilmaydi."],
  ["Sudsiz hal qilish mumkinmi?", "Ko'p hollarda — ha. Men har doim avval muzokara va kelishuv bitimini taklif qilaman: bu tezroq va arzonroq."],
  ["Xizmat narxi qanday belgilanadi?", "Ishning murakkabligi va vaqtiga qarab. Narx oldindan yozma shartnomada qayd etiladi — kutilmagan to'lovlar bo'lmaydi."],
  ["Boshqa shahardan murojaat qilsam bo'ladimi?", "Albatta. Onlayn konsultatsiya va hujjatlarni elektron ko'rib chiqish mumkin; zarur bo'lsa, sudga o'zim boraman."],
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => Math.round(n).toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";

  // Header / menu
  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
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
  $("#practiceGrid").innerHTML = AREAS.map((a, i) => `<article class="area reveal" data-area="${i}"><span class="area__num">0${i + 1}</span><span class="area__icon">${a.icon}</span><h3>${a.name}</h3><p>${a.text}</p><ul>${a.items.map((x) => `<li>${x}</li>`).join("")}</ul><em>MASLAHAT OLISH →</em></article>`).join("");
  $("#faqList").innerHTML = FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
  $("#topic").innerHTML = [...AREAS.map((a) => a.name), "Notarial xizmat", "Boshqa"].map((n) => `<option>${n}</option>`).join("");

  // Only one FAQ open at a time
  $$("#faqList details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) $$("#faqList details").forEach((o) => { if (o !== d) o.open = false; });
  }));

  // Notary calculator
  const type = $("#docType"), value = $("#docValue");
  type.innerHTML = DOCS.map((d, i) => `<option value="${i}">${d.name}</option>`).join("");
  const calc = () => {
    const d = DOCS[type.value];
    $("#valueWrap").hidden = !d.value;
    const v = Math.max(0, +value.value || 0);
    const duty = d.value ? v * d.pct : d.duty * BHM;
    let fee = d.fee * BHM;
    if ($("#urgent").checked) fee *= 1.5;
    const visit = $("#visit").checked ? 300000 : 0;
    $("#outDuty").textContent = money(duty);
    $("#outFee").textContent = money(fee + visit);
    $("#outTotal").textContent = money(duty + fee + visit);
  };
  $("#calcForm").addEventListener("input", calc);
  $("#calcForm").addEventListener("change", calc);
  calc();

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + "ms"; revealer.observe(el); });
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (t) => { const p = Math.min((t - start) / 1800, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Consultation modal
  const modal = $("#modal"), form = $("#consultForm"), success = $("#consultSuccess");
  const open = (topic) => {
    form.hidden = false; success.hidden = true;
    if (topic) $("#topic").value = topic;
    $("#modalTitle").textContent = topic === "Notarial xizmat" ? "Notariusga yozilish" : "Konsultatsiyaga yozilish";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-consult]").forEach((b) => b.addEventListener("click", () => open(b.dataset.consult === "notary" ? "Notarial xizmat" : null)));
  $("#practiceGrid").addEventListener("click", (e) => { const a = e.target.closest("[data-area]"); if (a) open(AREAS[a.dataset.area].name); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  $("#year").textContent = new Date().getFullYear();
});
