const TESTS = [
  { id: 1, icon: "🫄", name: "Qorin bo'shlig'i", text: "Jigar, o't pufagi, oshqozon osti bezi, taloq", price: 150000, cat: "qorin", tint: "#fff1f1", prep: "fasting", keys: "jigar o't pufak" },
  { id: 2, icon: "🦋", name: "Qalqonsimon bez", text: "Tugun, kattalashish, gormonal o'zgarishlar", price: 120000, cat: "bez", tint: "#eef4ff", prep: "none", keys: "tiroid shitovidka" },
  { id: 3, icon: "🫘", name: "Buyrak va siydik yo'llari", text: "Tosh, kista, yallig'lanish", price: 130000, cat: "qorin", tint: "#effaf1", prep: "bladder", keys: "pochka" },
  { id: 4, icon: "🤰", name: "Homiladorlik skriningi", text: "1-2-3 trimestr, 3D/4D tasvir bilan", price: 250000, cat: "ayol", tint: "#f5efff", prep: "bladder", keys: "homila chaqaloq bola 3d 4d" },
  { id: 5, icon: "🌸", name: "Kichik tos a'zolari", text: "Bachadon, tuxumdonlar (ayollar)", price: 150000, cat: "ayol", tint: "#fff6e8", prep: "bladder", keys: "ginekologik bachadon" },
  { id: 6, icon: "❤️", name: "Yurak EXO-KG", text: "Yurak klapanlari va funksiyasi", price: 220000, cat: "yurak", tint: "#fff0f3", prep: "none", keys: "exokardiografiya" },
  { id: 7, icon: "🩸", name: "Oyoq tomirlari doppleri", text: "Varikoz, tromb, qon aylanishi", price: 200000, cat: "yurak", tint: "#eef4ff", prep: "none", keys: "vena doppler" },
  { id: 8, icon: "🎀", name: "Sut bezlari", text: "Profilaktik tekshiruv, tugunlar", price: 140000, cat: "ayol", tint: "#fff1f7", prep: "cycle", keys: "ko'krak mammologiya" },
  { id: 9, icon: "🧒", name: "Bolalar kompleks UZI", text: "Qorin, buyrak, yurak — 0–14 yosh", price: 280000, cat: "bola", tint: "#effaf1", prep: "fasting", keys: "bolalar chaqaloq" },
  { id: 10, icon: "🦴", name: "Chanoq-son bo'g'imi", text: "Chaqaloqlar displaziyasi skriningi", price: 110000, cat: "bola", tint: "#f5efff", prep: "none", keys: "chaqaloq bo'g'im" },
  { id: 11, icon: "🧬", name: "Prostata bezi", text: "Transabdominal tekshiruv (erkaklar)", price: 150000, cat: "bez", tint: "#fff6e8", prep: "bladder", keys: "erkak" },
  { id: 12, icon: "📦", name: "To'liq check-up paketi", text: "Qorin + buyrak + qalqonsimon + yurak", price: 520000, old: 620000, cat: "paket", tint: "#e9fbf6", prep: "fasting", keys: "paket kompleks" },
];
const CATS = [["all", "Barchasi"], ["qorin", "Qorin"], ["ayol", "Ayollar"], ["yurak", "Yurak va tomir"], ["bez", "Bezlar"], ["bola", "Bolalar"], ["paket", "Paketlar"]];
const PREP = {
  fasting: { title: "🍽️ Och qoringa", items: ["Tekshiruvdan 6–8 soat oldin ovqat yemang", "Oldingi kuni gaz hosil qiluvchi taomlar (non, dukkakli, gazli ichimlik) yemang", "Oddiy suv ichish mumkin (1 stakangacha)"] },
  bladder: { title: "💧 To'la siydik pufagi", items: ["Tekshiruvdan 1 soat oldin 1–1,5 litr suv iching", "Tekshiruvgacha hojatxonaga bormang", "Homiladorlikda 1-trimestrdan keyin shart emas"] },
  none: { title: "✅ Maxsus tayyorgarlik shart emas", items: ["Qulay kiyimda keling", "Oldingi natijalaringiz bo'lsa, olib keling"] },
  cycle: { title: "📆 Hayz siklining 5–12 kunlari", items: ["Eng aniq natija siklning birinchi yarmida", "Mammografiya natijasi bo'lsa, olib keling"] },
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";
  const byId = (id) => TESTS.find((t) => t.id === id);
  let basket = [];
  try { basket = JSON.parse(localStorage.getItem("uzi-basket")) || []; } catch { /* storage unavailable */ }

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2600); };

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

  // Static lists
  $("#chips").innerHTML = CATS.map(([id, n], i) => `<button class="${i ? "" : "active"}" data-cat="${id}">${n}</button>`).join("");
  $("#footerTests").innerHTML = TESTS.slice(0, 5).map((t) => `<li><a href="#tests">${t.name}</a></li>`).join("");
  $("#prepList").innerHTML = Object.values(PREP).slice(0, 3).map((p) => `<article><h3>${p.title}</h3><ul>${p.items.map((x) => `<li>${x}</li>`).join("")}</ul></article>`).join("");

  // Tests grid
  let cat = "all", query = "";
  const render = () => {
    const q = query.toLowerCase();
    const list = TESTS.filter((t) => (cat === "all" || t.cat === cat) && (!q || `${t.name} ${t.text} ${t.keys}`.toLowerCase().includes(q)));
    $("#testsGrid").innerHTML = list.map((t) => `
      <article class="test" style="--tint:${t.tint}">
        <span class="test__icon">${t.icon}</span>
        <h3>${t.name}</h3><p>${t.text}</p>
        <b>${money(t.price)}${t.old ? ` <s class="muted small">${money(t.old)}</s>` : ""}</b>
        <button class="prep-link" data-prep="${t.id}">Tayyorgarlik</button>
        <button class="add ${basket.includes(t.id) ? "on" : ""}" data-add="${t.id}">${basket.includes(t.id) ? "✓ Tanlandi" : "Tanlash"}</button>
      </article>`).join("");
    $("#empty").hidden = list.length > 0;
  };
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    cat = b.dataset.cat;
    $$("#chips button").forEach((x) => x.classList.toggle("active", x === b));
    render();
  });
  $("#search").addEventListener("input", (e) => {
    query = e.target.value.trim();
    render();
    if (query) $("#tests").scrollIntoView({ behavior: "smooth" });
  });
  render();

  // Basket
  const drawer = $("#drawer"), overlay = $("#overlay");
  const totals = () => {
    const sum = basket.reduce((s, id) => s + byId(id).price, 0);
    const discount = basket.length >= 3 ? Math.round(sum * 0.1) : 0;
    return { sum, discount, total: sum - discount };
  };
  const renderBasket = () => {
    try { localStorage.setItem("uzi-basket", JSON.stringify(basket)); } catch { /* ignore */ }
    $("#basketCount").textContent = basket.length;
    $("#drawerList").innerHTML = basket.length ? basket.map((id) => { const t = byId(id); return `<li><span>${t.icon} ${t.name}</span><b>${money(t.price)}</b><button class="rm" data-rm="${id}" aria-label="O'chirish">×</button></li>`; }).join("") : '<li class="empty-li">Hali tekshiruv tanlanmadi</li>';
    const { discount, total } = totals();
    $("#basketTotal").textContent = money(total);
    $("#discountNote").textContent = discount ? `🎉 3+ tekshiruvga 10% chegirma: −${money(discount)}` : basket.length ? "3 ta va undan ko'p tekshiruvga 10% chegirma" : "";
  };
  const openDrawer = () => { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $("#basketBtn").addEventListener("click", openDrawer);
  $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", closeDrawer));
  $("#drawerList").addEventListener("click", (e) => {
    const id = +e.target.dataset.rm;
    if (!id) return;
    basket = basket.filter((x) => x !== id);
    renderBasket(); render();
  });
  $("#testsGrid").addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]");
    if (a) {
      const id = +a.dataset.add;
      basket = basket.includes(id) ? basket.filter((x) => x !== id) : [...basket, id];
      renderBasket(); render();
      const bb = $("#basketBtn"); bb.classList.remove("bump"); void bb.offsetWidth; bb.classList.add("bump");
      if (basket.includes(id)) notify(`🧾 "${byId(id).name}" tanlandi`);
    }
    const p = e.target.closest("[data-prep]");
    if (p) showPrep(byId(+p.dataset.prep));
  });
  renderBasket();

  // Modal
  const modal = $("#modal"), body = $("#modalBody");
  const openModal = (html) => { body.innerHTML = html; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); toggleMenu(false); } });

  const showPrep = (t) => {
    const p = PREP[t.prep];
    openModal(`<h3>${t.icon} ${t.name}</h3><p class="muted" style="margin-bottom:12px">${t.text}</p><div class="sel"><b>${p.title}</b></div><ul class="steps-list">${p.items.map((x) => `<li>✓ ${x}</li>`).join("")}</ul><button class="btn btn--blue btn--block" id="prepAdd" style="margin-top:14px">${basket.includes(t.id) ? "Yozilishga o'tish" : "Tanlash va yozilish"}</button>`);
    $("#prepAdd").addEventListener("click", () => { if (!basket.includes(t.id)) { basket.push(t.id); renderBasket(); render(); } openBook(); });
  };

  const openBook = (mode) => {
    closeDrawer();
    const home = mode === "home";
    const { sum, discount, total } = totals();
    const sel = basket.length ? basket.map((id) => byId(id).name).join(", ") : "Tekshiruv tanlanmagan — shifokor bilan kelishiladi";
    const minDate = new Date().toISOString().split("T")[0];
    openModal(`<h3>${home ? "🏠 Uyga chaqirish" : "📅 Tekshiruvga yozilish"}</h3>
      <div class="sel"><b>Tanlangan:</b> ${sel}${sum ? `<br><b>Jami:</b> ${money(total)}${discount ? ` (−${money(discount)} chegirma)` : ""}${home ? " + chaqiruv 100 000 so'm" : ""}` : ""}</div>
      <form id="bookForm">
        <label>Ism-familiya<input required></label>
        <label>Telefon<input type="tel" required placeholder="+998 __ ___ __ __"></label>
        ${home ? '<label>Manzil<input required placeholder="Tuman, ko\'cha, uy"></label>' : '<label>Manzil<select><option>Yunusobod — "MedLine"</option><option>Sergeli — "SihatMed"</option></select></label>'}
        <div class="row"><label>Sana<input type="date" min="${minDate}" required></label><label>Vaqt<select><option>08:00–10:00</option><option>10:00–12:00</option><option>14:00–16:00</option><option>16:00–18:00</option><option>18:00–20:00</option></select></label></div>
        <button class="btn btn--blue btn--block" type="submit">Tasdiqlash</button>
      </form>`);
    $("#bookForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const preps = [...new Set(basket.map((id) => byId(id).prep))].filter((p) => p !== "none").map((p) => PREP[p].title);
      body.innerHTML = `<div class="ok"><div>✅</div><h3>Yozildingiz!</h3><p class="muted">Tasdiqlash uchun qo'ng'iroq qilamiz.</p>${preps.length ? `<div class="sel" style="margin-top:14px;text-align:left"><b>Eslatma — tayyorgarlik:</b><br>${preps.join("<br>")}</div>` : ""}</div>`;
      basket = []; renderBasket(); render();
    });
  };
  $$("[data-book]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openBook(b.dataset.book); }));

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
    const step = (t) => { const p = Math.min((t - start) / 1500, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  $("#year").textContent = new Date().getFullYear();
});
