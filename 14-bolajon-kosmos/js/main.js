const IMG = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const CARTOONS = [
  { title: "Yo'qolgan Oy", time: "12:45", img: "1446941611757-91d2c3bd3d45", story: [
    ["1446941611757-91d2c3bd3d45", "Bir kuni Nova osmonga qarasa... Oy yo'q!"],
    ["1419242902214-272b3f66ee7a", "Do'stlari bilan kemaga o'tirib, qidiruvga chiqishdi."],
    ["1462331940025-496dfbfc7564", "Rangli tumanlik orasida kichkina nur ko'rindi."],
    ["1446941611757-91d2c3bd3d45", "Oy shunchaki Yer soyasida yashiringan ekan — bu Oy tutilishi! 🌒"],
  ] },
  { title: "Robotni qutqarish", time: "11:30", img: "1485827404703-89b55fcc595e", story: [
    ["1485827404703-89b55fcc595e", "Ziggi robotning batareyasi tugab qoldi!"],
    ["1561144257-e32e8efc6c4f", "Bolalar quyosh panellarini topishga ahd qilishdi."],
    ["1446776811953-b23d57bd21aa", "Kosmik stansiyada quyosh nuri juda ko'p ekan."],
    ["1485827404703-89b55fcc595e", "Ziggi yana quvnoq! Quyosh — toza energiya manbai ☀️"],
  ] },
  { title: "Kometa quvish", time: "13:02", img: "1543722530-d2c3201371e7", story: [
    ["1543722530-d2c3201371e7", "Galaktikada yorug' dumli mehmon paydo bo'ldi."],
    ["1502134249126-9f3755a50d78", "Bu kometa! U muz va changdan iborat."],
    ["1464802686167-b939a6910659", "Quyoshga yaqinlashganda dumi uzayib, porlaydi."],
    ["1543722530-d2c3201371e7", "Komet dumi har doim Quyoshdan teskari tomonga qaraydi ☄️"],
  ] },
  { title: "Mars siri", time: "12:18", img: "1630694093867-4b947d812bf0", story: [
    ["1630694093867-4b947d812bf0", "Orbit o'zga sayyoralikdan xat keldi: \"Marsga keling!\""],
    ["1614728894747-a83421e2b9c9", "Mars qizil, chunki tuprog'ida zang (temir oksidi) bor."],
    ["1541873676-a18131494184", "Skafandr kiyib, qizil qumda yurdik!"],
    ["1630694093867-4b947d812bf0", "Marsda bir kun Yerdagidan 40 daqiqa uzunroq 🔴"],
  ] },
];

const SCIENCE = [
  { title: "Vulqon yasash", icon: "🌋", img: "1532187643603-ba119ca4109e", need: "Soda, sirka, idish uchun suyuqlik bo'yog'i, stakan", steps: ["Stakanni tovoq ustiga qo'ying.", "Ichiga 2 qoshiq soda soling.", "Bir necha tomchi bo'yoq qo'shing.", "Kattalar yordamida sirka quying — vulqon otiladi! 🌋"], why: "Soda va sirka uchrashganda karbonat angidrid gazi hosil bo'ladi va ko'pik toshadi." },
  { title: "Kamalak yasash", icon: "🌈", img: "1534447677768-be436bb09401", need: "Shaffof stakan suv, oq qog'oz, quyoshli deraza", steps: ["Stakanni suvga to'ldiring.", "Uni quyosh tushib turgan derazaga qo'ying.", "Pastiga oq qog'oz qo'ying.", "Qog'ozda kamalak paydo bo'lishini kuzating! 🌈"], why: "Suv yorug'likni sindiradi va u 7 ta rangga ajraladi." },
  { title: "Quyosh tizimi", icon: "🪐", img: "1614732414444-096e5f1122d5", need: "Plastilin yoki rangli qog'oz, ip, karton", steps: ["8 ta turli o'lchamdagi shar yasang.", "Eng kattasini Quyosh qiling (sariq).", "Sayyoralarni tartib bilan joylashtiring.", "Nomlarini yozing: Merkuriy, Venera, Yer..."], why: "Yupiter eng katta sayyora — unga 1300 ta Yer sig'adi!" },
  { title: "Tuz kristali", icon: "💎", img: "1462331940025-496dfbfc7564", need: "Issiq suv (kattalar yordamida), tuz, ip, qalam, stakan", steps: ["Kattalar issiq suvga tuzni eritadi.", "Ipni qalamga bog'lab, suvga osiltiring.", "Stakanni tinch joyga qo'ying.", "3–5 kundan keyin kristallarni kuzating! 💎"], why: "Suv bug'langanda tuz zarrachalari ipda to'planib, kristall hosil qiladi." },
];

