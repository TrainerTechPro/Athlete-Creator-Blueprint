// Week 2: Offer Sketch. Turn what people ask you for into a first idea.
import { h, clear, debounce, toast } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { OFFER_FIELDS, offerChecks, PRODUCT_TYPES, VALIDATION_SIGNALS } from '../../content/sales.js';
import { fieldEl } from '../../ui/fields.js';
import { toolShell } from '../../ui/toolShell.js';
import { checklistLine, checkbox, bar } from '../../ui/components.js';

export function render() {
  const draft = { ...store.get('offer', {}) };
  const persist = debounce(() => store.set('offer', draft), 250);
  const checks = h('div', { class: 'checks' });
  const meter = h('div');
  const drawChecks = () => {
    clear(checks); clear(meter);
    const c = offerChecks(draft);
    const ok = c.filter((x) => x.ok).length;
    c.forEach((x) => checks.append(checklistLine(x.ok, x.text)));
    meter.append(h('div', { class: 'row between' }, h('b', null, 'Offer strength'), h('span', { class: `tag ${ok === c.length ? 'ok' : 'volt'}` }, `${ok}/${c.length}`)), h('div', { style: { marginTop: '8px' } }, bar(Math.round((ok / c.length) * 100))));
  };
  const form = h('div', { class: 'stack', style: { '--gap': '14px' } });
  const changed = () => { persist(); drawChecks(); };
  const drawForm = () => { clear(form); OFFER_FIELDS.forEach((f) => form.append(fieldEl(f, draft, changed))); };
  drawForm(); drawChecks();

  const st = store.get('blueprint.statement', {});
  const pull = h('button', { class: 'btn secondary', type: 'button', onclick: () => {
    if (st.who && !draft.who) draft.who = st.who;
    if (st.struggle && !draft.problem) draft.problem = st.struggle;
    if (st.outcome && !draft.promise) draft.promise = st.outcome;
    store.set('offer', draft);
    drawForm(); drawChecks();
    toast(st.who || st.struggle || st.outcome ? 'Pulled from your message statement' : 'Write your message statement first', st.who ? 'ok' : 'warn');
  } }, 'Pull from my message statement');

  const signals = h('div', { class: 'stack', style: { '--gap': '8px' } });
  const drawSignals = () => {
    clear(signals);
    VALIDATION_SIGNALS.forEach((s, i) => {
      const checked = !!store.get(`offer.signals.s${i}`);
      signals.append(h('div', { class: `check${checked ? ' done' : ''}`, style: { padding: '10px 12px' } }, checkbox({ checked, label: s, onChange: (v) => { store.set(`offer.signals.s${i}`, v); draft.signals = { ...(draft.signals || {}), [`s${i}`]: v }; drawSignals(); } }), h('div', { class: 'grow' }, h('p', { style: { margin: 0, color: 'var(--ink)' } }, s))));
    });
  };
  drawSignals();

  return toolShell('offer', h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'Sketch, do not build'), 'This is a one-page idea, not a business plan. The goal is to find out whether anyone wants it before you spend time making it.'),
    h('div', { class: 'lab' },
      h('div', { class: 'card pop stack', style: { '--gap': '14px' } }, pull, form),
      h('div', { class: 'stack', style: { '--gap': '16px', position: 'sticky', top: '12px' } }, h('div', { class: 'card' }, meter, h('div', { style: { marginTop: '12px' } }, checks)), h('div', { class: 'card soft' }, h('h4', null, 'Signs people want it'), h('div', { style: { marginTop: '10px' } }, signals))),
    ),
    h('div', { class: 'card soft' }, h('h3', null, 'Ways to package it'), h('div', { class: 'grid c3', style: { marginTop: '12px' } }, PRODUCT_TYPES.map((p) => h('div', { class: 'leaf' }, h('small', null, `Effort ${'●'.repeat(p.effort)}${'○'.repeat(3 - p.effort)}`), h('b', null, p.name), h('p', { class: 'muted tiny', style: { margin: '4px 0' } }, p.example), h('p', { class: 'tiny', style: { margin: 0 } }, h('b', null, 'Validate: '), p.validate))))),
  ));
}
