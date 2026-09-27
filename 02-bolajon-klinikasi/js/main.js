document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const links = nav.querySelectorAll(".nav__link");

  // Header shadow
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
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
  links.forEach((l) => { const s = document.querySelector(l.getAttribute("href")); if (s) spy.observe(s); });

  // Reveal
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealer.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + "ms";
    revealer.observe(el);
  });

  // Counters
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1800, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => counterObs.observe(el));

  // Doctors slider
  const track = document.getElementById("docTrack");
  const slide = (dir) => {
    const card = track.querySelector(".doctor");
    const stepPx = card.offsetWidth + 18;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    if (dir > 0 && atEnd) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 0) track.scrollTo({ left: track.scrollWidth });
    else track.scrollBy({ left: dir * stepPx });
  };
  document.getElementById("prevDoc").addEventListener("click", () => slide(-1));
  document.getElementById("nextDoc").addEventListener("click", () => slide(1));
  let auto = setInterval(() => slide(1), 4000);
  track.addEventListener("pointerenter", () => clearInterval(auto));
  track.addEventListener("pointerleave", () => { clearInterval(auto); auto = setInterval(() => slide(1), 4000); });

  // Booking modal
  const modal = document.getElementById("modal");
  const form = document.getElementById("bookForm");
  const success = document.getElementById("bookSuccess");
  const date = document.getElementById("bookDate");
  date.min = new Date().toISOString().split("T")[0];

  const open = () => { form.hidden = false; success.hidden = true; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  document.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", open));
  modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // Pre-select a doctor when their card is clicked
  const select = form.querySelector("select");
  track.querySelectorAll(".doctor").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const name = card.querySelector("h3").textContent;
      open();
      [...select.options].forEach((o) => { if (o.text.startsWith(name)) select.value = o.value || o.text; });
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true;
    success.hidden = false;
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
