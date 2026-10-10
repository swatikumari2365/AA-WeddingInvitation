/* ===================== EDIT THESE ===================== */
const WEDDING = {
  bride: { name: "Arpana",   relation: "Daughter of", parents: ["Ram Sewak Prasad", "Pushpa Gupta"] },
  groom: { name: "Abhishek", relation: "Son of", parents: ["Late Kedar Prasad", "Late Mamta Devi"] },
  main: {
    date: "2nd December 2026", time: "7:00 PM onwards",
    startsAt: "2026-12-02T19:00:00+05:30", // countdown target (IST) — change if the time changes
    quote: "Two hearts, two families, one beautiful beginning. Your blessings and presence will make our day complete.",
    inviteLine: "With folded hands, we invite you all to celebrate with us",
    venue: ["Destination Banquet Hall", "Daladali Chowk, Ring Road", "Ranchi"],
    // REPLACE with your real Google Maps link:
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Destination+Banquet+Hall+Daladali+Chowk+Ring+Road+Ranchi"
  }
};
// REPLACE / ADD events here (icon is any emoji)
const EVENTS = {
  bride: { title: "Bride's Side", list: [
    { date: "30th November 2026", name: "Mehendi", time: "9:00 AM onwards", venue: "Our Home, Lapra", icon: "🌿" },
    { date: "30th November 2026", name: "Haldi",   time: "5:00 PM onwards", venue: "Our Home, Lapra", icon: "🌼" },
    { date: "1st December 2026",  name: "Marwa, Ghiwdhari", time: "9:00 AM onwards", venue: "Our Home, Lapra", icon: "🪔" },
    { date: "1st December 2026",  name: "Sangeet", time: "6:00 PM onwards", venue: "Our Home, Lapra", icon: "🥁" } ] },
  groom: { title: "Groom's Side", list: [
    { date: "30th November 2026", name: "Tilak", time: "9:00 AM onwards", venue: "Krishna Inn, Ratu Road, Ranchi", icon: "🔱" },
    { date: "1st December 2026",  name: "Marwa, Ghiwdhari", time: "9:00 AM onwards", venue: "Krishna Inn, Ratu Road, Ranchi", icon: "🪔" } ] }
};
/* ====================================================== */

const $ = (s, r = document) => r.querySelector(s);
/* turns "30th" into 30<sup>th</sup> */
const fmtDate = d => d.replace(/(\d+)(st|nd|rd|th)/g, "$1<sup>$2</sup>");
const set = (id, t) => { $(id).textContent = t; };
set("#introBride", WEDDING.bride.name); set("#introGroom", WEDDING.groom.name);
set("#brideName2", WEDDING.bride.name); set("#groomName2", WEDDING.groom.name);
// "Daughter of / Son of" on line 1, parents' names on line 2 (each name stays unbroken)
const parentsHTML = p => `${p.relation}<br>` + p.parents.map(n => `<span class="pn">${n}</span>`).join(" &amp; ");
$("#brideParents").innerHTML = parentsHTML(WEDDING.bride); $("#groomParents").innerHTML = parentsHTML(WEDDING.groom);
set("#wedBride", WEDDING.bride.name); set("#wedGroom", WEDDING.groom.name);
$("#wedDate").innerHTML = fmtDate(WEDDING.main.date); set("#wedTime", WEDDING.main.time);
$("#wedVenue").innerHTML = WEDDING.main.venue.join("<br>");
$("#mapBtn").href = WEDDING.main.mapsUrl;
set("#inviteLine", WEDDING.main.inviteLine); set("#quote", "“" + WEDDING.main.quote + "”");

