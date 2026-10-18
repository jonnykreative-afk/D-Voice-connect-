export class StateView {
  constructor(container) {
    this.container = container;
    this.loading = container.querySelector('.state-loading');
    this.empty = container.querySelector('.state-empty');
    this.error = container.querySelector('.state-error');
    this.data = container.querySelector('.state-data');
    this.currentState = 'loading';
  }
  
  setLoading() {
    this._setState('loading');
  }
  
  setEmpty() {
    this._setState('empty');
  }
  
  setError() {
    this._setState('error');
  }
  
  setData() {
    this._setState('data');
  }
  
  _setState(state) {
    this.currentState = state;
    this.loading.hidden = state !== 'loading';
    this.empty.hidden = state !== 'empty';
    this.error.hidden = state !== 'error';
    this.data.hidden = state !== 'data';
  }
  
  getDataContainer() {
    return this.data;
  }
  
  getState() {
    return this.currentState;
  }
}