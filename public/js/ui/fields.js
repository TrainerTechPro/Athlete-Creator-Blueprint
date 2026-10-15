// Schema-driven form fields shared by the challenge builders and the Week 2 to 4 tools.
// Field types: text, longtext, number, select, choice (chips), list (repeatable rows), pairs (expectation vs reality).
import { h, clear, autoGrow } from '../lib/dom.js';
import { SPEAK_WPS } from '../content/challenge.js';

export function fieldEl(f, draft, changed) {
  const wrap = h('div', { class: 'field' });
  const label = h('label', { class: 'lbl', for: `f-${f.id}` }, f.label);
  if (f.type === 'text') {
    const el = h('input', { type: 'text', id: `f-${f.id}`, value: draft[f.id] || '', placeholder: f.placeholder || '', autocomplete: 'off' });
    el.addEventListener('input', () => { draft[f.id] = el.value; changed(); });
    return wrap.append(label, el), wrap;
  }
  if (f.type === 'longtext') {
    const el = h('textarea', { id: `f-${f.id}`, rows: f.rows || 5, placeholder: f.placeholder || '' });
    el.value = draft[f.id] || '';
    autoGrow(el);
    const note = h('div', { class: 'tiny muted', style: { marginTop: '4px' } });
    const upd = () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      note.textContent = f.id === 'script' ? `${words} words ≈ ${Math.round(words / SPEAK_WPS)} seconds out loud` : `${words} words`;
    };
    el.addEventListener('input', () => { draft[f.id] = el.value; upd(); changed(); });
    upd();
    return wrap.append(label, el, note), wrap;
  }
  if (f.type === 'select') {
    const el = h('select', { id: `f-${f.id}` }, h('option', { value: '' }, 'Choose…'), f.options.map((o) => (typeof o === 'string' ? h('option', { value: o }, o) : h('option', { value: o.value }, o.label))));
    el.value = draft[f.id] || '';
    el.addEventListener('change', () => { draft[f.id] = el.value; changed(); });
    return wrap.append(label, el), wrap;
  }
  if (f.type === 'list') {
    const rows = h('div', { class: 'rows' });
    const draw = () => {
      clear(rows);
      if (!draft[f.id].length) draft[f.id] = Array.from({ length: f.min }, () => '');
      draft[f.id].forEach((val, i) => {
        const ta = h('textarea', { rows: 2, placeholder: f.placeholder, 'aria-label': `${f.label} ${i + 1}`, style: { minHeight: '64px' } });
        ta.value = val;
        autoGrow(ta);
        ta.addEventListener('input', () => { draft[f.id][i] = ta.value; changed(); });
        rows.append(h('div', { class: 'rowin' }, h('span', { class: 'n' }, String(i + 1)), ta, draft[f.id].length > f.min ? h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Remove ${i + 1}`, onclick: () => { draft[f.id].splice(i, 1); draw(); changed(); } }, '✕') : h('span')));
      });
      if (draft[f.id].length < f.max) rows.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { draft[f.id].push(''); draw(); } }, '+ Add')));
    };
    draw();
    return wrap.append(label, rows), wrap;
  }
  if (f.type === 'pairs') {
    const rows = h('div', { class: 'rows' });
    const draw = () => {
      clear(rows);
      if (!draft[f.id].length) draft[f.id] = Array.from({ length: f.min }, () => ({ label: '', expectAge: '', realAge: '' }));
      draft[f.id].forEach((p, i) => {
        const mk = (key, ph, aria, type = 'text') => {
          const el = h('input', { type, value: p[key] || '', placeholder: ph, 'aria-label': `Slide ${i + 1} ${aria}`, inputmode: type === 'number' ? 'numeric' : null });
          el.addEventListener('input', () => { p[key] = el.value; changed(); });
          return el;
        };
        rows.append(h('div', { class: 'pairrow' }, h('span', { class: 'n', style: { fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: '1.3rem', paddingBottom: '10px' } }, String(i + 1)), h('div', { class: 'lab-col' }, i === 0 && h('div', { class: 'tiny muted' }, 'Milestone'), mk('label', 'First car', 'milestone')), h('div', null, i === 0 && h('div', { class: 'tiny muted' }, 'Expected at'), mk('expectAge', '16', 'expected age', 'number')), h('div', null, i === 0 && h('div', { class: 'tiny muted' }, 'Actually at'), mk('realAge', '23', 'real age', 'number')), draft[f.id].length > f.min ? h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Remove slide ${i + 1}`, onclick: () => { draft[f.id].splice(i, 1); draw(); changed(); } }, '✕') : h('span')));
      });
      if (draft[f.id].length < f.max) rows.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { draft[f.id].push({ label: '', expectAge: '', realAge: '' }); draw(); } }, '+ Add slide')));
    };
    draw();
    return wrap.append(label, rows), wrap;
  }
  if (f.type === 'number') {
    const el = h('input', { type: 'number', id: `f-${f.id}`, value: draft[f.id] ?? '', placeholder: f.placeholder || '', inputmode: 'numeric', min: 0 });
    el.addEventListener('input', () => { draft[f.id] = el.value; changed(); });
    return wrap.append(label, el), wrap;
  }
  if (f.type === 'choice') {
    const group = h('div', { class: 'chips', role: 'radiogroup', 'aria-label': f.label });
    const draw = () => {
      clear(group);
      f.options.forEach((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const lab = typeof o === 'string' ? o : o.label;
        group.append(h('button', { type: 'button', class: `chip${draft[f.id] === val ? ' on' : ''}`, role: 'radio', 'aria-checked': String(draft[f.id] === val), onclick: () => { draft[f.id] = draft[f.id] === val ? '' : val; draw(); changed(); } }, lab));
      });
    };
    draw();
    return wrap.append(h('div', { class: 'lbl' }, f.label), group), wrap;
  }
  return wrap;
}
