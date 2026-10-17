/* =========================================================
   components/section.js
   Simple titled section scaffold. Not interactive.
   ========================================================= */

import { el } from '../libs/dom.js';

export function renderSection({ id, title, action, children }) {
  const section = el('section', {
    class: 'home-section',
    dataset: id ? { section: id } : {},
  });

  if (title || action) {
    const header = el('header', { class: 'home-section__header' });
    if (title) header.append(el('h2', { class: 'home-section__title', text: title }));
    if (action) {
      header.append(el('a', {
        class: 'home-section__action',
        href: action.href || '#',
        text: action.label,
        dataset: action.action ? { action: action.action } : {},
      }));
    }
    section.append(header);
  }

  const body = el('div', { class: 'home-section__body' });
  const kids = Array.isArray(children) ? children : [children];
  for (const child of kids) if (child) body.append(child);
  section.append(body);

  return section;
}