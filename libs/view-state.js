/* =========================================================
   libs/view-state.js
   Controls transitions between loading / empty / error / data.
   ========================================================= */

const STATES = ['loading', 'empty', 'error', 'data'];

export function createViewState(root) {
  if (!root) throw new Error('createViewState: missing root element');

  const nodes = {};
  for (const name of STATES) {
    nodes[name] = root.querySelector(`[data-state="${name}"]`);
  }

  function set(name) {
    if (!STATES.includes(name)) {
      console.warn(`[view-state] unknown state "${name}"`);
      return;
    }
    for (const key of STATES) {
      const node = nodes[key];
      if (!node) continue;
      node.hidden = key !== name;
    }
    root.dataset.currentState = name;
  }

  const current = root.dataset.currentState || 'loading';
  set(current);

  return { set, root, nodes };
}