// ====== SHU YERNI O'ZGARTIRING ======
const CONFIG = {
  name: "Nurali Ishburiyev",
  brand: "nurali.dev",
  city: "Toshkent, O'zbekiston",
  telegram: "username",          // t.me/ dan keyingi qism (@ belgisisiz)
  instagram: "username",         // instagram.com/ dan keyingi qism
  phone: "+998 00 000 00 00",
  photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&auto=format&fit=crop&crop=faces", // o'z rasmingiz: "img/me.jpg"
};
// ====================================

const SERVICES = [
  { name: "Landing sahifa", price: "1 500 000", days: "5–7 kun", img: "02", items: ["Bitta sahifada butun biznes", "Ariza / qabulga yozilish formasi", "Xarita, narxlar, sharhlar"] },
  { name: "Shaxsiy brend sayti", price: "1 800 000", days: "5–7 kun", img: "17", items: ["Shifokor, usta, yurist, oshpaz uchun", "Kalkulyator yoki test", "Onlayn yozilish"] },
  { name: "Onlayn do'kon vitrinasi", price: "3 000 000", days: "10–14 kun", img: "06", items: ["Katalog, filtr va qidiruv", "Savat va buyurtma", "Aksiya taymeri"] },
  { name: "Taplink (shu sahifadek)", price: "500 000", days: "1–2 kun", img: "18", items: ["Instagram bio uchun bitta havola", "Barcha kontaktlar bir joyda", "Sizning rang va uslubingizda"] },
];

const WORKS = [
  { n: "17", dir: "17-stomatolog", name: "Stomatolog", type: "brand" },
  { n: "18", dir: "18-sartarosh", name: "Sartarosh", type: "brand" },
  { n: "02", dir: "02-bolajon-klinikasi", name: "Klinika", type: "biz" },
  { n: "05", dir: "05-bolajon-market", name: "Marketpleys", type: "shop" },
  { n: "21", dir: "21-oshpaz", name: "Oshpaz", type: "brand" },
  { n: "01", dir: "01-bolajon-maktabi", name: "Xususiy maktab", type: "biz" },
  { n: "09", dir: "09-bolajon-fresh", name: "Oziq-ovqat do'koni", type: "shop" },
  { n: "25", dir: "25-avtoservis", name: "Avtoservis", type: "brand" },
  { n: "03", dir: "03-bolajon-tur", name: "Turagentlik", type: "biz" },
  { n: "12", dir: "12-bolajon-zoo", name: "Zoomarket", type: "shop" },
];
const WORK_TYPES = { all: "Hammasi", brand: "Shaxsiy brend", biz: "Biznes", shop: "Do'kon" };

