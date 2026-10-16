export function renderEmpty({ title, body, actionLabel, onAction }) {
  return buildState({ title, body, actionLabel, onAction });
}

export function renderError({ title, body, actionLabel, onAction }) {
  return buildState({ title, body, actionLabel, onAction });
}

function buildState({ title, body, actionLabel, onAction }) {
  const wrap = document.createElement("div");
  wrap.className = "state";
  wrap.innerHTML = `
    <p class="state__title"></p>
    <p class="state__body"></p>
  `;
  wrap.querySelector(".state__title").textContent = title || "";
  wrap.querySelector(".state__body").textContent = body || "";

  if (actionLabel && onAction) {
    const btn = document.createElement("button");
    btn.className = "btn btn--primary";
    btn.textContent = actionLabel;
    btn.addEventListener("click", onAction);
    wrap.appendChild(btn);
  }
  return wrap;
}