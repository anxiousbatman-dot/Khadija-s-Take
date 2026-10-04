// Comments with Google sign-in, stored in Firebase (Firestore).
// app.js loads this file only after you paste your Firebase values into posts.js.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const MAX = 1000;

export function mountComments(box, post, site) {
  const app = initializeApp(site.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (!document.getElementById("cm-style")) {
    document.head.insertAdjacentHTML("beforeend", `<style id="cm-style">
      .cm { padding: 0 .5rem; }
      .cm-auth { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; margin-bottom: .9rem; }
      .cm-auth small { color: var(--ink); }
      .cm-btn { font: inherit; padding: .35rem 1rem; border: 1px solid var(--ink); border-radius: 999px; background: var(--ink); color: #fff; cursor: pointer; }
      .cm-btn.cm-ghost { background: none; color: var(--ink); }
      .cm-btn:disabled { opacity: .6; cursor: default; }
      .cm-form { margin-bottom: 1rem; }
      .cm-label { display: block; margin-bottom: .3rem; }
      .cm-form textarea { width: 100%; padding: .6rem; font: inherit; color: #3b2a25; background: #fff; border: 1px solid var(--ink); border-radius: 4px; resize: vertical; }
      .cm-row { display: flex; justify-content: space-between; align-items: center; margin-top: .4rem; }
      .cm-msg { min-height: 1.2em; margin: 0 0 .6rem; }
      .cm-list { margin: 0; padding: 0; list-style: none; }
      .cm-item, .cm-empty { margin-bottom: .6rem; padding: .7rem .9rem; background: var(--entry); border: 1px solid var(--line); }
      .cm-head { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
      .cm-del { margin-left: auto; padding: 0; font: inherit; font-size: .8rem; color: var(--ink); text-decoration: underline; background: none; border: 0; cursor: pointer; }
      .cm-text { margin: .4rem 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
      .cm button:focus-visible, .cm textarea:focus-visible { outline: 2px dashed var(--ink); outline-offset: 2px; }
    </style>`);
  }

  box.innerHTML = `
    <div class="cm">
      <div class="cm-auth" id="cm-auth"></div>
      <form class="cm-form" id="cm-form" hidden>
        <label class="cm-label" for="cm-text">Write your take</label>
        <textarea id="cm-text" rows="4" maxlength="${MAX}" required></textarea>
        <div class="cm-row"><span id="cm-left">${MAX}</span><button class="cm-btn" type="submit">Post comment</button></div>
      </form>
      <p class="cm-msg" id="cm-msg" role="status"></p>
      <ul class="cm-list" id="cm-list"></ul>
    </div>`;

  const $ = id => document.getElementById(id);
  const say = t => { $("cm-msg").textContent = t || ""; };
  let user = null;
  let comments = [];
  const isAdmin = () => !!(user && site.adminEmail && user.email === site.adminEmail);
  const ms = c => (c.createdAt ? c.createdAt.toMillis() : Date.now());
  const when = c =>
    c.createdAt
      ? c.createdAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "just now";

  function renderAuth() {
    const el = $("cm-auth");
    if (user) {
      el.innerHTML = `<span></span><button class="cm-btn cm-ghost" type="button" id="cm-out">Sign out</button>`;
      el.firstChild.textContent = `Signed in as ${user.displayName || "you"}`;
      $("cm-out").onclick = () => signOut(auth);
    } else {
      el.innerHTML = `<button class="cm-btn" type="button" id="cm-in">Sign in with Google to comment</button>
        <small>Your Google name will show next to your comment.</small>`;
      $("cm-in").onclick = () =>
        signInWithPopup(auth, new GoogleAuthProvider()).catch(e => {
          if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
            say("Sign-in didn't work. If a pop-up was blocked, allow pop-ups for this site and try again.");
          }
        });
    }
    $("cm-form").hidden = !user;
  }

  function renderList() {
    const ul = $("cm-list");
    ul.innerHTML = "";
    if (!comments.length) {
      ul.innerHTML = `<li class="cm-empty">No comments yet. Be the first.</li>`;
      return;
    }
    comments.forEach(c => {
      const li = document.createElement("li");
      li.className = "cm-item";
      const head = document.createElement("div");
      head.className = "cm-head";
      const name = document.createElement("strong");
      name.textContent = c.name;
      const date = document.createElement("span");
      date.textContent = when(c);
      head.append(name, date);
      if (user && (c.uid === user.uid || isAdmin())) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "cm-del";
        del.textContent = "Delete";
        del.onclick = () => {
          if (confirm("Delete this comment?")) {
            deleteDoc(doc(db, "comments", c.id)).catch(() => say("Couldn't delete that comment."));
          }
        };
        head.append(del);
      }
      const text = document.createElement("p");
      text.className = "cm-text";
      text.dir = "auto";
      text.textContent = c.text;   // textContent keeps comments from running as code
      li.append(head, text);
      ul.append(li);
    });
  }

  onSnapshot(
    query(collection(db, "comments"), where("postSlug", "==", post.slug)),
    snap => {
      comments = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => ms(b) - ms(a));
      renderList();
    },
    () => say("Comments couldn't load right now.")
  );

  onAuthStateChanged(auth, u => {
    user = u;
    renderAuth();
    renderList();
  });

  $("cm-text").addEventListener("input", e => { $("cm-left").textContent = MAX - e.target.value.length; });

  $("cm-form").addEventListener("submit", async e => {
    e.preventDefault();
    const text = $("cm-text").value.trim();
    if (!user || !text) return;
    const btn = $("cm-form").querySelector("button[type=submit]");
    btn.disabled = true;
    say("");
    try {
      await addDoc(collection(db, "comments"), {
        postSlug: post.slug,
        text,
        name: (user.displayName || "Reader").slice(0, 80),
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      $("cm-text").value = "";
      $("cm-left").textContent = MAX;
    } catch (err) {
      say("Couldn't post your comment. Please try again.");
    }
    setTimeout(() => { btn.disabled = false; }, 5000);   // short pause between comments
  });
}
