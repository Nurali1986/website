const IMG = (id, w = 400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const TREATMENTS = [
  { key: "hydra", icon: "💧", name: "Gidrafeysial", text: "Chuqur tozalash va namlantirish", price: 450000, img: "1616394584738-fc6e612e71b9" },
  { key: "clean", icon: "✨", name: "Yuzni tozalash", text: "Kombinatsiyalangan, ultratovush", price: 350000, img: "1570172619644-dfd03ed5d881" },
  { key: "acne", icon: "🌿", name: "Husnbuzar davolash", text: "Yallig'lanish va izlarga qarshi", price: 400000, img: "1512290923902-8a9f81dc236c" },
  { key: "needle", icon: "🔹", name: "Mikroneedling", text: "Kollagen, chandiq va g'ovaklar", price: 650000, img: "1598440947619-2c35fc9aa908" },
  { key: "pigment", icon: "☀️", name: "Pigmentatsiya", text: "Dog'larni oqartirish, tekis rang", price: 500000, img: "1596755389378-c31d21fd1273" },
  { key: "peel", icon: "🍋", name: "Kimyoviy piling", text: "Yangilanish va nur", price: 380000, img: "1620916566398-39f1143ab7be" },
];

const QUIZ = [
  { q: "Kun oxirida teringiz qanday bo'ladi?", a: [["💦", "Yaltiraydi, yog'li", "oily"], ["🏜️", "Tortilgan, quruq", "dry"], ["🔀", "T-zona yog'li, yonoqlar quruq", "combo"], ["😌", "Deyarli o'zgarmaydi", "normal"]] },
  { q: "Sizni eng ko'p nima bezovta qiladi?", a: [["🔴", "Husnbuzar va yallig'lanish", "acne"], ["🟤", "Dog'lar va notekis rang", "pigment"], ["〰️", "Ajinlar, elastiklik", "needle"], ["🌫️", "Xira rang, kengaygan g'ovaklar", "clean"]] },
  { q: "Teringiz qanchalik sezgir?", a: [["🌸", "Juda sezgir, tez qizaradi", "sens"], ["🙂", "O'rtacha", "mid"], ["💪", "Sezgir emas", "tough"]] },
  { q: "Qancha vaqtga tayyorsiz?", a: [["⚡", "Bir martalik tez natija", "fast"], ["📅", "Bir necha seanslik kurs", "course"]] },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";
  const byKey = (k) => TREATMENTS.find((t) => t.key === k);

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

  // Treatments
  $("#treatGrid").innerHTML = TREATMENTS.map((t) => `<article class="tcard reveal" data-t="${t.key}"><img src="${IMG(t.img)}" alt="${t.name}" loading="lazy"><span class="tcard__icon">${t.icon}</span><h3>${t.name}</h3><p>${t.text}</p><em>DAN <b>${money(t.price)}</b></em></article>`).join("");
  $("#footerList").innerHTML = TREATMENTS.map((t) => `<li><a href="#treatments">${t.name}</a></li>`).join("");

  // Modal
  const modal = $("#modal"), dialog = $(".modal__dialog", modal), body = $("#modalBody");
  let tourTimer;
  const openModal = (html, wide = false) => { dialog.classList.toggle("wide", wide); body.innerHTML = html; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); clearInterval(tourTimer); };
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); toggleMenu(false); } });

  const openBook = (preset) => {
    const minDate = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    openModal(`<h3>Protseduraga yozilish</h3>
      <form id="bookForm">
        <label>Ismingiz<input required></label>
        <label>Telefon<input type="tel" required placeholder="+998 __ ___ __ __"></label>
        <label>Protsedura<select id="bookT">${[...TREATMENTS.map((t) => `${t.name} — ${money(t.price)}`), "Glow abonementi", "Radiance abonementi", "Lumière abonementi", "Konsultatsiya (bepul)"].map((n) => `<option>${n}</option>`).join("")}</select></label>
        <label>Sana<input type="date" min="${minDate}" required></label>
        <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto;margin:0" checked> Birinchi tashrif (−20%)</label>
        <button class="btn btn--gold btn--block">Tasdiqlash</button>
      </form>`);
    if (preset) [...$("#bookT").options].forEach((o, i) => { if (o.text.startsWith(preset)) $("#bookT").selectedIndex = i; });
    $("#bookForm").addEventListener("submit", (e) => { e.preventDefault(); body.innerHTML = `<div class="ok"><div>✧</div><h3>Rahmat!</h3><p class="muted">Vaqtni tasdiqlash uchun qo'ng'iroq qilaman. Tashrifdan oldin makiyajsiz kelishingizni so'rayman.</p></div>`; });
  };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => openBook(b.dataset.book)));
  $("#treatGrid").addEventListener("click", (e) => { const c = e.target.closest("[data-t]"); if (c) openBook(byKey(c.dataset.t).name); });

  $("#tourBtn").addEventListener("click", () => {
    const frames = [["1560750588-73207b1ef5b8", "Qabul xonasi"], ["1570172619644-dfd03ed5d881", "Protsedura xonasi"], ["1598440947619-2c35fc9aa908", "Professional kosmetika"]];
    openModal(`<div class="tour">${frames.map(([id], i) => `<img src="${IMG(id, 1200)}" alt="" class="${i ? "" : "on"}">`).join("")}<p id="tourCap">${frames[0][1]}</p></div>`, true);
    let i = 0;
    const imgs = $$(".tour img");
    tourTimer = setInterval(() => { imgs[i].classList.remove("on"); i = (i + 1) % imgs.length; imgs[i].classList.add("on"); $("#tourCap").textContent = frames[i][1]; }, 3500);
  });

  // Skin quiz
  const answers = [];
  const box = $("#quizBox");
  const renderQ = () => {
    const n = answers.length;
    $("#quizBar").style.width = ((n + 1) / (QUIZ.length + 1)) * 100 + "%";
    $("#quizStep").textContent = n < QUIZ.length ? `${n + 1} / ${QUIZ.length}` : "Natija";
    if (n === QUIZ.length) return renderResult();
    box.innerHTML = `<h3>${QUIZ[n].q}</h3><div class="answers">${QUIZ[n].a.map(([ic, t, v]) => `<button data-v="${v}"><span>${ic}</span>${t}</button>`).join("")}</div>`;
  };
  const renderResult = () => {
    const [type, concern, sens, time] = answers;
    const recs = new Set([concern]);
    if (type === "oily" || type === "combo") recs.add("clean");
    if (type === "dry" || sens === "sens") recs.add("hydra");
    if (time === "course" && concern !== "needle" && sens !== "sens") recs.add("needle");
    if (sens === "sens") recs.delete("peel");
    const typeName = { oily: "yog'li", dry: "quruq", combo: "aralash", normal: "normal" }[type];
    const list = [...recs].slice(0, 3).map(byKey);
    box.innerHTML = `<div class="result"><h3>Teringiz turi: ${typeName}${sens === "sens" ? ", sezgir" : ""}</h3><p class="muted">Sizga quyidagi protseduralarni tavsiya qilaman:</p><div class="recs">${list.map((t) => `<div class="rec"><img src="${IMG(t.img, 150)}" alt=""><div><b>${t.icon} ${t.name}</b><small>${money(t.price)} dan</small></div></div>`).join("")}</div><button class="btn btn--gold" id="quizBook">Konsultatsiyaga yozilish</button><button class="link" id="quizAgain">Qaytadan</button></div>`;
    $("#quizBook").addEventListener("click", () => openBook(list[0].name));
    $("#quizAgain").addEventListener("click", () => { answers.length = 0; renderQ(); });
  };
  box.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { answers.push(b.dataset.v); renderQ(); } });
  renderQ();

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 6) * 60 + "ms"; revealer.observe(el); });
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (t) => { const p = Math.min((t - start) / 1500, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("✧ Obuna bo'ldingiz!"); });
  $("#year").textContent = new Date().getFullYear();
});
