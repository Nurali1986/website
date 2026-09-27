const SERVICES = [
  { icon: "💻", name: "Kompyuter diagnostikasi", text: "Skaner bilan xatoliklarni o'qish va tahlil.", from: "100 000" },
  { icon: "⚙️", name: "Motor ta'miri", text: "Kichik ta'mirdan kapital ta'mirgacha.", from: "500 000" },
  { icon: "🛢", name: "Moy va filtrlar", text: "Sintetik moy, havo va salon filtri.", from: "60 000" },
  { icon: "🛞", name: "Xodovoy qism", text: "Amortizator, richag, sharovoy, razval.", from: "150 000" },
  { icon: "🛑", name: "Tormoz tizimi", text: "Kolodka, disk, suyuqlik almashtirish.", from: "120 000" },
  { icon: "⚡", name: "Avtoelektrik", text: "Generator, starter, simlar, datchiklar.", from: "150 000" },
  { icon: "❄️", name: "Konditsioner", text: "Freon to'ldirish, germetiklikni tekshirish.", from: "180 000" },
  { icon: "🔁", name: "Karobka (AKPP/MKPP)", text: "Moy almashtirish, ta'mir, sozlash.", from: "300 000" },
];

const CLASSES = [
  { name: "Ekonom", text: "Spark, Nexia, Cobalt", k: 1 },
  { name: "O'rta", text: "Malibu, K5, Tucson", k: 1.3 },
  { name: "Premium / SUV", text: "Camry, Tahoe, BYD Song", k: 1.7 },
];

// base labour price (so'm) and time (hours)
const JOBS = [
  { name: "Kompyuter diagnostikasi", price: 100000, h: 0.5, diag: true },
  { name: "Moy + filtr almashtirish", price: 60000, h: 0.5 },
  { name: "Old tormoz kolodkalari", price: 120000, h: 1 },
  { name: "Old amortizatorlar", price: 350000, h: 3 },
  { name: "Razval-sxojdeniye", price: 150000, h: 1 },
  { name: "Svecha almashtirish", price: 80000, h: 0.5 },
  { name: "GRM remen / zanjir", price: 700000, h: 5 },
  { name: "Konditsioner freoni", price: 180000, h: 1 },
];

