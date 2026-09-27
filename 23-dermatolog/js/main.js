const IMG = (id, w = 700) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const CONDITIONS = [
  { icon: "🔴", name: "Husnbuzar (akne)", img: "1512290923902-8a9f81dc236c", text: "O'smirlar va kattalardagi husnbuzar, izlar va dog'lar.", signs: ["Qora nuqtalar, yiringli toshmalar", "Yallig'langan tugunchalar", "Husnbuzardan keyingi izlar"], treat: ["Bosqichma-bosqich tashqi terapiya", "Zarur bo'lsa — tizimli davolash", "Kosmetolog bilan hamkorlikda izlarni tuzatish"] },
  { icon: "🌵", name: "Ekzema va dermatit", img: "1584515979956-d9f6e5d09982", text: "Qichishish, qizarish va quruqlik bilan kechadigan surunkali holatlar.", signs: ["Kuchli qichishish", "Quruq, po'st tashlaydigan dog'lar", "Allergenga javob"], treat: ["Qo'zg'atuvchini aniqlash", "Emolientlar va to'g'ri parvarish", "Qaytalanishning oldini olish rejasi"] },
  { icon: "⚪", name: "Psoriaz", img: "1571772996211-2f02c9727629", text: "Surunkali, yuqumli bo'lmagan kasallik — nazorat ostiga olish mumkin.", signs: ["Kumushrang tangachali pilakchalar", "Tirsak, tizza, bosh terisida", "Tirnoq o'zgarishlari"], treat: ["Tashqi va fototerapiya", "Zamonaviy biologik preparatlar", "Uzoq muddatli remissiya rejasi"] },
  { icon: "🟤", name: "Xollar va o'smalar", img: "1581595219315-a187dd40c322", text: "Raqamli dermatoskopiya bilan xollarni tekshirish va kuzatish.", signs: ["Yangi paydo bo'lgan xol", "Shakli yoki rangi o'zgargan xol", "Qichishadigan yoki qonaydigan xol"], treat: ["FotoFinder bilan xarita", "Yillik kuzatuv", "Zarur bo'lsa — onkodermatologga yo'llanma"] },
  { icon: "💇", name: "Soch to'kilishi", img: "1559757148-5c350d0d3c56", text: "Trixoskopiya bilan sababni aniqlab, davolash.", signs: ["Kuniga 100 dan ortiq soch to'kilishi", "Siyraklashish, o'choqli to'kilish", "Bosh terisi qichishi, kepak"], treat: ["Trixoskopiya va tahlillar", "Gormonal va defitsit sabablarni aniqlash", "Mezoterapiya, PRP"] },
];

