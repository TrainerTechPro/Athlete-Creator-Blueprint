// Splits a free-written story into Struggle / Move / Win beats using the same cues the coach uses.
// It is a starting point: the person edits the result.

const PURSUIT_CUE =
  /\b(so i|i started|i decided|i began|i tried|i worked|i trained|i practiced|i asked|i changed|i switched|i moved|i learned|i committed|every (?:day|morning|night)|spent|kept (?:going|showing)|rebuilt|reset)\b/i;
const PAYOFF_CUE =
  /\b(now\b|today|finally|ended up|turned out|realized|realised|learned that|taught me|that'?s when|made me|looking back|it changed|since then|years? later)\b/i;

export function sentencesOf(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function splitStory(text) {
  const s = sentencesOf(text);
  if (s.length < 3) return { problem: s[0] || '', pursuit: s[1] || '', payoff: '' };
  let pi = s.findIndex((x, i) => i > 0 && PURSUIT_CUE.test(x));
  if (pi === -1) pi = Math.max(1, Math.floor(s.length / 3));
  let qi = s.findIndex((x, i) => i > pi && PAYOFF_CUE.test(x));
  if (qi === -1) qi = Math.max(pi + 1, Math.floor((s.length * 2) / 3));
  if (qi >= s.length) qi = s.length - 1;
  return {
    problem: s.slice(0, pi).join(' '),
    pursuit: s.slice(pi, qi).join(' '),
    payoff: s.slice(qi).join(' '),
  };
}

// Cut a long answer down to its first clause so it reads well inside a sentence or hook.
export function clauseCut(text, maxWords = 12) {
  const first = sentencesOf(text || '')[0] || '';
  const clause = first
    .replace(/[.!?]+$/, '')
    .split(/,\s+(?:and|but|so|because)\s+|;\s+|\s+[-\u2013\u2014]\s+|,\s+but\s+/i)[0]
    .replace(/,$/, '')
    .trim();
  const words = clause.split(/\s+/);
  return (words.length > maxWords ? words.slice(0, maxWords).join(' ') : clause).replace(/[,;:]$/, '');
}
