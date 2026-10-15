// A small add / edit / delete list backed by an array in the store. Used by several Week 2 to 4 tools.
import { h, clear, uid, confirmDialog, toast } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { fieldEl } from './fields.js';

/**
 * opts:
 *  path        store path to an array
 *  fields      field schema (see ui/fields.js)
 *  blank()     returns a new empty item (id is added for you)
 *  card(item)  returns a node describing an item
 *  validate(draft) -> string | null   (error message)
 *  addLabel, formTitle, emptyText, max
 *  onChange()  called after any change
 *  newFirst    show newest first (default true)
 */
export function collection(opts) {
  const host = h('div', { class: 'stack', style: { '--gap': '14px' } });
  let editing = null; // item id, 'new' or null
  let draft = null;

  const list = () => store.get(opts.path, []);
  const save = (items) => {
    store.set(opts.path, items);
    opts.onChange?.();
  };

  if (opts.initial) {
    editing = 'new';
    draft = { id: uid(), ...opts.blank(), ...opts.initial };
  }

  const draw = () => {
    clear(host);
    const items = list();
    if (editing) host.append(form());
    else if (!opts.max || items.length < opts.max) {
      host.append(
        h('div', null, h('button', { class: 'btn lg', type: 'button', onclick: () => { editing = 'new'; draft = { id: uid(), ...opts.blank() }; draw(); } }, opts.addLabel || '+ Add')),
      );
    }
    if (!items.length && !editing) host.append(h('div', { class: 'empty' }, opts.emptyText || 'Nothing here yet.'));
    const ordered = opts.newFirst === false ? items : [...items].reverse();
    ordered.forEach((item) => {
      if (editing === item.id) return;
      host.append(
        h('article', { class: 'idea' },
          opts.card(item),
          h('div', { class: 'row', style: { marginTop: '10px' } },
            h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { editing = item.id; draft = structuredClone(item); draw(); } }, 'Edit'),
            h('button', { class: 'btn ghost sm', type: 'button', onclick: async () => { if (await confirmDialog('Delete this entry?', 'Delete')) { save(list().filter((x) => x.id !== item.id)); draw(); } } }, 'Delete'),
            opts.extraActions?.(item, draw),
          ),
        ),
      );
    });
  };

  const form = () => {
    const err = h('p', { class: 'tiny', style: { color: 'var(--hot)', margin: 0, minHeight: '1.2em' }, role: 'alert' });
    const fields = h('div', { class: 'stack', style: { '--gap': '14px' } }, opts.fields.map((f) => fieldEl(f, draft, () => opts.onDraft?.(draft))));
    return h('form', { class: 'card pop stack', style: { '--gap': '14px' }, novalidate: true, onsubmit: (e) => {
      e.preventDefault();
      const msg = opts.validate?.(draft);
      if (msg) return (err.textContent = msg);
      const exists = list().some((x) => x.id === draft.id);
      save(exists ? list().map((x) => (x.id === draft.id ? draft : x)) : [...list(), draft]);
      editing = null; draft = null;
      toast('Saved');
      draw();
    } },
      h('h3', null, opts.formTitle || 'Add entry'),
      fields,
      err,
      h('div', { class: 'row' }, h('button', { class: 'btn lg', type: 'submit' }, 'Save'), h('button', { class: 'btn ghost', type: 'button', onclick: () => { editing = null; draft = null; draw(); } }, 'Cancel')),
    );
  };

  draw();
  host.refresh = draw;
  return host;
}
