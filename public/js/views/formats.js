// Lesson 2: Message + format = content that works. Format library, matcher quiz, format detail.
import { h, clear } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { FORMATS, FORMAT_BY_ID, KIND_LABEL, MATCHER, matchFormats, fillHook, displayName } from '../content/formats.js';
import { archetypeById } from '../content/archetypes.js';
import { crumbs, pageHead, vulnerability, bar, arrow } from '../ui/components.js';

export function render(route) {
  const sub = route.parts[1];
  if (sub === 'match') return matcher();
  if (sub && FORMAT_BY_ID[sub]) return detail(FORMAT_BY_ID[sub]);
  return library(route);
}

const savedIds = () => store.get('formats.saved', []);
const toggleSaved = (id) => store.set('formats.saved', savedIds().includes(id) ? savedIds().filter((x) => x !== id) : [...savedIds(), id]);

function library(route) {
  let kind = route.query.kind || 'all';
  const host = h('div');
  const filters = h('div', { class: 'filters', role: 'group', 'aria-label': 'Filter formats' });
  const draw = () => {
    clear(filters);
    [['all', 'All'], ['talking', 'Talking'], ['non-talking', 'Non-talking'], ['carousel', 'Carousel'], ['saved', `Shortlist (${savedIds().length})`]].forEach(([k, l]) =>
      filters.append(h('button', { class: `chip${kind === k ? ' on' : ''}`, type: 'button', 'aria-pressed': String(kind === k), onclick: () => { kind = k; draw(); } }, l)),
    );
    clear(host);
    const list = FORMATS.filter((f) => (kind === 'all' ? true : kind === 'saved' ? savedIds().includes(f.id) : f.kind === kind));
    if (!list.length) return host.append(h('div', { class: 'empty' }, h('h3', null, 'Nothing here yet'), h('p', null, 'Save formats from their detail page, or take the matcher quiz to get a shortlist.')));
    host.append(
      h('div', { class: 'f-grid' }, list.map((f) => h('a', { class: 'f-card', href: `#/formats/${f.id}` },
        h('div', { class: 'row between' }, h('span', { class: 'tag' }, KIND_LABEL[f.kind]), savedIds().includes(f.id) && h('span', { class: 'tag volt' }, 'Shortlisted')),
        h('h3', null, displayName(f)),
        h('p', null, f.summary),
        h('div', { class: 'meta' }, h('span', { class: 'tiny muted' }, 'Personal'), vulnerability(f.vulnerability), h('span', { class: 'tiny muted', style: { marginLeft: '8px' } }, ['', 'Quick', 'Medium', 'Longer'][f.effort])),
      ))),
    );
  };
  draw();

  const matched = Object.keys(store.get('formats.matcher', {})).length >= 5;
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Formats' }),
    pageHead({
      eyebrow: 'Lesson 2 · Get more views with the right formats',
      title: 'The Format Bank',
      lede: 'Every post has two parts: the message (what you say) and the format (how you package it). You need both. Pick a few formats that fit your capacity, then test them often enough to learn what works for you.',
    }),
    h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'The equation'), h('h2', null, 'Message + Format = Content that works'), h('p', { class: 'muted' }, 'Talking formats build connection, authority and personality. Non-talking formats (B-roll, carousels) are often easier to optimise for reach. A strong strategy makes room for both. You do not need to master every format.')),
    h('div', { class: 'card volt pop row between' }, h('div', null, h('h3', null, matched ? 'Your matches are ready' : 'Not sure where to start?'), h('p', { style: { margin: '4px 0 0' } }, '5 quick questions. We rank formats by what fits your comfort, time and goals.')), h('a', { class: 'btn secondary lg', href: '#/formats/match' }, matched ? 'See my matches' : 'Find my formats', arrow())),
    filters,
    host,
    h('div', { class: 'row end' }, h('a', { class: 'btn lg', href: '#/lab' }, 'Next: Idea Lab →')),
  );
}

