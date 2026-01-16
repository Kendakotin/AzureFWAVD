const projects = window.KENDAKS_PROJECTS ?? [];
const root = document.getElementById("gallery");
const search = document.getElementById("search");

function shotSrc(projectId, stepIndex){
  const num = String(stepIndex).padStart(2,'0');
  return `assets/screens/${projectId}/step-${num}.png`;
}

function render(list){
  root.innerHTML = list.map(p => {
    const steps = p.steps || [];
    const stepCards = steps.map((s, i) => {
      const src = shotSrc(p.id, i+1);
      return `
        <div class="project" style="margin-bottom:12px">
          <div class="meta">
            <span class="badge">${p.category}</span>
            <span class="badge">${p.title}</span>
            <span class="badge">Step ${String(i+1).padStart(2,'0')}/${String(steps.length).padStart(2,'0')}</span>
          </div>
          <div class="step" style="grid-template-columns: 520px 1fr;">
            <div class="stepmedia">
              <img src="${src}" alt="${p.title} step ${i+1}" onerror="this.src='assets/screens/placeholder.png'" />
            </div>
            <div>
              <h4 style="margin:0 0 6px">${i+1}. ${s.title}</h4>
              <div class="body">${s.body || ''}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <article id="${p.id}">
        ${stepCards}
      </article>
    `;
  }).join("");
}

render(projects);

search?.addEventListener("input", (e) => {
  const q = (e.target.value || '').toLowerCase().trim();
  if(!q) return render(projects);
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.scenario||'').toLowerCase().includes(q)
  );
  render(filtered);
});
