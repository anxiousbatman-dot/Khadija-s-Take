import { SpeedInsights } from "@vercel/speed-insights/next"
const fmt = d =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
// Newest first, by date. Used for "Latest post", "Recent posts" and Updates.
const byDate = [...POSTS].sort((x, y) => y.date.localeCompare(x.date));
const postUrl = p => `post.html?slug=${encodeURIComponent(p.slug)}`;
// "Your take" area: a heart like button and the comments.
// Once Firebase is set up in posts.js, likes and comments both live in Firebase (see comments.js).
// Until then, likes use Abacus (a free counting service) and the comment area shows a notice.
const COUNT_API = "https://abacus.jasoncameron.dev";
const COUNT_NS = "khadijas-take-blog";
const slugKey = slug => slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const countCall = (action, key) =>
  fetch(`${COUNT_API}/${action}/${COUNT_NS}/${key}`)
    .then(r => r.json())
    .then(d => Number(d && d.value) || 0)
    .catch(err => { console.warn("Like counter unreachable:", err); return null; });

function addComments(p) {
  const section = main.querySelector("section");
  const useFirebase = !!(SITE.firebase && SITE.firebase.apiKey);

  document.head.insertAdjacentHTML("beforeend", `<style>
    .take-bar { margin-top: 1.5rem; }
    .like { display: inline-flex; align-items: center; gap: .5rem; margin: 0 .5rem .8rem; padding: .25rem .8rem .25rem .5rem; background: none; border: 1px solid var(--line); border-radius: 999px; font: inherit; color: var(--ink); cursor: pointer; }
    .like svg path { fill: none; stroke: var(--head); stroke-width: 2; transition: fill .15s, stroke .15s; }
    .like.liked svg path { fill: #e0245e; stroke: #e0245e; }
    .like:focus-visible { outline: 2px dashed var(--link); outline-offset: 2px; }
    #comments-box { margin: 0 .5rem; }
  </style>`);

  section.insertAdjacentHTML("beforeend", `
    <h2 class="bar take-bar">Your take</h2>
    <button class="like" id="like-btn" type="button" aria-pressed="false" aria-label="Like this post">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span id="like-count">0</span>
    </button>
    <div id="comments-box"></div>`);

  const btn = document.getElementById("like-btn");
  const num = document.getElementById("like-count");
  const box = document.getElementById("comments-box");

  if (useFirebase) {
    import("./comments.js")
      .then(m => m.mountFirebase({ btn, num, box, post: p, site: SITE }))
      .catch(err => {
        console.warn("Firebase part failed to load:", err);
        box.innerHTML = `<p class="pad">Comments couldn't load right now.</p>`;
      });
    return;
  }

  // Not set up yet: likes use Abacus, and the comment area shows a notice.
  box.innerHTML = `<p class="pad">Comments are coming soon.</p>`;
  const saved = "liked:" + p.slug;
  const keyUp = "like-" + slugKey(p.slug);
  const keyDown = "unlike-" + slugKey(p.slug);
  let liked = false;
  try { liked = localStorage.getItem(saved) === "1"; } catch (e) {}
  let likes = 0, unlikes = 0;

  const paint = () => {
    btn.classList.toggle("liked", liked);
    btn.setAttribute("aria-pressed", String(liked));
    num.textContent = Math.max(0, likes - unlikes);
  };
  paint();

  Promise.all([countCall("get", keyUp), countCall("get", keyDown)]).then(([a, b]) => {
    likes = a || 0;
    unlikes = b || 0;
    paint();
  });

  btn.addEventListener("click", () => {
    liked = !liked;
    const isLike = liked;
    if (isLike) likes++; else unlikes++;
    paint();
    try { localStorage.setItem(saved, liked ? "1" : "0"); } catch (e) {}
    countCall("hit", isLike ? keyUp : keyDown).then(v => {
      if (v === null) return;   // service unreachable: keep what is on screen
      if (isLike) likes = v; else unlikes = v;
      paint();
    });
  });
}

// If a post body is plain text (no HTML tags), make each line its own paragraph.
// dir="auto" lets Arabic lines flow right-to-left on their own.
const formatBody = html =>
  /<\w+[^>]*>/.test(html)
    ? html
    : html.split("\n").map(t => t.trim()).filter(Boolean).map(t => `<p dir="auto">${t}</p>`).join("");
// Hide a picture quietly if the file is not there yet
const img = (src, alt = "") => (src ? `<img src="${src}" alt="${alt}" onerror="this.remove()">` : "");

