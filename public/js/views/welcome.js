// First-run profile setup. Also reused from Settings to edit the profile.
import { h } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { CONFIG } from '../config.js';
import { ARCHETYPES, PLATFORMS } from '../content/archetypes.js';
import { field, textInput } from '../ui/components.js';

export function profileForm({ onSaved, submitLabel = 'Save profile' }) {
  const p = structuredClone(store.get('profile', {}));
  p.handles ||= {};
  p.platforms ||= [];

  const err = h('p', { class: 'tiny', style: { color: 'var(--hot)', minHeight: '1.2em', margin: '8px 0 0' }, role: 'alert' });

  const arch = h(
    'div',
    { class: 'choices arch', role: 'radiogroup', 'aria-label': 'I am a…' },
    ARCHETYPES.map((a) => {
      const input = h('input', { type: 'radio', name: 'arch', value: a.id, checked: p.archetype === a.id });
      input.addEventListener('change', () => (p.archetype = a.id));
      return h('label', { class: 'choice' }, input, h('span', null, h('b', null, a.label), h('small', null, a.blurb)));
    }),
  );

  const level = h(
    'div',
    { class: 'choices', role: 'radiogroup', 'aria-label': 'Content experience' },
    [
      { id: 'beginner', label: 'Just getting started', blurb: `Goal: post ${CONFIG.postGoal.beginner} times a week` },
      { id: 'advanced', label: 'I already post regularly', blurb: `Goal: post ${CONFIG.postGoal.advanced} times a week` },
    ].map((l) => {
      const input = h('input', { type: 'radio', name: 'lvl', value: l.id, checked: (p.level || 'beginner') === l.id });
      input.addEventListener('change', () => (p.level = l.id));
      return h('label', { class: 'choice' }, input, h('span', null, h('b', null, l.label), h('small', null, l.blurb)));
    }),
  );

  const platforms = h(
    'div',
    { class: 'chips' },
    PLATFORMS.map((pl) => {
      const btn = h('button', { type: 'button', class: `chip${p.platforms.includes(pl.id) ? ' on' : ''}`, 'aria-pressed': String(p.platforms.includes(pl.id)) }, pl.label);
      btn.addEventListener('click', () => {
        p.platforms = p.platforms.includes(pl.id) ? p.platforms.filter((x) => x !== pl.id) : [...p.platforms, pl.id];
        btn.classList.toggle('on');
        btn.setAttribute('aria-pressed', String(p.platforms.includes(pl.id)));
      });
      return btn;
    }),
  );

  const handleInputs = PLATFORMS.slice(0, 3).map((pl) =>
    field({
      id: `h-${pl.id}`,
      label: `${pl.label} handle`,
      input: textInput({ id: `h-${pl.id}`, value: p.handles[pl.id], placeholder: '@yourhandle', onInput: (v) => (p.handles[pl.id] = v) }),
    }),
  );

  const form = h(
    'form',
    { class: 'stack', style: { '--gap': '22px' }, novalidate: true },
    h('div', { class: 'fields' },
      field({ id: 'name', label: 'First name', input: textInput({ id: 'name', value: p.name, placeholder: 'Jordan', onInput: (v) => (p.name = v) }) }),
      field({ id: 'sport', label: 'Your sport', help: 'We use this in examples and prompts.', input: textInput({ id: 'sport', value: p.sport, placeholder: 'Soccer, track, swimming…', onInput: (v) => (p.sport = v) }) }),
    ),
    h('div', null, h('div', { class: 'lbl' }, 'Which describes you best?'), arch),
    h('div', null, h('div', { class: 'lbl' }, 'How much content do you already make?'), level),
    h('div', null, h('div', { class: 'lbl' }, 'Where do you want to post? (pick 1 or 2)'), platforms),
    h('div', { class: 'fields' }, handleInputs),
    err,
    h('button', { class: 'btn lg', type: 'submit' }, submitLabel),
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!(p.name || '').trim()) return (err.textContent = 'Add your first name so we can personalise things.');
    if (!p.archetype) return (err.textContent = 'Pick the option that describes you best.');
    p.createdAt ||= new Date().toISOString();
    p.level ||= 'beginner';
    store.set('profile', p);
    onSaved(p);
  });
  return form;
}

export function render() {
  return h(
    'div',
    { class: 'welcome' },
    h('span', { class: 'eyebrow' }, CONFIG.brand),
    h('h1', { id: 'page-title', tabindex: '-1' }, 'Build the brand', h('br'), 'only you can ', h('span', { class: 'hl' }, 'post.')),
    h('p', { class: 'lede' }, CONFIG.tagline + ' This is a guided workbook, not a form. It asks sharper questions when your answers are vague and turns them into a Blueprint you can post from.'),
    h(
      'div',
      { class: 'grid c3', style: { marginTop: '22px' } },
      [
        ['01', 'Say', 'What you stand for'],
        ['02', 'Reach', 'Who needs it'],
        ['03', 'Why', 'The stories behind it'],
      ].map(([n, t, d]) => h('div', { class: 'stat' }, h('div', { class: 'n' }, n), h('div', { style: { fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase' } }, t), h('div', { class: 'l' }, d))),
    ),
    h('div', { class: 'card pop' }, h('h2', null, 'First, who are you?'), h('p', { class: 'muted' }, 'Two minutes. This only shapes examples and prompts. Everything stays on your device.'), profileForm({ submitLabel: 'Start my Blueprint →', onSaved: () => go('/') })),
  );
}
