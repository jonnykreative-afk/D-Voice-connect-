import { escapeHtml, formatDate } from "../libs/utility/dom.js";

export function renderCard(r) {
  const badges = [
    r.contentType ? `<span class="badge badge--type">${escapeHtml(r.contentType)}</span>` : "",
    r.format      ? `<span class="badge">${escapeHtml(r.format)}</span>` : ""
  ].join("");

  const metaLeft = r.contributor ? escapeHtml(r.contributor) : "";
  const metaRightParts = [];
  if (r.dateAdded) metaRightParts.push(formatDate(r.dateAdded));
  if (typeof r.downloads === "number") metaRightParts.push(`${r.downloads} downloads`);
  const metaRight = metaRightParts.join(" · ");

  const btn = document.createElement("button");
  btn.className = "card";
  btn.dataset.id = r.id;
  btn.setAttribute("aria-label", `Open details for ${r.title}`);
  btn.innerHTML = `
    <div class="card__title">${escapeHtml(r.title)}</div>
    <div class="card__course">
      <span class="card__code">${escapeHtml(r.courseCode || "")}</span>
      ${escapeHtml(r.courseTitle || "")}
    </div>
    <div class="card__badges">${badges}</div>
    <div class="card__meta">
      <span>${metaLeft}</span>
      <span>${metaRight}</span>
    </div>
  `;
  return btn;
}

export function renderCards(items) {
  const wrap = document.createElement("div");
  wrap.className = "cards";
  items.forEach(r => wrap.appendChild(renderCard(r)));
  return wrap;
}

export function renderSkeletons(n = 6) {
  const wrap = document.createElement("div");
  wrap.className = "cards";
  wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < n; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton";
    sk.innerHTML = `
      <div class="sk-line sk-line--title"></div>
      <div class="sk-line sk-line--sub"></div>
      <div class="sk-line sk-line--meta"></div>
    `;
    wrap.appendChild(sk);
  }
  return wrap;
}