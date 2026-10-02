// Week 3: the call-to-action ladder, a simple lead path, and a profile conversion check.
import { h, clear, debounce, autoGrow, copyText } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { CTA_LADDER, LEAD_PATH_STEPS, PROFILE_AUDIT, DISCLOSURE_RULES } from '../../content/sales.js';
import { toolShell } from '../../ui/toolShell.js';
import { checkbox, bar } from '../../ui/components.js';

export function render() {
  const ladder = CTA_LADDER.map((step, i) => {
    const ta = h('textarea', { rows: 2, id: `cta-${step.id}`, placeholder: step.script });
    ta.value = store.get(`leads.ladder.${step.id}`, '');
    autoGrow(ta);
    const save = debounce(() => store.set(`leads.ladder.${step.id}`, ta.value), 250);
    ta.addEventListener('input', save);
    ta.addEventListener('blur', () => save.flush());
    return h('div', { class: 'card' },
      h('div', { class: 'row top' }, h('div', { class: 'jersey' }, String(i + 1)), h('div', { class: 'grow' }, h('div', { class: 'row' }, h('h3', null, step.name), h('span', { class: 'tag line' }, step.when)), h('p', { class: 'muted', style: { margin: '4px 0 10px' } }, `The ask: ${step.ask}.`),
        h('label', { class: 'lbl', for: `cta-${step.id}` }, 'Your version'), ta,
        h('p', { class: 'tiny muted', style: { margin: '8px 0 0' } }, h('b', null, 'Watch out: '), step.risk),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { ta.value = step.script; ta.dispatchEvent(new Event('input')); } }, 'Start from the example'), h('button', { class: 'btn ghost sm', type: 'button', onclick: () => ta.value.trim() && copyText(ta.value) }, 'Copy')))),
    );
  });

  const path = LEAD_PATH_STEPS.map((s, i) => {
    const input = h('input', { type: 'text', id: `lp-${s.id}`, value: store.get(`leads.path.${s.id}`, ''), placeholder: s.fieldHint, autocomplete: 'off' });
    input.addEventListener('input', debounce(() => store.set(`leads.path.${s.id}`, input.value), 250));
    return h('div', { class: 'row top', style: { flexWrap: 'nowrap' } }, h('div', { class: 'jersey', style: { width: '40px', height: '40px', fontSize: '1.3rem' } }, String(i + 1)), h('div', { class: 'grow' }, h('label', { class: 'lbl', for: `lp-${s.id}` }, s.label), input));
  });

  const audit = h('div', { class: 'stack', style: { '--gap': '8px' } });
  const auditBar = h('div');
  const drawAudit = () => {
    clear(audit); clear(auditBar);
    const done = PROFILE_AUDIT.filter((a) => store.get(`leads.profile.${a.id}`)).length;
    auditBar.append(h('div', { class: 'row between' }, h('b', null, 'Profile conversion check'), h('span', { class: 'tag volt' }, `${done}/${PROFILE_AUDIT.length}`)), h('div', { style: { margin: '8px 0 12px' } }, bar(Math.round((done / PROFILE_AUDIT.length) * 100))));
    PROFILE_AUDIT.forEach((a) => {
      const checked = !!store.get(`leads.profile.${a.id}`);
      audit.append(h('div', { class: `check${checked ? ' done' : ''}`, style: { padding: '10px 12px' } }, checkbox({ checked, label: a.text, onChange: (v) => { store.set(`leads.profile.${a.id}`, v); drawAudit(); } }), h('div', { class: 'grow' }, h('p', { style: { margin: 0, color: 'var(--ink)' } }, a.text))));
    });
  };
  drawAudit();

  return toolShell('leads', h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'Ask in steps'), 'Most people never buy from a stranger. They follow, then engage, then ask a question, then buy. Match the size of your ask to how well the viewer knows you. A convert ask on an attract post usually fails.'),
    h('section', null, h('h2', { style: { marginBottom: '12px' } }, 'Your call-to-action ladder'), h('div', { class: 'stack', style: { '--gap': '12px' } }, ladder)),
    h('div', { class: 'card pop' }, h('h3', null, 'A simple path from viewer to conversation'), h('p', { class: 'muted' }, 'Keep it to four steps and one keyword. Example: a position post says “comment GUIDE”, you send a free checklist, then invite them to a pilot.'), h('div', { class: 'stack', style: { '--gap': '14px', marginTop: '12px' } }, path)),
    h('div', { class: 'card' }, auditBar, audit),
    h('div', { class: 'card warnbox' }, h('h4', null, 'Before you ask for anything'), h('ul', { style: { margin: '8px 0 0', paddingLeft: '18px' } }, DISCLOSURE_RULES.map((r) => h('li', null, r))), h('a', { class: 'link tiny', href: '#/tools/monetize' }, 'Read the full rules note →')),
  ), { lede: 'Attention is not income. Build a clear, honest path from a viewer to a conversation.' });
}
