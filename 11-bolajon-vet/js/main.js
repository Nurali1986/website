const SERVICES = [
  { icon: "🐾", name: "Umumiy ko'rik", text: "Salomatlik tekshiruvi, kasalliklarni aniqlash va maslahat." },
  { icon: "💉", name: "Emlash", text: "Hayvoningizni himoya qiluvchi asosiy va qo'shimcha emlashlar." },
  { icon: "🦷", name: "Tish parvarishi", text: "Tish ko'rigi, tozalash va og'iz bo'shlig'i salomatligi." },
  { icon: "✂️", name: "Sterilizatsiya", text: "It va mushuklar uchun xavfsiz, professional amaliyot." },
  { icon: "🩻", name: "Jarrohlik", text: "Ehtiyotkorlik va aniqlik bilan bajariladigan operatsiyalar." },
  { icon: "🚑", name: "Shoshilinch yordam", text: "Eng kerakli paytda tezkor yordam." },
  { icon: "🐶", name: "Kuchukcha va mushukcha", text: "Baxtli va sog'lom hayot uchun to'g'ri boshlanish." },
  { icon: "❤️", name: "Keksa hayvonlar", text: "Yoshi ulg'aygan hayvonlarga qulaylik va g'amxo'rlik." },
  { icon: "📟", name: "Mikrochip", text: "Doimiy identifikatsiya — xotirjamligingiz uchun." },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2800); };
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

  // Services (grid, select, footer) from one list
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `<button class="svc reveal" data-svc="${i}"><span class="svc__icon">${s.icon}</span><h3>${s.name}</h3><p>${s.text}</p></button>`).join("");
  $("#serviceSelect").innerHTML += SERVICES.map((s) => `<option>${s.name}</option>`).join("");
  $("#footerServices").innerHTML = SERVICES.map((s) => `<li><a href="#services">${s.name}</a></li>`).join("");
  $("#servicesGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-svc]");
    if (!b) return;
    $("#serviceSelect").value = SERVICES[b.dataset.svc].name;
    $("#book").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#bookForm input").focus({ preventScroll: true }), 600);
  });

  // Reveal
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 70 + "ms"; revealer.observe(el); });

  // Wellness plan switch
  const prices = { it: "149 000", mushuk: "119 000" };
  $$(".plan-switch button").forEach((b) => b.addEventListener("click", () => {
    $$(".plan-switch button").forEach((x) => x.classList.toggle("active", x === b));
    $("#planPrice").textContent = prices[b.dataset.plan];
  }));

  // Booking form with light validation
  const form = $("#bookForm"), note = $("#formNote");
  const date = $("#date");
  const today = new Date();
  date.min = today.toISOString().split("T")[0];
  date.value = new Date(today.getTime() + 864e5).toISOString().split("T")[0];
  form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    bad.forEach((el) => el.classList.add("invalid"));
    if (bad.length) { bad[0].focus(); notify("Iltimos, belgilangan maydonlarni to'ldiring"); return; }
    const d = Object.fromEntries(new FormData(form));
    const when = new Date(d.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
    note.classList.add("ok");
    note.innerHTML = `✔ Rahmat, ${d.name}! ${d.pet} uchun "${d.service}" — ${when}, ${d.branch}. Tez orada qo'ng'iroq qilamiz.`;
    form.reset();
    date.value = new Date(today.getTime() + 864e5).toISOString().split("T")[0];
  });

  // Hide the mobile CTA while the booking form is on screen
  const cta = $("#mobileCta");
  new IntersectionObserver(([e]) => cta.classList.toggle("hide", e.isIntersecting), { threshold: 0.2 }).observe($("#book"));

  $("#year").textContent = new Date().getFullYear();
});
