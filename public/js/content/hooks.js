// Week 2: hooks. A hook is the first line (spoken, on-screen or both) that earns the next three seconds.
// scoreHook() is a transparent checklist, not a prediction of views.

export const HOOK_TYPES = [
  {
    id: 'curiosity',
    name: 'Curiosity gap',
    formula: 'The one thing nobody tells {who} about {topic}',
    example: 'The one thing nobody tells freshman athletes about film sessions',
    why: 'Opens a question the viewer needs closed.',
    test: /\b(nobody|no one|never told|didn'?t tell|what they don'?t|the one thing|secret|hidden)\b/i,
  },
  {
    id: 'contrarian',
    name: 'Contrarian',
    formula: '{Common advice} is wrong for {goal}',
    example: 'Playing through pain is wrong for getting recruited',
    why: 'Challenges something the viewer believes, so they stop and argue.',
    test: /\b(is wrong|are wrong|myth|lie|overrated|stop doing|not what you think|bad for|actually)\b/i,
  },
  {
    id: 'number',
    name: 'Number list',
    formula: '{n} things I wish I knew before {milestone}',
    example: '3 things I wish I knew before my first college game',
    why: 'Promises a finite, scannable payoff.',
    test: /^\s*\d+\s+\w+|\b\d+\s+(things|ways|mistakes|rules|habits|reasons|lessons|tips)\b/i,
  },
  {
    id: 'identity',
    name: 'Identity callout',
    formula: "If you're {a specific person} who {struggle}, watch this",
    example: "If you're a high school junior who's invisible to coaches, watch this",
    why: 'Names the exact viewer, so the right people feel seen.',
    test: /\b(if you'?re|if you are|for (every|all|any) |to every|attention)\b/i,
  },
  {
    id: 'confession',
    name: 'Confession',
    formula: "I'm {age} and I'm embarrassed to admit {truth}",
    example: "I'm 20 and I'm embarrassed to admit I still call my mom after every loss",
    why: 'Honesty about a flaw builds fast trust.',
    test: /\b(embarrass|ashamed|admit|confess|nobody knows|i never told)\b/i,
  },
  {
    id: 'mistake',
    name: 'Mistake',
    formula: 'The mistake that cost me {thing}',
    example: 'The mistake that cost me my senior season',
    why: 'Loss aversion: viewers want to avoid your mistake.',
    test: /\b(mistake|cost me|ruined|regret|biggest error|almost (quit|lost))\b/i,
  },
  {
    id: 'proof',
    name: 'Proof or transformation',
    formula: 'How I went from {A} to {B} in {time}',
    example: 'How I went from JV bench to starting in one season',
    why: 'A specific before and after signals the video delivers a method.',
    test: /\b(went from|from .{2,30} to .{2,30}|in (\d+|one|two|three|a) (days?|weeks?|months?|years?|season))\b/i,
  },
  {
    id: 'question',
    name: 'Sharp question',
    formula: 'Why do {who} always {struggle}?',
    example: 'Why do the hardest workers on the team still get cut?',
    why: 'A question the viewer is already asking themselves.',
    test: /\?\s*$|^\s*(why|how|what|when|should|is|are|do|does|can)\b/i,
  },
  {
    id: 'stop',
    name: 'Stop doing',
    formula: 'Stop {doing X} if you want {desire}',
    example: 'Stop emailing 100 coaches the same message if you want an offer',
    why: 'A direct command with a stake.',
    test: /^\s*(stop|quit|don'?t|never)\b/i,
  },
];

const FILLER = /^\s*(hey|hi|hello|so|um|uh|okay|ok|what'?s up|welcome|today|in this video|guys|yo)\b/i;
const TENSION = /\b(never|stop|wrong|mistake|nobody|don'?t|didn'?t|can'?t|without|instead|but|worst|embarrass|afraid|truth|myth|lie|secret|regret|almost|quit|cost|miss|cut|fail)\w*/i;
const AUDIENCE = /\b(you|you'?re|your|athletes?|players?|swimmers?|runners?|freshman|sophomore|junior|senior|recruits?|parents?|coach(es)?|college|high school|teammates?|rookies?)\b/i;

export function scoreHook(raw) {
  const text = (raw || '').trim();
  if (!text) return { score: 0, checks: [], types: [], tips: [], words: 0 };
  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length;
  const joins = (text.match(/\b(and|but|so|because|then)\b/gi) || []).length + (text.match(/,/g) || []).length;
  const specific = /\d/.test(text) || /\b(last|this) (year|season|week|summer)\b/i.test(text) || words.slice(1).some((w) => /^[A-Z][a-z]{2,}/.test(w));

  const checks = [
    { id: 'length', weight: 20, ok: n >= 4 && n <= 14, text: `Short enough to land in about 3 seconds (${n} words, aim for 6 to 12).`, tip: n > 14 ? 'Cut it to the one idea. Move the rest into the video or caption.' : 'Add a little more so it carries a clear idea.' },
    { id: 'specific', weight: 20, ok: specific, text: 'Specific: has a number, age, time or named thing.', tip: 'Swap a vague word for a number, an age or a real moment ("3 things", "at 19", "my senior season").' },
    { id: 'tension', weight: 20, ok: TENSION.test(text), text: 'Creates tension or a gap the viewer wants closed.', tip: 'Add stakes: a mistake, a contrary view, a loss, or something people are not told.' },
    { id: 'audience', weight: 15, ok: AUDIENCE.test(text), text: 'Speaks to a specific person or says "you".', tip: 'Name who it is for ("if you are a freshman…") or speak to "you".' },
    { id: 'filler', weight: 15, ok: !FILLER.test(text), text: 'Starts with the point, not a greeting or filler.', tip: 'Delete "hey guys", "so today" and "in this video". Start with the first useful word.' },
    { id: 'oneidea', weight: 10, ok: joins <= 1, text: 'One idea only.', tip: 'Two ideas in one hook split attention. Pick the stronger one.' },
  ];
  const score = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  const types = HOOK_TYPES.filter((t) => t.test.test(text)).map((t) => t.id);
  const tips = checks.filter((c) => !c.ok).map((c) => c.tip);
  return { score, checks, types, tips, words: n };
}

export const hookLabel = (score) => (score >= 80 ? 'Scroll-stopper' : score >= 60 ? 'Solid' : score >= 40 ? 'Getting there' : 'Needs work');
