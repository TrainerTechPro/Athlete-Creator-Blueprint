// Checks a Blueprint against the Do and Don't principles. Pure: takes plain data in.
import { analyze, wordCount } from './coach.js';
import { QUESTIONS } from './content/blueprint.js';

const STOP = new Set(
  'about after again also because been before being between could does doing from have into just like make more most much only other over really should some than that their them then there these they this those very what when where which while with would your yours people thing things want need feel feels'.split(' '),
);

const keywords = (text) =>
  new Set(
    (text.toLowerCase().match(/[a-z]{5,}/g) || [])
      .filter((w) => !STOP.has(w))
      .map((w) => w.replace(/(ing|ers|er|ed|es|s)$/, '')),
  );

function overlap(a, b) {
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n;
}

export function scoreAnswers(answers = {}) {
  const out = {};
  for (const q of QUESTIONS) {
    if (q.type === 'pillars') continue;
    const text = answers[q.id] || '';
    out[q.id] = text.trim() ? { q, ...analyze(text, { kind: q.kind }) } : null;
  }
  return out;
}

export function averageScore(scored) {
  const vals = Object.values(scored).filter(Boolean).map((r) => r.score);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

export function health({ answers = {}, pillars = {}, stories = [], statement = {} }) {
  const scored = scoreAnswers(answers);
  const filled = Object.values(scored).filter(Boolean);
  const avg = averageScore(scored);
  const fixTo = (id) => `#/blueprint/${QUESTIONS.find((q) => q.id === id)?.part || 'say'}?q=${id}`;
  const fullStories = stories.filter((s) => s.problem?.trim() && s.pursuit?.trim() && s.payoff?.trim());

  const dos = [];
  dos.push({
    id: 'experience',
    label: 'Built from experience',
    status: fullStories.length >= 2 ? 'pass' : fullStories.length === 1 ? 'warn' : 'todo',
    note:
      fullStories.length >= 2
        ? `${fullStories.length} complete stories in your bank.`
        : 'Add at least two stories with a struggle, a move and a win.',
    fix: '#/blueprint/why',
  });
  dos.push({
    id: 'specific',
    label: 'Specific',
    status: !filled.length ? 'todo' : avg >= 50 ? 'pass' : 'warn',
    note: !filled.length ? 'Answer some questions first.' : `Average answer depth is ${avg}/100. Aim for 50+.`,
    fix: filled.length ? fixTo(filled.sort((a, b) => a.score - b.score)[0].q.id) : '#/blueprint/say',
  });

  const msgText = [answers['say-beliefs'], answers['say-contrarian'], statement.angle].join(' ');
  const pillarText = Object.values(pillars).join(' ');
  const avatarText = [answers['who-who'], answers['who-pain'], answers['who-want'], answers['who-become'], statement.who].join(' ');
  const storyText = stories.map((s) => `${s.problem} ${s.pursuit} ${s.payoff}`).join(' ') + (answers['why-origin'] || '');
  const links = [
    overlap(keywords(msgText), keywords(pillarText)),
    overlap(keywords(msgText), keywords(avatarText)),
    overlap(keywords(msgText), keywords(storyText)),
    overlap(keywords(avatarText), keywords(storyText)),
  ].filter((n) => n > 0).length;
  const enough = wordCount(msgText) > 10 && wordCount(avatarText) > 10 && wordCount(pillarText) > 2;
  dos.push({
    id: 'connect',
    label: 'Connected',
    status: !enough ? 'todo' : links >= 2 ? 'pass' : 'warn',
    note: !enough
      ? 'Fill in message, audience and pillars to check the links.'
      : links >= 2
        ? 'Your message, audience, pillars and stories share common ground.'
        : 'Your parts may not talk to each other yet. Reuse the same key words across message, audience and stories.',
    fix: '#/blueprint/statement',
  });

  const psy = ['who-pain', 'who-want', 'who-become'].map((id) => scored[id]).filter(Boolean);
  const psyOk = psy.filter((r) => !r.issues.includes('nofeeling') && !r.issues.includes('noidentity')).length;
  dos.push({
    id: 'psycho',
    label: 'Psychographics, not just demographics',
    status: psy.length < 3 ? 'todo' : psyOk >= 3 ? 'pass' : 'warn',
    note: psy.length < 3 ? 'Answer all three audience questions.' : psyOk >= 3 ? 'You described feelings, wants and identity.' : 'One audience answer lacks feelings or identity. Name fears, desires and who they want to become.',
    fix: '#/blueprint/reach',
  });

  const donts = [];
  const beliefs = scored['say-beliefs'];
  donts.push({
    id: 'topics',
    label: 'Topics vs. a message',
    status: !beliefs ? 'todo' : beliefs.issues.some((i) => ['topic', 'nobelief'].includes(i)) ? 'warn' : 'pass',
    note: !beliefs ? 'Answer the beliefs question.' : beliefs.issues.some((i) => ['topic', 'nobelief'].includes(i)) ? 'Reads like categories. Add the belief that ties them together.' : 'There is a point of view here.',
    fix: fixTo('say-beliefs'),
  });
  const who = scored['who-who'];
  donts.push({
    id: 'everyone',
    label: 'Speaking to everyone',
    status: !who ? 'todo' : who.issues.some((i) => ['broad', 'nodemo'].includes(i)) ? 'warn' : 'pass',
    note: !who ? 'Describe your audience.' : who.issues.some((i) => ['broad', 'nodemo'].includes(i)) ? 'Your audience is too broad or too vague. Pick one real person.' : 'Your audience is specific.',
    fix: fixTo('who-who'),
  });
  donts.push({
    id: 'hide',
    label: 'Hiding behind information',
    status: !fullStories.length && !filled.length ? 'todo' : fullStories.length ? 'pass' : 'warn',
    note: fullStories.length ? 'Your experiences are in the mix.' : 'Add personal stories so people meet you, not just information.',
    fix: '#/blueprint/why',
  });
  const genericQs = filled.filter((r) => r.issues.includes('generic'));
  donts.push({
    id: 'generic',
    label: 'Staying generic',
    status: !filled.length ? 'todo' : genericQs.length ? 'warn' : 'pass',
    note: !filled.length ? 'Answer some questions first.' : genericQs.length ? `Generic phrasing in ${genericQs.length} answer${genericQs.length > 1 ? 's' : ''}. Swap big words for real scenes.` : 'No generic filler detected.',
    fix: genericQs[0] ? fixTo(genericQs[0].q.id) : '#/blueprint/say',
  });

  return { dos, donts, avg, scored };
}