const ABCDE = [
  { l: "A", title: "Asimmetriya", text: "Xolning bir yarmi ikkinchisiga o'xshamaydi" },
  { l: "B", title: "Chegara (Border)", text: "Chetlari notekis, xira yoki tishli" },
  { l: "C", title: "Rang (Color)", text: "Bir nechta rang: qora, jigarrang, qizil, oq" },
  { l: "D", title: "Diametr", text: "6 mm dan katta (qalam o'chirg'ichidan kattaroq)" },
  { l: "E", title: "O'zgarish (Evolving)", text: "Hajmi, shakli yoki rangi o'zgarmoqda, qonaydi" },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

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

  // Conditions tabs
  $("#condTabs").innerHTML = CONDITIONS.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-c="${i}"><span>${c.icon}</span>${c.name}</button>`).join("");
  const showCond = (i) => {
    const c = CONDITIONS[i];
    $$("#condTabs button").forEach((b) => b.setAttribute("aria-selected", +b.dataset.c === i));
    const panel = $("#condPanel");
    panel.style.animation = "none"; void panel.offsetWidth; panel.style.animation = "";
    panel.innerHTML = `<img src="${IMG(c.img)}" alt="${c.name}" loading="lazy"><div><h3>${c.icon} ${c.name}</h3><p>${c.text}</p><h4>Belgilari</h4><ul>${c.signs.map((s) => `<li>${s}</li>`).join("")}</ul><h4>Qanday davolayman</h4><ul>${c.treat.map((s) => `<li>${s}</li>`).join("")}</ul><button class="btn btn--plum" data-book="${i}">Shu muammo bilan yozilish</button></div>`;
    $("[data-book]", panel).addEventListener("click", () => openBook(c.name));
  };
  $("#condTabs").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) showCond(+b.dataset.c); });
  showCond(0);

  // ABCDE checker
  const on = new Set();
  $("#letters").innerHTML = ABCDE.map((a, i) => `<button type="button" class="letter" data-l="${i}" aria-pressed="false"><b>${a.l}</b><span><strong>${a.title}</strong><small>${a.text}</small></span><i>✓</i></button>`).join("");
  const renderVerdict = () => {
    const n = on.size;
    const evolving = on.has(4);
    const [level, title, text] = n === 0
      ? [0, "Belgilar tanlanmadi", "Xolingizni ABCDE belgilari bo'yicha ko'rib chiqing. Yiliga bir marta profilaktik dermatoskopiya tavsiya etiladi."]
      : n === 1 && !evolving
        ? [1, "Kuzatib boring", "Bitta belgi ko'pincha xavfsiz bo'ladi, lekin xolni suratga olib, 1–3 oyda solishtiring. Rejali ko'rikka yoziling."]
        : n <= 2
          ? [2, "Shifokorga ko'rsating", "Bir nechta belgi yoki o'zgarish bor. Yaqin 2–3 hafta ichida dermatoskopiyadan o'tishingizni tavsiya qilaman."]
          : [3, "Kechiktirmang", "Bir nechta xavf belgisi mavjud. Iltimos, iloji boricha tez dermatologga murojaat qiling."];
    const angle = [-80, -45, 10, 70][level];
    $("#verdict").innerHTML = `<div class="gauge"><span class="needle" style="transform:translateX(-50%) rotate(${angle}deg)"></span></div><h3>${title}</h3><p>${text}</p><button class="btn btn--plum btn--block" id="vBook">Dermatoskopiyaga yozilish</button><p class="muted" style="font-size:.78rem;margin:12px 0 0">Tanlangan belgilar: ${n} / 5</p>`;
    $("#vBook").addEventListener("click", () => openBook("Xollar va o'smalar"));
  };
  $("#letters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-l]");
    if (!b) return;
    const i = +b.dataset.l;
    on.has(i) ? on.delete(i) : on.add(i);
    b.classList.toggle("on", on.has(i));
    b.setAttribute("aria-pressed", on.has(i));
    renderVerdict();
  });
  renderVerdict();

  // Photo upload preview (local only)
  const file = $("#file"), drop = $("#drop"), thumbs = $("#thumbs");
  const preview = (files) => {
    thumbs.innerHTML = "";
    [...files].filter((f) => f.type.startsWith("image/")).slice(0, 3).forEach((f) => {
      const img = document.createElement("img");
      img.alt = f.name;
      img.src = URL.createObjectURL(f);
      img.onload = () => URL.revokeObjectURL(img.src);
      thumbs.appendChild(img);
    });
    $("#dropText").innerHTML = thumbs.children.length ? `✅ ${thumbs.children.length} ta rasm tanlandi<br><small>O'zgartirish uchun bosing</small>` : "📷 Rasmni shu yerga tashlang yoki bosing<br><small>JPG/PNG, 3 tagacha</small>";
  };
  file.addEventListener("change", () => preview(file.files));
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => preview(e.dataTransfer.files));
  $("#uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!thumbs.children.length) return notify("Iltimos, kamida bitta rasm tanlang");
    e.target.reset(); preview([]);
    notify("✅ So'rov qabul qilindi! 24 soat ichida Telegram orqali javob beraman.");
  });

  // Booking modal
  const modal = $("#modal"), form = $("#bookForm"), ok = $("#bookOk");
  $("#bookTopic").innerHTML = [...CONDITIONS.map((c) => c.name), "Profilaktik ko'rik", "Boshqa"].map((n) => `<option>${n}</option>`).join("");
  $("#bookDate").min = new Date().toISOString().split("T")[0];
  function openBook(topic) {
    form.hidden = false; ok.hidden = true;
    if (topic) $("#bookTopic").value = topic;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("button[data-book]").forEach((b) => { if (!b.closest("#condPanel")) b.addEventListener("click", () => openBook()); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; ok.hidden = false; form.reset(); });

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
    const step = (t) => { const p = Math.min((t - start) / 1600, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  $("#year").textContent = new Date().getFullYear();
});
