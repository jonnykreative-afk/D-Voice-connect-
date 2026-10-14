// js/components/chips/chip.js
export function FilterChip({ value, label, active = false }) {
  return `
    <button class="filter-chip${active ? ' is-active' : ''}"
            type="button"
            data-filter-value="${value}"
            aria-pressed="${active}">
      ${label}
    </button>
  `;
}