const SITES = [
  { n: "01", dir: "01-bolajon-maktabi", name: "Bolajon Maktabi", type: "biz", cat: "talim", color: "#1d3a8a", text: "Xususiy maktab: ariza formasi, video-slayder va yutuqlar hisoblagichi.", tags: ["Ariza formasi", "Slayder", "Hisoblagich"] },
  { n: "02", dir: "02-bolajon-klinikasi", name: "Bolajon Klinikasi", type: "biz", cat: "tibbiyot", color: "#2563eb", text: "Xususiy klinika: shifokorlar slayderi va qabulga yozilish oynasi.", tags: ["Qabulga yozilish", "Shifokorlar"] },
  { n: "03", dir: "03-bolajon-tur", name: "Bolajon Tur", type: "biz", cat: "xizmat", color: "#1e88e5", text: "Turagentlik: tur qidiruvi, paketlar filtri, sevimlilar va sharhlar.", tags: ["Qidiruv", "Filtr", "Sevimlilar"] },
  { n: "04", dir: "04-bolajon-pet", name: "Bolajon Pet", type: "biz", cat: "hayvon", color: "#0f9d8a", text: "Uy hayvonlari parvarishi: grooming xizmatlari, karusellar va savat.", tags: ["Savat", "Karusel"] },
  { n: "05", dir: "05-bolajon-market", name: "Bolajon Market", type: "biz", cat: "savdo", color: "#f97316", text: "Maktab va ofis marketpleysi: qidiruv, savat, istaklar va taymer.", tags: ["Savat", "Qidiruv", "Aksiya taymeri"] },
  { n: "06", dir: "06-bolajon-aksessuar", name: "Bolajon Aksessuar", type: "biz", cat: "savdo", color: "#e11d48", text: "Soat, sumka va zargarlik do'koni: slayder, filtrlar va savat.", tags: ["Filtr", "Savat", "Slayder"] },
  { n: "07", dir: "07-bolajon-wellness", name: "Bolajon Sog'lom Hayot", type: "biz", cat: "tibbiyot", color: "#16a34a", text: "Sog'lom ovqatlanish: BMI va kaloriya kalkulyatori, retseptlar filtri.", tags: ["BMI kalkulyator", "Retseptlar"] },
  { n: "08", dir: "08-bolajon-bog", name: "Bolajon Bog'", type: "biz", cat: "xizmat", color: "#166534", text: "O'simliklar va landshaft: bog' narxi kalkulyatori, tadbirlar, galereya.", tags: ["Narx kalkulyatori", "Galereya"] },
  { n: "09", dir: "09-bolajon-fresh", name: "Bolajon Fresh", type: "biz", cat: "savdo", color: "#14532d", text: "Oziq-ovqat do'koni: savat va bepul yetkazish progress-bari.", tags: ["Savat", "Yetkazib berish"] },
  { n: "11", dir: "11-bolajon-vet", name: "Bolajon Vet", type: "biz", cat: "hayvon", color: "#ea580c", text: "Veterinariya markazi: tekshiriladigan qabul formasi va xizmatlar.", tags: ["Qabulga yozilish", "Xizmatlar"] },
  { n: "12", dir: "12-bolajon-zoo", name: "Bolajon Zoo", type: "biz", cat: "hayvon", color: "#f59e0b", text: "Zoomarket: kategoriyalar, flesh-savdo taymeri va savat.", tags: ["Aksiya taymeri", "Savat"] },
  { n: "13", dir: "13-bolajon-bogcha", name: "Bolajon Bog'cha", type: "biz", cat: "talim", color: "#ec4899", text: "Xususiy bog'cha: guruhlar kun tartibi, galereya va ariza.", tags: ["Kun tartibi", "Galereya"] },
  { n: "14", dir: "14-bolajon-kosmos", name: "Bolajon Kosmos", type: "biz", cat: "talim", color: "#4338ca", text: "Bolalar uchun: 3 ta o'yin, multfilm-hikoyalar, yulduzlar va haftalik topshiriq.", tags: ["3 ta o'yin", "Hikoyalar", "Ekran vaqti"] },
  { n: "15", dir: "15-psixolog", name: "Dilnoza Rahimova", role: "Psixolog", type: "brand", cat: "tibbiyot", color: "#3f6b4f", text: "Anonim stress testi va bo'sh vaqtni tanlab yozilish.", tags: ["Stress testi", "Qabul vaqti"] },
  { n: "16", dir: "16-lor", name: "Dr. Jahongir Tursunov", role: "LOR shifokor", type: "brand", cat: "tibbiyot", color: "#0e7490", text: "Belgilarga qarab kerakli tekshiruvni tavsiya qiladi, narxlar ro'yxati.", tags: ["Belgilar tekshiruvi", "Narxlar"] },
  { n: "17", dir: "17-stomatolog", name: "Dr. Malika Karimova", role: "Stomatolog", type: "brand", cat: "tibbiyot", color: "#0d9488", text: "\"Oldin/keyin\" solishtirish, davolash narxi va 6 oyga bo'lib to'lash.", tags: ["Oldin / keyin", "Bo'lib to'lash"] },
  { n: "18", dir: "18-sartarosh", name: "Beka Barber", role: "Sartarosh", type: "brand", cat: "xizmat", color: "#b08d57", text: "3 qadamli yozilish: xizmat → kun → vaqt. Hozir ochiq/yopiq holati.", tags: ["3 qadamli yozilish", "Ochiq/yopiq"] },
  { n: "19", dir: "19-uzi-doktor", name: "Dr. Nigora Saidova", role: "UZI doktori", type: "brand", cat: "tibbiyot", color: "#1d4ed8", text: "Tekshiruvlar qidiruvi, tayyorgarlik yo'riqnomasi, 3+ tekshiruvga −10%.", tags: ["Qidiruv", "Savat", "Chegirma"] },
  { n: "20", dir: "20-yurist", name: "Sherzod Qodirov", role: "Advokat va notarius", type: "brand", cat: "xizmat", color: "#b8913a", text: "Huquq sohalari, notarial xizmat narxi kalkulyatori, savol-javob.", tags: ["Notarial kalkulyator", "FAQ"] },
  { n: "21", dir: "21-oshpaz", name: "Chef Akmal", role: "Oshpaz", type: "brand", cat: "xizmat", color: "#c2410c", text: "To'y keyteringi kalkulyatori (osh masalliqlarigacha), master-klassga joy.", tags: ["Keytering kalkulyatori", "Master-klass"] },
  { n: "22", dir: "22-kosmetolog", name: "Lola Nazarova", role: "Kosmetolog", type: "brand", cat: "tibbiyot", color: "#a16207", text: "Teri turi testi, tavsiyalar, klinika turi va abonementlar.", tags: ["Teri testi", "Abonement"] },
  { n: "23", dir: "23-dermatolog", name: "Dr. Farrux Ergashev", role: "Dermatolog", type: "brand", cat: "tibbiyot", color: "#7c3aed", text: "Xollarni ABCDE belgilari bo'yicha tekshirish, onlayn konsultatsiya.", tags: ["ABCDE tekshiruv", "Onlayn"] },
  { n: "24", dir: "24-ginekolog", name: "Dr. Gulnora Axmedova", role: "Akusher-ginekolog", type: "brand", cat: "tibbiyot", color: "#db2777", text: "Homiladorlik haftasi, tug'ruq sanasi va ko'riklar jadvali kalkulyatori.", tags: ["Homiladorlik kalkulyatori"] },
  { n: "25", dir: "25-avtoservis", name: "Usta Rustam", role: "Avtousta", type: "brand", cat: "xizmat", color: "#1677ff", text: "Ta'mir narxi kalkulyatori va \"mashinada nima bo'lyapti\" yordamchisi.", tags: ["Narx kalkulyatori", "Belgilar yordamchisi"] },
  { n: "26", dir: "taplink", name: "Taplink", role: "Instagram uchun", type: "brand", cat: "xizmat", color: "#ca9a04", text: "Instagram bio uchun bitta havola: kontaktlar, xizmatlar, portfolio va Telegram'ga buyurtma formasi.", tags: ["Havolalar", "Xizmat narxlari", "Telegram'ga buyurtma"] },
];

