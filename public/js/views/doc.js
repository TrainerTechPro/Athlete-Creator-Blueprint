// "My Blueprint": the finished one-page document, as a visual canvas plus exports (PDF via print, Markdown, JSON).
import { h, clear, copyText, download, toast } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { CONFIG } from '../config.js';
import { PARTS, QUESTION_BY_ID, assembleStatement } from '../content/blueprint.js';
import { START_QUESTIONS } from '../content/start.js';
import { FORMAT_BY_ID, displayName } from '../content/formats.js';
import { archetypeById } from '../content/archetypes.js';
import { health } from '../blueprintHealth.js';
import { askAI, aiReady, AIError, blueprintContext } from '../ai.js';
import { crumbs, pageHead } from '../ui/components.js';

const PILLAR_LABEL = { skill: 'Skill', perspective: 'Perspective', lifestyle: 'Lifestyle', passion: 'Passion' };
const val = (s) => (s || '').trim();

export function collect() {
  const profile = store.get('profile', {});
  const bp = store.get('blueprint', {});
  const a = bp.answers || {};
  return {
    name: profile.name,
    sport: profile.sport,
    archetype: archetypeById(profile.archetype).label,
    statement: assembleStatement(bp.statement),
    tagline: val(bp.statement?.tagline),
    say: [
      ['Beliefs I keep coming back to', a['say-beliefs']],
      ['Where I disagree with the standard advice', a['say-contrarian']],
      ['What people come to me for', a['say-help']],
    ],
    pillars: Object.keys(PILLAR_LABEL).map((k) => [PILLAR_LABEL[k], k, bp.pillars?.[k]]),
    reach: [
      ['Who I want to reach', a['who-who']],
      ['What they are struggling with', a['who-pain']],
      ['What they deeply want', a['who-want']],
      ['Who they are trying to become', a['who-become']],
    ],
    why: [
      ['Origin', a['why-origin']],
      ['A belief I changed', a['why-changed']],
      ['What I tried and learned', a['why-tried']],
    ],
    stories: (bp.stories || []).filter((s) => val(s.problem) || val(s.pursuit) || val(s.payoff)),
    formats: store.get('formats.saved', []).map((id) => FORMAT_BY_ID[id]).filter(Boolean),
    ideas: store.get('formats.ideas', []),
    bio: val(store.get('bio.final', '')),
    start: START_QUESTIONS.map((q) => [q.prompt, store.get('start.answers', {})[q.id]]).filter(([, v]) => val(v)),
  };
}

export function toMarkdown(d = collect()) {
  const L = [];
  L.push(`# ${d.name ? d.name + '\'s ' : ''}Athlete Creator Blueprint`);
  L.push(`${d.archetype}${d.sport ? ' · ' + d.sport : ''}`, '');
  if (d.statement) L.push(`> ${d.statement}`, '');
  if (d.tagline) L.push(`**Tagline:** ${d.tagline}`, '');
  if (d.bio) L.push(`**Bio:** ${d.bio}`, '');
  const sec = (title, rows) => {
    L.push(`## ${title}`, '');
    rows.forEach(([q, v]) => { L.push(`### ${q}`, val(v) || '_Not answered yet_', ''); });
  };
  sec('01 What I say', d.say);
  L.push('### Content pillars');
  d.pillars.forEach(([label, , v]) => L.push(`- **${label}:** ${val(v) || '_empty_'}`));
  L.push('');
  sec('02 Who I say it to', d.reach);
  sec('03 Why it matters to me', d.why);
  if (d.stories.length) {
    L.push('## Story bank', '');
    d.stories.forEach((s) => L.push(`### ${s.title || 'Untitled'} (${s.tag || 'Other'})`, `- **Struggle:** ${val(s.problem)}`, `- **Move:** ${val(s.pursuit)}`, `- **Win:** ${val(s.payoff)}`, ''));
  }
  if (d.formats.length) { L.push('## Format shortlist', ''); d.formats.forEach((f) => L.push(`- ${displayName(f)} (${f.kind})`)); L.push(''); }
  if (d.ideas.length) { L.push('## Saved hooks', ''); d.ideas.forEach((i) => L.push(`- ${i.hook}`)); L.push(''); }
  return L.join('\n');
}

