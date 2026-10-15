// Week 4: everything in one printable page, plus journey stats and a finish line.
import { h, copyText, download, todayISO, toast } from '../../lib/dom.js';
import { go } from '../../lib/router.js';
import * as store from '../../lib/store.js';
import { CONFIG } from '../../config.js';
import { assembleStatement } from '../../content/blueprint.js';
import { FORMAT_BY_ID, displayName } from '../../content/formats.js';
import { MISSIONS, RECOMMENDED_MIX, mixFromPosts } from '../../content/missions.js';
import { ROADMAP_BY_ID, readinessTier, READINESS } from '../../content/sales.js';
import { archetypeById } from '../../content/archetypes.js';
import { diagnose } from '../../content/analytics.js';
import { WEEKS, ALL_WEEK_TASKS } from '../../content/weeks.js';
import { DAYS } from '../../content/plan.js';
import { toolShell } from '../../ui/toolShell.js';

const t = (x) => (x || '').toString().trim();

function gather() {
  const profile = store.get('profile', {});
  const bp = store.get('blueprint', {});
  const posts = store.get('posts', []);
  const offer = store.get('offer', {});
  const rm = store.get('roadmap', {});
  const mix = mixFromPosts(posts, 14);
  const d = diagnose(posts);
  const answers = store.get('readiness.answers', {});
  const ready = READINESS.every((q) => answers[q.id] !== undefined) ? readinessTier(READINESS.reduce((s, q) => s + answers[q.id], 0), READINESS.length * 2) : null;
  const weekTasks = [2, 3, 4].reduce((n, w) => n + ALL_WEEK_TASKS(w).filter((x) => store.get(`weeks.w${w}.tasks.${x.id}`)).length, 0) + DAYS.flatMap((x) => x.tasks).filter((x) => store.get(`plan.tasks.${x.id}`)).length;
  return {
    name: profile.name, sport: profile.sport, archetype: archetypeById(profile.archetype).label,
    statement: assembleStatement(bp.statement), tagline: t(bp.statement?.tagline),
    pillars: Object.entries(bp.pillars || {}).filter(([, v]) => t(v)),
    stories: (bp.stories || []).filter((s) => t(s.title) || t(s.problem)),
    formats: store.get('formats.saved', []).map((id) => FORMAT_BY_ID[id]).filter(Boolean),
    hooks: [...store.get('hooks', [])].sort((a, b) => b.score - a.score).slice(0, 5),
    mix, offer, roadmap: rm, ready, bio: t(store.get('bio.final', '')),
    commit: t(store.get('weeks.w4.review.commit', '')) || t(store.get('weeks.w3.review.commit', '')) || t(store.get('plan.review.commit', '')),
    stats: {
      posts: posts.length,
      hooks: store.get('hooks', []).length,
      refs: store.get('swipe', []).length,
      stories: store.get('stories', []).length,
      calendar: store.get('calendar', []).length,
      tasks: weekTasks,
      bestViews: d.best ? d.best.rates.views : null,
      medianViews: d.medianViews,
    },
    complete: store.get('strategy.complete'),
  };
}

function toText(g) {
  const L = [`# ${g.name ? g.name + '’s ' : ''}Creator Strategy`, `${g.archetype}${g.sport ? ' · ' + g.sport : ''}`, ''];
  if (g.statement) L.push(`> ${g.statement}`, '');
  if (g.tagline) L.push(`Tagline: ${g.tagline}`);
  if (g.bio) L.push(`Bio: ${g.bio}`);
  if (g.pillars.length) { L.push('', '## Pillars'); g.pillars.forEach(([k, v]) => L.push(`- ${k}: ${t(v)}`)); }
  if (g.formats.length) L.push('', '## Formats I will repeat', ...g.formats.map((f) => `- ${displayName(f)}`));
  if (g.hooks.length) L.push('', '## Best hooks', ...g.hooks.map((x) => `- ${x.text}`));
  L.push('', '## Mission mix (suggested)', ...MISSIONS.map((m) => `- ${m.name}: ${RECOMMENDED_MIX[m.id]}%`));
  if (t(g.offer.who) || t(g.offer.promise)) L.push('', '## Offer', `- For: ${t(g.offer.who)}`, `- Problem: ${t(g.offer.problem)}`, `- Promise: ${t(g.offer.promise)}`, `- Price: ${t(g.offer.price)}`);
  if (g.roadmap.path) {
    L.push('', `## 30-day roadmap: ${ROADMAP_BY_ID[g.roadmap.path].name}`, `Track: ${t(g.roadmap.metric)}`);
    g.roadmap.weeks.forEach((w, i) => { L.push(`### Week ${i + 1}: ${w.title}`); w.actions.forEach((a) => L.push(`- [${a.done ? 'x' : ' '}] ${a.text}`)); });
  }
  if (g.commit) L.push('', '## My commitment', g.commit);
  return L.join('\n');
}

