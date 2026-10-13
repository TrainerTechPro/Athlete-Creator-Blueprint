// Week 2: the pre-flight checklist. Run it on every video before you post.
import { h, clear, debounce, toast } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { PREFLIGHT } from '../../content/editing.js';
import { toolShell } from '../../ui/toolShell.js';
import { checkbox, bar } from '../../ui/components.js';

export function render() {
  const total = PREFLIGHT.reduce((n, g) => n + g.items.length, 0);
  const summary = h('div');
  const groups = h('div', { class: 'stack', style: { '--gap': '16px' } });

  const label = h('input', { type: 'text', id: 'pf-label', value: store.get('edit.label', ''), placeholder: 'Which video are you checking?', autocomplete: 'off' });
  label.addEventListener('input', debounce(() => store.set('edit.label', label.value), 250));

  const done = () => PREFLIGHT.flatMap((g) => g.items).filter((i) => store.get(`edit.checks.${i.id}`)).length;

  const drawSummary = () => {
    clear(summary);
    const d = done();
    summary.append(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', null, d === total ? 'Cleared for takeoff ✓' : 'Pre-flight progress'), h('span', { class: `tag ${d === total ? 'ok' : 'volt'}` }, `${d}/${total}`)), h('div', { style: { marginTop: '10px' } }, bar(Math.round((d / total) * 100)))));
  };

  const drawGroups = () => {
    clear(groups);
    PREFLIGHT.forEach((g) =>
      groups.append(
        h('div', { class: 'card' }, h('h3', null, g.group), h('div', { class: 'stack', style: { marginTop: '12px', '--gap': '8px' } },
          g.items.map((i) => {
            const checked = !!store.get(`edit.checks.${i.id}`);
            return h('div', { class: `check${checked ? ' done' : ''}`, style: { padding: '10px 12px' } },
              checkbox({ checked, label: i.text, onChange: (v) => { store.set(`edit.checks.${i.id}`, v); drawGroups(); drawSummary(); } }),
              h('div', { class: 'grow' }, h('p', { style: { margin: 0, color: 'var(--ink)' } }, i.text)),
            );
          }),
        )),
      ),
    );
  };
  drawSummary(); drawGroups();

  return toolShell('edit', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-label' }, 'Checking'), label),
    summary, groups,
    h('div', { class: 'row' },
      h('button', { class: 'btn secondary', type: 'button', onclick: () => { store.set('edit.checks', {}); store.set('edit.label', ''); label.value = ''; drawGroups(); drawSummary(); toast('Reset for your next video'); } }, 'Reset for the next video'),
      h('a', { class: 'btn', href: '#/posts?new=1' }, 'Log the post →'),
    ),
  ), { lede: 'Editing is where good videos get lost. Run this list on every video so the basics are never missed, then post.' });
}