export function render() {
  const d = collect();
  const hasAny = d.statement || d.say.some(([, v]) => val(v)) || d.reach.some(([, v]) => val(v));

  const aiHost = h('div');
  const aiBtn = h('button', { class: `btn ai${aiReady() ? '' : ' hide'}`, type: 'button' }, '✦ AI review');
  aiBtn.addEventListener('click', async () => {
    aiBtn.disabled = true; aiBtn.textContent = 'Reviewing…';
    try {
      const r = await askAI('review', { archetype: store.get('profile.archetype'), sport: store.get('profile.sport'), context: blueprintContext() });
      clear(aiHost);
      const list = (t, arr) => arr?.length ? h('div', null, h('h4', null, t), h('ul', null, arr.map((x) => h('li', null, x)))) : null;
      aiHost.append(h('div', { class: 'card ai-out stack no-print', style: { '--gap': '10px' } }, h('span', { class: 'tag' }, 'AI review'), list('Strengths', r.strengths), list('Gaps', r.gaps), list('How the parts connect', r.connections), list('Next steps', r.next_steps)));
    } catch (e) { toast(e instanceof AIError ? e.message : 'The AI coach is unavailable.', 'warn'); }
    finally { aiBtn.disabled = false; aiBtn.textContent = '✦ AI review'; }
  });

  const check = health({ answers: store.get('blueprint.answers', {}), pillars: store.get('blueprint.pillars', {}), stories: store.get('blueprint.stories', []), statement: store.get('blueprint.statement', {}) });
  const warns = [...check.dos, ...check.donts].filter((x) => x.status === 'warn');

  const leaf = (label, text, cls = '') => h('div', { class: `leaf ${val(text) ? '' : 'empty'} ${cls}` }, h('small', null, label), h('p', null, val(text) || 'Not answered yet'));

  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    h('div', { class: 'no-print' }, crumbs({ label: 'Home', href: '#/' }, { label: 'My Blueprint' })),
    h('div', { class: 'no-print' }, pageHead({
      eyebrow: 'Your first draft',
      title: 'My Blueprint',
      lede: 'This is your first draft, and it should evolve as you post, test and learn. Print it, save it as a PDF, or copy it to share with your coach.',
      right: h('div', { class: 'row' }, aiBtn, h('button', { class: 'btn secondary', type: 'button', onclick: () => window.print() }, 'Print / Save PDF'), h('button', { class: 'btn secondary', type: 'button', onclick: () => copyText(toMarkdown(d)) }, 'Copy as text'), h('button', { class: 'btn secondary', type: 'button', onclick: () => download('my-blueprint.md', toMarkdown(d), 'text/markdown') }, 'Download .md')),
    })),
    aiHost,
    !hasAny && h('div', { class: 'empty no-print' }, h('h3', null, 'Nothing here yet'), h('p', null, 'Answer a few Blueprint questions and they appear here automatically.'), h('a', { class: 'btn', href: '#/blueprint/say' }, 'Start the Blueprint')),
    warns.length > 0 && hasAny && h('div', { class: 'card warnbox no-print' }, h('b', null, `${warns.length} thing${warns.length > 1 ? 's' : ''} worth tightening: `), warns.map((w, i) => [i ? ' · ' : '', h('a', { href: w.fix, class: 'link' }, w.label)])),

    h('article', { class: 'doc' },
      h('span', { class: 'eyebrow' }, `${CONFIG.brand} · ${d.archetype}${d.sport ? ' · ' + d.sport : ''}`),
      h('h1', null, `${d.name ? d.name + '’s' : 'My'} Blueprint`),
      h('div', { class: 'canvas', style: { marginTop: '20px' } },
        h('div', { class: 'root-node' }, h('span', { class: 'eyebrow', style: { color: 'var(--volt-ink)' } }, 'My message'), h('p', { class: 'statement-out', style: { margin: 0 } }, d.statement || 'Write your statement in the Blueprint.'), d.tagline && h('p', { style: { margin: '8px 0 0', fontWeight: 700 } }, d.tagline)),
        h('div', { class: 'branches' },
          h('div', { class: 'branch' }, h('header', null, h('b', null, '01 Say')), h('div', { class: 'body' }, d.say.map(([l, t]) => leaf(l, t)), h('div', { class: 'grid', style: { gap: '8px' } }, d.pillars.map(([l, k, t]) => leaf(l + ' pillar', t, k))))),
          h('div', { class: 'branch' }, h('header', null, h('b', null, '02 Reach')), h('div', { class: 'body' }, d.reach.map(([l, t]) => leaf(l, t)))),
          h('div', { class: 'branch' }, h('header', null, h('b', null, '03 Why')), h('div', { class: 'body' }, d.stories.length ? d.stories.map((s) => h('div', { class: 'leaf' }, h('small', null, `${s.tag || 'Story'} · ${s.title || 'Untitled'}`), h('p', null, h('b', null, 'Struggle: '), val(s.problem) || '…'), h('p', null, h('b', null, 'Move: '), val(s.pursuit) || '…'), h('p', null, h('b', null, 'Win: '), val(s.payoff) || '…'))) : d.why.map(([l, t]) => leaf(l, t))))),
      ),
      d.formats.length > 0 && [h('h2', null, 'Format shortlist'), h('div', { class: 'chips' }, d.formats.map((f) => h('span', { class: 'chip static' }, displayName(f))))],
      d.ideas.length > 0 && [h('h2', null, 'Saved hooks'), h('ul', null, d.ideas.slice(0, 12).map((i) => h('li', null, i.hook)))],
      d.bio && [h('h2', null, 'Bio'), h('p', { class: 'answer-text' }, d.bio)],
      d.start.length > 0 && [h('h2', null, 'Starting point'), d.start.map(([q, a]) => [h('h3', null, q), h('p', { class: 'answer-text' }, val(a))])],
    ),
  );
}
