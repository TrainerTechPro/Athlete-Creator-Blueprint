// Built-in answer coach.
// Scores how specific and usable an answer is, explains why, and picks follow-up
// questions that push the person toward a sharper answer. Pure functions, no DOM.
//
// This is an advisory heuristic, not a judge: it never blocks anyone from moving on.
// The optional live AI coach (see ai.js) goes deeper when it is configured.

export const KINDS = {
  reflect: { minWords: 12, goodWords: 28 },
  belief: { minWords: 15, goodWords: 34 },
  contrarian: { minWords: 15, goodWords: 32 },
  help: { minWords: 10, goodWords: 24 },
  pillar: { minWords: 2, goodWords: 6 },
  audience: { minWords: 10, goodWords: 24 },
  pain: { minWords: 14, goodWords: 28 },
  desire: { minWords: 14, goodWords: 26 },
  identity: { minWords: 12, goodWords: 26 },
  story: { minWords: 45, goodWords: 90 },
  vision: { minWords: 10, goodWords: 24 },
};

// How much each signal counts toward the 0-100 score, by question type. Each row sums to 100.
// Stories and beliefs live or die on concrete detail; identity and desire live on the right words.
const WEIGHTS = {
  default: { len: 30, concrete: 20, fit: 30, voice: 20 },
  belief: { len: 25, concrete: 20, fit: 35, voice: 20 },
  contrarian: { len: 25, concrete: 15, fit: 40, voice: 20 },
  help: { len: 35, concrete: 20, fit: 30, voice: 15 },
  audience: { len: 30, concrete: 5, fit: 45, voice: 20 },
  pain: { len: 30, concrete: 5, fit: 45, voice: 20 },
  desire: { len: 30, concrete: 5, fit: 45, voice: 20 },
  identity: { len: 30, concrete: 5, fit: 45, voice: 20 },
  story: { len: 25, concrete: 25, fit: 35, voice: 15 },
  vision: { len: 35, concrete: 10, fit: 30, voice: 25 },
  pillar: { len: 0, concrete: 0, fit: 100, voice: 0 },
};
const CONCRETE_MATTERS = new Set(['belief', 'contrarian', 'help', 'reflect', 'story']);

const GENERIC = [
  'inspire', 'motivate', 'make a difference', 'be the best', 'positive vibes', 'good vibes',
  'live your best life', 'best life', 'empower', 'hustle', 'grind', 'passionate about', 'authentic',
  'share my story', 'give back', 'impact', 'help others', 'help people', 'change lives',
  'be myself', 'work hard', 'never give up', 'believe in yourself', 'follow your dreams',
  'good content', 'content creator', 'lifestyle', 'whatever', 'stuff', 'things like that', 'etc',
];

const BROAD = /\b(everyone|everybody|anyone|anybody|all people|all athletes|any athlete|people in general|the world)\b/i;
const EMOTION =
  /\b(feel|felt|feeling|scar|afraid|fear|anxious|anxiety|nervous|embarrass|asham|shame|proud|pride|angry|anger|frustrat|stuck|lost|alone|lonely|doubt|insecur|confiden|pressure|stress|overwhelm|burn(?:ed|t)?\s?out|exhaust|hurt|pain|cried|cry|love|hate|dream|hope|worr|guilt|regret|excit|happy|joy|relief|grateful|jealous|compar|imposter|invisible|judged|not enough|numb|empty|panic|terrif|heartbr|devastat|crush|overthink|dread|cringe|avoid|hesitat|shy|tired|lonel|ignor|exposed|belong|embarrass|sick|calm)\w*/gi;
