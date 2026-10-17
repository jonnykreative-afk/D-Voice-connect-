/* =========================================================
   components/chip.js
   One filter chip. Presentation only; orchestrator wires clicks.
   ========================================================= */

import { el } from '../libs/dom.js';

export function renderChip({ value, label, group, active = false }) {
  const chip = el('button', {
    type: 'button',
    class: 'chip',
    'aria-pressed': String(active),
    dataset: { action: 'toggle-filter', group, value },
  }, [
    el('span', { text: label }),
    active ? el('span', {
      class: 'chip__clear',
      'aria-hidden': 'true',
      html: '&#x2715;', // ✕
    }) : null,
    el('span', {
      class: 'chip__sr',
      text: active ? '(active, tap to clear)' : '(inactive, tap to filter)',
    }),
  ]);

  return chip;
}