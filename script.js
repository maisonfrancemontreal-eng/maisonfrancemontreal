
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Impossible de charger ${path}`);
  return res.json();
}

function formatDateFR(dateString) {
  const d = new Date(`${dateString}T12:00:00`);
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderProgram(items) {
  const grid = document.getElementById('programGrid');
  const tpl = document.getElementById('programCardTemplate');
  items.forEach((item, index) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.program-index').textContent = index + 1;
    node.querySelector('h3').textContent = item.title;
    node.querySelector('.program-subtitle').textContent = item.subtitle;
    const ul = node.querySelector('ul');
    item.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      ul.appendChild(li);
    });
    grid.appendChild(node);
  });
}

function createSection(title, text) {
  const section = document.createElement('div');
  section.className = 'candidate-section';
  const h4 = document.createElement('h4');
  h4.textContent = title;
  const p = document.createElement('p');
  p.textContent = text;
  section.append(h4, p);
  return section;
}

function renderCandidates(items) {
  const grid = document.getElementById('candidateGrid');
  const tpl = document.getElementById('candidateCardTemplate');
  grid.innerHTML = '';
  items.forEach(item => {
    const node = tpl.content.cloneNode(true);
    const photos = node.querySelectorAll('.candidate-photo');
    photos[0].src = item.photo;
    photos[1].src = item.photoStrobo || item.photo;
    photos[2].src = item.photoStrobo || item.photo;
    photos.forEach(p => p.alt = `Portrait de ${item.name}`);
    node.querySelector('.candidate-name').textContent = item.name;
    const wrap = node.querySelector('.candidate-sections');

    wrap.append(
      createSection('Identité', item.sections.identite),
      createSection('Parcours professionnel', item.sections.parcours),
      createSection('Engagements associatifs & citoyens', item.sections.engagements),
      createSection('Motivation pour l’élection consulaire', item.sections.motivation),
      createSection('Valeurs & personnalité', item.sections.valeurs),
    );
    grid.appendChild(node);
  });
}

function renderFeaturedEvent(item) {
  const wrap = document.getElementById("featuredEvent");
  const tpl = document.getElementById("featuredEventTemplate");
  if (!wrap || !item) return;
  const node = tpl.content.cloneNode(true);
  node.querySelector(".featured-event-date").textContent = formatDateFR(item.date);
  node.querySelector(".featured-event-title").textContent = item.title;
  node.querySelector(".featured-event-location").textContent = item.location;
  node.querySelector(".featured-event-description").textContent = item.description;
  const img = node.querySelector(".featured-event-image");
  if (item.image) {
    img.src = item.image;
    img.alt = item.imageAlt || item.title;
  } else {
    img.remove();
  }
  wrap.innerHTML = '';
  wrap.appendChild(node);
}

function renderEvents(items) {
  const grid = document.getElementById("eventsGrid");
  const tpl = document.getElementById("eventCardTemplate");
  grid.innerHTML = '';
  items.forEach(item => {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".event-date").textContent = formatDateFR(item.date);
    node.querySelector("h3").textContent = item.title;
    node.querySelector(".event-location").textContent = item.location;
    node.querySelector(".event-description").textContent = item.description;
    const img = node.querySelector(".event-image");
    if (item.image) {
      img.src = item.image;
      img.alt = item.imageAlt || item.title;
    } else {
      img.remove();
    }
    grid.appendChild(node);
  });
}

function renderSocials(items) {
  const wrap = document.getElementById('socialLinks');
  items.forEach(item => {
    const a = document.createElement('a');
    a.href = item.url;
    a.textContent = item.label;
    a.target = item.url.startsWith('http') ? '_blank' : '_self';
    if (a.target === '_blank') a.rel = 'noreferrer noopener';
    wrap.appendChild(a);
  });
}

function hydrateSite(site) {
  document.title = site.siteTitle;
  document.getElementById('siteTitle').textContent = site.siteTitle;
  document.getElementById('siteTagline').textContent = site.siteTagline;
  document.getElementById('heroText').textContent = site.heroText;
  document.getElementById('ctaPrimary').textContent = site.ctaPrimary;
  document.getElementById('ctaSecondary').textContent = site.ctaSecondary;
}

function setupSearch(allCandidates) {
  const input = document.getElementById('candidateSearch');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const filtered = !q
      ? allCandidates
      : allCandidates.filter(c =>
          c.name.toLowerCase().includes(q) ||
          Object.values(c.sections).some(v => v.toLowerCase().includes(q))
        );
    renderCandidates(filtered);
  });
}

function setupMobileMenu() {
  const button = document.getElementById('menuButton');
  const menu = document.getElementById('mobileMenu');
  button.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

async function init() {
  try {
    const [site, program, candidates, events] = await Promise.all([
      loadJSON('data/site.json'),
      loadJSON('data/program.json'),
      loadJSON('data/candidates.json'),
      loadJSON('data/events.json'),
    ]);
    hydrateSite(site);
    renderProgram(program);
    renderCandidates(candidates);
    renderFeaturedEvent(events[0]);
    renderEvents(events);
    renderSocials(site.socials);
    setupSearch(candidates);
    setupMobileMenu();
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `<main style="padding:2rem;font-family:Inter,system-ui,sans-serif"><h1>Erreur de chargement</h1><p>${error.message}</p></main>`;
  }
}

init();