const CONTRAST =
  /\b(but|actually|instead|never|wrong|myth|overrated|truth|opposite|unlike|rather than|everyone says|they say|people think|most (?:people|athletes|coaches|players)|supposed to|shouldn'?t|should not|stop|not\b)/gi;
const BELIEF =
  /\b(i believe|i think|i'?m convinced|i know|the truth is|truth is|the thing is|the real|the best way|the key is|what (?:really )?matters|it'?s about|is about|always|never)\b/gi;
const IDENTITY =
  /\b(become|becoming|be the|want to be|someone who|version of|identity|person who|player|athlete|starter|captain|leader|confident|respected|known|man|woman|person|teammate|professional|pro)\b/gi;
const DEMOGRAPHIC =
  /\b(\d{1,2}\s?(?:-|to)\s?\d{1,2}|\d{1,2}[\s-]?(?:year|yr)s?|age[sd]?|teen|freshman|sophomore|junior|senior|high[\s-]school|college|d1|d2|d3|ncaa|transfer|recruit|parent|mom|dad|girls?|boys?|women|men|female|male|young|youth|beginner|walk-on|prospect|grad|student|varsity|rookie|veteran|retired|pro|travel team|club)\b/gi;
const OUTCOME =
  /\b(scholarship|roster|starting|starter|recruit|offer|signed|sponsor|brand|deal|paid|income|money|confidence|respect|belong|win|score|lead|captain|play|make the team|get noticed|get seen|career|future|college|pro|opportunity)\b/gi;
const PROBLEM =
  /\b(struggl|couldn'?t|can'?t|failed|fail|injur|torn|acl|cut\b|benched|lost|loss|quit|doubt|afraid|rejected|broke|slump|alone|embarrass|ashamed|worst|hardest|setback|didn'?t make|wasn'?t good|behind|not good enough|pressure|stuck)\w*/gi;
const PURSUIT =
  /\b(so i|i started|i decided|i began|i tried|i worked|i trained|i practiced|i asked|i changed|i switched|i moved|i learned|i committed|i showed|every (?:day|morning|night)|spent|kept (?:going|showing)|rebuilt|reset|started (?:to|going))\b/gi;
const PAYOFF =
  /\b(now|today|finally|ended up|turned out|realized|realised|learned that|taught me|result|because of that|since then|that'?s when|made me|proved|looking back|it changed|changed me)\b/gi;
const FIRST_PERSON = /\b(i|i'm|i've|i'd|i'll|my|me|myself)\b/gi;
const TIME_ANCHOR =
  /\b(when i was|last (?:year|season|week|summer)|at \d{1,2}\b|in (?:19|20)\d{2}|my (?:freshman|sophomore|junior|senior|rookie) (?:year|season)|after my|before my|one (?:day|night|game|practice))\b/gi;

const count = (re, s) => (s.match(re) || []).length;

export function wordCount(text) {
  return (text.trim().match(/[\p{L}\p{N}'’-]+/gu) || []).length;
}

function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function concreteCount(text) {
  let n = 0;
  n += Math.min(3, count(/\b\d[\d,.]*\b/g, text));
  n += Math.min(2, count(/["“”]/g, text) > 1 ? 1 : 0);
  // Capitalised words that are not the start of a sentence and not "I": names, teams, places.
  for (const s of sentences(text)) {
    const words = s.split(/\s+/).slice(1);
    n += Math.min(
      3,
      words.filter((w) => /^[A-Z][a-z]{2,}/.test(w) && !/^(I|I'm|I've|I'd|I'll|My|The|But|And|So)$/.test(w)).length,
    );
  }
  n += Math.min(2, count(TIME_ANCHOR, text));
  return n;
}

function looksLikeTopicList(text) {
  const items = text
    .split(/[,;\n•·|]+|\s\/\s|\s-\s/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (items.length < 3) return false;
  const avg = items.reduce((a, x) => a + wordCount(x), 0) / items.length;
  return avg <= 2.6;
}

export function pickQuote(text, max = 110) {
  const s = sentences(text).sort((a, b) => b.length - a.length)[0] || '';
  const cut = s.length > max ? s.slice(0, max).replace(/\s+\S*$/, '') + '…' : s;
  return cut.replace(/[.!?]+$/, '');
}

export const LEVELS = [
  { id: 'empty', label: 'Not started', min: -1 },
  { id: 'surface', label: 'Surface', min: 0 },
  { id: 'warming', label: 'Warming up', min: 28 },
  { id: 'specific', label: 'Specific', min: 52 },
  { id: 'sharp', label: 'Sharp', min: 76 },
];

export function levelFor(score, words) {
  if (!words) return LEVELS[0];
  let lvl = LEVELS[1];
  for (const l of LEVELS) if (score >= l.min && l.id !== 'empty') lvl = l;
  return lvl;
}

export function analyze(rawText, opts = {}) {
  const text = (rawText || '').trim();
  const kind = opts.kind && KINDS[opts.kind] ? opts.kind : 'reflect';
  const cfg = { ...KINDS[kind], ...(opts.minWords ? { minWords: opts.minWords } : {}) };
  const words = wordCount(text);

  if (!words) {
    return { kind, words: 0, score: 0, level: LEVELS[0], issues: [], strengths: [], quote: '', generic: [] };
  }

  const lower = text.toLowerCase();
  const emotion = count(EMOTION, text);
  const contrast = count(CONTRAST, text);
  const belief = count(BELIEF, text);
  const identity = count(IDENTITY, text);
  const demographic = count(DEMOGRAPHIC, text);
  const outcome = count(OUTCOME, text);
  const problem = count(PROBLEM, text);
  const pursuit = count(PURSUIT, text);
  const payoff = count(PAYOFF, text);
  const firstPerson = count(FIRST_PERSON, text);
  const concrete = concreteCount(text);
  const genericHits = GENERIC.filter((g) => lower.includes(g));
  const listy = looksLikeTopicList(text);
  const uniq = new Set(lower.match(/[\p{L}\p{N}']+/gu) || []).size;
  const repetitive = words > 24 && uniq / words < 0.5;

  const issues = [];
  const strengths = [];
  const W = WEIGHTS[kind] || WEIGHTS.default;
  const frac = (x) => Math.max(0, Math.min(1, x));

  // Length, relative to what a good answer to this kind of question looks like.
  const lenFrac = frac(words / cfg.goodWords);
  if (words < cfg.minWords) issues.push('short');

  // Concrete detail: numbers, names, moments.
  const concreteFrac = frac(concrete / 3);
  if (concrete >= 3) strengths.push('You gave real specifics (numbers, names, or moments).');
  else if (words >= cfg.minWords && concrete === 0 && CONCRETE_MATTERS.has(kind)) issues.push('noconcrete');

  // Fit for this kind of question.
  const timeAnchored = TIME_ANCHOR.test(text);
  TIME_ANCHOR.lastIndex = 0;
  let fitFrac = 0;
  switch (kind) {
    case 'belief':
      fitFrac = frac(belief * 0.5 + contrast * 0.25 + (firstPerson > 0 ? 0.25 : 0));
      if (belief === 0 && contrast < 2) issues.push('nobelief');
      else strengths.push('There is a point of view in here, not just a topic.');
      break;
    case 'contrarian':
      fitFrac = frac(contrast * 0.35 + (timeAnchored || firstPerson > 1 ? 0.3 : 0));
      if (contrast < 2) issues.push('nocontrast');
      else strengths.push('You are pushing against something, which gives people a reason to stop.');
      break;
    case 'help':
      fitFrac = frac(0.4 + concrete * 0.2 + (/\b(how|when|ask|advice|help|teach|show)\b/i.test(text) ? 0.3 : 0));
      break;
    case 'audience':
      fitFrac = frac(demographic * 0.3 + emotion * 0.3 + (words >= 15 ? 0.15 : 0));
      if (demographic === 0) issues.push('nodemo');
      else if (demographic >= 2) strengths.push('You can picture who this is for.');
      break;
    case 'pain':
      fitFrac = frac(emotion * 0.4 + (/\b(because|when|every|each|keep|always)\b/i.test(text) ? 0.25 : 0) + (firstPerson + count(/\b(they|their|them)\b/gi, text) > 0 ? 0.15 : 0));
      if (emotion === 0) issues.push('nofeeling');
      else if (emotion >= 2) strengths.push('You named the feeling underneath the problem.');
      break;
    case 'desire':
      fitFrac = frac(emotion * 0.3 + outcome * 0.3 + (/\b(want|wish|dream|hope|need)\b/i.test(text) ? 0.25 : 0));
      if (emotion === 0 && outcome === 0) issues.push('nofeeling');
      break;
    case 'identity':
      fitFrac = frac(identity * 0.35 + emotion * 0.2 + (/\b(known|seen|look to|respected|calm|confident)\b/i.test(text) ? 0.2 : 0));
      if (identity === 0) issues.push('noidentity');
      break;
    case 'story': {
      const parts = [problem > 0, pursuit > 0, payoff > 0];
      fitFrac = parts.filter(Boolean).length / 3;
      if (!parts[0]) issues.push('nostory_problem');
      if (!parts[1]) issues.push('nostory_pursuit');
      if (!parts[2]) issues.push('nostory_payoff');
      if (parts.every(Boolean)) strengths.push('This story has a full arc: struggle, what you did, what changed.');
      break;
    }
    case 'vision':
      fitFrac = frac(outcome * 0.3 + concrete * 0.2 + (firstPerson > 0 ? 0.25 : 0) + (/\b(want|will|would|plan)\b/i.test(text) ? 0.15 : 0));
      break;
    case 'pillar':
      fitFrac = words >= 2 ? 1 : 0.3;
      break;
    default:
      fitFrac = frac(firstPerson * 0.15 + emotion * 0.25 + (/\bbecause\b/i.test(text) ? 0.2 : 0) + concrete * 0.1);
  }

  // Voice: feeling words and first-person ownership.
  const voiceFrac = kind === 'pillar' ? 0 : frac(Math.min(1, emotion / 2) * 0.7 + (firstPerson >= 2 ? 0.3 : firstPerson >= 1 ? 0.15 : 0));
  if (kind !== 'pillar') {
    if (emotion >= 3 && kind !== 'pain') strengths.push('There is real feeling here, which is what people remember.');
    if (emotion === 0 && ['reflect', 'belief', 'help', 'vision'].includes(kind) && words >= cfg.minWords) issues.push('nofeeling');
  }

  // Penalties.
  let penalty = Math.min(24, genericHits.length * 8);
  if (genericHits.length) issues.push('generic');
  if (kind === 'audience' && BROAD.test(text)) {
    issues.push('broad');
    penalty += 12;
  }
  if (listy && ['belief', 'contrarian', 'help', 'reflect', 'vision'].includes(kind)) {
    issues.push('topic');
    penalty += 12;
  }
  if (repetitive) {
    issues.push('repetitive');
    penalty += 8;
  }

  const raw = lenFrac * W.len + concreteFrac * W.concrete + fitFrac * W.fit + voiceFrac * W.voice - penalty;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  return {
    kind,
    words,
    score,
    level: levelFor(score, words),
    issues: [...new Set(issues)],
    strengths: [...new Set(strengths)].slice(0, 2),
    quote: pickQuote(text),
    generic: genericHits,
  };
}

// Follow-up questions ------------------------------------------------------------

export const PRIORITY = [
  'short', 'topic', 'broad', 'generic', 'nostory_problem', 'nostory_pursuit', 'nostory_payoff',
  'nocontrast', 'nobelief', 'nodemo', 'noidentity', 'noconcrete', 'nofeeling', 'repetitive',
];

export const DEFAULT_PROBES = {
  short: [
    'Give me two more sentences. What is the first example that comes to mind?',
    'Say it out loud like you are texting a teammate, then type what you said.',
  ],
  topic: [
    'That reads like a list of topics. A message is the belief that ties them together. Finish this: "Across all of that, I believe..."',
    'If you could only defend one item on that list in an argument, which one and why?',
  ],
  broad: [
    'If this speaks to everyone, it speaks to no one. Pick one real person you know who needs this. What is their age and situation?',
    'Who was the athlete you were two years ago? Describe them in two lines.',
  ],
  generic: [
    'Phrases like "{generic}" could describe thousands of athletes. What did you actually do or see that made you believe this?',
    'Swap the big word for a scene: where were you, who was there, what happened?',
  ],
  noconcrete: [
    'Give one real example: a game, a practice, a text from a teammate, a number, a name.',
    'When did you last see this happen? Describe that exact moment.',
  ],
  nofeeling: [
    'How did it feel in your body when this was going on? Name the emotion.',
    'What were you most afraid of at that point?',
  ],
  nocontrast: [
    'Who would disagree with you? What would they say?',
    'Finish this: "Everyone tells athletes to ___, but in my experience ___."',
  ],
  nobelief: [
    'You described a topic. What do you believe about it that not everyone does?',
    'Finish this: "The thing nobody tells you about ___ is ___."',
  ],
  nodemo: [
    'Add the basics: age range, where they are in their sport or life, what they are juggling.',
    'Is this a high schooler chasing recruitment, a college athlete losing their spot, a parent, someone newly retired? Be that specific.',
  ],
  noidentity: [
    'Describe them in a year if it all works: what do teammates say about them, how do they carry themselves?',
    'Finish this: "They want to be the kind of person who..."',
  ],
  nostory_problem: ['What went wrong? Start at the moment it felt hard or embarrassing.'],
  nostory_pursuit: ['What did you do about it? The real steps, including the messy ones.'],
  nostory_payoff: ['What changed afterwards: a result, a lesson, a new way of seeing things, a new version of you?'],
  repetitive: ['You are circling one idea. What is the second layer underneath it?'],
  strong: [
    'This is strong. Pressure test: could another athlete in your sport have written it? What is the one line only you would say?',
    'Turn this into a first line someone would stop scrolling for. How would you say it in under 12 words?',
  ],
};

export function pickFollowups(result, probes = {}, asked = [], max = 3) {
  if (!result || !result.words) return [];
  const bank = (code) => [...(probes[code] || []), ...(DEFAULT_PROBES[code] || [])];
  const out = [];
  const seen = new Set(asked);
  const fill = (str) =>
    str
      .replace('{generic}', result.generic[0] || 'inspire people')
      .replace('{quote}', result.quote || 'what you wrote');
  const take = (code) => {
    const next = bank(code).find((p) => !seen.has(fill(p)));
    if (next) {
      const q = fill(next);
      seen.add(q);
      out.push({ code, text: q });
    }
  };
  for (const code of PRIORITY) {
    if (out.length >= max) break;
    if (result.issues.includes(code)) take(code);
  }
  if (!out.length && result.score >= 50) take('strong');
  if (!out.length) take('noconcrete');
  return out;
}

export const ISSUE_LABELS = {
  short: 'A little short. Details are where the good stuff lives.',
  topic: 'Reads like a list of topics, not a point of view.',
  broad: 'Too broad. Aim at one real person.',
  generic: 'Some phrases are generic. Could any athlete say this?',
  noconcrete: 'No concrete example yet (a moment, number, or name).',
  nofeeling: 'No feeling in it yet. Emotion is what makes people care.',
  nocontrast: 'No contrast yet. What do you push back on?',
  nobelief: 'More topic than belief. What is your take?',
  nodemo: 'Who exactly? Add age, stage, situation.',
  noidentity: 'Who are they trying to become?',
  nostory_problem: 'The struggle is missing.',
  nostory_pursuit: 'What you did about it is missing.',
  nostory_payoff: 'What changed is missing.',
  repetitive: 'Circling one idea.',
};
