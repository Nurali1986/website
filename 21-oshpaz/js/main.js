const IMG = (id, w = 200) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&q=80&auto=format&fit=crop`;

const MENU = [
  { cat: "Milliy", name: "To'y oshi", text: "Devzira guruch, qo'y go'shti, bedana tuxumi", price: "45 000", img: "1512058564366-18510be2db19", tag: "Imzo" },
  { cat: "Milliy", name: "Qozon kabob", text: "Yosh qo'zi, kartoshka, ziravorlar", price: "65 000", img: "1555939594-58d7cb561ad1" },
  { cat: "Milliy", name: "Qo'lbola manti", text: "Qo'y go'shti va dumba, qatiq bilan", price: "38 000", img: "1546833999-b9f581a1996d" },
  { cat: "Yevropa", name: "Mol go'shti steyki", text: "Ribay, grill sabzavotlar, sous", price: "120 000", img: "1600565193348-f74bd3c7ccdf", tag: "Yangi" },
  { cat: "Yevropa", name: "Dengiz mahsulotli paella", text: "Krevetka, midiya, za'faron", price: "95 000", img: "1414235077428-338989a2e8c0" },
  { cat: "Yevropa", name: "Margarita pitsa", text: "Tosh pechda, mozzarella", price: "55 000", img: "1565299624946-b28f40a0ae38" },
  { cat: "Salatlar", name: "Grek salati", text: "Feta, zaytun, bodring, pomidor", price: "32 000", img: "1540189549336-e6e99c3679fe" },
  { cat: "Salatlar", name: "Achchiq-chuchuk", text: "Pomidor, piyoz, ko'kat", price: "18 000", img: "1507048331197-7d4ac70811cf" },
];

const PACKS = [
  { name: "Standart", text: "Salatlar, osh, meva, choy", price: 120000 },
  { name: "Premium", text: "+ issiq taom, kabob, shirinlik", price: 185000 },
  { name: "Lyuks", text: "+ Yevropa menyusi, furshet, tort", price: 260000 },
];

const CLASSES = [
  { day: 5, month: "OKT", name: "Haqiqiy to'y oshi", text: "Guruch tanlash, zirvak sirlari, qozon bilan ishlash.", price: "350 000 so'm", seats: 10, taken: 7 },
  { day: 12, month: "OKT", name: "Manti va chuchvara", text: "Xamir, qiyma va buklash texnikasi — 6 xil shakl.", price: "300 000 so'm", seats: 8, taken: 8 },
  { day: 19, month: "OKT", name: "Italyan oqshomi", text: "Uy pastasi, risotto va tiramisu.", price: "450 000 so'm", seats: 10, taken: 3 },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const money = (n) => Math.round(n).toLocaleString("ru-RU").replace(/[  ,]/g, " ") + " so'm";

  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2800); };

  // Header / menu
  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
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
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => $("#" + b.dataset.goto).scrollIntoView({ behavior: "smooth" })));

  // Menu tabs
  const cats = ["Barchasi", ...new Set(MENU.map((m) => m.cat))];
  $("#menuTabs").innerHTML = cats.map((c, i) => `<button class="${i ? "" : "active"}" data-cat="${c}">${c}</button>`).join("");
  const renderMenu = (cat) => {
    $("#menuList").innerHTML = MENU.filter((m) => cat === "Barchasi" || m.cat === cat).map((m, i) => `<div class="dish" style="animation-delay:${i * 50}ms"><img src="${IMG(m.img)}" alt="${m.name}" loading="lazy"><div><h3>${m.name}${m.tag ? `<span class="tag">${m.tag}</span>` : ""}</h3><p>${m.text}</p></div><b>${m.price}</b></div>`).join("");
  };
  $("#menuTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    $$("#menuTabs button").forEach((x) => x.classList.toggle("active", x === b));
    renderMenu(b.dataset.cat);
  });
  renderMenu("Barchasi");

  // Catering calculator
  let pack = 1;
  $("#packs").innerHTML = PACKS.map((p, i) => `<button type="button" class="pack ${i === pack ? "active" : ""}" data-pack="${i}"><b>${p.name}</b><small>${p.text}</small><em>${money(p.price)} / kishi</em></button>`).join("");
  const calc = () => {
    const g = +$("#guests").value;
    $("#guestsOut").textContent = g;
    const lines = [[`${PACKS[pack].name} menyu × ${g}`, PACKS[pack].price * g]];
    $$(".extras input:checked").forEach((c) => lines.push([`${c.dataset.name} × ${g}`, +c.value * g]));
    let sum = lines.reduce((s, l) => s + l[1], 0);
    const discount = g >= 300 ? Math.round(sum * 0.07) : 0;
    if (discount) lines.push(["Katta tadbir chegirmasi (−7%)", -discount]);
    sum -= discount;
    $("#receiptLines").innerHTML = lines.map(([n, v]) => `<div class="line"><span>${n}</span><span>${v < 0 ? "−" + money(-v) : money(v)}</span></div>`).join("");
    $("#total").textContent = money(sum);
    $("#per").textContent = `≈ ${money(sum / g)} bir mehmonga`;
    const rice = Math.ceil(g * 0.12), meat = Math.ceil(g * 0.1), carrot = Math.ceil(g * 0.12);
    $("#plovInfo").innerHTML = `🍚 Osh uchun kerak bo'ladi: <b>${rice} kg</b> guruch, <b>${meat} kg</b> go'sht, <b>${carrot} kg</b> sabzi — ${Math.ceil(g / 150)} ta qozonda.`;
  };
  $("#packs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pack]");
    if (!b) return;
    pack = +b.dataset.pack;
    $$(".pack").forEach((x) => x.classList.toggle("active", x === b));
    calc();
  });
  $("#calcForm").addEventListener("input", calc);
  calc();

  // Master classes
  const booked = new Set();
  const renderClasses = () => {
    $("#classList").innerHTML = CLASSES.map((c, i) => {
      const taken = c.taken + (booked.has(i) ? 1 : 0);
      const full = taken >= c.seats;
      return `<article class="class"><time>${c.day}<small>${c.month}</small></time><h3>${c.name}</h3><p>${c.text}</p><div class="seats">${full ? "Joy qolmadi" : `Bo'sh joy: ${c.seats - taken} / ${c.seats}`} · ${c.price}</div><div class="seats__bar"><span style="width:${(taken / c.seats) * 100}%"></span></div><button class="btn btn--orange" data-class="${i}" ${full || booked.has(i) ? "disabled" : ""}>${booked.has(i) ? "✓ Yozildingiz" : full ? "Kutish ro'yxati" : "Joy band qilish"}</button></article>`;
    }).join("");
  };
  $("#classList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-class]");
    if (!b || b.disabled) return;
    booked.add(+b.dataset.class);
    renderClasses();
    notify(`🍳 "${CLASSES[b.dataset.class].name}" master-klassiga joy band qilindi!`);
  });
  renderClasses();

  // Order modal
  const modal = $("#modal"), form = $("#orderForm"), success = $("#orderSuccess");
  const date = $("#orderDate");
  date.min = new Date(Date.now() + 2 * 864e5).toISOString().split("T")[0];
  const open = (kind) => {
    form.hidden = false; success.hidden = true;
    $("#modalTitle").textContent = kind ? `Buyurtma: ${kind}` : "Buyurtma";
    $("#modalNote").textContent = kind === "Keytering" ? `${$("#guestsOut").textContent} mehmon · ${PACKS[pack].name} · ${$("#total").textContent}` : "Menyu va vaqtni telefonda kelishamiz.";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-order]").forEach((b) => b.addEventListener("click", () => open(b.dataset.order)));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); form.hidden = true; success.hidden = false; form.reset(); });

  // Reveal
  const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    revealer.unobserve(e.target);
  }), { threshold: 0.1 });
  $$(".reveal").forEach((el) => revealer.observe(el));

  $("#year").textContent = new Date().getFullYear();
});
