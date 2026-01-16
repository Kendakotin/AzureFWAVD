const projects = window.KENDAKS_PROJECTS ?? [];
const nav = document.getElementById("nav");
const root = document.getElementById("projects");
const search = document.getElementById("search");

function fallbackIcon(label = "STEP") {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 64 64" fill="none">
    <rect x="6" y="6" width="52" height="52" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <path d="M18 34h28" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 26h20" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M18 42h16" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    <text x="32" y="54" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="system-ui">${label}</text>
  </svg>`;
}

function stepIconHTML(iconName) {
  const src = `assets/step-icons/${iconName}.svg`;
  return `<img src="${src}" alt="${iconName} icon" onerror="this.outerHTML=\`${fallbackIcon(iconName.toUpperCase())}\`" />`;
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function render(list) {
  nav.innerHTML = list.map((p) => `<a href="#${p.id}">${p.title}</a>`).join("");

  root.innerHTML = list
    .map((p) => {
      const refsHtml = (p.references || [])
        .map((r) => `<li><a target="_blank" rel="noopener" href="${r.url}">${r.title}</a></li>`)
        .join("");

      const stepsHtml = p.steps
        .map((s, idx) => {
          const shot = `assets/screens/${p.id}/step-${pad2(idx + 1)}.png`;
          return `
          <div class="step">
            <div class="step-media">
              <img class="step-shot" src="${shot}" alt="${p.title} — step ${idx + 1} screenshot" />
              <div class="step-icon">${stepIconHTML(s.icon)}</div>
            </div>
            <div class="step-content">
              <h4>${idx + 1}. ${s.title}</h4>
              <div class="body">${s.body}</div>
              ${s.code?.trim() ? `<pre><code>${escapeHtml(s.code)}</code></pre>` : ""}
            </div>
          </div>`;
        })
        .join("");

      return `
    <article class="project" id="${p.id}">
      <h2>${p.title}</h2>
      <div class="meta">
        <span class="badge">${p.category}</span>
        <span class="badge">Steps: ${p.steps.length}</span>
        <span class="badge">Screenshot: per step ✓</span>
      </div>

      <div class="section-title">Scenario & example</div>
      <p style="color:var(--muted);margin:0">${p.scenario}</p>

      <div class="section-title">Architecture</div>
      <img class="arch" src="${p.architectureImage}" alt="${p.title} architecture diagram"/>

      <div class="section-title">Step-by-step implementation (each step includes a screenshot + explanation)</div>
      <div class="steps">${stepsHtml}</div>

      <div class="refs">
        <div class="section-title">Official references</div>
        <ul style="margin:0;padding-left:18px;color:var(--muted);font-size:13px">${refsHtml}</ul>
      </div>
    </article>`;
    })
    .join("");
}

render(projects);

search?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return render(projects);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.scenario || "").toLowerCase().includes(q)
  );

  render(filtered);
});