/* page navigation (no reload) */
let current = $("#intro"), busy = false;
function go(id) {
  const next = document.getElementById(id);
  if (busy || next === current) return;
  busy = true; current.classList.add("leaving"); current.classList.remove("active");
  setTimeout(() => {
    current.classList.remove("leaving");
    next.scrollTop = 0; next.classList.add("active"); current = next;
    if (id === "events") revealEvents();
    if (id === "wedding") celebrate();
    busy = false;
  }, 600);
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]"), s = e.target.closest("[data-side]");
  if (b) go(b.dataset.go);
  if (s) { renderEvents(s.dataset.side); go("events"); }
  const r = e.target.closest(".btn");
  if (r) { const rc = r.getBoundingClientRect(), d = Math.max(rc.width, rc.height), sp = document.createElement("span");
    sp.className = "ripple"; sp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rc.left - d/2}px;top:${e.clientY - rc.top - d/2}px`;
    r.appendChild(sp); setTimeout(() => sp.remove(), 650); }
});

/* events timeline */
function renderEvents(side) {
  const data = EVENTS[side], tl = $("#timeline");
  set("#eventsTitle", data.title);
  tl.className = "timeline " + side;
  tl.innerHTML = data.list.map(ev => `
    <article class="ev"><span class="ico" aria-hidden="true">${ev.icon}</span>
      <div class="d">${fmtDate(ev.date)}</div><h3>${ev.name}</h3><p>${ev.time}</p><p>${ev.venue}</p></article>`).join("");
}
let io;
function revealEvents() {
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { setTimeout(() => en.target.classList.add("show"), en.target.dataset.i * 150); io.unobserve(en.target); }
  }), { root: $("#events"), threshold: .15 });
  document.querySelectorAll(".ev").forEach((el, i) => { el.dataset.i = i % 3; io.observe(el); });
}

/* floating petals */
(function petals() {
  const box = $("#petals"), n = matchMedia("(max-width:600px)").matches ? 14 : 26;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span"); p.className = "petal" + (i % 4 === 0 ? " gold" : "");
    p.style.cssText = `left:${Math.random()*100}%;--dx:${Math.random()*160-80}px;animation-duration:${9+Math.random()*10}s;animation-delay:${-Math.random()*18}s;transform:scale(${.6+Math.random()*.8})`;
    box.appendChild(p);
  }
})();

/* countdown to the wedding */
(function countdown() {
  const target = new Date(WEDDING.main.startsAt).getTime(), box = $("#countdown");
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const t = target - Date.now();
    if (t <= 0) { box.innerHTML = '<p class="live">The celebration has begun! 🎉</p>'; return; }
    const v = [Math.floor(t/864e5), Math.floor(t%864e5/36e5), Math.floor(t%36e5/6e4), Math.floor(t%6e4/1e3)];
    ["days","hours","mins","secs"].forEach((k, i) => { const el = $("#cd-" + k); if (el) el.textContent = pad(v[i]); });
  }
  box.innerHTML = [["days","Days"],["hours","Hours"],["mins","Minutes"],["secs","Seconds"]]
    .map(([k, l]) => `<div class="cd"><b id="cd-${k}">00</b><span>${l}</span></div>`).join("");
  tick(); setInterval(tick, 1000);
})();

/* celebration: petal & confetti burst when the wedding page opens */
function celebrate() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const box = $("#confetti"), cols = ["#8a2434","#b08d3c","#e6cf8e","#c24a5c","#f3e7cf"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("span"); c.className = "confetti";
    c.style.cssText = `left:${Math.random()*100}%;background:${cols[i%5]};--dx:${Math.random()*240-120}px;animation-duration:${3+Math.random()*3}s;animation-delay:${Math.random()*1.2}s;border-radius:${i%3?"2px":"50%"}`;
    box.appendChild(c); setTimeout(() => c.remove(), 7500);
  }
}
/* twinkling sparkles on the wedding page */
(function sparkles() {
  const box = $("#sparkles");
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span"); s.className = "spark";
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*4}s;animation-duration:${2+Math.random()*3}s`;
    box.appendChild(s);
  }
})();

/* background music — browsers block sound until the visitor touches the page,
   so we try on load and otherwise start on the very first tap/click/scroll/key */
(function music() {
  const a = $("#bgm"), btn = $("#musicBtn"); let wantOn = true;
  a.volume = 0.6;
  const sync = () => { const on = !a.paused; btn.classList.toggle("off", !on); btn.setAttribute("aria-pressed", on); };
  const start = () => wantOn && a.play().then(() => { sync(); unbind(); }).catch(() => {});
  const evs = ["pointerdown", "touchstart", "click", "keydown", "wheel"];
  const unbind = () => evs.forEach(e => document.removeEventListener(e, start, true));
  evs.forEach(e => document.addEventListener(e, start, true));
  a.play().then(() => { sync(); unbind(); }).catch(sync);
  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (a.paused) { wantOn = true; a.play().then(sync); } else { wantOn = false; a.pause(); sync(); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) a.pause(); else if (wantOn) a.play().then(sync).catch(() => {}); });
})();