const STEPS = [
  ["Suhbat", "Biznesingiz, mijozlaringiz va saytdan nima kutayotganingizni gaplashamiz. 15–20 daqiqa, bepul."],
  ["Dizayn", "Sizga yoqqan namuna asosida yoki o'zim chizgan dizaynni ko'rsataman. Ma'qullaganingizdan keyin davom etaman."],
  ["Yig'ish", "Saytni yozaman: telefon va kompyuterga moslab, kalkulyator va formalar bilan."],
  ["Topshirish", "Saytni internetga joylayman, havolasini beraman va qanday o'zgartirishni ko'rsataman."],
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // Config → page
  const tg = `https://t.me/${CONFIG.telegram}`;
  const hrefs = { telegram: tg, instagram: `https://instagram.com/${CONFIG.instagram}`, phone: "tel:" + CONFIG.phone.replace(/[^+\d]/g, "") };
  $$("[data-link]").forEach((a) => (a.href = hrefs[a.dataset.link]));
  const [b1, ...b2] = CONFIG.brand.split(".");
  const texts = { name: CONFIG.name, phone: CONFIG.phone, city: CONFIG.city, instagramAt: "@" + CONFIG.instagram };
  $$("[data-text]").forEach((el) => {
    if (el.dataset.text === "brand") el.innerHTML = b2.length ? `${b1}<b>.</b>${b2.join(".")}` : b1;
    else el.textContent = texts[el.dataset.text];
  });
  const photo = $("#photo");
  photo.src = CONFIG.photo;
  photo.alt = CONFIG.name;

  // Services
  const svcList = $("#svcList"), svcCard = $("#svcCard");
  svcList.innerHTML = SERVICES.map((s, i) => `<button type="button" role="tab" data-svc="${i}"><span>${i + 1}</span>${s.name}</button>`).join("");
  const showSvc = (i) => {
    const s = SERVICES[i];
    $$("button", svcList).forEach((b, j) => { b.classList.toggle("active", j === i); b.setAttribute("aria-selected", j === i); });
    svcCard.innerHTML = `<img src="../assets/thumbs/${s.img}.jpg" alt="" width="720" height="450">
      <div class="services__info"><ul>${s.items.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p class="services__price"><b>${s.price} so'm</b> dan · ${s.days}</p>
      <a class="btn btn--yellow btn--sm" href="${tg}?text=${encodeURIComponent(`Assalomu alaykum! "${s.name}" bo'yicha ma'lumot olmoqchiman.`)}" target="_blank" rel="noopener">Buyurtma berish →</a></div>`;
  };
  svcList.addEventListener("click", (e) => { const b = e.target.closest("[data-svc]"); if (b) showSvc(+b.dataset.svc); });
  showSvc(0);
  $("#oType").innerHTML = [...SERVICES.map((s) => s.name), "Hali bilmayman"].map((n) => `<option>${n}</option>`).join("");

  // Marquee
  const words = ["Tez", "Chiroyli", "Telefonga mos", "Ishonchli", "O'zbek tilida"];
  const chunk = words.map((w) => `<span>${w}</span><svg viewBox="0 0 24 24"><path d="M12 0c1 7 4 10 12 12-8 2-11 5-12 12-1-7-4-10-12-12 8-2 11-5 12-12z" fill="currentColor"/></svg>`).join("");
  $("#marquee").innerHTML = chunk + chunk;

  // Works
  const grid = $("#worksGrid"), chips = $("#workChips");
  chips.innerHTML = Object.entries(WORK_TYPES).map(([k, v]) => `<button type="button" data-type="${k}" class="${k === "all" ? "active" : ""}">${v}</button>`).join("");
  const showWorks = (type) => {
    grid.innerHTML = WORKS.filter((w) => type === "all" || w.type === type).map((w) => `
      <a class="work" href="../${w.dir}/" target="_blank" rel="noopener">
        <img src="../assets/thumbs/${w.n}.jpg" alt="" loading="lazy" width="720" height="450">
        <span><b>${w.name}</b><small>${WORK_TYPES[w.type]}</small></span>
      </a>`).join("");
  };
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b) return;
    $$("button", chips).forEach((x) => x.classList.toggle("active", x === b));
    showWorks(b.dataset.type);
  });
  showWorks("all");

  // Steps
  const row = $("#stepsRow");
  row.innerHTML = STEPS.map(([t, d], i) => `<article class="step"><span>${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join("");
  const slide = (dir) => row.scrollBy({ left: dir * (row.firstElementChild.offsetWidth + 12), behavior: "smooth" });
  $("#stepPrev").addEventListener("click", () => slide(-1));
  $("#stepNext").addEventListener("click", () => slide(1));

  // Toast
  const toast = $("#toast");
  let toastTimer;
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // Share
  $("#share").addEventListener("click", async () => {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); notify("Havola nusxalandi ✓"); }
    } catch (err) {
      if (err.name !== "AbortError") notify("Havolani manzil satridan nusxalang");
    }
  });

  // Order → Telegram
  const form = $("#orderForm"), err = $("#orderErr");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), biz = form.biz.value.trim();
    if (!name || !biz) { err.hidden = false; (name ? form.biz : form.name).focus(); return; }
    err.hidden = true;
    const text = `Assalomu alaykum! Ismim ${name}.\nSoham: ${biz}.\nKerakli sayt: ${form.type.value}.`;
    window.open(`${tg}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    notify("Telegram ochilmoqda…");
  });
  form.addEventListener("input", () => (err.hidden = true));

  // Reveal + counters
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealer.observe(el));
  const counterObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = (t) => { const p = Math.min((t - start) / 1200, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  $("#year").textContent = new Date().getFullYear();
});
