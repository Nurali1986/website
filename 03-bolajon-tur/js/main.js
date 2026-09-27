document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const header = $("#header");
  const burger = $("#burger");
  const nav = $("#nav");
  const links = $$(".nav__link", nav);

  // Header background on scroll
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggleMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
  links.forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  // Active link on scroll
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });

  // Reveal
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealer.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; revealer.observe(el); });

  // Toast
  const toast = $("#toast");
  let toastTimer;
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  };

  // Search tabs change field labels
  const labels = {
    flight: ["Qayerdan", "Qayerga", "Ketish", "Qaytish"],
    hotel: ["Shahar", "Mehmonxona", "Kirish", "Chiqish"],
    car: ["Olish joyi", "Qaytarish joyi", "Olish sanasi", "Qaytarish sanasi"],
    tour: ["Shahar", "Ekskursiya turi", "Sana", "Tugash sanasi"],
  };
  const ids = ["fromLabel", "toLabel", "departLabel", "returnLabel"];
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    labels[tab.dataset.tab].forEach((txt, i) => ($("#" + ids[i]).textContent = txt));
  }));

  // Default dates
  const fmt = (d) => d.toISOString().split("T")[0];
  const today = new Date();
  const depart = $("#depart"), ret = $("#return");
  depart.min = ret.min = fmt(today);
  depart.value = fmt(new Date(today.getTime() + 14 * 864e5));
  ret.value = fmt(new Date(today.getTime() + 21 * 864e5));
  depart.addEventListener("change", () => { ret.min = depart.value; if (ret.value < depart.value) ret.value = depart.value; });

  $("#swap").addEventListener("click", () => { const f = $("#from"), t = $("#to"); [f.value, t.value] = [t.value, f.value]; });

  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = 12 + Math.floor(Math.random() * 30);
    notify(`✈ ${$("#to").value} bo'yicha ${n} ta taklif topildi. Menejer siz bilan bog'lanadi!`);
  });

  // Destinations fill the search field
  $$(".dest").forEach((d) => d.addEventListener("click", () => { $("#to").value = d.dataset.city; }));

  // Package filters + show more
  const pkgs = $$(".pkg");
  let showAll = false, current = "all";
  const renderPkgs = () => {
    let shown = 0;
    pkgs.forEach((p) => {
      const match = current === "all" || p.dataset.type === current;
      const visible = match && (showAll || shown < 4);
      p.hidden = !visible;
      if (visible) { shown++; p.classList.add("visible"); }
    });
  };
  $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    current = btn.dataset.filter;
    renderPkgs();
  }));
  $("#showMore").addEventListener("click", (e) => {
    showAll = !showAll;
    e.currentTarget.firstChild.textContent = showAll ? "Kamroq ko'rsatish " : "Barcha paketlar ";
    renderPkgs();
  });

  // Likes
  $$(".like").forEach((b) => b.addEventListener("click", () => {
    b.classList.toggle("on");
    notify(b.classList.contains("on") ? "❤ Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi");
  }));

  // Booking modal
  const modal = $("#modal"), form = $("#bookForm"), success = $("#bookSuccess");
  const open = (title) => {
    $("#modalTitle").textContent = title ? `Bron: ${title}` : "Bron qilish";
    form.hidden = false; success.hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => open(b.dataset.book)));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  // Counters
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Testimonials slider
  const slides = $$("#tSlides blockquote"), dots = $$("#tDots button");
  let idx = 0;
  const go = (i) => {
    idx = i;
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    dots.forEach((d, k) => d.classList.toggle("active", k === i));
  };
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  setInterval(() => go((idx + 1) % slides.length), 5000);

  // Newsletter
  $("#subscribe").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); notify("✔ Obuna bo'ldingiz! Maxsus takliflarni kuting."); });

  $("#year").textContent = new Date().getFullYear();
});
