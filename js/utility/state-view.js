// state-view.js — replace entire file
export class StateView {
  constructor(container) {
    this.container = container;
    this.loading  = container.querySelector('.state-loading');
    this.empty    = container.querySelector('.state-empty');
    this.error    = container.querySelector('.state-error');
    this.notFound = container.querySelector('.state-not-found'); // null on pages without it
    this.data     = container.querySelector('.state-data');
    this.currentState = 'loading';
  }

  setLoading()  { this._setState('loading'); }
  setEmpty()    { this._setState('empty'); }
  setError()    { this._setState('error'); }
  setNotFound() { this._setState('not-found'); }
  setData()     { this._setState('data'); }

  _setState(state) {
    this.currentState = state;
    this._toggle(this.loading,  state !== 'loading');
    this._toggle(this.empty,    state !== 'empty');
    this._toggle(this.error,    state !== 'error');
    this._toggle(this.notFound, state !== 'not-found');
    this._toggle(this.data,     state !== 'data');
  }

  _toggle(el, hidden) {
    if (el) el.hidden = hidden;
  }

  getDataContainer() { return this.data; }
  getState()         { return this.currentState; }
}