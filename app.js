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

  const videosMap = window.KENDAKS_PROJECT_VIDEOS || {};
  const lowlevelMap = window.KENDAKS_LOWLEVEL_IMAGES || {};
  const placeholder = "assets/screens/placeholder.png";

  root.innerHTML = list.map(p => {
    const videos = videosMap[p.id] || [];
    return `
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

      ${lowlevelMap[p.id] ? `
        <div class="section-title">Low-level architecture diagram (Visio-style)</div>
        <img class="arch" src="${lowlevelMap[p.id]}" alt="${p.title} low-level architecture diagram"/>
      ` : ``}

      ${p.lowLevelArchitecture ? `
        <details class="lld">
          <summary>Low-level architecture (implementation view)</summary>
          <div class="lld-body">${p.lowLevelArchitecture}</div>
        </details>
      ` : ``}

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
            <div class="shot-wrap">
              <img class="shot" data-shot="assets/screens/${p.id}/step-${String(idx+1).padStart(2,'0')}.png" src="assets/screens/${p.id}/step-${String(idx+1).padStart(2,'0')}.png" alt="Step ${idx+1} screenshot" />
              <div class="shot-note">Replace this reference screenshot with your real portal screenshot at <code>assets/screens/${p.id}/step-${String(idx+1).padStart(2,'0')}.png</code>.</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="refs">
        <div class="section-title">Video tutorials</div>
        ${videos.length ? `
          <ul style="margin:0;padding-left:18px;color:var(--muted);font-size:13px">
            ${videos.map(v => `<li><a target="_blank" rel="noopener" href="${v.url}">${v.title}</a></li>`).join("")}
          </ul>
        ` : `<p style="margin:0;color:var(--muted);font-size:13px">Add video links for this project in <code>js/videos.js</code>.</p>`}
      </div>

      <div class="refs">
        <div class="section-title">Latest references (Microsoft Learn / official)</div>
        <ul style="margin:0;padding-left:18px;color:var(--muted);font-size:13px">
          ${(p.references||[]).map(r => `<li><a target="_blank" rel="noopener" href="${r.url}">${r.title}</a></li>`).join("")}
        </ul>
      </div>
    </article>
  `;
  }).join("");

  // Swap missing screenshots to placeholder (keeps UI clean)
  document.querySelectorAll("img.shot").forEach(img => {
    img.addEventListener("error", () => {
      img.src = placeholder;
    }, { once: true });
  });
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
