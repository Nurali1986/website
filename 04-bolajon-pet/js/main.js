document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const links = $$(".nav__link", nav);

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

  // Active link
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
  $$(".reveal").forEach((el) => revealer.observe(el));

  // Carousels with generated dots + autoplay
  $$("[data-carousel]").forEach((car) => {
    const track = $(".carousel__track", car);
    const dotsBox = $(".dots", car);
    const pages = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth + 0.3));
    const build = () => {
      dotsBox.innerHTML = "";
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `${i + 1}-sahifa`);
        b.addEventListener("click", () => track.scrollTo({ left: i * track.clientWidth }));
        dotsBox.appendChild(b);
      }
      sync();
    };
    const sync = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      $$("button", dotsBox).forEach((d, k) => d.classList.toggle("active", k === i));
    };
    track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener("resize", build);
    build();

    let timer;
    const play = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
        track.scrollTo({ left: end ? 0 : track.scrollLeft + track.clientWidth });
      }, 4500);
    };
    car.addEventListener("pointerenter", () => clearInterval(timer));
    car.addEventListener("pointerleave", play);
    play();
  });

  // Reviews
  const reviews = $$(".review"), rDots = $$("#reviewDots button");
  let rIdx = 1;
  const showReview = (i) => {
    rIdx = i;
    reviews.forEach((r, k) => r.classList.toggle("active", k === i));
    rDots.forEach((d, k) => d.classList.toggle("active", k === i));
  };
  reviews.forEach((r, i) => r.addEventListener("click", () => showReview(i)));
  rDots.forEach((d, i) => d.addEventListener("click", () => showReview(i)));
  showReview(1);
  setInterval(() => showReview((rIdx + 1) % reviews.length), 5000);

  // Toast
  const toast = $("#toast");
  let tTimer;
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tTimer);
    tTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // Cart
  const cart = new Map();
  const cartBtn = $("#cartBtn"), drawer = $("#drawer"), overlay = $("#drawerOverlay");
  const money = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";
  const renderCart = () => {
    const list = $("#cartList");
    let total = 0, count = 0;
    list.innerHTML = "";
    cart.forEach((item, name) => {
      total += item.price * item.qty;
      count += item.qty;
      const li = document.createElement("li");
      li.innerHTML = `<span>${name}<br><span class="qty">${item.qty} × ${money(item.price)}</span></span><button class="rm" aria-label="O'chirish">×</button>`;
      $(".rm", li).addEventListener("click", () => { cart.delete(name); renderCart(); });
      list.appendChild(li);
    });
    if (!cart.size) list.innerHTML = '<li class="empty">Savat bo\'sh 🐾</li>';
    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = money(total);
  };
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => {
    const name = b.dataset.add, price = +b.dataset.price;
    const item = cart.get(name) || { price, qty: 0 };
    item.qty++;
    cart.set(name, item);
    renderCart();
    cartBtn.classList.remove("bump");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("bump");
    notify(`🐾 "${name}" savatga qo'shildi`);
  }));
  const setDrawer = (open) => {
    drawer.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", !open);
  };
  cartBtn.addEventListener("click", () => setDrawer(true));
  $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", () => setDrawer(false)));
  $("#checkout").addEventListener("click", () => {
    if (!cart.size) return notify("Avval mahsulot tanlang 🐶");
    setDrawer(false);
    openModal("Buyurtmani rasmiylashtirish");
  });

  // Contact modal
  const modal = $("#modal"), form = $("#contactForm"), success = $("#formSuccess");
  const openModal = (title = "Biz bilan bog'laning") => {
    $("#modalTitle").textContent = title;
    form.hidden = false; success.hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-contact]").forEach((b) => b.addEventListener("click", () => openModal()));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); setDrawer(false); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true; success.hidden = false; form.reset();
    if ($("#modalTitle").textContent.startsWith("Buyurtma")) { cart.clear(); renderCart(); }
  });

  $("#year").textContent = new Date().getFullYear();
});
