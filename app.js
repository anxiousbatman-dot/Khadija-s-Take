const fmt = d =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
const postUrl = p => `post.html?slug=${encodeURIComponent(p.slug)}`;
// "Your take" area: a heart like button with a shared count, plus Disqus comments if enabled.
const LIKE_API = "https://api.counterapi.dev/v1/khadijas-take-blog"; // free counter service, no account needed
const likeKey = slug => "like-" + slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const readCount = d => Number(d && (d.count ?? d.value ?? 0)) || 0;

function addComments(p) {
  const section = main.querySelector("section");
  const url = `${LIKE_API}/${likeKey(p.slug)}`;
  const saved = "liked:" + p.slug;
  let liked = false;
  try { liked = localStorage.getItem(saved) === "1"; } catch (e) {}
  let count = 0;

  document.head.insertAdjacentHTML("beforeend", `<style>
    .take-bar { margin-top: 1.5rem; }
    .like { display: inline-flex; align-items: center; gap: .5rem; margin: 0 .5rem .8rem; padding: .25rem .8rem .25rem .5rem; background: none; border: 1px solid var(--line); border-radius: 999px; font: inherit; color: var(--ink); cursor: pointer; }
    .like svg path { fill: none; stroke: var(--head); stroke-width: 2; transition: fill .15s, stroke .15s; }
    .like.liked svg path { fill: #e0245e; stroke: #e0245e; }
    .like:focus-visible { outline: 2px dashed var(--link); outline-offset: 2px; }
    #disqus_thread { margin: 0 .5rem; }
  </style>`);

  section.insertAdjacentHTML("beforeend", `
    <h2 class="bar take-bar">Your take</h2>
    <button class="like" id="like-btn" type="button" aria-pressed="false" aria-label="Like this post">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span id="like-count">0</span>
    </button>
    <div id="disqus_thread"></div>`);

  const btn = document.getElementById("like-btn");
  const num = document.getElementById("like-count");
  const paint = () => {
    btn.classList.toggle("liked", liked);
    btn.setAttribute("aria-pressed", String(liked));
    num.textContent = count;
  };
  paint();
  fetch(url).then(r => r.json()).then(d => { count = readCount(d); paint(); }).catch(() => {});

  btn.addEventListener("click", () => {
    liked = !liked;
    count = Math.max(0, count + (liked ? 1 : -1));
    paint();
    try { localStorage.setItem(saved, liked ? "1" : "0"); } catch (e) {}
    fetch(`${url}/${liked ? "up" : "down"}`).then(r => r.json()).then(d => { count = readCount(d); paint(); }).catch(() => {});
  });

  if (!SITE.disqusShortname) return;
  window.disqus_config = function () {
    this.page.url = location.href;   // each post has its own address (?slug=...)
    this.page.identifier = p.slug;   // keeps comments attached to the right post
  };
  const s = document.createElement("script");
  s.src = `https://${SITE.disqusShortname}.disqus.com/embed.js`;
  s.setAttribute("data-timestamp", +new Date());
  document.body.appendChild(s);
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

// Left sidebar
const box = (title, items) =>
  `<div class="side-box"><h3>${title}</h3><ul>${items.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
document.getElementById("sidebar").innerHTML =
  box("Menu", [`<a href="index.html">Home</a>`]) +
  box("Recent posts", sorted.slice(0, 6).map(p => `<a href="${postUrl(p)}">${p.title}</a>`)) +
  box("Links", SITE.links.map(l => `<a href="${l.url}">${l.text}</a>`));

const main = document.getElementById("main");
const slug = new URLSearchParams(location.search).get("slug");

if (!document.body.dataset.page && location.pathname.endsWith("post.html")) {
  // Single post
  const p = POSTS.find(x => x.slug === slug);
  if (p) {
    document.title = `${p.title} - ${SITE.name}`;
    main.innerHTML = `
      <section>
        <h2 class="bar">${p.title}</h2>
        <article class="entry">
          <h3 class="entry-title">Posted ${fmt(p.date)}</h3>
          <div class="entry-body full post">${formatBody(p.body)}</div>
        </article>
        <p class="back"><a href="index.html">Back to all posts</a></p>
      </section>`;
    addComments(p);
  } else {
    document.title = `Post not found - ${SITE.name}`;
    main.innerHTML = `
      <section>
        <h2 class="bar">Post not found</h2>
        <p class="pad">That post doesn't exist. Check the link or pick one from the sidebar.</p>
        <p class="back"><a href="index.html">Back to all posts</a></p>
      </section>`;
  }
} else {
  // Home page
  document.title = SITE.name;
  main.innerHTML = `
    <section>
      <h2 class="bar">Greetings</h2>
      <div class="greet"><p>${SITE.intro}</p>${img(SITE.welcomeImage)}</div>
    </section>
    <section>
      <h2 class="bar">Latest posts</h2>
      ${sorted.length ? sorted.map(p => `
        <article class="entry">
          <h3 class="entry-title"><a href="${postUrl(p)}">${p.title} - ${fmt(p.date)}</a></h3>
          <div class="entry-body">
            ${img(p.image, p.title)}
            <div><p>${p.summary}</p><p><a href="${postUrl(p)}">Read more</a></p></div>
          </div>
        </article>`).join("") : `<p class="pad">No posts yet. Add your first one in posts.js.</p>`}
    </section>`;
}
