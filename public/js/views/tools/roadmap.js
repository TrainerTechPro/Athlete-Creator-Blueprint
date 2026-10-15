// Week 4: choose one path and get a 30-day plan you can edit and tick off.
import { h, clear, uid, debounce, confirmDialog, todayISO, toast } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { ROADMAP_PATHS, ROADMAP_BY_ID, READINESS, readinessTier } from '../../content/sales.js';
import { toolShell } from '../../ui/toolShell.js';
import { checkbox, bar } from '../../ui/components.js';

function build(pathId) {
  const p = ROADMAP_BY_ID[pathId];
  return {
    path: pathId,
    start: todayISO(),
    metric: p.metric,
    weeks: p.weeks.map((w) => ({ title: w.title, actions: w.actions.map((text) => ({ id: uid(), text, done: false })) })),
  };
}

export function render() {
  const host = h('div', { class: 'stack', style: { '--gap': '18px' } });
  const get = () => store.get('roadmap', {});
  const save = () => store.set('roadmap', get());

  const readiness = () => {
    const a = store.get('readiness.answers', {});
    if (READINESS.some((q) => a[q.id] === undefined)) return null;
    return readinessTier(READINESS.reduce((s, q) => s + a[q.id], 0), READINESS.length * 2);
  };

  const draw = () => {
    clear(host);
    const rm = get();
    if (!rm.path) {
      const tier = readiness();
      if (tier && tier.id === 'build') host.append(h('div', { class: 'card warnbox' }, h('b', null, 'Your readiness check says: keep building the base. '), 'The "Grow my audience" path is the best fit right now.'));
      host.append(
        h('div', { class: 'grid c2' }, ROADMAP_PATHS.map((p) =>
          h('div', { class: 'card' }, h('h3', null, p.name), h('p', { class: 'muted' }, h('b', null, 'You will track: '), p.metric),
            h('ol', { class: 'steps' }, p.weeks.map((w, i) => h('li', null, h('span', null, h('b', null, `Week ${i + 1}: `), w.title)))),
            h('div', { style: { marginTop: '12px' } }, h('button', { class: 'btn', type: 'button', onclick: () => { store.set('roadmap', build(p.id)); draw(); toast('Roadmap created'); } }, 'Choose this path'))),
        )),
      );
      return;
    }
    const total = rm.weeks.reduce((n, w) => n + w.actions.length, 0);
    const done = rm.weeks.reduce((n, w) => n + w.actions.filter((a) => a.done).length, 0);
    const startIn = h('input', { type: 'date', id: 'rm-start', value: rm.start || todayISO() });
    startIn.addEventListener('change', () => { rm.start = startIn.value; save(); draw(); });
    const metricIn = h('input', { type: 'text', id: 'rm-metric', value: rm.metric || '', autocomplete: 'off' });
    metricIn.addEventListener('input', debounce(() => { rm.metric = metricIn.value; save(); }, 250));

    host.append(
      h('div', { class: 'card volt pop' }, h('div', { class: 'row between' }, h('div', null, h('span', { class: 'eyebrow' }, 'Your path'), h('h2', null, ROADMAP_BY_ID[rm.path].name)), h('span', { class: 'tag' }, `${done}/${total} actions`)), h('div', { style: { marginTop: '10px' } }, bar(total ? Math.round((done / total) * 100) : 0))),
      h('div', { class: 'fields' }, h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'rm-start' }, 'Start date'), startIn), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'rm-metric' }, 'What I will track'), metricIn)),
    );

    rm.weeks.forEach((w, wi) => {
      const start = rm.start ? new Date(rm.start) : null;
      let range = '';
      if (start && !isNaN(start)) {
        const a = new Date(start.getTime() + wi * 7 * 86400000);
        const b = new Date(a.getTime() + 6 * 86400000);
        const f = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        range = `${f(a)} to ${f(b)}`;
      }
      const list = h('div', { class: 'stack', style: { '--gap': '8px' } });
      const drawList = () => {
        clear(list);
        w.actions.forEach((a, ai) => {
          const input = h('input', { type: 'text', value: a.text, 'aria-label': `Week ${wi + 1} action ${ai + 1}`, style: { textDecoration: a.done ? 'line-through' : 'none', opacity: a.done ? 0.6 : 1 } });
          input.addEventListener('input', debounce(() => { a.text = input.value; save(); }, 250));
          list.append(h('div', { class: `check${a.done ? ' done' : ''}`, style: { padding: '8px 10px', alignItems: 'center' } },
            checkbox({ checked: a.done, label: a.text, onChange: (v) => { a.done = v; save(); draw(); } }),
            h('div', { class: 'grow' }, input),
            h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': 'Remove action', onclick: () => { w.actions.splice(ai, 1); save(); draw(); } }, '✕')));
        });
        list.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { w.actions.push({ id: uid(), text: '', done: false }); save(); draw(); } }, '+ Add an action')));
      };
      drawList();
      host.append(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('div', null, h('span', { class: 'eyebrow', style: { marginBottom: 0 } }, `Week ${wi + 1}${range ? ' · ' + range : ''}`), h('h3', null, w.title))), h('div', { style: { marginTop: '12px' } }, list)));
    });

    host.append(
      h('div', { class: 'callout' }, h('b', null, 'If an action does not fit'), 'Edit it. A plan you change is better than a plan you ignore. Keep to three actions a week so you can actually do them.'),
      h('div', { class: 'row' }, h('button', { class: 'btn secondary', type: 'button', onclick: async () => { if (await confirmDialog('Switch path? This replaces your current roadmap.', 'Switch path')) { store.set('roadmap', {}); draw(); } } }, 'Choose a different path'), h('a', { class: 'btn lg', href: '#/tools/strategy' }, 'See my strategy →')),
    );
  };
  draw();

  return toolShell('roadmap', host, { lede: 'Pick one direction for the next 30 days. One path with three actions a week beats five plans you never start.' });
}