export function render() {
  const g = gather();
  const missing = [];
  if (!g.statement) missing.push(['Write your message statement', '#/blueprint/statement']);
  if (!g.formats.length) missing.push(['Shortlist some formats', '#/formats']);
  if (!t(g.offer.who)) missing.push(['Sketch an offer', '#/tools/offer']);
  if (!g.roadmap.path) missing.push(['Choose a 30-day path', '#/tools/roadmap']);

  const stat = (n, l) => h('div', { class: 'stat' }, h('div', { class: 'n' }, String(n)), h('div', { class: 'l' }, l));

  const finish = g.complete
    ? h('div', { class: 'card volt pop' }, h('span', { class: 'eyebrow' }, 'Finish line'), h('h2', null, 'You built a creator strategy.'), h('p', null, `Completed ${new Date(g.complete).toLocaleDateString()}. You came in with an idea. You now have a message, an audience, stories, formats, a way to measure what works, and a plan for the next 30 days. The part that makes you a creator is that you keep posting.`),
        h('div', { class: 'row' }, h('a', { class: 'btn secondary', href: '#/posts' }, 'Keep posting'), h('a', { class: 'btn secondary', href: '#/tools/roadmap' }, 'Open my roadmap')))
    : h('div', { class: 'card no-print' }, h('h3', null, 'Ready to call it?'), missing.length ? h('div', null, h('p', { class: 'muted' }, 'A few gaps, but you can finish anyway. You can always come back.'), h('ul', null, missing.map(([l, href]) => h('li', null, h('a', { class: 'link', href }, l))))) : h('p', { class: 'muted' }, 'Everything is in place.'),
        h('button', { class: 'btn lg', type: 'button', onclick: () => { store.set('strategy.complete', todayISO()); toast('Strategy complete. Well done.'); go('/tools/strategy'); } }, 'Mark my strategy complete'));

  const sec = (title, ...children) => h('section', null, h('h2', null, title), ...children);

  return toolShell('strategy', h('div', { class: 'stack', style: { '--gap': '22px' } },
    h('div', { class: 'row no-print' }, h('button', { class: 'btn', type: 'button', onclick: () => window.print() }, 'Print / Save PDF'), h('button', { class: 'btn secondary', type: 'button', onclick: () => copyText(toText(g)) }, 'Copy as text'), h('button', { class: 'btn secondary', type: 'button', onclick: () => download('my-creator-strategy.md', toText(g), 'text/markdown') }, 'Download .md')),
    finish,
    h('div', { class: 'mini no-print' }, stat(g.stats.posts, 'Posts logged'), stat(g.stats.hooks, 'Hooks banked'), stat(g.stats.refs, 'Posts studied'), stat(g.stats.tasks, 'Tasks done')),
    h('article', { class: 'doc' },
      h('span', { class: 'eyebrow' }, `${CONFIG.brand} · ${g.archetype}${g.sport ? ' · ' + g.sport : ''}`),
      h('h1', null, `${g.name ? g.name + '’s' : 'My'} Creator Strategy`),
      h('div', { class: 'canvas', style: { marginTop: '16px' } }, h('div', { class: 'root-node' }, h('span', { class: 'eyebrow', style: { color: 'var(--volt-ink)' } }, 'My message'), h('p', { class: 'statement-out', style: { margin: 0 } }, g.statement || 'Write your statement in the Blueprint.'), g.tagline && h('p', { style: { margin: '8px 0 0', fontWeight: 700 } }, g.tagline))),
      g.bio && sec('Bio', h('p', { class: 'answer-text' }, g.bio)),
      g.pillars.length > 0 && sec('Content pillars', h('div', { class: 'grid c2' }, g.pillars.map(([k, v]) => h('div', { class: `leaf ${k}` }, h('small', null, k), h('p', null, t(v)))))),
      g.stories.length > 0 && sec('Story bank', h('ul', null, g.stories.map((s) => h('li', null, h('b', null, t(s.title) || 'Untitled'), s.tag ? ` (${s.tag})` : '')))),
      g.formats.length > 0 && sec('Formats I will repeat', h('div', { class: 'chips' }, g.formats.map((f) => h('span', { class: 'chip static' }, displayName(f))))),
      g.hooks.length > 0 && sec('Best hooks', h('ol', null, g.hooks.map((x) => h('li', null, x.text)))),
      sec('Mission mix', h('p', { class: 'muted' }, 'Every post gets one job. A suggested starting split:'), h('div', { class: 'chips' }, MISSIONS.map((m) => h('span', { class: 'chip static' }, `${m.name} ${RECOMMENDED_MIX[m.id]}%`))), g.mix.tagged > 0 && h('p', { class: 'tiny muted' }, `Your last 14 days: ${MISSIONS.map((m) => `${m.name} ${g.mix.pct[m.id]}%`).join(', ')}.`)),
      (t(g.offer.who) || t(g.offer.promise)) && sec('Offer', h('p', null, h('b', null, 'For: '), t(g.offer.who)), h('p', null, h('b', null, 'Problem: '), t(g.offer.problem)), h('p', null, h('b', null, 'Promise: '), t(g.offer.promise)), t(g.offer.price) && h('p', null, h('b', null, 'Price: '), t(g.offer.price)), g.ready && h('p', { class: 'tiny muted' }, `Readiness: ${g.ready.label}.`)),
      g.roadmap.path && sec(`30-day roadmap: ${ROADMAP_BY_ID[g.roadmap.path].name}`, h('p', { class: 'muted' }, `Track: ${t(g.roadmap.metric)}`), g.roadmap.weeks.map((w, i) => h('div', null, h('h3', null, `Week ${i + 1}: ${w.title}`), h('ul', null, w.actions.filter((a) => t(a.text)).map((a) => h('li', null, `${a.done ? '✓ ' : ''}${a.text}`)))))),
      g.commit && sec('My commitment', h('p', { class: 'answer-text' }, g.commit)),
    ),
  ), { lede: 'Everything you built in one place. Print it, share it with your coach, and put the first week of your roadmap in your calendar.' });
}