document.querySelectorAll("[data-site-name]").forEach(el => (el.textContent = SITE.name));
document.querySelectorAll("[data-site-tagline]").forEach(el => (el.textContent = SITE.tagline));
document.getElementById("year").textContent = new Date().getFullYear();

// Sections of the site (shown in the Menu box). Each post belongs to one through its "category" in posts.js.
const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "articles", label: "Articles" },
  { id: "art", label: "Art" },
  { id: "diary", label: "Diary" },
  { id: "updates", label: "Updates" }
];
const catOf = p => p.category || "articles";
const KIND = { articles: "article", art: "art post", "diary": "diary post" };
const sectionHref = id => `index.html#${id}`;

// Left sidebar
const side = (title, items, cls = "") =>
  `<div class="side-box ${cls}"><h3>${title}</h3><ul>${items.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
// Small pink tile with a music note. If the playlist picture exists it covers the tile.
const noteIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>`;
const playlistLink = pl =>
  `<a class="pl" href="${pl.url}" target="_blank" rel="noopener"><span class="pl-img">${noteIcon}${
    pl.image ? `<img src="${pl.image}" alt="" onerror="this.remove()">` : ""
  }</span><span>${pl.name}</span></a>`;
document.getElementById("sidebar").innerHTML =
  side("Menu", SECTIONS.map(s => `<a href="${sectionHref(s.id)}" data-sec="${s.id}">${s.label}</a>`)) +
  side("Playlists", (SITE.playlists || []).map(playlistLink), "playlists") +
  side("Links", SITE.links.filter(l => l.url).map(l => `<a href="${l.url}">${l.text}</a>`));

document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap">`);
document.head.insertAdjacentHTML("beforeend", `<style>
  .side-box a[aria-current] { font-weight: 700; text-decoration: underline; }
  .side-box.playlists ul { padding-left: .6rem; list-style: none; }
  .side-box.playlists li { margin: .4rem 0; }
  .pl { display: flex; align-items: center; gap: .55rem; }
  .pl-img { position: relative; flex: none; display: flex; align-items: center; justify-content: center; width: 2.1rem; height: 2.1rem; overflow: hidden; background: var(--head); border: 1px solid var(--line); border-radius: 4px; }
  .pl-img svg { width: 1.1rem; height: 1.1rem; fill: #fff; }
  .pl-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .notes { margin: 0 .5rem; padding: 0; list-style: none; }
  .note { display: flex; gap: .7rem; align-items: flex-start; margin-bottom: .6rem; padding: .6rem .8rem; background: var(--entry); border: 1px solid var(--line); }
  .note svg { flex: none; margin-top: .25rem; fill: var(--ink); }
  .note p { margin: 0; }
  .note-date { display: block; font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); }
  .about-card { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 1.4rem; align-items: start; padding: 0 .5rem; }
  .about-pic { position: relative; display: flex; align-items: center; justify-content: center; aspect-ratio: 4 / 5; overflow: hidden; background: var(--strip); border: 3px solid var(--head); border-radius: 18px; }
  .about-pic span { padding: 1rem; text-align: center; font: 700 1.3rem/1.2 "Fredoka", Quicksand, Verdana, sans-serif; color: var(--head); }
  .about-pic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .about-hi { margin: 0; font: 500 1.25rem/1.25 "Fredoka", Quicksand, Verdana, sans-serif; color: var(--ink); }
  .about-name { font-weight: 700; font-size: 2.1rem; }
  .about-nick { display: block; margin: .15rem 0 1.1rem; font: 700 clamp(2.6rem, 7vw, 3.6rem)/.95 "Fredoka", Quicksand, Verdana, sans-serif; color: var(--head); }
  .about-text p:not(.about-hi) { margin: 0 0 .7rem; }
  @media (max-width: 720px) { .about-card { grid-template-columns: 1fr; } .about-pic { max-height: 24rem; } }
</style>`);

const main = document.getElementById("main");
const setActive = id =>
  document.querySelectorAll("[data-sec]").forEach(a =>
    a.dataset.sec === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));

