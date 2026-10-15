// Week 2: content calendar and batch workflow. Idea -> Scripted -> Filmed -> Edited -> Posted.
import { h, clear, toast } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { FORMATS, FORMAT_BY_ID, displayName } from '../../content/formats.js';
import { MISSIONS, MISSION_BY_ID } from '../../content/missions.js';
import { WORKFLOW_STEPS, BATCH_TIPS } from '../../content/editing.js';
import { toolShell } from '../../ui/toolShell.js';
import { collection } from '../../ui/collection.js';

const DAYS = ['Unscheduled', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STEP_INDEX = Object.fromEntries(WORKFLOW_STEPS.map((s, i) => [s.id, i]));

export function render(route) {
  const pillars = Object.entries(store.get('blueprint.pillars', {})).filter(([, v]) => (v || '').trim());
  const fields = [
    { id: 'hook', label: 'Hook or working title', type: 'text', placeholder: '3 things I wish I knew before my first college game' },
    { id: 'formatId', label: 'Format', type: 'select', options: FORMATS.map((f) => ({ value: f.id, label: displayName(f) })) },
    { id: 'pillar', label: 'Pillar', type: 'select', options: pillars.map(([k]) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) })) },
    { id: 'mission', label: 'Mission', type: 'choice', options: MISSIONS.map((m) => ({ value: m.id, label: m.name })) },
    { id: 'day', label: 'Day', type: 'select', options: DAYS },
    { id: 'status', label: 'Status', type: 'choice', options: WORKFLOW_STEPS.map((s) => ({ value: s.id, label: s.label })) },
    { id: 'script', label: 'Script beats (Struggle, Move, Win)', type: 'longtext', rows: 5, placeholder: 'Hook (0 to 3s): …\nSetup: …\nPayoff: …' },
  ];

  const tiles = h('div', { class: 'mini' });
  const drawTiles = () => {
    clear(tiles);
    const items = store.get('calendar', []);
    WORKFLOW_STEPS.slice(0, 4).forEach((s) => tiles.append(h('div', { class: 'stat' }, h('div', { class: 'n' }, String(items.filter((i) => i.status === s.id).length)), h('div', { class: 'l' }, s.label))));
  };
  drawTiles();

  const list = collection({
    path: 'calendar',
    fields,
    initial: route.query.hook ? { hook: route.query.hook, status: 'idea' } : null,
    blank: () => ({ hook: '', formatId: '', pillar: '', mission: '', day: 'Unscheduled', status: 'idea', script: '' }),
    validate: (d) => ((d.hook || '').trim() ? null : 'Add a hook or working title.'),
    addLabel: '+ Plan a post',
    formTitle: 'Plan a post',
    emptyText: 'Plan five posts for this week. Start with the hooks from your Hook Lab.',
    onChange: drawTiles,
    card: (i) => h('div', null,
      h('div', { class: 'row' }, h('span', { class: `tag ${i.status === 'posted' ? 'ok' : 'volt'}` }, WORKFLOW_STEPS.find((s) => s.id === i.status)?.label || 'Idea'), i.day && i.day !== 'Unscheduled' && h('span', { class: 'tag line' }, i.day), i.formatId && FORMAT_BY_ID[i.formatId] && h('span', { class: 'tag line' }, displayName(FORMAT_BY_ID[i.formatId])), i.mission && h('span', { class: 'tag line' }, MISSION_BY_ID[i.mission]?.name), i.pillar && h('span', { class: 'tag line' }, i.pillar)),
      h('p', { style: { margin: '8px 0 0', fontWeight: 700 } }, i.hook),
      i.script && h('p', { class: 'muted', style: { margin: '6px 0 0', whiteSpace: 'pre-wrap' } }, i.script),
    ),
    extraActions: (item, redraw) => {
      const next = WORKFLOW_STEPS[(STEP_INDEX[item.status] ?? 0) + 1];
      if (!next) return h('a', { class: 'btn sm', href: `#/posts?hook=${encodeURIComponent(item.hook)}&f=${item.formatId || ''}` }, 'Log in Post Log');
      return h('button', { class: 'btn sm', type: 'button', onclick: () => {
        store.update('calendar', (l) => l.map((x) => (x.id === item.id ? { ...x, status: next.id } : x)), []);
        drawTiles();
        redraw();
        toast(`Moved to ${next.label}`);
      } }, `Mark ${next.label.toLowerCase()} →`);
    },
  });

  return toolShell('calendar', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'card soft' }, h('h3', null, 'The workflow'), h('div', { class: 'row', style: { marginTop: '10px' } }, WORKFLOW_STEPS.map((s, i) => h('div', { class: 'leaf', style: { flex: '1 1 140px' } }, h('small', null, `Step ${i + 1}`), h('b', null, s.label), h('p', { class: 'muted tiny', style: { margin: 0 } }, s.hint))))),
    tiles, list,
    h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'Batch like a pro'), h('ul', { style: { margin: 0, paddingLeft: '18px' } }, BATCH_TIPS.map((t) => h('li', null, t)))),
  ));
}
