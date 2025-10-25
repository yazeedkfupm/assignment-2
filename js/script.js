// ====== Utilities ======
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

// Safe localStorage helpers
const storage = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  del(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

// ====== Greeting and Theme ======
const greetingEl = $("#greeting");
const usernameInput = $("#usernameInput");
const saveNameBtn = $("#saveNameBtn");
const clearNameBtn = $("#clearNameBtn");
const themeToggle = $("#themeToggle");

function timeGreeting(date = new Date()){
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function renderGreeting(){
  const name = storage.get("username", "");
  const base = timeGreeting();
  greetingEl.textContent = name ? `${base}, ${name}!` : `${base}!`;
}
function initTheme(){
  const saved = storage.get("theme", "light");
  document.documentElement.classList.toggle("dark", saved === "dark");
  themeToggle.setAttribute("aria-pressed", saved === "dark");
}
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle("dark");
  storage.set("theme", isDark ? "dark" : "light");
  themeToggle.setAttribute("aria-pressed", isDark);
}

saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name) storage.set("username", name);
  renderGreeting();
});
clearNameBtn.addEventListener("click", () => {
  storage.del("username");
  usernameInput.value = "";
  renderGreeting();
});
themeToggle.addEventListener("click", toggleTheme);

// ====== Tabs ======
const tabs = $$(".tab");
const panels = $$(".tab-panel");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => { p.classList.remove("show"); p.setAttribute("aria-hidden", "true"); });
    tab.classList.add("active");
    const id = tab.dataset.tab;
    const panel = $("#" + id);
    panel.classList.add("show");
    panel.setAttribute("aria-hidden", "false");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ====== Projects: data, filter, sort, search ======
const DEFAULT_PROJECTS = [
  { id: 1, title: "Responsive Web Landing", type: "web", date: "2025-05-20", summary: "Marketing landing with responsive grid.", stack: ["HTML", "CSS", "JS"] },
  { id: 2, title: "Data Explorer", type: "data", date: "2025-03-02", summary: "Client-side CSV explorer and charts.", stack: ["JS", "D3"] },
  { id: 3, title: "Portfolio Redesign", type: "design", date: "2025-08-15", summary: "High-fidelity Figma components.", stack: ["Figma"] },
  { id: 4, title: "API Dashboard", type: "web", date: "2025-10-01", summary: "Dashboard with fetch, retries, and caching.", stack: ["JS", "API"] }
];

const state = {
  projects: DEFAULT_PROJECTS,
  query: "",
  filter: "all",
  sort: "date-desc"
};

const listEl = $("#projectsList");
const emptyEl = $("#emptyState");
const searchEl = $("#search");
const filterEl = $("#filter");
const sortEl = $("#sort");

function filterAndSort(items){
  let results = items;

  // filter
  if (state.filter !== "all") {
    results = results.filter(p => p.type === state.filter);
  }

  // search
  if (state.query) {
    const q = state.query.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.stack.join(" ").toLowerCase().includes(q)
    );
  }

  // sort
  results = results.slice().sort((a,b) => {
    switch(state.sort){
      case "date-asc": return a.date.localeCompare(b.date);
      case "date-desc": return b.date.localeCompare(a.date);
      case "title-asc": return a.title.localeCompare(b.title);
      case "title-desc": return b.title.localeCompare(a.title);
      default: return 0;
    }
  });

  return results;
}

function renderProjects(){
  const data = filterAndSort(state.projects);
  listEl.innerHTML = "";
  if (data.length === 0){
    emptyEl.classList.remove("hidden");
    return;
  } else {
    emptyEl.classList.add("hidden");
  }

  data.forEach(p => {
    const card = document.createElement("article");
    card.className = "card project";
    card.innerHTML = `
      <div class="header">
        <h3>${p.title}</h3>
        <div class="meta">${p.type.toUpperCase()} • ${new Date(p.date).toLocaleDateString()}</div>
      </div>
      <p>${p.summary}</p>
      <button class="btn btn-small toggle-details" aria-expanded="false">Details</button>
      <div class="details" id="details-${p.id}" aria-hidden="true">
        <p><strong>Stack:</strong> ${p.stack.join(", ")}</p>
        <p><em>Project ID:</em> ${p.id}</p>
      </div>
    `;
    const toggle = $(".toggle-details", card);
    const details = $(".details", card);
    toggle.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      details.setAttribute("aria-hidden", String(!open));
    });
    listEl.appendChild(card);
  });
}

// input
searchEl.addEventListener("input", e => { state.query = e.target.value; renderProjects(); });
filterEl.addEventListener("change", e => { state.filter = e.target.value; renderProjects(); });
sortEl.addEventListener("change", e => { state.sort = e.target.value; renderProjects(); });

// ====== Contact Form Validation ======
const contactForm = $("#contactForm");
const formStatus = $("#formStatus");
const validators = {
  name: v => v.trim().length >= 2 || "Please enter at least 2 characters.",
  email: v => /\S+@\S+\.\S+/.test(v) || "Please enter a valid email address.",
  message: v => v.trim().length >= 10 || "Message must be at least 10 characters."
};
function showFieldError(id, msg){
  const el = $("#" + id + "Error");
  el.textContent = msg || "";
}
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm).entries());
  let ok = true;

  for (const [field, fn] of Object.entries(validators)){
    const res = fn(data[field] || "");
    if (res !== true){ ok = false; showFieldError(field, res); }
    else { showFieldError(field, ""); }
  }

  if (!ok){
    formStatus.textContent = "Please fix the errors above.";
    formStatus.className = "status error";
    return;
  }

  // Simulate async
  formStatus.textContent = "Sending…";
  formStatus.className = "status loading";
  setTimeout(() => {
    formStatus.textContent = "Thanks! Your message has been sent.";
    formStatus.className = "status ok";
    // simple animated success
    formStatus.animate([{opacity:0},{opacity:1}], {duration: 250, easing: "ease-out"});
    contactForm.reset();
  }, 800);
});

// ====== API Demo with loading, error, retry ======
const API_DEMO_URL = "https://api.quotable.io/random"; // public demo API
const apiLoading = $("#apiLoading");
const apiError = $("#apiError");
const apiRetry = $("#apiRetry");
const apiContent = $("#apiContent");

async function fetchDemo(){
  apiLoading.classList.remove("hidden");
  apiError.classList.add("hidden");
  apiContent.classList.add("hidden");
  try{
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000); // timeout
    const res = await fetch(API_DEMO_URL, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data.content || data.fact || JSON.stringify(data);
    apiContent.textContent = `“${text}”`;
    apiLoading.classList.add("hidden");
    apiContent.classList.remove("hidden");
  }catch(err){
    console.error(err);
    apiLoading.classList.add("hidden");
    apiError.classList.remove("hidden");
  }
}
apiRetry.addEventListener("click", fetchDemo);

// ====== Init ======
function init(){
  $("#year").textContent = new Date().getFullYear();
  initTheme();
  renderGreeting();
  renderProjects();
  fetchDemo();
}
document.addEventListener("DOMContentLoaded", init);
