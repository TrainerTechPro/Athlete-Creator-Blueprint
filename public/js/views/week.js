// Hub page for Weeks 2 to 4: overview, tools, Do/Don't, FAQ, goals and daily plan.
import { h } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { WEEKS } from '../content/weeks.js';
import { TOOL_META } from '../content/toolmeta.js';
import { progress, weekProgress } from '../progress.js';
import { crumbs, pageHead, bar, ring } from '../ui/components.js';
import { weekBoard } from '../ui/weekBoard.js';

export function render(route) {
  const n = Number(route.parts[1]);
  const cfg = WEEKS[n];
  if (!cfg) return h('div', { class: 'card' }, h('h2', null, 'Week not found'), h('a', { class: 'btn', href: '#/' }, 'Go home'));

  const p = progress();
  const wp = weekProgress(n);
  const prev = n === 2 ? p.week1 : p.weeks[n - 1].pct;
  const prevLabel = n === 2 ? 'Week 1' : `Week ${n - 1}`;

  const toolCards = cfg.tools.map((id) => {
    const t = TOOL_META[id];
    return h('a', { class: 'f-card', href: `#/tools/${id}` }, h('div', { class: 'row between' }, h('span', { class: 'jersey', style: { width: '40px', height: '40px', fontSize: '1.3rem' } }, t.icon), h('span', { class: 'tag line' }, 'Tool')), h('h3', null, t.title), h('p', null, t.blurb));
  });

  return h(
    'div',
    { class: 'stack', style: { '--gap': '24px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: `Week ${n}` }),
    pageHead({
      eyebrow: `Week ${n} · ${cfg.short}`,
      title: cfg.title,
      lede: cfg.tagline,
      right: ring(wp.pct),
    }),
    prev < 40 && h('div', { class: 'card warnbox' }, h('b', null, `${prevLabel} is ${prev}% done. `), `Each week builds on the one before. You can start here, but the tools work best once ${prevLabel} is in place.`),
    h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'This week'), h('p', { style: { margin: '0 0 10px' } }, cfg.overview), h('p', { class: 'muted', style: { margin: 0 } }, cfg.summary)),
    h('section', null, h('h2', { style: { marginBottom: '12px' } }, 'Your tools'), h('div', { class: 'f-grid' }, toolCards)),
    h('div', { class: 'two' },
      h('div', { class: 'card do' }, h('span', { class: 'eyebrow' }, 'Do this'), h('ul', null, cfg.dos.map((d) => h('li', null, d)))),
      h('div', { class: 'card dont' }, h('span', { class: 'eyebrow', style: { color: 'var(--hot)' } }, 'Do not do this'), h('ul', null, cfg.donts.map((d) => h('li', null, d)))),
    ),
    h('div', { class: 'card soft' }, h('h3', null, 'Common questions'), h('div', { style: { marginTop: '10px' } }, cfg.faq.map((f) => h('details', { style: { padding: '10px 0', borderBottom: '1.5px solid var(--line)' } }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, f.q), h('p', { class: 'muted', style: { marginTop: '8px' } }, f.a))))),
    weekBoard(n),
    h('div', { class: 'row between' }, n > 2 ? h('a', { class: 'btn secondary', href: `#/week/${n - 1}` }, `← Week ${n - 1}`) : h('a', { class: 'btn secondary', href: '#/plan' }, '← Week 1 plan'), n < 4 ? h('a', { class: 'btn lg', href: `#/week/${n + 1}` }, `Week ${n + 1} →`) : h('a', { class: 'btn lg', href: '#/tools/strategy' }, 'Open my strategy →')),
  );
}
