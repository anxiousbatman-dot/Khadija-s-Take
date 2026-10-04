const fmt = d =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
const postUrl = p => `post.html?slug=${encodeURIComponent(p.slug)}`;
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
          <div class="entry-body full post">${p.body}</div>
        </article>
        <p class="back"><a href="index.html">Back to all posts</a></p>
      </section>`;
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
