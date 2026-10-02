// Week 2: break down posts from creators ahead of you and find the pattern.
import { h, clear } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { FORMATS, FORMAT_BY_ID, displayName } from '../../content/formats.js';
import { HOOK_TYPES } from '../../content/hooks.js';
import { toolShell } from '../../ui/toolShell.js';
import { collection } from '../../ui/collection.js';
import { bar } from '../../ui/components.js';

const LENGTHS = ['Under 15s', '15 to 30s', '30 to 60s', 'Over 60s', 'Carousel / photos'];
const HOOK_NAME = Object.fromEntries(HOOK_TYPES.map((t) => [t.id, t.name]));

const FIELDS = [
  { id: 'creator', label: 'Creator (handle)', type: 'text', placeholder: '@someone a few steps ahead of you' },
  { id: 'link', label: 'Link (optional)', type: 'text', placeholder: 'https://…' },
  { id: 'formatId', label: 'Format', type: 'select', options: [...FORMATS.map((f) => ({ value: f.id, label: displayName(f) })), { value: 'other', label: 'Something else' }] },
  { id: 'hookType', label: 'Hook type', type: 'select', options: HOOK_TYPES.map((t) => ({ value: t.id, label: t.name })) },
  { id: 'hook', label: 'The hook (exact words)', type: 'text', placeholder: 'What they say or show in the first 2 seconds' },
  { id: 'length', label: 'Length', type: 'select', options: LENGTHS },
  { id: 'why', label: 'Why does it work? (2 sentences)', type: 'longtext', rows: 3, placeholder: 'It names a fear I have. The payoff arrives at 8 seconds. The text is easy to read.' },
  { id: 'mine', label: 'My version, using my Blueprint', type: 'longtext', rows: 3, placeholder: 'Same structure, but about my own story of getting cut at 12.' },
];

export function render() {
  const summary = h('div');
  const drawSummary = () => {
    clear(summary);
    const items = store.get('swipe', []);
    const n = items.length;
    summary.append(
      h('div', { class: 'card' },
        h('div', { class: 'row between' }, h('b', null, 'Your goal: 7 breakdowns'), h('span', { class: 'tag volt' }, `${Math.min(n, 7)}/7`)),
        h('div', { style: { marginTop: '10px' } }, bar(Math.min(100, Math.round((n / 7) * 100)))),
      ),
    );
    if (n >= 3) {
      const count = (key, label) => {
        const m = {};
        items.forEach((i) => i[key] && (m[i[key]] = (m[i[key]] || 0) + 1));
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${label(k)} (${v})`);
      };
      const formats = count('formatId', (k) => (FORMAT_BY_ID[k] ? displayName(FORMAT_BY_ID[k]) : 'Other'));
      const hooks = count('hookType', (k) => HOOK_NAME[k] || k);
      const lens = count('length', (k) => k);
      summary.append(
        h('div', { class: 'card volt pop' }, h('span', { class: 'eyebrow' }, 'The pattern so far'),
          h('p', { style: { margin: '0 0 6px' } }, h('b', null, 'Formats that keep showing up: '), formats.join(', ') || '–'),
          h('p', { style: { margin: '0 0 6px' } }, h('b', null, 'Hook types: '), hooks.join(', ') || '–'),
          h('p', { style: { margin: 0 } }, h('b', null, 'Typical length: '), lens.join(', ') || '–'),
          h('p', { class: 'tiny', style: { margin: '10px 0 0' } }, 'Make your next post in the most common format with the most common hook type, using your own story.'),
        ),
      );
    }
  };
  drawSummary();

  const list = collection({
    path: 'swipe',
    fields: FIELDS,
    blank: () => ({ creator: '', link: '', formatId: '', hookType: '', hook: '', length: '', why: '', mine: '' }),
    validate: (d) => ((d.hook || '').trim() ? null : 'Add the hook so you can study it.'),
    addLabel: '+ Break down a post',
    formTitle: 'Break down a post',
    emptyText: 'Find creators a few steps ahead of you and add your first breakdown. Seven is the goal.',
    onChange: drawSummary,
    card: (i) => h('div', null,
      h('div', { class: 'row' }, i.creator && h('b', null, i.creator), i.formatId && h('span', { class: 'tag' }, FORMAT_BY_ID[i.formatId] ? displayName(FORMAT_BY_ID[i.formatId]) : 'Other'), i.hookType && h('span', { class: 'tag line' }, HOOK_NAME[i.hookType]), i.length && h('span', { class: 'tag line' }, i.length)),
      h('p', { style: { margin: '8px 0 4px', fontWeight: 700 } }, `“${i.hook}”`),
      i.why && h('p', { class: 'muted', style: { margin: '0 0 4px' } }, h('b', null, 'Why it works: '), i.why),
      i.mine && h('p', { style: { margin: 0 } }, h('b', null, 'My version: '), i.mine),
    ),
  });

  return toolShell('swipe', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'callout' }, h('b', null, 'Borrow the structure, not the content'), 'Copying a post teaches you nothing and feels hollow. Breaking it down teaches you why it works, so you can build your own version with your own story.'),
    h('div', { class: 'card soft' }, h('h3', null, 'Five questions for every post'), h('ol', { class: 'steps' }, ['What did I see or hear in the first 2 seconds?', 'What was the format, and how long was it?', 'What feeling did it create?', 'Where did the payoff arrive?', 'What from my own life could fill this same structure?'].map((q) => h('li', null, q)))),
    summary, list,
  ));
}