function matcher() {
  const answers = { ...store.get('formats.matcher', {}) };
  const host = h('div', { class: 'stack', style: { '--gap': '22px' } });
  const results = h('div', { class: 'stack', style: { '--gap': '12px' } });

  const drawResults = () => {
    clear(results);
    if (Object.keys(answers).length < 5 || (answers.assets || []).length === 0) {
      return results.append(h('p', { class: 'muted' }, 'Answer all five to see your ranked shortlist.'));
    }
    const ranked = matchFormats(answers, 6);
    results.append(h('h2', null, 'Your best-fit formats'));
    ranked.forEach((r, i) =>
      results.append(
        h('div', { class: 'rank' },
          h('div', { class: 'score' }, String(r.score)),
          h('div', null,
            h('div', { class: 'row' }, h('span', { class: 'tag' }, KIND_LABEL[r.format.kind]), h('b', null, displayName(r.format))),
            h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, r.reasons.join(' · ') || r.format.summary),
          ),
          h('div', { class: 'row' },
            h('a', { class: 'btn secondary sm', href: `#/formats/${r.format.id}` }, 'View'),
            h('button', { class: 'btn sm', type: 'button', onclick: (e) => { toggleSaved(r.format.id); e.target.textContent = savedIds().includes(r.format.id) ? 'Saved ✓' : 'Save'; } }, savedIds().includes(r.format.id) ? 'Saved ✓' : 'Save'),
          ),
        ),
      ),
    );
    results.append(h('div', { class: 'row end' }, h('a', { class: 'btn lg', href: '#/lab' }, 'Take one to the Idea Lab →')));
  };

  MATCHER.forEach((q, qi) => {
    const group = h('div', { class: 'choices', role: q.multi ? 'group' : 'radiogroup', 'aria-labelledby': `mq-${q.id}` });
    q.options.forEach((o) => {
      const checked = q.multi ? (answers[q.id] || []).includes(o.v) : String(answers[q.id]) === String(o.v);
      const input = h('input', { type: q.multi ? 'checkbox' : 'radio', name: q.id, value: o.v, checked });
      input.addEventListener('change', () => {
        if (q.multi) {
          const cur = new Set(answers[q.id] || []);
          input.checked ? cur.add(o.v) : cur.delete(o.v);
          answers[q.id] = [...cur];
        } else answers[q.id] = typeof o.v === 'number' ? o.v : o.v;
        store.set('formats.matcher', { ...answers });
        drawResults();
      });
      group.append(h('label', { class: 'choice' }, input, h('span', null, o.label)));
    });
    host.append(h('div', { class: 'card' }, h('span', { class: 'eyebrow' }, `Question ${qi + 1} of ${MATCHER.length}`), h('h3', { id: `mq-${q.id}`, style: { marginBottom: '12px' } }, q.prompt), group));
  });
  drawResults();

  return h('div', { class: 'stack', style: { '--gap': '22px' } }, crumbs({ label: 'Formats', href: '#/formats' }, { label: 'Format matcher' }), pageHead({ eyebrow: 'Find your fit', title: 'Format matcher', lede: 'Your best format is the one you will actually make. Tell us how you like to work.' }), host, results);
}

function detail(f) {
  const arch = store.get('profile.archetype', 'college');
  const archLabel = archetypeById(arch).label;
  const saved = savedIds().includes(f.id);
  const saveBtn = h('button', { class: 'btn secondary', type: 'button' }, saved ? 'Shortlisted ✓' : 'Add to shortlist');
  saveBtn.addEventListener('click', () => { toggleSaved(f.id); saveBtn.textContent = savedIds().includes(f.id) ? 'Shortlisted ✓' : 'Add to shortlist'; });
  const vals = { age: '', sport: store.get('profile.sport', '') };
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Formats', href: '#/formats' }, { label: displayName(f) }),
    pageHead({ eyebrow: `${KIND_LABEL[f.kind]} · Fits your ${f.fit.map((x) => x.toUpperCase()).join(' + ')}`, title: displayName(f), lede: f.summary }),
    h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, 'How personal'), vulnerability(f.vulnerability), h('span', { class: 'tiny muted' }, '·'), h('span', { class: 'tiny muted' }, `${['', 'Quick', 'Medium effort', 'More effort'][f.effort]}`)),
    h('div', { class: 'card pop' }, h('span', { class: 'eyebrow' }, `Hook ideas · ${archLabel} example`), f.ex?.[arch] && h('div', { class: 'hookline' }, f.ex[arch]), h('div', { class: 'stack', style: { marginTop: '14px', '--gap': '8px' } }, h('div', { class: 'tiny muted' }, 'Patterns (fill the brackets with your own details)'), f.hooks.map((t) => h('div', { class: 'hookline', style: { fontWeight: 500 } }, fillHook(t, vals))))),
    h('div', { class: 'two' },
      h('div', { class: 'card do' }, h('h4', null, 'Do this'), h('ul', null, f.dos.map((d) => h('li', null, d)))),
      h('div', { class: 'card dont' }, h('h4', null, 'Do not do this'), h('ul', null, f.donts.map((d) => h('li', null, d)))),
    ),
    h('div', { class: 'card' }, h('span', { class: 'eyebrow' }, 'Caption'), h('p', { style: { margin: 0 } }, f.caption)),
    h('div', { class: 'row' }, saveBtn, h('a', { class: 'btn lg', href: `#/lab?f=${f.id}` }, 'Make one in the Idea Lab →')),
  );
}
