// js/components/cards/card.js
// All card renderers live here. Pure functions: data → HTML string.
// Split into separate files when this passes ~200 lines.

const TYPE_LABEL = {
  'past-question': 'Past Question',
  'lecture-note':  'Lecture Note',
  'handout':       'Handout',
  'textbook':      'Textbook'
};

/* ---------- Home cards ---------- */

export function ResourceCard(item) {
  return `
    <a href="#resource-${item.id}" class="card resource-card">
      <span class="resource-card__type">${TYPE_LABEL[item.type] ?? item.type}</span>
      <h3 class="resource-card__title">${item.title}</h3>
      <p class="resource-card__meta">
        <i class="fas fa-file-alt"></i> ${item.meta ?? item.faculty ?? ''}
      </p>
    </a>
  `;
}

export function AnnouncementCard(item) {
  return `
    <a href="#announcement-${item.id}" class="announcement-card">
      <div class="announcement-icon"><i class="fas fa-bullhorn"></i></div>
      <div class="announcement-content">
        <div class="announcement-title">
          ${item.title}
          <span class="badge badge-primary">Official</span>
        </div>
        <p class="announcement-desc">${item.desc}</p>
        <p class="announcement-date">${item.source} • ${item.date}</p>
      </div>
    </a>
  `;
}

export function DateCard(item) {
  return `
    <div class="date-card">
      <div class="date-badge">
        <span class="date-badge__month">${item.month}</span>
        <span class="date-badge__day">${item.day}</span>
      </div>
      <div class="date-info">
        <div class="date-info__title">${item.title}</div>
        <div class="date-info__meta">${item.context}</div>
      </div>
    </div>
  `;
}

export function AssociationCard(item) {
  return `
    <a href="#association-${item.id}" class="card assoc-card">
      <div class="assoc-logo">${item.initial}</div>
      <h3 class="assoc-name">${item.name}</h3>
      <p class="assoc-desc">${item.desc}</p>
    </a>
  `;
}

/* ---------- Catalogue card (Explore, later Reading) ---------- */

export function ResourceTile(item, opts = {}) {
  const { saved = false, hideSave = false } = opts;
  const typeLabel = TYPE_LABEL[item.type] ?? item.type;

  const saveBtn = hideSave ? '' : `
    <button class="resource-tile__save${saved ? ' is-saved' : ''}"
            type="button"
            aria-label="${saved ? 'Remove from saved' : 'Save'}"
            data-save-toggle>
      <i class="fa${saved ? 's' : 'r'} fa-bookmark"></i>
    </button>
  `;

  return `
    <article class="resource-tile" data-id="${item.id}">
      <header class="resource-tile__head">
        <span class="resource-tile__code">${item.code ?? ''}</span>
        ${saveBtn}
      </header>
      <a href="#resource-${item.id}" class="resource-tile__body">
        <h3 class="resource-tile__title">${item.title}</h3>
      </a>
      <footer class="resource-tile__meta">
        <span class="resource-tile__type">${typeLabel}</span>
        ${item.faculty ? `<span class="resource-tile__dot">·</span><span>${item.faculty}</span>` : ''}
        ${item.level   ? `<span class="resource-tile__dot">·</span><span>${item.level}L</span>`   : ''}
      </footer>
    </article>
  `;
}