// Week 3: read your numbers against your own baseline.
import { h } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { diagnose, pct, WHERE_TO_LOOK } from '../../content/analytics.js';
import { FORMAT_BY_ID, displayName } from '../../content/formats.js';
import { MISSION_BY_ID } from '../../content/missions.js';
import { toolShell } from '../../ui/toolShell.js';

const fmtNum = (n) => (n === null || n === undefined ? '–' : Math.round(n).toLocaleString());
const name = {
  format: (k) => (FORMAT_BY_ID[k] ? displayName(FORMAT_BY_ID[k]) : k),
  mission: (k) => MISSION_BY_ID[k]?.name || k,
  pillar: (k) => k[0].toUpperCase() + k.slice(1),
};

export function render() {
  const posts = store.get('posts', []);
  const d = diagnose(posts);

  const group = (title, rows, label) =>
    rows?.length
      ? h('div', { class: 'card' }, h('h4', null, title), rows.map((r) => h('div', { class: 'row between', style: { padding: '8px 0', borderBottom: '1.5px solid var(--line)' } }, h('b', null, label(r.key)), h('span', { class: 'tiny muted' }, `${r.n} posts · median ${fmtNum(r.median)} views`))))
      : null;

  const body = !d.n
    ? h('div', { class: 'stack', style: { '--gap': '16px' } },
        h('div', { class: 'empty' }, h('h3', null, 'No numbers yet'), h('p', null, 'Open a post in your Post Log and add its views, saves, shares and follows. Three posts is enough to start.'), h('a', { class: 'btn', href: '#/posts' }, 'Open Post Log')),
      )
    : h('div', { class: 'stack', style: { '--gap': '18px' } },
        h('div', { class: 'mini' },
          h('div', { class: 'stat' }, h('div', { class: 'n' }, String(d.n)), h('div', { class: 'l' }, 'Posts with views')),
          h('div', { class: 'stat' }, h('div', { class: 'n' }, fmtNum(d.medianViews)), h('div', { class: 'l' }, 'Median views')),
          h('div', { class: 'stat' }, h('div', { class: 'n' }, d.best ? fmtNum(d.best.rates.views) : '–'), h('div', { class: 'l' }, 'Best post')),
          h('div', { class: 'stat' }, h('div', { class: 'n' }, String(d.perPost.filter((p) => p.flags.some((f) => f.tone === 'ok')).length)), h('div', { class: 'l' }, 'Wins to repeat')),
        ),
        d.insights.length > 0 && h('div', { class: 'callout' }, h('b', null, 'Insight'), d.insights.map((i) => h('p', { style: { margin: '4px 0 0' } }, i.text))),
        h('div', { class: 'stack', style: { '--gap': '12px' } }, [...d.perPost].sort((a, b) => b.rates.views - a.rates.views).map(({ post, rates, ratio, flags }) =>
          h('article', { class: 'post', style: { gridTemplateColumns: '1fr' } },
            h('div', null,
              h('div', { class: 'row between' }, h('div', { class: 'hook' }, post.hook || 'Untitled post'), h('a', { class: 'btn secondary sm', href: `#/posts?edit=${post.id}` }, 'Edit numbers')),
              h('div', { class: 'meta' }, post.formatId && h('span', { class: 'tag line' }, name.format(post.formatId)), post.mission && h('span', { class: 'tag line' }, name.mission(post.mission)), d.enough && h('span', { class: 'tag' }, `${ratio.toFixed(1)}× your median`)),
              h('div', { class: 'row', style: { marginTop: '10px', gap: '18px' } },
                [['Views', fmtNum(rates.views)], ['Watched', rates.avgWatch === null ? '–' : `${rates.avgWatch}%`], ['Saves', pct(rates.saveRate)], ['Shares', pct(rates.shareRate)], ['Follows', pct(rates.followRate, 2)], ['Clicks', pct(rates.clickRate, 2)]].map(([l, v]) => h('div', null, h('div', { style: { fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 } }, v), h('div', { class: 'tiny muted mono' }, l))),
              ),
              flags.length > 0 && h('div', { class: 'stack', style: { marginTop: '12px', '--gap': '6px' } }, flags.map((f) => h('div', { class: 'row top' }, h('span', { class: `tag ${f.tone === 'ok' ? 'ok' : 'warn'}` }, f.label), h('span', { class: 'tiny grow', style: { flex: 1 } }, f.text)))),
            ),
          ),
        )),
        h('div', { class: 'grid c3' }, group('By format', d.byFormat, name.format), group('By mission', d.byMission, name.mission), group('By pillar', d.byPillar, name.pillar)),
        h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'Your next test'), h('p', { style: { margin: 0 } }, 'Pick one flagged post. Change one thing about the next version (the hook, the format or the call to action) and compare it to your median again.')),
      );

  return toolShell('analytics', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'callout' }, h('b', null, 'Compare to yourself'), 'Benchmarks differ by sport, platform and audience size, so every flag here is relative to your own median. These are prompts to investigate, not verdicts. With fewer than 3 posts there is nothing to compare yet.'),
    body,
    h('div', { class: 'card soft' }, h('h3', null, 'How to read analytics without spiralling'), h('div', { class: 'grid c2', style: { marginTop: '10px' } }, WHERE_TO_LOOK.map((w) => h('div', { class: 'leaf' }, h('b', null, w.title), h('p', { class: 'muted tiny', style: { margin: '4px 0 0' } }, w.body))))),
  ), { lede: 'Numbers are feedback, not a grade. Read them against your own baseline and pick one thing to test.' });
}
