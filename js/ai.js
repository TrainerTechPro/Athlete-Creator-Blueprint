// Client for the optional live AI coach (/api/coach). The app works fully without it.
import * as store from './lib/store.js';

let cached = null;

export async function aiStatus(force = false) {
  if (cached && !force) return cached;
  try {
    const res = await fetch('/api/coach', { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error('unavailable');
    const data = await res.json();
    cached = { available: !!data.ai, needsCode: !!data.needsCode };
  } catch {
    cached = { available: false, needsCode: false };
  }
  return cached;
}

export const aiReady = () => !!cached?.available;

export class AIError extends Error {
  constructor(message, kind) {
    super(message);
    this.kind = kind;
  }
}

export async function askAI(mode, payload) {
  const res = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mode, code: store.get('ai.code', ''), ...payload }),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }
  if (res.status === 401) throw new AIError('That access code was not accepted.', 'code');
  if (res.status === 429) throw new AIError('The AI coach is busy. Try again in a minute.', 'rate');
  if (!res.ok) throw new AIError(data.error || 'The AI coach could not answer right now.', 'server');
  return data.result;
}

// A compact, trimmed snapshot of the client's Blueprint to give the AI context.
export function blueprintContext() {
  const profile = store.get('profile', {});
  const bp = store.get('blueprint', {});
  const clip = (s, n = 700) => (s || '').toString().slice(0, n);
  return {
    profile: { sport: clip(profile.sport, 60), archetype: profile.archetype, level: profile.level },
    answers: Object.fromEntries(Object.entries(bp.answers || {}).map(([k, v]) => [k, clip(v)])),
    pillars: Object.fromEntries(Object.entries(bp.pillars || {}).map(([k, v]) => [k, clip(v, 160)])),
    stories: (bp.stories || []).slice(0, 8).map((s) => ({
      title: clip(s.title, 80),
      problem: clip(s.problem, 300),
      pursuit: clip(s.pursuit, 300),
      payoff: clip(s.payoff, 300),
    })),
    statement: bp.statement || {},
  };
}