const SYMPTOMS = [
  { icon: "🔊", name: "Tormoz bosganda g'ichirlaydi", urg: "mid", cause: ["Kolodkalar yeyilgan", "Disk yuzasi notekis", "Kolodka ostiga tosh kirgan"], todo: ["1–2 hafta ichida ko'rsating", "Uzoq safarga chiqmang"] },
  { icon: "🌡", name: "Motor qizib ketyapti", urg: "high", cause: ["Antifriz kam yoki oqyapti", "Termostat ishlamayapti", "Ventilyator yoqilmayapti"], todo: ["Darhol to'xtab, motorni o'chiring", "Issiq motorda qopqoqni ochmang!", "Evakuator chaqiring yoki qo'ng'iroq qiling"] },
  { icon: "💡", name: "\"Check Engine\" chiroqchasi yondi", urg: "mid", cause: ["Datchik xatosi", "Svecha yoki katushka muammosi", "Benzin bakining qopqog'i yopilmagan"], todo: ["Kompyuter diagnostikasidan o'ting", "Chiroq miltillasa — haydashni to'xtating"] },
  { icon: "🫨", name: "Rul titraydi", urg: "low", cause: ["G'ildiraklar balansirovkasi buzilgan", "Tormoz diski qiyshaygan", "Rul tortqisi yeyilgan"], todo: ["Balansirovka va razval qildiring", "Tezlikda kuchaysa — tezroq keling"] },
  { icon: "🔋", name: "Ertalab qiyin o't oladi", urg: "low", cause: ["Akkumulyator zaryadi kam", "Starter yeyilgan", "Svechalar eskirgan"], todo: ["Akkumulyatorni tekshirtiring", "Qishdan oldin diagnostika qiling"] },
  { icon: "💧", name: "Mashina tagida dog'", urg: "mid", cause: ["Moy (qora) — motor/karobka salniki", "Yashil/qizil — antifriz", "Shaffof — konditsioner kondensati (normal)"], todo: ["Rangini suratga oling", "Moy darajasini tekshiring"] },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => Math.round(n / 1000) * 1000 > 0 ? (Math.round(n / 1000) * 1000).toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm" : "0 so'm";

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

  // Open / closed
  const now = new Date();
  const open = now.getDay() !== 0 && now.getHours() >= 8 && now.getHours() < 20;
  const st = $("#status");
  st.className = open ? "open" : "closed";
  st.textContent = open ? "● Hozir ochiq — keling!" : "● Hozir yopiq · ertaga 08:00 da";

  // Services
  $("#servicesGrid").innerHTML = SERVICES.map((s) => `<article class="svc reveal"><span>${s.icon}</span><h3>${s.name}</h3><p>${s.text}</p><em>${s.from} so'm dan</em></article>`).join("");

  // Calculator
  let cls = 0;
  $("#classes").innerHTML = CLASSES.map((c, i) => `<button type="button" class="${i ? "" : "active"}" data-cls="${i}"><b>${c.name}</b><small>${c.text}</small></button>`).join("");
  $("#jobs").innerHTML = JOBS.map((j, i) => `<label class="job"><input type="checkbox" data-job="${i}" ${i === 0 ? "checked" : ""}>${j.name}<small id="jp${i}"></small></label>`).join("");
  const calc = () => {
    const k = CLASSES[cls].k;
    JOBS.forEach((j, i) => ($("#jp" + i).textContent = money(j.price * k)));
    const picked = $$("[data-job]:checked").map((c) => JOBS[c.dataset.job]);
    const repair = picked.some((j) => !j.diag);
    let sum = 0, hours = 0;
    $("#billList").innerHTML = picked.length ? picked.map((j) => {
      const free = j.diag && repair;
      const p = free ? 0 : j.price * k;
      sum += p; hours += j.h;
      return `<li><span>${j.name}</span><span>${free ? "bepul" : money(p)}</span></li>`;
    }).join("") : '<li class="empty">Ish tanlanmadi</li>';
    $("#billSum").textContent = money(sum);
    $("#billTime").textContent = hours ? (hours < 1 ? `${hours * 60} daqiqa` : `~${Math.ceil(hours)} soat`) : "—";
    $("#billNote").textContent = repair && picked.some((j) => j.diag) ? "✓ Diagnostika ta'mir bilan birga — bepul" : "Diagnostika — ta'mir qilinsa bepul";
    return picked;
  };
  $("#classes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cls]");
    if (!b) return;
    cls = +b.dataset.cls;
    $$("#classes button").forEach((x) => x.classList.toggle("active", x === b));
    calc();
  });
  $("#jobs").addEventListener("change", calc);
  calc();

  // Symptom helper
  $("#symList").innerHTML = SYMPTOMS.map((s, i) => `<button data-sym="${i}"><span>${s.icon}</span>${s.name}</button>`).join("");
  const urgText = { high: "🚨 Shoshilinch", mid: "⚠️ Tez orada", low: "🟢 Rejali" };
  $("#symList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sym]");
    if (!b) return;
    const s = SYMPTOMS[b.dataset.sym];
    $$("#symList button").forEach((x) => x.classList.toggle("active", x === b));
    const box = $("#symAnswer");
    box.style.animation = "none"; void box.offsetWidth; box.style.animation = "";
    box.innerHTML = `<span class="urgency ${s.urg}">${urgText[s.urg]}</span><h3 style="margin-top:10px">${s.icon} ${s.name}</h3><h4>EHTIMOLIY SABABLAR</h4><ul>${s.cause.map((c) => `<li>${c}</li>`).join("")}</ul><h4>NIMA QILISH KERAK</h4><ul>${s.todo.map((c) => `<li>${c}</li>`).join("")}</ul><button class="btn btn--blue" id="symBook">Diagnostikaga navbat olish</button>`;
    $("#symBook").addEventListener("click", () => openBook(`Belgi: ${s.name}`));
  });

  // Booking
  const modal = $("#modal"), form = $("#bookForm"), ok = $("#bookOk"), sel = $("#bookSel");
  const date = $("#bookDate");
  date.min = new Date().toISOString().split("T")[0];
  function openBook(note) {
    form.hidden = false; ok.hidden = true;
    sel.hidden = !note;
    if (note) sel.textContent = note;
    date.value = date.min;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.book === "calc") {
      const picked = calc();
      openBook(picked.length ? `${CLASSES[cls].name}: ${picked.map((j) => j.name).join(", ")} · ${$("#billSum").textContent}` : null);
    } else openBook();
  }));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (new Date(date.value).getDay() === 0) { date.setCustomValidity("Yakshanba — dam olish kuni"); date.reportValidity(); return; }
    form.hidden = true; ok.hidden = false; sel.hidden = true; form.reset();
  });
  date.addEventListener("input", () => date.setCustomValidity(""));

  // Reveal
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; revealer.observe(el); });

  $("#year").textContent = new Date().getFullYear();
});
