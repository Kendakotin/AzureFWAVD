const projects = window.KENDAKS_PROJECTS ?? [];
const nav = document.getElementById("nav");
const root = document.getElementById("projects");
const search = document.getElementById("search");

function escapeHtml(str=""){
  return str
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function render(list){
  nav.innerHTML = list.map(p => `<a href="#${p.id}">${p.title}</a>`).join("");

  root.innerHTML = list.map(p => `
    <article class="project" id="${p.id}">
      <h2>${p.title}</h2>
      <div class="meta">
        <span class="badge">${p.category}</span>
        <span class="badge">Steps: ${p.steps.length}</span>
        <span class="badge">Images: per step ✓</span>
      </div>

      <div class="section-title">Scenario & example</div>
      <p style="color:var(--muted);margin:0">${p.scenario}</p>

      <div class="section-title">Architecture</div>
      <img class="arch" src="${p.architectureImage}" alt="${p.title} architecture diagram"/>

      <div class="section-title">Step-by-step implementation</div>
      <div class="steps">
        ${p.steps.map((s, idx) => `
          <div class="step">
            <img src="assets/step-icons/${s.icon}.svg" alt="${s.icon} icon" />
            <div>
              <h4>${idx+1}. ${s.title}</h4>
              <div class="body">${s.body}</div>
              ${s.code?.trim() ? `<pre><code>${escapeHtml(s.code)}</code></pre>` : ""}
            </div>
          </div>
        `).join("")}
      </div>

      <div class="refs">
        <div class="section-title">Latest references (Microsoft Learn / official)</div>
        <ul style="margin:0;padding-left:18px;color:var(--muted);font-size:13px">
          ${(p.references||[]).map(r => `<li><a target="_blank" rel="noopener" href="${r.url}">${r.title}</a></li>`).join("")}
        </ul>
      </div>
    </article>
  `).join("");
}

render(projects);

search?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if(!q) return render(projects);
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.scenario||"").toLowerCase().includes(q)
  );
  render(filtered);
});
