// Week 2: how discovery works, in plain words, with sources and honest limits.
import { h, clear } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { DISCOVERY, SIGNAL_CHECKLIST } from '../../content/editing.js';
import { toolShell, sourceLink } from '../../ui/toolShell.js';
import { checkbox } from '../../ui/components.js';

export function render() {
  const host = h('div', { class: 'stack', style: { '--gap': '10px' } });
  const draw = () => {
    clear(host);
    SIGNAL_CHECKLIST.forEach((s) => {
      const checked = !!store.get(`edit.signals.${s.id}`);
      host.append(h('div', { class: `check${checked ? ' done' : ''}`, style: { padding: '10px 12px' } }, checkbox({ checked, label: s.text, onChange: (v) => { store.set(`edit.signals.${s.id}`, v); draw(); } }), h('div', { class: 'grow' }, h('p', { style: { margin: 0, color: 'var(--ink)' } }, s.text))));
    });
  };
  draw();

  return toolShell('discovery', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'grid c2' }, DISCOVERY.map((d) => h('div', { class: 'card' }, h('h3', null, d.title), h('p', { class: 'muted' }, d.body), h('div', { class: 'callout' }, h('b', null, 'Takeaway'), d.takeaway), d.source && h('div', { style: { marginTop: '10px' } }, sourceLink(d.source))))),
    h('div', { class: 'card pop' }, h('span', { class: 'eyebrow' }, 'Use it'), h('h3', null, 'Design every video for the signals'), h('p', { class: 'muted' }, 'Before you post, ask: does this video give the platform a reason to show it to more people?'), host),
    h('p', { class: 'muted tiny' }, 'Last checked October 2026. Platforms change their products and what they share. Treat this as a starting point and trust your own analytics over any article.'),
  ), { lede: 'You do not need a secret formula. You need to understand what the platforms say they look at, and design your videos around it.' });
}
