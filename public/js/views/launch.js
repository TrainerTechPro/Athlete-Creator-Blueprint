// Week 0: checklist, mindset, athlete safety and the starting-point reflection.
import { h, safeUrl } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { CONFIG } from '../config.js';
import { launchChecks, progress } from '../progress.js';
import { MINDSET, LOOP, SAFETY, YOUTH_NOTE, START_QUESTIONS } from '../content/start.js';
import { archetypeById } from '../content/archetypes.js';
import { checkbox, crumbs, pageHead, bar } from '../ui/components.js';
import { questionFlow } from '../ui/questionFlow.js';
import { wordCount } from '../coach.js';

const TABS = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'start', label: 'Starting point' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'safety', label: 'Athlete safety' },
];

export function render(route) {
  const tab = route.parts[1] || 'checklist';
  if (tab === 'start' && route.query.flow) return startFlow(route);
  const body = { checklist, start: startOverview, mindset, safety }[tab] || checklist;
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Launch Pad' }),
    pageHead({ eyebrow: 'Step 0 · Setup week', title: 'Launch Pad', lede: 'Get the logistics out of the way so nothing competes for your attention once the real work starts. Do this once, then move on.' }),
    h('div', { class: 'tabs', role: 'tablist' }, TABS.map((t) => h('a', { class: 'tab', role: 'tab', href: `#/launch/${t.id}`, 'aria-current': t.id === tab ? 'page' : null }, t.label))),
    body(),
  );
}

function checklist() {
  const checks = launchChecks();
  const done = checks.filter((c) => c.done).length;
  const archetype = archetypeById(store.get('profile.archetype'));
  const wrap = h('div', { class: 'stack', style: { '--gap': '12px' } });
  const draw = () => {
    wrap.replaceChildren();
    launchChecks().forEach((c) => {
      const row = h(
        'div',
        { class: `check${c.done ? ' done' : ''}` },
        checkbox({
          checked: c.done,
          label: c.title,
          onChange: (v) => {
            store.set(`launch.checks.${c.id}`, v);
            draw();
          },
        }),
        h('div', { class: 'grow' }, h('h4', null, c.title), h('p', null, c.body)),
        c.id === 'handles' && h('a', { class: 'btn secondary sm go', href: '#/settings' }, 'Add handles'),
        c.id === 'safety' && h('a', { class: 'btn secondary sm go', href: '#/launch/safety' }, 'Read it'),
        c.id === 'firstpost' && h('a', { class: 'btn secondary sm go', href: '#/posts' }, 'Log a post'),
      );
      wrap.append(row);
    });
  };
  draw();
  const links = Object.entries(CONFIG.links).filter(([, v]) => safeUrl(v));
  return h(
    'div',
    { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', null, 'Setup progress'), h('span', { class: 'tag volt' }, `${done}/${checks.length}`)), h('div', { style: { marginTop: '10px' } }, bar(Math.round((done / checks.length) * 100)))),
    archetype.youth && h('div', { class: 'card warnbox' }, h('h4', null, 'Under 18?'), h('p', { style: { margin: '6px 0 0' } }, YOUTH_NOTE)),
    wrap,
    links.length > 0 && h('div', { class: 'row' }, links.map(([k, v]) => h('a', { class: 'btn secondary', href: safeUrl(v), target: '_blank', rel: 'noopener noreferrer' }, k[0].toUpperCase() + k.slice(1)))),
    h('div', { class: 'row end' }, h('a', { class: 'btn lg', href: '#/launch/start' }, 'Next: your starting point →')),
  );
}

function startOverview() {
  const answers = store.get('start.answers', {});
  const answered = START_QUESTIONS.filter((q) => wordCount(answers[q.id] || '') >= 8).length;
  const groups = [...new Set(START_QUESTIONS.map((q) => q.group))];
  return h(
    'div',
    { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'callout' }, h('b', null, 'Pro tip'), 'You cannot create toward a future you have not described. The more specific you get here about who you want to be and the life you want it to build, the easier it is to work toward. There are no right answers yet. You will come back to these.'),
    groups.map((g) => {
      const qs = START_QUESTIONS.filter((q) => q.group === g);
      const done = qs.filter((q) => wordCount(answers[q.id] || '') >= 8).length;
      return h(
        'div',
        { class: 'card' },
        h('div', { class: 'row between' }, h('h3', null, g), h('span', { class: 'tag volt' }, `${done}/${qs.length}`)),
        h('ul', { class: 'muted', style: { paddingLeft: '18px' } }, qs.map((q) => h('li', null, q.prompt))),
        h('a', { class: 'btn', href: `#/launch/start?flow=${encodeURIComponent(qs[0].id)}&g=${encodeURIComponent(g)}` }, done ? 'Review' : 'Start'),
      );
    }),
    h('p', { class: 'muted tiny' }, `${answered} of ${START_QUESTIONS.length} reflections answered.`),
  );
}

