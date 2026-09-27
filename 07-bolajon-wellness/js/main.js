document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // Header + menu
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

  // Counters
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 1700, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Calorie / BMI calculator (Mifflin–St Jeor)
  const form = $("#calcForm");
  const fmt = (n) => Math.round(n).toLocaleString("ru-RU") + " kkal";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const age = +d.age, h = +d.height, w = +d.weight, act = +d.activity;
    const bmi = w / Math.pow(h / 100, 2);
    const bmr = 10 * w + 6.25 * h - 5 * age + (d.sex === "m" ? 5 : -161);
    const tdee = bmr * act;
    const tag = bmi < 18.5 ? "Vazn yetishmaydi" : bmi < 25 ? "Me'yorda ✓" : bmi < 30 ? "Ortiqcha vazn" : "Semizlik";
    $("#bmiVal").textContent = bmi.toFixed(1);
    $("#bmiTag").textContent = tag;
    $("#bmiMarker").style.left = Math.min(98, Math.max(2, ((bmi - 14) / (40 - 14)) * 100)) + "%";
    $("#kMaintain").textContent = fmt(tdee);
    $("#kLose").textContent = fmt(tdee - 450);
    $("#kGain").textContent = fmt(tdee + 350);
    $("#result").hidden = false;
  });

  // Recipe filters
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#filters button").forEach((x) => x.classList.toggle("active", x === b));
    $$(".recipe").forEach((r) => { r.hidden = b.dataset.f !== "all" && r.dataset.type !== b.dataset.f; });
  });

  // Modals
  const openModal = (m) => { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); };
  const closeModal = (m) => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); };
  $$(".modal").forEach((m) => $$("[data-close]", m).forEach((b) => b.addEventListener("click", () => closeModal(m))));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.open").forEach(closeModal); });

  const modal = $("#modal"), bookForm = $("#bookForm"), success = $("#bookSuccess");
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => {
    $("#modalTitle").textContent = b.dataset.book ? `Yozilish: ${b.dataset.book}` : "Qabulga yozilish";
    bookForm.hidden = false; success.hidden = true;
    openModal(modal);
  }));
  bookForm.addEventListener("submit", (e) => { e.preventDefault(); bookForm.hidden = true; success.hidden = false; bookForm.reset(); });

  const vModal = $("#videoModal"), imgs = $$("#slides img");
  let vi = 0, vt;
  $("#videoBtn").addEventListener("click", () => {
    openModal(vModal);
    clearInterval(vt);
    vt = setInterval(() => { imgs[vi].classList.remove("active"); vi = (vi + 1) % imgs.length; imgs[vi].classList.add("active"); }, 3500);
  });
  $$("[data-close]", vModal).forEach((b) => b.addEventListener("click", () => clearInterval(vt)));

  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); e.target.querySelector("input").placeholder = "Rahmat! Obuna bo'ldingiz ✓"; });
  $("#year").textContent = new Date().getFullYear();
});
