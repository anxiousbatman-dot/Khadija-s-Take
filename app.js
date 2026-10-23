const fmt = d =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const byDate = [...POSTS].sort((x, y) => y.date.localeCompare(x.date));
const postUrl = p => `post.html?slug=${encodeURIComponent(p.slug)}`;
const catOf = p => p.category || "articles";
const sectionHref = id => `index.html#${id}`;
const main = document.getElementById("main");

const SECTIONS = [
  { id: "about", label: "About me", file: "about-me" },
  { id: "articles", label: "Articles", file: "articles" },
  { id: "art", label: "Art & commissions", file: "commissions" },
  { id: "diary", label: "Diary", file: "diary" },
  { id: "updates", label: "Updates", file: "updates" }
];
const KIND = { articles: "article", art: "art post", diary: "diary post" };

const ARTWORKS = [
  // ratio = original width / original height, so no picture is ever cropped.
  // All pictures share the same height (set in style.css); width follows the ratio.
  { file: "angel-full-body.jpg", title: "Full body", type: "Full-body illustration", price: "30 DT", ratio: 1809 / 2560 },
  { file: "full-body-group.jpg", title: "Full body", type: "Full-body illustration", price: "25 DT", ratio: 2560 / 1920 },
  { file: "duo-rendered-half-body.jpg", title: "Rendered half-up", type: "Half-up illustration", price: "25 DT", ratio: 4 / 5 },
  { file: "rendered-half-body.jpg", title: "Fully rendered half-up", type: "Half-up illustration", price: "20 DT", ratio: 800 / 543 },
  { file: "flat-color-bust.jpg", title: "Flat-colour bust-up", type: "Bust-up illustration", price: "10 DT", ratio: 4 / 5 },
  { file: "poster.jpg", title: "Illustrated poster", type: "Poster design", price: "16 DT", ratio: 4 / 5 },
  { file: "sketch-01.jpg", title: "Character sketch", type: "Sketch", price: "10 DT", ratio: 600 / 800 },
  { file: "sketch-02.jpg", title: "Character sketch", type: "Sketch", price: "10 DT", ratio: 4 / 5 }
];

const COUNT_API = "https://abacus.jasoncameron.dev";
const COUNT_NS = "khadijas-take-blog";
const slugKey = slug => slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const countCall = (action, key) =>
  fetch(`${COUNT_API}/${action}/${COUNT_NS}/${key}`)
    .then(r => r.json())
    .then(d => Number(d && d.value) || 0)
    .catch(err => { console.warn("Like counter unreachable:", err); return null; });

let fbSource = "nowhere";
async function loadFirebaseConfig() {
  try {
    const m = await import("./config.js");
    if (m.default && m.default.apiKey) { fbSource = "config.js"; return m.default; }
  } catch (e) { /* config.js is generated at deployment when available */ }
  if (SITE.firebase && SITE.firebase.apiKey) { fbSource = "posts.js"; return SITE.firebase; }
  return null;
}

function addComments(p) {
  const section = main.querySelector("section");
  section.insertAdjacentHTML("beforeend", `
    <h2 class="take-title">Your take</h2>
    <button class="like" id="like-btn" type="button" aria-pressed="false" aria-label="Like this post">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span id="like-count">0</span>
    </button>
    <div id="comments-box"></div>`);

  const btn = document.getElementById("like-btn");
  const num = document.getElementById("like-count");
  const box = document.getElementById("comments-box");
  let dbg = () => {};
  if (new URLSearchParams(location.search).has("debug")) {
    section.insertAdjacentHTML("beforeend", `<pre id="dbg" class="debug-box">Checks (visible only in debug mode):</pre>`);
    dbg = line => { document.getElementById("dbg").textContent += "\n" + line; };
    dbg("Page address: " + location.host);
  }

  loadFirebaseConfig().then(cfg => {
    dbg(cfg ? `Firebase keys found in ${fbSource} (project: ${cfg.projectId})` : "NO Firebase keys found");
    if (!cfg) return startWithoutFirebase();
    import("./comments.js")
      .then(m => m.mountFirebase({ btn, num, box, post: p, site: { ...SITE, firebase: cfg }, debug: dbg }))
      .catch(err => {
        console.warn("Firebase part failed to load:", err);
        box.innerHTML = `<p class="pad">Comments could not be loaded.</p>`;
      });
  });

  function startWithoutFirebase() {
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
      likes = a || 0; unlikes = b || 0; paint();
    });
    btn.addEventListener("click", () => {
      liked = !liked;
      if (liked) likes++; else unlikes++;
      paint();
      try { localStorage.setItem(saved, liked ? "1" : "0"); } catch (e) {}
      countCall("hit", liked ? keyUp : keyDown).then(v => {
        if (v === null) return;
        if (liked) likes = v; else unlikes = v;
        paint();
      });
    });
  }
}

