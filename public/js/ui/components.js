// Small reusable UI pieces.
import { h } from '../lib/dom.js';

const NS = 'http://www.w3.org/2000/svg';
export function svgIcon(path, size = 16) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', size);
  s.setAttribute('height', size);
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '3');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', path);
  s.append(p);
  return s;
}
export const tick = () => svgIcon('M4 12.5l5 5L20 6.5');
export const arrow = () => svgIcon('M5 12h14M13 6l6 6-6 6', 16);

export function crumbs(...items) {
  return h(
    'nav',
    { class: 'crumbs', 'aria-label': 'Breadcrumb' },
    items.flatMap((it, i) => [
      i ? ' / ' : null,
      it.href ? h('a', { href: it.href }, it.label) : h('span', null, it.label),
    ]),
  );
}

export function pageHead({ eyebrow, title, lede, right }) {
  return h(
    'header',
    { class: 'page-head' },
    eyebrow && h('span', { class: 'eyebrow' }, eyebrow),
    h('div', { class: 'row between top' }, h('h1', { tabindex: '-1', id: 'page-title' }, title), right),
    lede && h('p', { class: 'lede' }, lede),
  );
}

export function bar(pct) {
  return h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct }, h('i', { style: { width: `${pct}%` } }));
}

export function ring(pct) {
  return h('div', { class: 'ring', style: { '--p': pct }, role: 'img', 'aria-label': `${pct} percent` }, h('b', null, `${pct}`));
}

export function jersey(n) {
  return h('div', { class: 'jersey', 'aria-hidden': 'true' }, n);
}

// 10-segment scoreboard-style depth meter.
export function meter(score, level) {
  const on = Math.round(score / 10);
  const cls = level?.id === 'sharp' ? 'l4' : level?.id === 'specific' ? 'l3' : level?.id === 'warming' ? 'l2' : 'l1';
  const el = h('div', { class: `meter ${cls}`, role: 'img', 'aria-label': `Depth ${score} out of 100` });
  for (let i = 0; i < 10; i++) el.append(h('i', { class: i < on ? 'on' : '' }));
  return el;
}

export function checkbox({ checked, onChange, label }) {
  const btn = h(
    'button',
    {
      class: 'box',
      type: 'button',
      role: 'checkbox',
      'aria-checked': String(!!checked),
      'aria-label': label,
      onclick: () => onChange(!checked),
    },
    tick(),
  );
  return btn;
}

export function chips(items, onClick, { activeFn } = {}) {
  return h(
    'div',
    { class: 'chips' },
    items.map((it) => {
      const label = typeof it === 'string' ? it : it.label;
      const val = typeof it === 'string' ? it : it.value ?? it.label;
      return h('button', { type: 'button', class: `chip${activeFn?.(val) ? ' on' : ''}`, onclick: () => onClick(val) }, label);
    }),
  );
}

export function field({ label, help, input, id }) {
  return h('div', { class: 'field' }, label && h('label', { class: 'lbl', for: id }, label), help && h('p', { class: 'help' }, help), input);
}

export function textInput({ id, value, placeholder, onInput, type = 'text' }) {
  const el = h('input', { id, type, value: value || '', placeholder: placeholder || '', autocomplete: 'off' });
  el.addEventListener('input', () => onInput(el.value));
  return el;
}

export function textArea({ id, value, placeholder, onInput, rows = 4 }) {
  const el = h('textarea', { id, rows, placeholder: placeholder || '' });
  el.value = value || '';
  el.addEventListener('input', () => onInput(el.value));
  return el;
}

export function select({ id, value, options, onChange, placeholder }) {
  const el = h(
    'select',
    { id },
    placeholder && h('option', { value: '' }, placeholder),
    options.map((o) => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : o.label;
      return h('option', { value: v }, l);
    }),
  );
  el.value = value || '';
  el.addEventListener('change', () => onChange(el.value));
  return el;
}

export function emptyState(title, body, action) {
  return h('div', { class: 'empty' }, h('h3', null, title), body && h('p', null, body), action);
}

export function link(href, label, cls = 'btn') {
  return h('a', { class: cls, href }, label);
}

export function checklistLine(ok, text) {
  return h('div', { class: `cl${ok ? ' ok' : ''}` }, h('i', null, ok ? '✓' : ''), h('span', null, text));
}

export function vulnerability(n) {
  return h('span', { class: 'vul', role: 'img', 'aria-label': `Personal level ${n} of 3` }, [1, 2, 3].map((i) => h('i', { class: i <= n ? 'on' : '' })));
}
