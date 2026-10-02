// Week 4: write your offer pitch as Struggle, Move, Win. Caption and DM reply included.
import { h, clear, debounce, toast, copyText } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { PITCH_FIELDS, pitchChecks, assemblePitch, assembleDM, DISCLOSURE_RULES } from '../../content/sales.js';
import { fieldEl } from '../../ui/fields.js';
import { toolShell } from '../../ui/toolShell.js';
import { checklistLine, bar } from '../../ui/components.js';

export function render() {
  const draft = { ...store.get('pitch', {}) };
  const persist = debounce(() => store.set('pitch', draft), 250);
  const form = h('div', { class: 'stack', style: { '--gap': '14px' } });
  const checks = h('div', { class: 'checks' });
  const status = h('div');
  const caption = h('div', { class: 'preview' });
  const dm = h('div', { class: 'preview' });

  const drawOut = () => {
    clear(checks); clear(status);
    const c = pitchChecks(draft);
    const ok = c.filter((x) => x.ok).length;
    c.forEach((x) => checks.append(checklistLine(x.ok, x.text)));
    status.append(h('div', { class: 'row between' }, h('b', null, 'Pitch checks'), h('span', { class: `tag ${ok === c.length ? 'ok' : 'volt'}` }, `${ok}/${c.length}`)), h('div', { style: { marginTop: '8px' } }, bar(Math.round((ok / c.length) * 100))));
    const cap = assemblePitch(draft);
    caption.textContent = cap || 'Your caption appears as you write.';
    caption.style.opacity = cap ? 1 : 0.55;
    caption.dataset.text = cap;
    const d = (draft.struggle || draft.offer) ? assembleDM(draft) : '';
    dm.textContent = d || 'Your DM reply appears as you write.';
    dm.style.opacity = d ? 1 : 0.55;
    dm.dataset.text = d;
  };
  const changed = () => { persist(); drawOut(); };
  const drawForm = () => { clear(form); PITCH_FIELDS.forEach((f) => form.append(fieldEl(f, draft, changed))); };
  drawForm(); drawOut();

  const offer = store.get('offer', {});
  const pull = h('button', { class: 'btn secondary', type: 'button', onclick: () => {
    if (!offer.problem && !offer.promise) return toast('Fill in your Offer Sketch first', 'warn');
    if (offer.problem && !draft.struggle) draft.struggle = `${offer.problem}.`;
    if (offer.promise && !draft.win) draft.win = `${offer.promise}.`;
    if (offer.who && !draft.forwho) draft.forwho = `For ${offer.who}.`;
    if (offer.price && !draft.price) draft.price = offer.price;
    store.set('pitch', draft);
    drawForm(); drawOut();
    toast('Pulled from your Offer Sketch');
  } }, 'Pull from my Offer Sketch');

  const copy = (el) => () => (el.dataset.text ? copyText(el.dataset.text) : toast('Nothing to copy yet', 'warn'));

  return toolShell('pitch', h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'Story first, offer second'), 'The best pitch does not feel like one. It starts with their struggle, shows what you did about it, and invites them to the win. Lead with the person, not the product.'),
    h('div', { class: 'lab' },
      h('div', { class: 'card pop stack', style: { '--gap': '14px' } }, pull, form),
      h('div', { class: 'stack', style: { '--gap': '16px', position: 'sticky', top: '12px' } },
        h('div', { class: 'card' }, status, h('div', { style: { marginTop: '12px' } }, checks)),
        h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', null, 'Caption or Stories script'), h('button', { class: 'btn secondary sm', type: 'button', onclick: copy(caption) }, 'Copy')), h('div', { style: { marginTop: '10px' } }, caption)),
        h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', null, 'DM reply'), h('button', { class: 'btn secondary sm', type: 'button', onclick: copy(dm) }, 'Copy')), h('div', { style: { marginTop: '10px' } }, dm)),
      ),
    ),
    h('div', { class: 'card warnbox' }, h('h4', null, 'Disclosure and eligibility'), h('ul', { style: { margin: '8px 0 0', paddingLeft: '18px' } }, DISCLOSURE_RULES.map((r) => h('li', null, r))), h('p', { class: 'tiny', style: { margin: '10px 0 0' } }, 'Check that you are allowed to sell or promote this under your sport, school and league rules before you post.')),
  ));
}
