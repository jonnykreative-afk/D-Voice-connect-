// js/libs/state/auth.js
// Mock auth — replace with real session later.
let _auth = null;

export function setAuth(user) { _auth = user; }
export function getAuth() { return _auth; }
export function clearAuth() { _auth = null; }