const formatBody = html =>
  /<\w+[^>]*>/.test(html)
    ? html
    : html.split("\n").map(t => t.trim()).filter(Boolean).map(t => `<p dir="auto">${t}</p>`).join("");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("navigation").innerHTML = SECTIONS.map(s =>
  `<a href="${sectionHref(s.id)}" data-sec="${s.id}"><span aria-hidden="true">/</span>${s.label}</a>`
).join("");

const setActive = id => {
  document.querySelectorAll("[data-sec]").forEach(a => {
    if (a.dataset.sec === id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.body.dataset.section = id;
};

const pageHead = (eyebrow, title, intro = "") => `
  <header class="page-heading">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    ${intro ? `<p class="page-intro">${intro}</p>` : ""}
  </header>`;

const articleCard = (p, featured = false) => `
  <article class="article-row${featured ? " featured" : ""}">
    <div class="article-meta"><time datetime="${p.date}">${fmt(p.date)}</time><span>Social commentary</span></div>
    <div class="article-copy">
      <h2><a href="${postUrl(p)}">${p.title}</a></h2>
      <p>${p.summary}</p>
      <a class="text-link" href="${postUrl(p)}" aria-label="Read ${p.title}">Read the article <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;


function aboutPage() {
  return `
    ${pageHead("Profile / curriculum vitae", "Hello, I’m Khadija.")}
    <section class="about-layout">
      <div class="about-main">
        <div class="profile-block">
          <div class="portrait-frame">
            <div class="portrait-placeholder"><span>Khadija Boughanmi</span><small>Tunis, Tunisia</small></div>
            <img src="${SITE.aboutPicture}" alt="Portrait of Khadija Boughanmi" onload="this.parentElement.classList.add('has-image')" onerror="this.remove()">
          </div>
          <div class="profile-summary"><h2>A multidisciplinary profile</h2><p>${SITE.about}</p><p>I’m currently seeking a summer internship in accounting or business administration, and I’m available on weekends during the semester and full-time over the summer.</p></div>
        </div>
        <div class="cv-section"><h2>Experience</h2>
          <article class="cv-item"><div><time>Oct 2023 — Present</time><span>Kitsune Club · Tunis</span></div><div><h3>Vice President, Events Department</h3><p>Plan and coordinate events for a cosplay community. Following the department’s restructuring, joined the Logistics team for event setup and organization.</p></div></article>
          <article class="cv-item"><div><time>Mar 2026 — Present</time><span>Freelance · Online</span></div><div><h3>Digital Illustrator</h3><p>Create commissioned illustrations, define client needs, manage communication and schedules, and deliver artwork on deadline.</p></div></article>
          <article class="cv-item"><div><time>Sep 2026 — Present</time><span>Independent · Online</span></div><div><h3>Founder & Writer</h3><p>Designed, built, and launched a personal website to publish articles on current affairs and social topics.</p></div></article>
        </div>
        <div class="cv-section"><h2>Education</h2>
          <article class="cv-item"><div><time>Sep 2026 — Present</time><span>ISG · Tunis</span></div><div><h3>National Bachelor’s Degree in Management Sciences</h3><p>First-year student at the Higher Institute of Management.</p></div></article>
          <article class="cv-item"><div><time>Graduated with honors</time><span>Lycée Aïcha Bellagha · Tunis</span></div><div><h3>Baccalaureate in Economics and Management</h3><p>Graduated with honors (Assez Bien).</p></div></article>
        </div>
      </div>
      <aside class="about-aside">
        <section><h2>Skills</h2><ul class="skill-list"><li>Microsoft Excel</li><li>Event coordination & logistics</li><li>Client communication</li><li>Time management</li><li>Content writing & web publishing</li><li>Multilingual communication</li></ul></section>
        <section><h2>Languages</h2><dl class="language-list"><div><dt>Arabic</dt><dd>Native</dd></div><div><dt>English</dt><dd>Fluent</dd></div><div><dt>French</dt><dd>Proficient</dd></div></dl></section>
        <section><h2>Interests</h2><p>Writing and content creation<br>Digital illustration<br>Community and cultural events</p></section>
        <section class="contact-block"><h2>Contact</h2><a href="mailto:kadija0boughanmi@gmail.com">kadija0boughanmi@gmail.com</a><a href="https://www.linkedin.com/in/khadija-boughanmi-a11036332/" target="_blank" rel="noopener">LinkedIn profile ↗</a><span>Tunis, Tunisia</span></section>
      </aside>
    </section>`;
}

function articlesPage() {
  const items = POSTS.filter(p => catOf(p) === "articles");
  return `${pageHead("Notes on society & current affairs", "Articles")}
    <section class="article-list">${items.length ? items.map(p => articleCard(p)).join("") : `<p>Nothing here yet. Check back soon.</p>`}</section>`;
}

function diaryPage() {
  const items = POSTS.filter(p => catOf(p) === "diary");
  return `${pageHead("Personal notebook", "Diary")}
    <section class="article-list">${items.length ? items.map(p => articleCard(p)).join("") : `<div class="empty-state"><h2>This page is still blank.</h2><p>New diary entries will appear here.</p></div>`}</section>`;
}

function updatesPage() {
  return `${pageHead("Notification feed", "Updates")}
    <section class="conversation" aria-label="Website updates">
      <div class="chat-date">Recent activity</div>
      ${byDate.length ? byDate.map(p => `
        <article class="message">
          <div class="message-avatar" aria-hidden="true">KT</div>
          <div class="bubble"><span>${shortDate(p.date)}</span><p>A new ${KIND[catOf(p)] || "post"} is ready.</p><a href="${postUrl(p)}">${p.title} <span aria-hidden="true">↗</span></a></div>
        </article>`).join("") : `<p>No updates yet.</p>`}
    </section>`;
}

const shortDate = d => {
  const dt = new Date(d + "T00:00:00");
  const opts = { month: "long", day: "numeric" };
  if (dt.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return dt.toLocaleDateString("en-US", opts);
};

function artPage() {
  return `
    ${pageHead("Selected work & commissions", "Art and commissions")}
    <section class="portfolio-section" aria-labelledby="portfolio-title">
      <div class="section-heading slider-heading"><div><p class="eyebrow">Portfolio / 2026</p><h2 id="portfolio-title">Previous work</h2></div><div class="slider-controls"><button type="button" id="slide-prev" aria-label="Previous artwork">←</button><button type="button" id="slide-next" aria-label="Next artwork">→</button></div></div>
      <div class="art-slider" id="art-slider" tabindex="0" aria-label="Artwork gallery. Scroll horizontally or use the previous and next buttons.">
        ${ARTWORKS.map((a, i) => `<figure class="art-card" style="--r:${a.ratio}"><div class="art-image"><div class="art-placeholder"><span>Artwork ${String(i + 1).padStart(2, "0")}</span><small>${a.file}</small></div><img src="images/${a.file}" alt="${a.title}" loading="lazy" onload="this.parentElement.classList.add('has-image')" onerror="this.remove()"></div><figcaption><span>${a.title}</span><strong>${a.price}</strong></figcaption></figure>`).join("")}
      </div>
    </section>
    <section class="commission-sheet" aria-labelledby="prices-title">
      <div class="sheet-title"><div><p>Commissions are open</p><h2 id="prices-title">Price list</h2></div><span>Personal use · Prices in Tunisian dinars</span></div>
      <div class="price-columns">
        <div class="price-group"><h3>Illustration</h3>
          <div><span>Flat-colour bust-up</span><b>10 DT</b></div>
          <div><span>Fully rendered half-up</span><b>20 DT</b></div>
          <div><span>Two characters · rendered half-up</span><b>25 DT</b></div>
          <div><span>Four characters · full body</span><b>25 DT</b></div>
          <div><span>Angel · full body</span><b>30 DT</b></div>
          <div><span>Character sketch</span><b>10 DT <small>each</small></b></div>
        </div>
        <div class="price-group"><h3>Design & usage</h3>
          <div><span>Illustrated poster</span><b>16 DT</b></div>
          <div><span>Personal use</span><b>Included</b></div>
          <div><span>Commercial / business use</span><b>On request</b></div>
          <p>Prices are starting points for the examples shown. Send references for a precise quote before payment.</p>
        </div>
      </div>
      <div class="can-do"><div><h3>Can do</h3><p>Fan art · Portraits · Original characters</p></div><div><h3>Can’t do</h3><p>Detailed backgrounds · NSFW</p></div></div>
    </section>
    <section class="request-section" id="request" aria-labelledby="request-title">
      <div class="request-intro"><p class="eyebrow">Start a project</p><h2 id="request-title">Commission request</h2><div class="process-note"><span>01</span><p>Send references and details</p><span>02</span><p>Approve the sketch</p><span>03</span><p>Receive your artwork</p></div></div>
      <form class="commission-form" action="https://formsubmit.co/${SITE.commissionEmail}" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="_subject" value="New art commission request — Khadija’s Take">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">
        <div class="form-grid">
          <label>First name<input type="text" name="First name" autocomplete="given-name" required></label>
          <label>Last name<input type="text" name="Last name" autocomplete="family-name" required></label>
          <label>Email address<input type="email" name="Email" autocomplete="email" required></label>
          <label>Contact number <span>(optional)</span><input type="tel" name="Contact number" autocomplete="tel"></label>
          <label>Type of artwork<select name="Artwork type" id="artwork-type" required><option value="">Please select</option><option>Flat-colour bust-up — 10 DT</option><option>Fully rendered half-up — 20 DT</option><option>Two characters, rendered half-up — 25 DT</option><option>Four characters, full body — 25 DT</option><option>Angel, full body — 30 DT</option><option>Character sketch — 10 DT each</option><option>Illustrated poster — 16 DT</option><option>Other / custom request</option></select></label>
          <label>Requested completion date<input type="date" name="Requested completion date" id="deadline" required><small>At least one week from today.</small></label>
          <label class="full-field">Intended use<select name="Intended use" required><option value="">Please select</option><option>Personal use</option><option>Commercial / business use</option></select></label>
          <label class="full-field">Tell me about your idea<textarea name="Project details" rows="6" required placeholder="Characters, pose, expression, colours, text, dimensions, or anything else that matters."></textarea></label>
          <label class="full-field file-field">Reference pictures <span>(up to 5)</span><input type="file" name="Reference pictures" accept="image/*" multiple id="reference-files"><small>JPG, PNG, or other image files. Keep the combined size under 10 MB.</small></label>
        </div>
        <details class="terms"><summary>Read the Terms of Service before submitting</summary><div class="terms-grid">
          <section><h3>Payment</h3><p>50% is paid upfront before the sketch and 50% before delivery of the finished artwork. Accepted payment methods are discussed by email.</p></section>
          <section><h3>Process</h3><p>You send references and details. I provide a quote and sketch for approval, share progress updates, and send the finished work after the remaining payment.</p></section>
          <section><h3>Revisions</h3><p>Three major revisions are allowed during the sketch phase. Additional revisions or changes after rendering begins may incur extra fees.</p></section>
          <section><h3>Refunds</h3><p>A full refund is available only before work starts. No refund is available after sketch approval. If I cannot finish for personal reasons, a partial refund will be discussed.</p></section>
          <section><h3>Usage rights</h3><p>Commissions are for personal use unless commercial rights are agreed and paid for. You may post the artwork with proper credit. Do not sell, trace, claim, or use it for AI training.</p></section>
          <section><h3>Artist rights</h3><p>I may decline a request and may post commissioned artwork on my social media and portfolio. Please credit me as the artist whenever you post it.</p></section>
        </div></details>
        <label class="agreement"><input type="checkbox" name="Terms accepted" value="Yes" required><span>I have read and agree to the Terms of Service.</span></label>
        <p class="form-note">Submitting opens the secure form service to complete delivery. The first submission may require a one-time email activation.</p>
        <button class="button primary submit-button" type="submit">Send commission request <span aria-hidden="true">→</span></button>
      </form>
    </section>`;
}

function setupArtPage() {
  const slider = document.getElementById("art-slider");
  const deadline = document.getElementById("deadline");
  const files = document.getElementById("reference-files");
  if (deadline) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    deadline.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  if (files) files.addEventListener("change", () => {
    if (files.files.length > 5) {
      alert("Please choose no more than 5 reference pictures.");
      files.value = "";
      return;
    }
    const total = [...files.files].reduce((sum, f) => sum + f.size, 0);
    if (total > 10 * 1024 * 1024) {
      alert("The reference pictures are over 10 MB combined. Please choose smaller files.");
      files.value = "";
    }
  });
  if (!slider) return;
  const move = direction => slider.scrollBy({ left: direction * slider.clientWidth * 0.72, behavior: "smooth" });
  document.getElementById("slide-prev").addEventListener("click", () => move(-1));
  document.getElementById("slide-next").addEventListener("click", () => move(1));
  slider.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
  });
}

function listPage(id) {
  if (id === "about") return aboutPage();
  if (id === "articles") return articlesPage();
  if (id === "art") return artPage();
  if (id === "diary") return diaryPage();
  return updatesPage();
}

function showSection() {
  const h = location.hash.replace("#", "");
  const id = SECTIONS.some(s => s.id === h) ? h : "about";
  const current = SECTIONS.find(s => s.id === id);
  if (!current) return;
  document.title = id === "about" ? SITE.name : `${current.label} — ${SITE.name}`;
  
  main.innerHTML = id === "about" ? aboutPage() : listPage(id);
  
  setActive(id);
  if (id === "art") setupArtPage();
}

const slug = new URLSearchParams(location.search).get("slug");
if (location.pathname.endsWith("post.html")) {
  const p = POSTS.find(x => x.slug === slug);
  if (p) {
    const sec = SECTIONS.find(s => s.id === catOf(p)) || SECTIONS[2];
    document.title = `${p.title} — ${SITE.name}`;
    main.innerHTML = `
      <section class="single-post">
        <a class="back-link" href="${sectionHref(sec.id)}">← Back to ${sec.label}</a>
        <header class="post-header"><p class="eyebrow">${sec.label} / ${fmt(p.date)}</p><h1>${p.title}</h1><p>${p.summary}</p></header>
        <article class="post-body">${formatBody(p.body)}</article>
      </section>`;
    setActive(sec.id);
    addComments(p);
  } else {
    document.title = `Post not found — ${SITE.name}`;
    main.innerHTML = `<section class="empty-state"><h1>Post not found</h1><p>That post doesn’t exist. It may have moved or the link may be incomplete.</p><a class="button primary" href="index.html#articles">Browse articles</a></section>`;
  }
} else {
  showSection();
  window.addEventListener("hashchange", () => {
    showSection();
    window.scrollTo({ top: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  });
}
