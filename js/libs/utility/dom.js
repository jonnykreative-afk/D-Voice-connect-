// js/libs/utility/dom.js
export const qs  = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/**
 * Query a StateView root by its data-sv name within a scope.
 */
export const svRoot = (name, scope = document) =>
  scope.querySelector(`.sv[data-sv="${name}"]`);