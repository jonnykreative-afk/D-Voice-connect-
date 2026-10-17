/* =========================================================
   components/resource-card.js
   Presentation-only renderer for one resource card.
   No fetch. No listeners. Orchestrator wires clicks.
   ========================================================= */

import { el } from '../libs/dom.js';

const TYPE_LABELS = {
  'past-question':  'Past question',
  'lecture-note':   'Lecture note',
  'summary':        'Summary',
  'textbook':       'Textbook',
  'slide':          'Slides',
};

export function renderResourceCard(resource) {
  const {
    id,
    title,
    courseCode,
    courseTitle,
    contentType,
    fileFormat,
    contributor,
    dateAdded,
    downloadCount,
  } = resource;

  const card = el('article', {
    class: 'resource-card',
    dataset: { resourceId: id, action: 'open-resource' },
    tabindex: '0',
    role: 'button',
    'aria-label': `${title} — ${courseCode} ${courseTitle}`,
  });

  // Title
  card.append(el('h3', { class: 'resource-card__title', text: title }));

  // Course code + course title
  const course = el('p', { class: 'resource-card__course' });
  course.append(el('span', { class: 'resource-card__code', text: courseCode }));
  course.append(el('span', { class: 'resource-card__course-title', text: courseTitle }));
  card.append(course);

  // Badges
  const badges = el('div', { class: 'resource-card__badges' });
  if (contentType && TYPE_LABELS[contentType]) {
    badges.append(el('span', {
      class: 'badge badge--type',
      text: TYPE_LABELS[contentType],
    }));
  }
  if (fileFormat) {
    badges.append(el('span', {
      class: 'badge badge--format',
      text: fileFormat.toUpperCase(),
    }));
  }
  if (badges.childNodes.length) card.append(badges);

  // Meta line — degrade gracefully
  const metaParts = [];
  if (contributor) metaParts.push(contributor);
  if (dateAdded) metaParts.push(formatRelativeDate(dateAdded));
  if (typeof downloadCount === 'number') {
    metaParts.push(`${downloadCount.toLocaleString()} download${downloadCount === 1 ? '' : 's'}`);
  }
  if (metaParts.length) {
    card.append(el('p', {
      class: 'resource-card__meta',
      text: metaParts.join(' · '),
    }));
  }

  return card;
}

/* ---------- helpers ---------- */

function formatRelativeDate(iso) {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const diffDays = Math.round((Date.now() - then.getTime()) / 86_400_000);
  if (diffDays <= 0)  return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30)  return `${diffDays} days ago`;
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}