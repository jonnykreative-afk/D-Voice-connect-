// js/network/api.js
// Toggle this when wiring a real backend.
const USE_MOCK = true;

/**
 * Simulate latency so state transitions are visible.
 */
export function delay(ms = 400) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * Mock "fetch". Every network/*.mock.js exports functions that call this.
 */
export async function mockFetch(payloadFn, { latency = 500 } = {}) {
  await delay(latency);
  return payloadFn();
}

// Placeholder for real API later:
// export async function get(path) {
//   const res = await fetch(API_BASE + path);
//   return res.json();
// }