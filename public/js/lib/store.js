// App state with autosave to localStorage. Falls back to memory when storage is blocked.
import { CONFIG } from '../config.js';

const VERSION = 1;

const defaults = () => ({
  v: VERSION,
  profile: { name: '', sport: '', level: 'beginner', archetype: '', platforms: [], handles: {}, createdAt: null },
  launch: { checks: {} },
  start: { answers: {} },
  blueprint: { answers: {}, pillars: {}, stories: [], statement: {} },
  formats: { matcher: {}, saved: [], ideas: [] },
  challenge: { drafts: {}, posted: {} },
  plan: { tasks: {}, checkins: {}, goals: {}, review: {}, audit: {}, dismissed: false },
  posts: [],
  sounds: [],
  bio: {},
  swipe: [],
  hooks: [],
  calendar: [],
  offer: {},
  edit: {},
  missionPlan: {},
  leads: {},
  readiness: {},
  stories: [],
  pitch: {},
  roadmap: {},
  strategy: {},
  weeks: { w2: { tasks: {}, checkins: {}, goals: {}, review: {} }, w3: { tasks: {}, checkins: {}, goals: {}, review: {} }, w4: { tasks: {}, checkins: {}, goals: {}, review: {} } },
  ai: { code: '' },
  ui: {},
});

let state = defaults();
const listeners = new Set();
let saveTimer;
let memoryOnly = false;
let dirty = false;

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(CONFIG.storageKey);
  } catch {
    memoryOnly = true; // storage blocked (private mode, disabled cookies)
    return;
  }
  if (!raw) return;
  try {
    state = normalise(merge(defaults(), JSON.parse(raw)));
  } catch {
    // Unreadable saved data: keep a copy for recovery and start clean rather than crash or stop saving.
    try {
      localStorage.setItem(`${CONFIG.storageKey}:corrupt`, raw);
    } catch {
      /* ignore */
    }
    state = defaults();
  }
}

function merge(base, incoming) {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(base)) return incoming ?? base;
  const out = { ...base };
  for (const key of Object.keys(incoming)) {
    out[key] =
      base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])
        ? merge(base[key], incoming[key])
        : incoming[key];
  }
  return out;
}

function persist() {
  dirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 250);
}

export function flush() {
  clearTimeout(saveTimer);
  if (memoryOnly || !dirty) return;
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    dirty = false;
  } catch {
    memoryOnly = true;
  }
}

export const isMemoryOnly = () => memoryOnly;

export function get(path, fallback) {
  let cur = state;
  for (const part of path.split('.')) {
    if (cur === null || cur === undefined) return fallback;
    cur = cur[part];
  }
  return cur === undefined ? fallback : cur;
}

export function set(path, value) {
  const parts = path.split('.');
  let cur = state;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  persist();
  notify();
}

export function update(path, fn, fallback) {
  set(path, fn(get(path, fallback)));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

export const snapshot = () => structuredClone(state);

export function exportJSON() {
  return JSON.stringify({ app: 'athlete-creator-blueprint', exportedAt: new Date().toISOString(), data: state }, null, 2);
}

// Make sure imported data has the shapes the screens expect, so a hand-edited or old file cannot break the app.
function normalise(st) {
  const arr = (v) => (Array.isArray(v) ? v : []);
  const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  st.posts = arr(st.posts).filter((p) => p && typeof p === 'object');
  st.sounds = arr(st.sounds).filter((p) => p && typeof p === 'object');
  st.blueprint.stories = arr(st.blueprint?.stories).filter((p) => p && typeof p === 'object');
  st.formats.saved = arr(st.formats?.saved);
  st.formats.ideas = arr(st.formats?.ideas).filter((p) => p && typeof p === 'object');
  st.profile.platforms = arr(st.profile?.platforms);
  for (const [path, keys] of [['profile', ['handles']], ['blueprint', ['answers', 'pillars', 'statement']], ['start', ['answers']], ['plan', ['tasks', 'checkins', 'goals', 'review', 'audit']], ['challenge', ['drafts', 'posted']], ['launch', ['checks']], ['formats', ['matcher']]]) {
    for (const k of keys) st[path][k] = obj(st[path][k]);
  }
  st.bio = obj(st.bio);
  for (const k of ['swipe', 'hooks', 'calendar', 'stories']) st[k] = arr(st[k]).filter((p) => p && typeof p === 'object');
  for (const k of ['offer', 'edit', 'missionPlan', 'leads', 'readiness', 'pitch', 'roadmap', 'strategy']) st[k] = obj(st[k]);
  st.stories = st.stories.map((x) => ({ ...x, frames: arr(x.frames).filter((f) => f && typeof f === 'object') }));
  if (st.roadmap.path) {
    st.roadmap.weeks = arr(st.roadmap.weeks)
      .filter((w) => w && typeof w === 'object')
      .map((w) => ({ ...w, actions: arr(w.actions).filter((a) => a && typeof a === 'object') }));
  }
  st.leads.ladder = obj(st.leads.ladder);
  st.leads.path = obj(st.leads.path);
  st.leads.profile = obj(st.leads.profile);
  st.readiness.answers = obj(st.readiness.answers);
  st.offer.signals = obj(st.offer.signals);
  st.edit.checks = obj(st.edit.checks);
  st.edit.signals = obj(st.edit.signals);
  st.missionPlan.days = obj(st.missionPlan.days);
  st.weeks = obj(st.weeks);
  for (const w of ['w2', 'w3', 'w4']) {
    st.weeks[w] = obj(st.weeks[w]);
    for (const k of ['tasks', 'checkins', 'goals', 'review']) st.weeks[w][k] = obj(st.weeks[w][k]);
  }
  return st;
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.app !== 'athlete-creator-blueprint' || !parsed.data) {
    throw new Error('This file is not an Athlete Creator Blueprint export.');
  }
  state = normalise(merge(defaults(), parsed.data));
  dirty = true;
  flush();
  notify();
}

export function reset() {
  state = defaults();
  dirty = false;
  try {
    localStorage.removeItem(CONFIG.storageKey);
  } catch {
    /* storage unavailable */
  }
  notify();
}

load();
// Another tab saved newer data: pick it up instead of overwriting it later.
window.addEventListener('storage', (e) => {
  if (e.key !== CONFIG.storageKey) return;
  try {
    state = e.newValue ? normalise(merge(defaults(), JSON.parse(e.newValue))) : defaults();
    dirty = false;
    notify();
  } catch {
    /* ignore malformed data */
  }
});
window.addEventListener('beforeunload', flush);
window.addEventListener('pagehide', flush);
