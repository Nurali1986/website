const SCHEDULE = {
  kichik: [
    ["🌅", "08:00", "Kutib olish"], ["🥣", "08:30", "Nonushta"], ["🧸", "09:30", "O'yin mashg'uloti"],
    ["🌳", "10:30", "Sayr"], ["🍲", "12:00", "Tushlik"], ["😴", "12:30", "Kunduzgi uyqu"],
    ["🎵", "15:30", "Musiqa"], ["🏡", "17:30", "Uyga ketish"],
  ],
  orta: [
    ["🌅", "08:00", "Ertalabki badantarbiya"], ["🥣", "08:30", "Nonushta"], ["🔤", "09:30", "Harflar va raqamlar"],
    ["🎨", "10:30", "Rasm va loy"], ["🍲", "12:00", "Tushlik"], ["😴", "12:30", "Uyqu"],
    ["🇬🇧", "15:30", "Ingliz tili o'yinlari"], ["⚽", "16:30", "Sport"],
  ],
  katta: [
    ["🌅", "08:00", "Badantarbiya"], ["🥣", "08:30", "Nonushta"], ["✏️", "09:00", "O'qish va yozish"],
    ["➕", "10:00", "Mantiq va matematika"], ["🔬", "11:00", "Kichik tajribalar"], ["🍲", "12:00", "Tushlik"],
    ["♟️", "15:30", "Shaxmat"], ["🎭", "16:30", "Teatr to'garagi"],
  ],
};
const COLORS = ["#3d9bf0", "#f0437a", "#6cc04a", "#ffa62b", "#9b6bff", "#ffd23f"];
const GALLERY = [
  ["1607453998774-d533f65dac99", "Do'stlar birga"],
  ["1515488042361-ee00e0ddd4e4", "O'yinchoqlar olami"],
  ["1564429238817-393bd4286b2d", "Harflarni o'rganamiz"],
  ["1484820540004-14229fe36ca4", "Rangli kubiklar"],
  ["1596464716127-f2a82984de30", "Ijodiy soat"],
  ["1587616211892-f743fcca64f9", "Bayram kuni"],
  ["1535572290543-960a8046f5af", "Alifbo kubiklari"],
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2600); };
  $$("[data-toast]").forEach((b) => b.addEventListener("click", () => notify(b.dataset.toast)));

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

  // Hero text slider
  const slides = $$(".hs"), dots = $$("#heroDots button");
  let cur = 0, timer;
  const go = (i) => {
    cur = i % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === cur));
    dots.forEach((d, k) => d.classList.toggle("active", k === cur));
    clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  go(0);

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; revealer.observe(el); });
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (now) => { const p = Math.min((now - start) / 1500, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Daily schedule tabs
  const renderSchedule = (g) => {
    $("#timeline").innerHTML = SCHEDULE[g].map(([icon, time, name], i) => `<li style="--c:${COLORS[i % COLORS.length]};animation-delay:${i * 60}ms"><span>${icon}</span><time>${time}</time><b>${name}</b></li>`).join("");
  };
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#tabs button").forEach((x) => x.classList.toggle("active", x === b));
    renderSchedule(b.dataset.group);
  });
  renderSchedule("kichik");

  // Enroll modal
  const modal = $("#modal"), form = $("#enrollForm"), success = $("#enrollSuccess");
  const openModal = (program) => {
    if (program) $("#programSelect").value = program;
    form.hidden = false; success.hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-enroll]").forEach((b) => b.addEventListener("click", () => openModal()));
  $$("[data-program]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.program)));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  // Gallery lightbox
  const lb = $("#lightbox");
  let gi = 0;
  const show = (i) => {
    gi = (i + GALLERY.length) % GALLERY.length;
    $("#lbImg").src = `https://images.unsplash.com/photo-${GALLERY[gi][0]}?w=1400&q=80&auto=format&fit=crop`;
    $("#lbImg").alt = GALLERY[gi][1];
    $("#lbCap").textContent = `${GALLERY[gi][1]} · ${gi + 1}/${GALLERY.length}`;
  };
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  $("#openGallery").addEventListener("click", () => { show(0); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => show(gi - 1));
  $("#lbNext").addEventListener("click", () => show(gi + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeLb(); toggleMenu(false); }
    if (lb.classList.contains("open") && e.key === "ArrowRight") show(gi + 1);
    if (lb.classList.contains("open") && e.key === "ArrowLeft") show(gi - 1);
  });

  $("#year").textContent = new Date().getFullYear();
});