// Pieces used by the section pages
const shortDate = d => {
  const dt = new Date(d + "T00:00:00");
  const opts = { month: "long", day: "numeric" };
  if (dt.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return dt.toLocaleDateString("en-US", opts);
};
const section = (title, inner) => `<section><h2 class="bar">${title}</h2>${inner}</section>`;
const card = p => `
  <article class="entry">
    <h3 class="entry-title"><a href="${postUrl(p)}">${p.title} - ${fmt(p.date)}</a></h3>
    <div class="entry-body">
      ${img(p.image, p.title)}
      <div><p>${p.summary}</p><p><a href="${postUrl(p)}">Read more</a></p></div>
    </div>
  </article>`;
const bell = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22zm6-6v-5a6 6 0 0 0-4.5-5.8v-.7a1.5 1.5 0 0 0-3 0v.7A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;

// Introduction card: picture on the left, "Hi, I'm ..." and your text on the right
function aboutCard() {
  const paras = (SITE.about || "").split("\n").map(t => t.trim()).filter(Boolean)
    .map(t => `<p dir="auto">${t}</p>`).join("");
  const nick = SITE.aboutNickname
    ? `<p class="about-hi">You can call me <strong class="about-nick">${SITE.aboutNickname}</strong></p>` : "";
  return `
    <div class="about-card">
      <div class="about-pic"><span>my picture</span></div>
      <div class="about-text">
        <p class="about-hi">Hi, I'm <strong class="about-name">${SITE.aboutName}</strong></p>
        ${nick}
        ${paras}
      </div>
    </div>`;
}

// Finds your photo. It tries the address in posts.js first, then my-picture.jpg / .jpeg / .png / .webp
// in the images folder and next to index.html, and adds the first one that exists.
function loadAboutPicture() {
  const holder = document.querySelector(".about-pic");
  if (!holder) return;
  const urls = SITE.aboutPicture ? [SITE.aboutPicture] : [];
  for (const dir of ["images/", ""]) {
    for (const ext of ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG"]) urls.push(`${dir}my-picture.${ext}`);
  }
  const list = [...new Set(urls)];
  const tryNext = i => {
    if (i >= list.length) return;   // none found: the "my picture" box stays
    const im = new Image();
    im.onload = () => { im.alt = SITE.aboutName || ""; holder.appendChild(im); };
    im.onerror = () => tryNext(i + 1);
    im.src = list[i];
  };
  tryNext(0);
}

function homePage() {
  return (
    section("Introduction", aboutCard()) +
    section("Latest post", byDate.length ? card(byDate[0]) : `<p class="pad">No posts yet.</p>`)
  );
}

// Articles, Art and Daily Life: the posts of that category, in the same order as in posts.js
function listPage(id) {
  const items = POSTS.filter(p => catOf(p) === id);
  const label = SECTIONS.find(s => s.id === id).label;
  return section(label, items.length ? items.map(card).join("") : `<p class="pad">Nothing here yet. Check back soon.</p>`);
}

// Updates: every post shows up here like a notification, newest first
function updatesPage() {
  return section("Updates", byDate.length
    ? `<ul class="notes">${byDate.map(p => `
        <li class="note">${bell}<div>
          <span class="note-date">${shortDate(p.date)}</span>
          <p>New ${KIND[catOf(p)] || "post"} posted: <a href="${postUrl(p)}">${p.title}</a></p>
        </div></li>`).join("")}</ul>`
    : `<p class="pad">No updates yet.</p>`);
}

function showSection() {
  const h = location.hash.replace("#", "");
  const id = SECTIONS.some(s => s.id === h) ? h : "home";
  const label = SECTIONS.find(s => s.id === id).label;
  document.title = id === "home" ? SITE.name : `${label} - ${SITE.name}`;
  main.innerHTML = id === "home" ? homePage() : id === "updates" ? updatesPage() : listPage(id);
  setActive(id);
  if (id === "home") loadAboutPicture();
}

const slug = new URLSearchParams(location.search).get("slug");

if (location.pathname.endsWith("post.html")) {
  // Single post
  const p = POSTS.find(x => x.slug === slug);
  if (p) {
    const sec = SECTIONS.find(s => s.id === catOf(p)) || SECTIONS[1];
    document.title = `${p.title} - ${SITE.name}`;
    main.innerHTML = `
      <section>
        <h2 class="bar">${p.title}</h2>
        <article class="entry">
          <h3 class="entry-title">Posted ${fmt(p.date)}</h3>
          <div class="entry-body full post">${formatBody(p.body)}</div>
        </article>
        <p class="back"><a href="${sectionHref(sec.id)}">Back to ${sec.label}</a></p>
      </section>`;
    setActive(sec.id);
    addComments(p);
  } else {
    document.title = `Post not found - ${SITE.name}`;
    main.innerHTML = `
      <section>
        <h2 class="bar">Post not found</h2>
        <p class="pad">That post doesn't exist. Check the link or pick one from the sidebar.</p>
        <p class="back"><a href="${sectionHref("home")}">Back to Home</a></p>
      </section>`;
  }
} else {
  showSection();
  window.addEventListener("hashchange", () => { showSection(); window.scrollTo(0, 0); });
}
