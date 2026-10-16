import {
  FACULTIES, LEVELS, CONTENT_TYPES, FORMATS,
  getResources
} from "../../network/resources.js";
import { qs, escapeHtml } from "../../libs/utility/dom.js";
import { renderCards, renderSkeletons } from "../../components/cards.js";
import { renderEmpty, renderError } from "../../components/states.js";
import { renderChips, renderPopover } from "../../components/filters.js";

const PAGE_SIZE = 24;

const OPTIONS = {
  faculty: FACULTIES,
  level: LEVELS,
  contentType: CONTENT_TYPES,
  format: FORMATS
};

const el = {
  search:      qs("search-input"),
  searchClear: qs("search-clear"),
  filters:     qs("filters"),
  popover:     qs("filter-popover"),
  summary:     qs("result-summary"),
  results:     qs("results"),
  loadMore:    qs("load-more")
};

const state = {
  all: [],
  query: "",
  filters: { faculty:[], level:[], contentType:[], format:[] },
  page: 1,
  loading: false,
  error: false,
  openPopover: null
};

/* ---------- Filtering ---------- */

function matchesQuery(r, q) {
  if (!q) return true;
  const hay = [r.title, r.courseCode, r.courseTitle, r.contributor]
    .join(" ").toLowerCase();
  return hay.includes(q);
}

function matchesFilters(r) {
  const f = state.filters;
  if (f.faculty.length     && !f.faculty.includes(r.faculty))         return false;
  if (f.level.length       && !f.level.includes(r.level))             return false;
  if (f.contentType.length && !f.contentType.includes(r.contentType)) return false;
  if (f.format.length      && !f.format.includes(r.format))           return false;
  return true;
}

function getFiltered() {
  const q = state.query.trim().toLowerCase();
  return state.all
    .filter(r => matchesQuery(r, q) && matchesFilters(r))
    .sort((a,b) => (a.dateAdded < b.dateAdded ? 1 : -1));
}

function totalActiveFilters() {
  return Object.values(state.filters).reduce((n, arr) => n + arr.length, 0);
}

/* ---------- Rendering ---------- */

function renderResults() {
  if (state.error) {
    el.results.replaceChildren(renderError({
      title: "Couldn't load resources",
      body: "Check your connection and try again.",
      actionLabel: "Retry",
      onAction: () => { state.error = false; load(); }
    }));
    el.loadMore.innerHTML = "";
    return;
  }

  if (state.all.length === 0) {
    el.results.replaceChildren(renderEmpty({
      title: "No resources yet",
      body: "D'voice is still being populated. Check back soon."
    }));
    el.loadMore.innerHTML = "";
    return;
  }

  const all = getFiltered();
  if (all.length === 0) {
    el.results.replaceChildren(renderEmpty({
      title: "No matches",
      body: "Nothing matches your current search and filters.",
      actionLabel: "Clear search & filters",
      onAction: clearAll
    }));
    el.loadMore.innerHTML = "";
    renderSummary(0);
    return;
  }

  const visible = all.slice(0, state.page * PAGE_SIZE);
  el.results.replaceChildren(renderCards(visible));

  if (visible.length < all.length) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = `Load more (${all.length - visible.length} remaining)`;
    btn.addEventListener("click", loadMore);
    el.loadMore.replaceChildren(btn);
  } else {
    const end = document.createElement("div");
    end.className = "load-more__end";
    end.textContent = "End of results";
    el.loadMore.replaceChildren(end);
  }

  renderSummary(all.length);
}

function renderSummary(count) {
  const parts = [`<strong>${count}</strong> resource${count === 1 ? "" : "s"}`];
  const fa = totalActiveFilters();
  if (fa) parts.push(`${fa} filter${fa === 1 ? "" : "s"} applied`);
  if (state.query.trim()) parts.push(`matching "${escapeHtml(state.query.trim())}"`);
  el.summary.innerHTML = parts.join(" · ");
}

function renderFiltersUI() {
  renderChips(el.filters, {
    filters: state.filters,
    openKey: state.openPopover,
    onChipClick: openPopover
  });
  renderPopover(el.popover, {
    key: state.openPopover,
    options: state.openPopover ? OPTIONS[state.openPopover] : [],
    selected: state.openPopover ? state.filters[state.openPopover] : [],
    onToggle: (value) => toggleOption(state.openPopover, value),
    onClear: () => {
      state.filters[state.openPopover] = [];
      state.page = 1;
      renderFiltersUI();
      renderResults();
    },
    onDone: closePopover
  });
}

/* ---------- Popover ---------- */

function openPopover(key) {
  if (state.openPopover === key) return closePopover();
  state.openPopover = key;
  renderFiltersUI();
}

function closePopover() {
  state.openPopover = null;
  renderFiltersUI();
}

function toggleOption(key, value) {
  if (!key) return;
  const arr = state.filters[key];
  const i = arr.indexOf(value);
  if (i === -1) arr.push(value); else arr.splice(i, 1);
  state.page = 1;
  renderFiltersUI();
  renderResults();
}

/* ---------- Actions ---------- */

function loadMore() {
  if (state.loading) return;
  state.loading = true;
  setTimeout(() => {
    state.page += 1;
    state.loading = false;
    renderResults();
  }, 250);
}

function clearAll() {
  state.query = "";
  state.filters = { faculty:[], level:[], contentType:[], format:[] };
  state.page = 1;
  el.search.value = "";
  el.searchClear.classList.remove("is-visible");
  renderFiltersUI();
  renderResults();
}

/* ---------- Data load ---------- */

async function load() {
  el.results.replaceChildren(renderSkeletons(6));
  el.loadMore.innerHTML = "";
  el.summary.innerHTML = "";
  try {
    state.all = await getResources();
    state.error = false;
  } catch (err) {
    console.error(err);
    state.error = true;
  }
  renderFiltersUI();
  renderResults();
}

/* ---------- Events ---------- */

el.search.addEventListener("input", () => {
  state.query = el.search.value;
  state.page = 1;
  el.searchClear.classList.toggle("is-visible", state.query.length > 0);
  renderResults();
});

el.searchClear.addEventListener("click", () => {
  state.query = "";
  state.page = 1;
  el.search.value = "";
  el.searchClear.classList.remove("is-visible");
  el.search.focus();
  renderResults();
});

document.addEventListener("click", (e) => {
  if (!state.openPopover) return;
  const insidePopover = el.popover.contains(e.target);
  const onChip = e.target.closest("[data-filter]");
  if (!insidePopover && !onChip) closePopover();
});

el.results.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const resource = state.all.find(r => r.id === card.dataset.id);
  if (!resource) return;
  console.log("[Explore] open details sheet for", resource);
});

/* ---------- Init ---------- */

load();