const CATS = { all: "Hammasi", talim: "Ta'lim", tibbiyot: "Tibbiyot", savdo: "Savdo", xizmat: "Xizmatlar", hayvon: "Uy hayvonlari" };

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

  // Theme
  const root = document.documentElement;
  const saved = store.get("katalog-theme");
  if (saved) root.dataset.theme = saved;
  $("#themeBtn").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("katalog-theme", root.dataset.theme);
  });

  // Stats
  $("#statTotal").textContent = SITES.length;
  $("#statBiz").textContent = SITES.filter((s) => s.type === "biz").length;
  $("#statBrand").textContent = SITES.filter((s) => s.type === "brand").length;

  // Filters
  const state = { type: "all", cat: "all", q: "" };
  $("#cats").innerHTML = Object.entries(CATS).map(([k, v]) => `<button type="button" data-cat="${k}" class="${k === "all" ? "active" : ""}">${v}</button>`).join("");

  const grid = $("#grid");
  const render = () => {
    const q = state.q.trim().toLowerCase();
    const list = SITES.filter((s) =>
      (state.type === "all" || s.type === state.type) &&
      (state.cat === "all" || s.cat === state.cat) &&
      (!q || [s.name, s.role, s.text, ...s.tags, CATS[s.cat]].join(" ").toLowerCase().includes(q)));
    grid.innerHTML = list.map((s) => `
      <article class="card" style="--c:${s.color}">
        <a class="card__shot" href="${s.dir}/" target="_blank" rel="noopener" aria-label="${s.name} — ochish">
          <img src="assets/thumbs/${s.n}.jpg" alt="${s.name} sayti bosh sahifasi" loading="lazy" width="720" height="450">
          <span class="card__num">${s.n}</span>
        </a>
        <div class="card__body">
          <p class="card__meta"><span class="dot"></span>${s.type === "brand" ? "Shaxsiy brend · " + s.role : "Biznes · " + CATS[s.cat]}</p>
          <h3>${s.name}</h3>
          <p class="card__text">${s.text}</p>
          <ul class="card__tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
          <div class="card__actions">
            <a class="btn btn--primary" href="${s.dir}/" target="_blank" rel="noopener">Saytni ochish ↗</a>
            <button class="btn btn--ghost" type="button" data-preview="${s.n}" aria-label="${s.name} — ko'rib chiqish">👁 Ko'rish</button>
          </div>
        </div>
      </article>`).join("");
    $("#empty").hidden = list.length > 0;
    $("#count").textContent = `${list.length} ta sayt`;
  };

  $("#types").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b) return;
    state.type = b.dataset.type;
    $$("#types button").forEach((x) => x.classList.toggle("active", x === b));
    render();
  });
  $("#cats").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    state.cat = b.dataset.cat;
    $$("#cats button").forEach((x) => x.classList.toggle("active", x === b));
    render();
  });
  $("#search").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#reset").addEventListener("click", () => {
    Object.assign(state, { type: "all", cat: "all", q: "" });
    $("#search").value = "";
    $$("#types button").forEach((x) => x.classList.toggle("active", x.dataset.type === "all"));
    $$("#cats button").forEach((x) => x.classList.toggle("active", x.dataset.cat === "all"));
    render();
  });
  render();

  // Preview modal
  const modal = $("#preview"), frame = $("#frame"), stage = $("#stage");
  let current = 0, lastFocus = null;
  const visible = () => $$("[data-preview]", grid).map((b) => b.dataset.preview);
  const show = (n) => {
    const s = SITES.find((x) => x.n === n);
    current = n;
    frame.src = s.dir + "/";
    $("#pvTitle").textContent = `${s.n} · ${s.name}`;
    $("#pvOpen").href = s.dir + "/";
  };
  const open = (n) => {
    lastFocus = document.activeElement;
    show(n);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#pvClose").focus();
  };
  const close = () => {
    modal.hidden = true;
    frame.src = "about:blank";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  const step = (d) => {
    const ids = visible();
    const i = ids.indexOf(current);
    if (ids.length) show(ids[(i + d + ids.length) % ids.length]);
  };
  grid.addEventListener("click", (e) => { const b = e.target.closest("[data-preview]"); if (b) open(b.dataset.preview); });
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  $("#pvPrev").addEventListener("click", () => step(-1));
  $("#pvNext").addEventListener("click", () => step(1));
  $("#devices").addEventListener("click", (e) => {
    const b = e.target.closest("[data-device]");
    if (!b) return;
    stage.dataset.device = b.dataset.device;
    $$("#devices button").forEach((x) => x.classList.toggle("active", x === b));
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  $("#year").textContent = new Date().getFullYear();
});
