const IMG = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const SERVICES = [
  { icon: "🧍", name: "Individual terapiya", text: "Hayotiy qiyinchiliklarni birga tahlil qilamiz.", price: "350 000 so'm", img: "1573497620053-ea5300f94f21" },
  { icon: "💞", name: "Juftlik terapiyasi", text: "Muloqot va ishonchni mustahkamlash.", price: "450 000 so'm", img: "1527525443983-6e60c75fff46" },
  { icon: "🌀", name: "Xavotir va stress", text: "Stressni boshqarish va xotirjamlik.", price: "350 000 so'm", img: "1544005313-94ddf0286df2" },
  { icon: "☁️", name: "Depressiyadan chiqish", text: "Umid va motivatsiyani qayta tiklash.", price: "350 000 so'm", img: "1583864697784-a0efc8379f70" },
  { icon: "🧒", name: "Bolalar va o'smirlar", text: "Bolalar va o'smirlarni qo'llab-quvvatlash.", price: "300 000 so'm", img: "1596464716127-f2a82984de30" },
  { icon: "💻", name: "Onlayn seans", text: "Uydan turib sifatli yordam oling.", price: "300 000 so'm", img: "1551836022-d5d88e9218df" },
];

const QUESTIONS = [
  "Kutilmagan voqealar sizni tez-tez asabiylashtirdimi?",
  "Hayotingizdagi muhim narsalarni nazorat qila olmayotgandek his qildingizmi?",
  "O'zingizni tarang va xavotirli his qildingizmi?",
  "Uyqu bilan muammolar bo'ldimi?",
  "Qiyinchiliklar shunchalik ko'payib ketdiki, ularni yengib bo'lmaydigandek tuyuldimi?",
  "Kundalik ishlardan zavq olish qiyinlashdimi?",
];
const OPTIONS = ["Hech qachon", "Ba'zan", "Tez-tez", "Doim"];

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

  // Services
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `<article class="svc reveal" data-svc="${i}"><img src="${IMG(s.img, 400)}" alt="${s.name}" loading="lazy"><span class="svc__icon">${s.icon}</span><h3>${s.name}</h3><p>${s.text}</p><em>${s.price} →</em></article>`).join("");
  $("#footerServices").innerHTML = SERVICES.map((s) => `<li><a href="#services">${s.name}</a></li>`).join("");
  $("#bookService").innerHTML = SERVICES.map((s) => `<option>${s.name} — ${s.price}</option>`).join("");

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
    const step = (now) => { const p = Math.min((now - start) / 1600, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  // Stress self-test
  const form = $("#testForm");
  form.innerHTML = QUESTIONS.map((q, i) => `<div class="q"><p>${i + 1}. ${q}</p><div class="q__opts">${OPTIONS.map((o, v) => `<label><input type="radio" name="q${i}" value="${v}" required><span>${o}</span></label>`).join("")}</div></div>`).join("") + `<button type="submit" class="btn btn--green btn--block">Natijani ko'rish</button><div id="testResult"></div>`;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const score = QUESTIONS.reduce((s, _, i) => s + +new FormData(form).get("q" + i), 0);
    const max = QUESTIONS.length * 3;
    const pct = Math.round((score / max) * 100);
    const [title, text] = pct < 34
      ? ["🌿 Past stress darajasi", "Siz stress bilan yaxshi kurashyapsiz. Dam olish va o'zingizga g'amxo'rlikni davom ettiring."]
      : pct < 67
        ? ["🌤 O'rtacha stress darajasi", "Charchoq to'planib qolgan ko'rinadi. Bir nechta seans stressni boshqarish usullarini o'rganishga yordam beradi."]
        : ["⛈ Yuqori stress darajasi", "Siz hozir katta yuk ostidasiz. Iltimos, o'zingizni yolg'iz qoldirmang — mutaxassis bilan gaplashish juda muhim."];
    $("#testResult").innerHTML = `<div class="result"><h3>${title}</h3><div class="meter"><span style="left:${Math.max(3, Math.min(97, pct))}%"></span></div><p class="muted">${text}</p><button type="button" class="btn btn--green btn--sm" data-book style="margin-top:12px">Maslahat olish</button></div>`;
    $("#testResult [data-book]").addEventListener("click", openBook);
  });

  // Reviews slider
  const track = $("#track");
  const stepPx = () => track.querySelector(".review").offsetWidth + 16;
  $("#prev").addEventListener("click", () => track.scrollBy({ left: -stepPx() }));
  $("#next").addEventListener("click", () => {
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    end ? track.scrollTo({ left: 0 }) : track.scrollBy({ left: stepPx() });
  });

  // Booking modal with time slots
  const modal = $("#modal"), bookForm = $("#bookForm"), success = $("#bookSuccess");
  const date = $("#bookDate"), slotsBox = $("#slots");
  const iso = (d) => d.toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 864e5);
  date.min = iso(new Date());
  let slot = "";
  const renderSlots = () => {
    const day = new Date(date.value || tomorrow);
    const seed = day.getDate();
    const times = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:00"];
    slot = "";
    slotsBox.innerHTML = day.getDay() === 0
      ? '<p class="small muted" style="grid-column:1/-1">Yakshanba — dam olish kuni. Boshqa sanani tanlang.</p>'
      : times.map((t, i) => `<button type="button" ${((seed + i) % 3 === 0) ? "disabled" : ""}>${t}</button>`).join("");
  };
  slotsBox.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    $$("button", slotsBox).forEach((x) => x.classList.toggle("active", x === b));
    slot = b.textContent;
  });
  date.addEventListener("change", renderSlots);
  function openBook(serviceIndex) {
    bookForm.hidden = false; success.hidden = true;
    date.value = iso(tomorrow);
    if (typeof serviceIndex === "number") $("#bookService").selectedIndex = serviceIndex;
    renderSlots();
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => openBook()));
  $("#servicesGrid").addEventListener("click", (e) => { const s = e.target.closest("[data-svc]"); if (s) openBook(+s.dataset.svc); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); toggleMenu(false); } });
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!slot) return notify("Iltimos, qulay vaqtni tanlang");
    const fmt = new FormData(bookForm).get("fmt");
    const when = new Date(date.value).toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
    success.innerHTML = `<div>🌿</div><h3>Yozildingiz!</h3><p class="muted">${$("#bookService").value.split(" — ")[0]} · ${fmt}<br>${when}, soat ${slot}</p><p class="small muted">Tasdiqlash uchun sizga qo'ng'iroq qilaman.</p>`;
    bookForm.hidden = true; success.hidden = false; bookForm.reset();
  });

  $("#year").textContent = new Date().getFullYear();
});
