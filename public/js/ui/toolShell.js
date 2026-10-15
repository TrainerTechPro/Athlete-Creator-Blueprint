import { h } from '../lib/dom.js';
import { TOOL_META } from '../content/toolmeta.js';
import { crumbs, pageHead } from './components.js';

// Consistent frame for every Week 2 to 4 tool: breadcrumb, title, lede, body, back link.
export function toolShell(id, body, { lede, right } = {}) {
  const t = TOOL_META[id];
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: `Week ${t.week}`, href: `#/week/${t.week}` }, { label: t.title }),
    pageHead({ eyebrow: `Week ${t.week} tool`, title: t.title, lede: lede || t.blurb, right }),
    body,
    h('div', { class: 'row between' }, h('a', { class: 'btn secondary', href: `#/week/${t.week}` }, `← Back to Week ${t.week}`)),
  );
}

export const sourceLink = (s) => h('a', { class: 'link tiny', href: s.href, target: '_blank', rel: 'noopener noreferrer' }, `Source: ${s.label}`);
