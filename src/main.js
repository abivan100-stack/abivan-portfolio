import './style.css';

const projects = {
  volt: { index: '01 / 07', title: 'Volt', description: 'A transparent, simulated community-solar trading platform. Every transaction is sealed into a SHA-256 hash chain so changes are visible, not hidden.', tags: ['React', 'TypeScript', 'SHA-256', 'Energy systems'], link: 'https://github.com/abivan100-stack/volt-ledger', visual: 'solar' },
  vault: { index: '02 / 07', title: 'Vault', description: 'A vaccine cold-chain integrity console that simulates temperature monitoring and records shipment events to a verifiable ledger.', tags: ['React', 'TypeScript', 'Cold chain', 'Hash ledger'], link: 'https://github.com/abivan100-stack/vault', visual: 'vault' },
  crash: { index: '03 / 07', title: 'C.R.A.S.H', description: 'Chennai Road Accident Safety Hub: a mapping and analysis tool that ranks high-risk road locations from severity-weighted incident data.', tags: ['JavaScript', 'Python', 'Maps', 'Public safety'], link: 'https://github.com/abivan100-stack/C.R.A.S.H', visual: 'crash' },
  freshsense: { index: '04 / 07', title: 'FreshSense', description: 'A food-spoilage detection concept using an ESP32 and gas sensors to turn environmental readings into an early warning.', tags: ['ESP32', 'Gas sensors', 'IoT', 'RoboWunder'], link: 'https://github.com/abivan100-stack', visual: 'freshsense' },
  landmine: { index: '05 / 07', title: 'Landmine Detector Boots', description: 'A wearable metal-detection concept designed around a boot sole for hands-free, ground-level scanning.', tags: ['Wearables', 'Metal detection', 'Embedded systems', 'Buildathon'], link: 'https://github.com/abivan100-stack', visual: 'landmine' },
  spike: { index: '06 / 07', title: 'Spike Fit', description: 'A rule-based track-spike fitting tool. It turns an athlete’s event, surface, budget, and injury history into explained recommendations.', tags: ['React', 'TypeScript', 'Rules engine', 'UX'], link: 'https://github.com/abivan100-stack/Spike_Fit', visual: 'spike' },
  rutu: { index: '07 / 07', title: 'Gaikwad', description: 'An interactive Ruturaj Gaikwad fan tribute with canvas visualizations, scroll-led storytelling, and a playable cricket trivia experience.', tags: ['HTML', 'Canvas', 'Web Audio', 'Interaction design'], link: 'https://github.com/abivan100-stack/rutu-gaikwad-fansite', visual: 'rutu' },
};

const panel = {
  index: document.querySelector('#panel-index'), title: document.querySelector('#panel-title'), description: document.querySelector('#panel-description'), tags: document.querySelector('#panel-tags'), link: document.querySelector('#panel-link'), visual: document.querySelector('#panel-visual'),
};

function selectProject(key) {
  const project = projects[key];
  if (!project) return;
  document.querySelectorAll('[data-project]').forEach((item) => {
    const isSelected = item.dataset.project === key;
    item.classList.toggle('is-selected', isSelected);
    if (item.classList.contains('node')) item.classList.toggle('active', isSelected);
  });
  panel.index.textContent = project.index;
  panel.title.textContent = project.title;
  panel.description.textContent = project.description;
  panel.link.href = project.link;
  panel.tags.replaceChildren(...project.tags.map((tag) => { const li = document.createElement('li'); li.textContent = tag; return li; }));
  panel.visual.className = `panel-visual visual-${project.visual}`;
  panel.visual.innerHTML = visualMarkup(project.visual);
}

function visualMarkup(type) {
  const marks = {
    solar: '<div class="sun"></div><div class="roof roof-a"></div><div class="roof roof-b"></div><div class="energy-line"></div><span>LOCAL<br>ENERGY</span>',
    vault: '<div class="thermometer"><i></i></div><div class="corridor"><b></b><b></b><b></b><b></b><b></b></div><span>2–8°C</span>',
    crash: '<div class="map-grid"></div><i class="hotspot h1"></i><i class="hotspot h2"></i><i class="hotspot h3"></i><span>CHENNAI / RISK MAP</span>',
    freshsense: '<div class="sensor"><i></i><i></i><i></i></div><div class="signal"></div><span>AIR / CHECK</span>',
    landmine: '<div class="boot"></div><div class="scan"></div><span>GROUND / SCAN</span>',
    spike: '<div class="shoe"></div><div class="spikes"><i></i><i></i><i></i><i></i></div><span>FIND YOUR FIT</span>',
    rutu: '<div class="stump"></div><div class="ball"></div><div class="trajectory"></div><span>31 / GAIKWAD</span>',
  };
  return marks[type];
}

document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => selectProject(button.dataset.project)));
selectProject('volt');