const CREW = [
  { icon: "👩‍🚀", name: "Nova", role: "Tadqiqotchi", fact: "Salom! Men Nova. Bilasanmi, kosmosda tovush eshitilmaydi, chunki havo yo'q!" },
  { icon: "🤖", name: "Ziggi", role: "Robot", fact: "Bip-bip! Men Ziggi. Xalqaro kosmik stansiya Yer atrofini 90 daqiqada aylanib chiqadi!" },
  { icon: "👩‍🔬", name: "Luna", role: "Olima", fact: "Men Lunaman. Oyda odam izlari millionlab yil saqlanadi — u yerda shamol yo'q!" },
  { icon: "👽", name: "Orbit", role: "O'zga sayyoralik", fact: "Men Orbit! Saturnning halqalari muz va toshlardan iborat." },
  { icon: "🧑‍✈️", name: "Kometa", role: "Uchuvchi", fact: "Men uchuvchi Kometa. Quyosh nuri Yerga 8 daqiqada yetib keladi!" },
];

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);

  // Starfield
  const sky = $("#stars");
  for (let i = 0; i < 120; i++) {
    const s = document.createElement("i");
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${2 + Math.random() * 4}s;--delay:${-Math.random() * 5}s;${Math.random() > .85 ? "width:3px;height:3px;" : ""}`;
    sky.appendChild(s);
  }

  // Toast
  const toast = $("#toast");
  let tt;
  const notify = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3000); };

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

  // Player profile (name + stars) kept per browser
  let player = store.get("bk-player", { name: "", stars: 0, weekly: 0 });
  const savePlayer = () => {
    store.set("bk-player", player);
    $("#starCount").textContent = player.stars;
    $("#loginText").textContent = player.name || "Kirish";
    const w = Math.min(player.weekly, 8);
    $("#challengeBar").style.width = (w / 8) * 100 + "%";
    $("#challengeInfo").textContent = w >= 8 ? "🏆 Chellenj bajarildi! Barakalla!" : `${w} / 8 yulduz`;
  };
  const addStars = (n, weekly = false) => { player.stars += n; if (weekly) player.weekly += n; savePlayer(); };
  savePlayer();

  // Modal
  const modal = $("#modal"), body = $("#modalBody");
  let cleanup = null;
  const open = (title, html) => {
    if (cleanup) { cleanup(); cleanup = null; }
    $("#modalTitle").textContent = title;
    body.innerHTML = html;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  };
  const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (cleanup) { cleanup(); cleanup = null; } };
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); toggleMenu(false); } });

  $("#loginBtn").addEventListener("click", () => {
    open("Kosmonavt ismingni yoz 🧑‍🚀", `<form id="nameForm" class="result"><input id="nameInput" maxlength="20" value="${player.name}" placeholder="Masalan: Aziza" style="width:100%;padding:14px 18px;border-radius:16px;border:2px solid var(--line);background:rgba(255,255,255,.08);font-size:1.2rem;outline:none" required><p>Yulduzlaring: ⭐ ${player.stars}</p><button class="btn btn--yellow">Saqlash</button></form>`);
    $("#nameForm").addEventListener("submit", (e) => { e.preventDefault(); player.name = $("#nameInput").value.trim(); savePlayer(); close(); notify(`Xush kelibsan, kosmonavt ${player.name}! 🚀`); });
  });
  $("#rewardsLink").addEventListener("click", (e) => { e.preventDefault(); notify(`Sizda ⭐ ${player.stars} ta yulduz bor! O'yinlarda ko'proq to'plang.`); });

  // ---------- Game 1: Math mission ----------
  const mathGame = () => {
    const total = 8;
    let q = 0, score = 0;
    open("➕ Matematika missiyasi", `<div class="hud"><span>Savol <b id="qn">1</b>/${total}</span><span>⭐ <b id="sc">0</b></span></div><div class="track"><span class="track__rocket" id="rk" style="left:6%">🚀</span><span class="track__goal">🪐</span></div><div class="question" id="qq"></div><div class="answers" id="aa"></div>`);
    const next = () => {
      if (q === total) {
        addStars(score, true);
        body.innerHTML = `<div class="result"><span class="big">${score >= 6 ? "🏆" : score >= 3 ? "🌟" : "🚀"}</span><h3>${score >= 6 ? "Zo'r! Missiya bajarildi!" : "Yaxshi urinish!"}</h3><p>${total} ta savoldan ${score} tasiga to'g'ri javob berding.<br>+${score} ⭐ yulduz!</p><button class="btn btn--yellow" id="again">Yana o'ynash</button></div>`;
        $("#again").addEventListener("click", mathGame);
        return;
      }
      const plus = Math.random() > .4;
      let a = rand(1, 9), b = rand(1, 9);
      if (!plus && b > a) [a, b] = [b, a];
      const ans = plus ? a + b : a - b;
      const opts = new Set([ans]);
      while (opts.size < 4) opts.add(Math.max(0, ans + rand(-4, 4)));
      $("#qn").textContent = q + 1;
      $("#qq").textContent = `${a} ${plus ? "+" : "−"} ${b} = ?`;
      $("#aa").innerHTML = shuffle([...opts]).map((o) => `<button data-v="${o}">${o}</button>`).join("");
      $$("#aa button").forEach((btn) => btn.addEventListener("click", () => {
        const ok = +btn.dataset.v === ans;
        $$("#aa button").forEach((x) => { x.disabled = true; if (+x.dataset.v === ans) x.classList.add("right"); });
        if (!ok) btn.classList.add("wrong");
        if (ok) score++;
        q++;
        $("#sc").textContent = score;
        $("#rk").style.left = 6 + (q / total) * 82 + "%";
        setTimeout(next, 900);
      }));
    };
    next();
  };

  // ---------- Game 2: Memory ----------
  const memoryGame = () => {
    const faces = shuffle(["👽", "🚀", "🪐", "⭐", "🌙", "🤖"].flatMap((f) => [f, f]));
    let first = null, lock = false, moves = 0, found = 0;
    open("👽 Juftini top", `<div class="hud"><span>Yurishlar: <b id="mv">0</b></span><span>Topildi: <b id="fd">0</b>/6</span></div><div class="memory" id="mem">${faces.map((f, i) => `<button class="mcard" data-i="${i}" aria-label="Karta"><span>${f}</span></button>`).join("")}</div>`);
    $("#mem").addEventListener("click", (e) => {
      const c = e.target.closest(".mcard");
      if (!c || lock || c.classList.contains("flip") || c.classList.contains("done")) return;
      c.classList.add("flip");
      if (!first) { first = c; return; }
      moves++;
      $("#mv").textContent = moves;
      if (faces[first.dataset.i] === faces[c.dataset.i]) {
        [first, c].forEach((x) => x.classList.add("done"));
        first = null; found++;
        $("#fd").textContent = found;
        if (found === 6) {
          const stars = moves <= 10 ? 5 : moves <= 14 ? 3 : 1;
          addStars(stars);
          setTimeout(() => {
            body.innerHTML = `<div class="result"><span class="big">🎉</span><h3>Barakalla!</h3><p>Hamma juftlarni ${moves} ta yurishda topding.<br>+${stars} ⭐</p><button class="btn btn--yellow" id="again">Yana o'ynash</button></div>`;
            $("#again").addEventListener("click", memoryGame);
          }, 600);
        }
      } else {
        lock = true;
        setTimeout(() => { first.classList.remove("flip"); c.classList.remove("flip"); first = null; lock = false; }, 800);
      }
    });
  };

  // ---------- Game 3: Count the stars ----------
  const countGame = () => {
    let round = 0, score = 0;
    const rounds = 5;
    open("⭐ Yulduzlarni sana", `<div class="hud"><span>Raund <b id="rd">1</b>/${rounds}</span><span>⭐ <b id="cs">0</b></span></div><div class="count-sky" id="csky"></div><div class="answers" id="ca"></div>`);
    const next = () => {
      if (round === rounds) {
        addStars(score);
        body.innerHTML = `<div class="result"><span class="big">🌟</span><h3>Sanash ustasi!</h3><p>${rounds} tadan ${score} ta to'g'ri. +${score} ⭐</p><button class="btn btn--yellow" id="again">Yana o'ynash</button></div>`;
        $("#again").addEventListener("click", countGame);
        return;
      }
      const icon = ["⭐", "🪐", "🚀", "🌙", "👽"][round];
      const n = rand(2, 10);
      $("#rd").textContent = round + 1;
      $("#csky").innerHTML = Array.from({ length: n }, (_, i) => `<span style="animation-delay:${i * 70}ms">${icon}</span>`).join("");
      const opts = new Set([n]);
      while (opts.size < 4) opts.add(Math.max(1, n + rand(-3, 3)));
      $("#ca").innerHTML = shuffle([...opts]).map((o) => `<button data-v="${o}">${o}</button>`).join("");
      $$("#ca button").forEach((btn) => btn.addEventListener("click", () => {
        $$("#ca button").forEach((x) => { x.disabled = true; if (+x.dataset.v === n) x.classList.add("right"); });
        if (+btn.dataset.v === n) score++; else btn.classList.add("wrong");
        round++;
        $("#cs").textContent = score;
        setTimeout(next, 900);
      }));
    };
    next();
  };

  const games = { math: mathGame, memory: memoryGame, count: countGame };
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-game]");
    if (g) games[g.dataset.game]();
    const soon = e.target.closest("[data-soon]");
    if (soon) notify(`🚧 "${soon.dataset.soon}" tez orada ishga tushadi!`);
    const c = e.target.closest("[data-cartoon]");
    if (c) playCartoon(+c.dataset.cartoon);
    const s = e.target.closest("[data-science]");
    if (s) showScience(+s.dataset.science);
  });

  // ---------- Cartoons (story slideshow) ----------
  $("#cartoonCards").innerHTML = CARTOONS.map((c, i) => `<button class="tile" data-cartoon="${i}"><img src="${IMG(c.img, 400)}" alt="" loading="lazy"><span class="play">▶</span><span class="tile__label">${c.title}</span><span class="tile__time">${c.time}</span></button>`).join("");
  const playCartoon = (i) => {
    const c = CARTOONS[i];
    open(`📺 ${c.title}`, `<div class="story" id="story">${c.story.map(([img, text], k) => `<img src="${IMG(img, 1000)}" alt="" class="${k ? "" : "active"}" data-text="${text.replace(/"/g, "&quot;")}">`).join("")}<p id="storyText"></p></div><div class="story-bar" id="sbar">${c.story.map(() => "<span></span>").join("")}</div>`);
    const imgs = $$("#story img"), bars = $$("#sbar span");
    let k = 0;
    const show = () => {
      imgs.forEach((im, j) => im.classList.toggle("active", j === k));
      bars.forEach((b, j) => { b.className = j < k ? "done" : j === k ? "now" : ""; });
      $("#storyText").textContent = imgs[k].dataset.text;
    };
    show();
    const t = setInterval(() => {
      k++;
      if (k >= imgs.length) {
        clearInterval(t);
        addStars(1);
        body.insertAdjacentHTML("beforeend", `<div class="result"><p>Qism tugadi! +1 ⭐</p><button class="btn btn--yellow btn--sm" id="replay">Qayta ko'rish</button></div>`);
        $("#replay").addEventListener("click", () => playCartoon(i));
        return;
      }
      show();
    }, 4500);
    cleanup = () => clearInterval(t);
  };

  // ---------- Science activities ----------
  $("#scienceCards").innerHTML = SCIENCE.map((s, i) => `<button class="tile" data-science="${i}"><img src="${IMG(s.img, 400)}" alt="" loading="lazy"><span class="tile__label">${s.icon} ${s.title}</span></button>`).join("");
  const showScience = (i) => {
    const s = SCIENCE[i];
    open(`${s.icon} ${s.title}`, `<p class="need"><b>Kerak bo'ladi:</b> ${s.need}</p><ol class="steps">${s.steps.map((x) => `<li>${x}</li>`).join("")}</ol><p><b>Nega shunday bo'ladi?</b> ${s.why}</p><p class="safety" style="margin-top:12px">⚠️ Tajribalarni faqat kattalar yordamida bajaring!</p><div class="result"><button class="btn btn--yellow btn--sm" id="doneExp">Men buni qildim! ⭐</button></div>`);
    $("#doneExp").addEventListener("click", () => { addStars(2); close(); notify(`Ajoyib olim! "${s.title}" uchun +2 ⭐`); });
  };

  // ---------- Crew ----------
  $("#crewList").innerHTML = CREW.map((c, i) => `<button class="buddy" data-buddy="${i}"><span>${c.icon}</span><b>${c.name}</b><small>${c.role}</small></button>`).join("");
  $("#crewList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-buddy]");
    if (!b) return;
    $$(".buddy").forEach((x) => x.classList.toggle("active", x === b));
    notify(`${CREW[b.dataset.buddy].icon} ${CREW[b.dataset.buddy].fact}`);
  });

  // ---------- Parents: screen-time timer ----------
  let screenTimer = null;
  $("#timerBtn").addEventListener("click", () => {
    const note = $("#timerNote");
    if (screenTimer) { clearInterval(screenTimer); screenTimer = null; note.hidden = true; $("#timerBtn").textContent = "⏱ Ekran vaqti taymerini yoqish →"; return; }
    let left = 30 * 60;
    note.hidden = false;
    $("#timerBtn").textContent = "⏹ Taymerni o'chirish";
    const tick = () => {
      note.textContent = `Qolgan vaqt: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      if (left-- <= 0) { clearInterval(screenTimer); screenTimer = null; notify("⏰ Ekran vaqti tugadi! Endi dam olamiz yoki tashqarida o'ynaymiz 🌳"); }
    };
    tick();
    screenTimer = setInterval(tick, 1000);
  });

  $("#year").textContent = new Date().getFullYear();
});