function startFlow(route) {
  const group = route.query.g;
  const qs = START_QUESTIONS.filter((q) => !group || q.group === group);
  const startAt = Math.max(0, qs.findIndex((q) => q.id === route.query.flow));
  return h(
    'div',
    { class: 'stack' },
    crumbs({ label: 'Launch Pad', href: '#/launch' }, { label: 'Starting point', href: '#/launch/start' }, { label: group || 'Reflect' }),
    h('h1', { id: 'page-title', tabindex: '-1', class: 'sr' }, group || 'Reflect'),
    questionFlow(qs, {
      partLabel: group || 'Reflect',
      startAt,
      getAnswer: (q) => store.get('start.answers', {})[q.id] || '',
      setAnswer: (q, v) => store.set(`start.answers.${q.id}`, v),
      isDone: (q) => wordCount(store.get('start.answers', {})[q.id] || '') >= 8,
      onFinish: () => go('/launch/start'),
      onExit: () => go('/launch/start'),
      finishLabel: 'Done →',
    }),
  );
}

function mindset() {
  return h(
    'div',
    { class: 'stack', style: { '--gap': '16px' } },
    h('p', { class: 'lede' }, 'Across thousands of creators, the difference between the ones who hit their goals and the ones who do not is rarely skill. It is how they work. Here is what winning creators do.'),
    h('div', { class: 'grid c2' }, MINDSET.map((m, i) => h('div', { class: 'card' }, h('div', { class: 'row top' }, h('div', { class: 'jersey' }, String(i + 1)), h('div', { class: 'grow' }, h('h3', null, m.title), h('p', { class: 'muted' }, m.body)))))),
    h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'The loop'), h('h2', null, 'Learn. Post. Feedback. Apply.'), h('div', { class: 'loop', style: { marginTop: '12px' } }, LOOP.map((l, i) => h('div', { style: { color: 'var(--ink)' } }, h('i', null, `0${i + 1}`), h('b', null, l.label), h('span', null, l.body)))), h('p', { class: 'muted', style: { marginTop: '12px' } }, 'The more times you run the loop, the better you get. When it all starts to feel like too much, come back here and remember: you do not need to do everything. You need to keep moving.')),
  );
}

function safety() {
  const checks = store.get('launch.checks', {});
  const archetype = archetypeById(store.get('profile.archetype'));
  const btn = h('button', { class: 'btn lg', type: 'button' }, checks.safety ? 'Marked as read ✓' : 'I have read this');
  btn.addEventListener('click', () => {
    store.set('launch.checks.safety', true);
    btn.textContent = 'Marked as read ✓';
  });
  return h(
    'div',
    { class: 'stack', style: { '--gap': '16px' } },
    h('p', { class: 'lede' }, 'Athletes have some extra things to think about before building a public brand. Two minutes now saves headaches later. This is general guidance, not legal advice. Rules change, so check with your school, league or compliance office.'),
    archetype.youth && h('div', { class: 'card warnbox' }, h('h4', null, 'You are under 18'), h('p', { style: { margin: '6px 0 0' } }, YOUTH_NOTE)),
    h('div', { class: 'grid c2' }, SAFETY.map((s) => h('div', { class: 'card' }, h('h3', null, s.title), h('p', { class: 'muted' }, s.body)))),
    h('div', null, btn),
  );
}
