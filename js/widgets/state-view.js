// js/widgets/state-view.js
// Generic 3-or-4 state controller for any container with
//   [data-state="loading"|"empty"|"data"|"error"] children.

export class StateView {
  /**
   * @param {HTMLElement|string} root - The .sv wrapper (or selector).
   * @param {{ defaultState?: string, mountSelector?: string }} opts
   */
  constructor(root, opts = {}) {
    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!this.root) throw new Error('StateView: root not found');

    this.states = new Map();
    this.root.querySelectorAll('[data-state]').forEach(el => {
      this.states.set(el.dataset.state, el);
    });

    // Where the orchestrator appends rendered cards.
    this.mount = this.root.querySelector(opts.mountSelector || '[data-sv-mount]');

    this.defaultState = opts.defaultState || 'loading';
    this.show(this.defaultState);
  }

  has(state) { return this.states.has(state); }

  /**
   * Show exactly one state, hide the rest.
   * @param {'loading'|'empty'|'data'|'error'} name
   */
  show(name) {
    if (!this.states.has(name)) {
      console.warn(`StateView: unknown state "${name}"`);
      return;
    }
    for (const [key, el] of this.states) {
      el.hidden = key !== name;
    }
    this.current = name;
  }

  /**
   * Clear the mount node. Call before appending fresh cards.
   */
  clearMount() {
    if (this.mount) this.mount.innerHTML = '';
  }

  /**
   * Convenience: clear, run a render callback per item, append HTML.
   * The callback returns an HTML string (from a card component).
   *
   * @param {Array} items
   * @param {(item: any, index: number) => string} cardFn
   */
  render(items, cardFn) {
    if (!this.mount) throw new Error('StateView: no mount node');
    this.clearMount();
    this.mount.innerHTML = items.map(cardFn).join('');
    this.show('data');
  }

  /**
   * Decide state from a network result.
   * Empty array / null → empty. Non-empty → data.
   * Anything with `.error` → error.
   */
  resolve(result) {
    if (result && result.error) return this.show('error');
    if (!result || (Array.isArray(result) && result.length === 0)) return this.show('empty');
    return this.show('data');
  }
}