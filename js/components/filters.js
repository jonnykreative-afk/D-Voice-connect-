import { escapeHtml } from "../libs/utility/dom.js";

const DEFS = [
  { key:"faculty",     label:"Faculty" },
  { key:"level",       label:"Level" },
  { key:"contentType", label:"Type" },
  { key:"format",      label:"Format" }
];

const TITLES = {
  faculty: "Faculty", level: "Level",
  contentType: "Content type", format: "Format"
};

export function renderChips(container, { filters, openKey, onChipClick }) {
  container.innerHTML = DEFS.map(d => {
    const count = filters[d.key].length;
    const cls = [
      "chip",
      openKey === d.key ? "is-open" : "",
      count ? "has-value" : ""
    ].filter(Boolean).join(" ");
    return `
      <button class="${cls}" data-filter="${d.key}"
              aria-expanded="${openKey === d.key}">
        ${d.label}
        ${count ? `<span class="chip__count">${count}</span>` : ""}
      </button>`;
  }).join("");

  container.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => onChipClick(btn.dataset.filter));
  });
}

export function renderPopover(container, { key, options, selected, onToggle, onClear, onDone }) {
  if (!key) {
    container.classList.remove("is-open");
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <p class="filter-popover__title">${TITLES[key]}</p>
    <div class="filter-popover__options">
      ${options.map(o => `
        <button class="opt ${selected.includes(o) ? "is-selected" : ""}"
                data-opt="${escapeHtml(o)}">${escapeHtml(o)}</button>
      `).join("")}
    </div>
    <div class="filter-popover__actions">
      <button class="link-btn" data-action="clear">Clear</button>
      <button class="link-btn" data-action="done">Done</button>
    </div>`;
  container.classList.add("is-open");

  container.querySelectorAll("[data-opt]").forEach(b => {
    b.addEventListener("click", () => onToggle(b.dataset.opt));
  });
  container.querySelector('[data-action="clear"]').addEventListener("click", onClear);
  container.querySelector('[data-action="done"]').addEventListener("click", onDone);
}