document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const links = nav.querySelectorAll(".nav__link");

  // Sticky header shadow
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
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  // Active link on scroll
  const sections = [...links].map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealer.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 80 + "ms";
    revealer.observe(el);
  });

  // Animated counters
  const animate = (el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("uz-UZ");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animate(e.target);
      counterObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => counterObs.observe(el));

  // Modals
  const openModal = (m) => { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeModal = (m) => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  document.querySelectorAll(".modal").forEach((m) => {
    m.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeModal(m)));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach(closeModal);
  });

  const modal = document.getElementById("modal");
  const form = document.getElementById("applyForm");
  const success = document.getElementById("applySuccess");
  document.querySelectorAll("[data-open-modal], a[href='#admission'].btn").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      form.hidden = false;
      success.hidden = true;
      openModal(modal);
    })
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true;
    success.hidden = false;
    form.reset();
  });

  // Video slideshow
  const videoModal = document.getElementById("videoModal");
  const slides = videoModal.querySelectorAll("img");
  let slideTimer;
  document.getElementById("videoBtn").addEventListener("click", () => {
    openModal(videoModal);
    let i = 0;
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 3500);
  });
  videoModal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => clearInterval(slideTimer)));

  // Newsletter
  const sub = document.getElementById("subscribe");
  sub.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("subscribeMsg").textContent = "Rahmat! Siz muvaffaqiyatli obuna bo'ldingiz.";
    sub.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
