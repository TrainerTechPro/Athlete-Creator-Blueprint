// Week 3: give every post a job. Missions, your mix, and a week plan.
import { h, clear, toast } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { MISSIONS, MISSION_BY_ID, RECOMMENDED_MIX, mixFromPosts, mixAdvice, FUNNEL_NOTES } from '../../content/missions.js';
import { FORMAT_BY_ID, displayName } from '../../content/formats.js';
import { toolShell } from '../../ui/toolShell.js';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function render() {
  const mixHost = h('div');
  const untaggedHost = h('div');
  const planHost = h('div');

  const drawMix = () => {
    clear(mixHost);
    const mix = mixFromPosts(store.get('posts', []), 14);
    const rows = MISSIONS.map((m) => {
      const actual = mix.pct[m.id];
      const target = RECOMMENDED_MIX[m.id];
      return h('div', { style: { marginBottom: '14px' } },
        h('div', { class: 'row between' }, h('b', null, m.name), h('span', { class: 'tiny muted' }, `${mix.counts[m.id]} post${mix.counts[m.id] === 1 ? '' : 's'} · ${actual}% now · ${target}% suggested`)),
        h('div', { style: { position: 'relative', height: '16px', border: '2px solid var(--ink)', borderRadius: '99px', background: 'var(--bg-2)', overflow: 'hidden', marginTop: '6px' } },
          h('i', { style: { display: 'block', height: '100%', width: `${actual}%`, background: 'var(--volt)', borderRight: actual ? '2px solid var(--ink)' : '0', transition: 'width .4s' } }),
          h('i', { title: `Suggested ${target}%`, style: { position: 'absolute', top: 0, bottom: 0, left: `${target}%`, width: '3px', background: 'var(--hot)' } }),
        ),
      );
    });
    mixHost.append(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Your last 14 days'), h('span', { class: 'tag volt' }, `${mix.tagged}/${mix.total} tagged`)), h('div', { style: { marginTop: '12px' } }, rows), h('p', { class: 'tiny muted' }, 'The red line is a suggested starting split, not a rule. Reach and trust come before sales, so it leans toward attract and nurture.'), h('div', { class: 'callout' }, h('b', null, 'What to adjust'), h('ul', { style: { margin: '6px 0 0', paddingLeft: '18px' } }, mixAdvice(mix).map((a) => h('li', null, a))))));
  };

  const drawUntagged = () => {
    clear(untaggedHost);
    const cutoff = Date.now() - 30 * 86400000;
    const list = store.get('posts', []).filter((p) => !MISSION_BY_ID[p.mission] && p.date && new Date(p.date).getTime() >= cutoff).slice(0, 8);
    if (!list.length) return;
    untaggedHost.append(
      h('div', { class: 'card pop' }, h('h3', null, 'Tag your recent posts'), h('p', { class: 'muted' }, 'Pick the job each post was really doing.'),
        h('div', { class: 'stack', style: { '--gap': '10px' } }, list.map((p) => h('div', { class: 'idea' }, h('b', null, p.hook || 'Untitled'), h('div', { class: 'chips', style: { marginTop: '8px' } }, MISSIONS.map((m) => h('button', { class: 'chip', type: 'button', onclick: () => {
          store.update('posts', (l) => l.map((x) => (x.id === p.id ? { ...x, mission: m.id } : x)), []);
          drawMix(); drawUntagged(); toast(`Tagged ${m.name}`);
        } }, m.name)))))),
      ),
    );
  };

  const drawPlan = () => {
    clear(planHost);
    const plan = store.get('missionPlan.days', {});
    planHost.append(
      h('div', { class: 'card' }, h('h3', null, 'Plan this week'), h('p', { class: 'muted' }, 'Pick a mission for each day you plan to post. Tap a format to build the hook in the Idea Lab.'),
        h('div', { class: 'stack', style: { '--gap': '12px', marginTop: '12px' } }, WEEKDAYS.map((d) => {
          const cur = plan[d];
          return h('div', { class: 'idea' },
            h('div', { class: 'row' }, h('b', { style: { width: '44px' } }, d), h('div', { class: 'chips' }, MISSIONS.map((m) => h('button', { class: `chip${cur === m.id ? ' on' : ''}`, type: 'button', 'aria-pressed': String(cur === m.id), onclick: () => { store.set(`missionPlan.days.${d}`, cur === m.id ? '' : m.id); drawPlan(); } }, m.name)))),
            cur && MISSION_BY_ID[cur] && h('div', { class: 'chips', style: { marginTop: '8px' } }, h('span', { class: 'tiny muted', style: { alignSelf: 'center' } }, 'Try:'), MISSION_BY_ID[cur].formats.filter((f) => FORMAT_BY_ID[f]).slice(0, 4).map((f) => h('a', { class: 'chip', href: `#/lab?f=${f}` }, displayName(FORMAT_BY_ID[f])))),
          );
        })),
      ),
    );
  };

  drawMix(); drawUntagged(); drawPlan();

  const cards = MISSIONS.map((m) =>
    h('details', { class: 'card', style: { padding: '14px 18px' } },
      h('summary', { style: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' } }, h('span', { class: 'jersey', style: { width: '40px', height: '40px', fontSize: '1.2rem' } }, m.name[0]), h('div', null, h('b', null, m.name), h('div', { class: 'muted tiny' }, m.job))),
      h('div', { class: 'stack', style: { marginTop: '12px', '--gap': '8px' } },
        h('p', { style: { margin: 0 } }, h('b', null, 'The viewer is asking: '), m.asks),
        h('p', { style: { margin: 0 } }, h('b', null, 'Watch: '), m.kpi),
        h('p', { style: { margin: 0 } }, h('b', null, 'Angles: '), m.angles.join(' · ')),
        h('p', { style: { margin: 0 } }, h('b', null, 'Examples: '), m.examples.join(' · ')),
        h('p', { style: { margin: 0 } }, h('b', null, 'Call to action: '), m.cta),
        h('p', { class: 'muted', style: { margin: 0 } }, h('b', null, 'If you only do this: '), m.risk),
      ),
    ),
  );

  return toolShell('missions', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'The funnel'), h('h2', null, 'Attract. Nurture. Position. Convert.'), h('p', { class: 'muted' }, 'The four stack like a funnel. At every layer you lose people but keep the right ones, and trust builds as you go down.'), h('ul', { style: { margin: 0, paddingLeft: '18px' } }, FUNNEL_NOTES.map((n) => h('li', null, n)))),
    h('div', { class: 'stack', style: { '--gap': '10px' } }, cards),
    mixHost, untaggedHost, planHost,
  ), { lede: 'Post with an intention. Every post gets one job, and your mix tells you if your brand is balanced.' });
}
