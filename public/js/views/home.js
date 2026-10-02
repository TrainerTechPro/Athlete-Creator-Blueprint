import { h } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { CONFIG } from '../config.js';
import { progress, nextAction, weeklyGoals } from '../progress.js';
import { LOOP } from '../content/start.js';
import { ROADMAP } from '../content/plan.js';
import { bar, ring, jersey, arrow } from '../ui/components.js';

export function render() {
  const profile = store.get('profile', {});
  const p = progress();
  const next = nextAction();
  const goals = weeklyGoals();
  const goalDone = goals.filter((g) => g.done).length;

  const cards = [
    { n: '0', t: 'Launch Pad', d: 'Set up accounts, rhythm and mindset. Capture your starting point.', href: '#/launch', pct: p.launch.pct },
    { n: '1', t: 'Your Blueprint', d: 'What you say, who you say it to, and why it matters to you.', href: '#/blueprint', pct: p.blueprint.pct },
    { n: '2', t: 'Formats', d: 'Package your message in formats built to perform. Find the ones that fit you.', href: '#/formats', pct: p.formats.pct },
    { n: '3', t: 'Weekly Challenge', d: 'Publish at least one guided post and put it all into practice.', href: '#/challenge', pct: p.challenge.pct },
    { n: '4', t: 'Week 1 Plan', d: 'Seven days of small tasks, check-ins and a Sunday review.', href: '#/plan', pct: p.plan.pct },
  ];

  return h(
    'div',
    { class: 'stack', style: { '--gap': '26px' } },
    h(
      'section',
      { class: 'card pop hero' },
      h('div', { class: 'stripe', 'aria-hidden': 'true' }),
      h('span', { class: 'eyebrow' }, `${CONFIG.brand} · Week 1`),
      h('h1', { id: 'page-title', tabindex: '-1' }, `${greeting()}, ${profile.name || 'athlete'}.`),
      h('p', { class: 'lede' }, p.overall < 5 ? CONFIG.tagline : `You are ${p.overall}% through the Blueprint journey. Keep stacking reps.`),
    ),

    h(
      'section',
      { class: 'card volt pop next', 'aria-label': 'Next best action' },
      jersey('▶'),
      h('div', null, h('span', { class: 'eyebrow' }, 'Your next move'), h('h2', null, next.title), h('p', { class: 'muted', style: { margin: '6px 0 0' } }, next.desc)),
      h('a', { class: 'btn secondary lg', href: next.route }, next.cta, arrow()),
    ),

    h(
      'section',
      null,
      h('div', { class: 'row between', style: { marginBottom: '12px' } }, h('h2', null, 'The journey')),
      h(
        'div',
        { class: 'journey' },
        cards.map((c) =>
          h('a', { class: 'j-card', href: c.href }, jersey(c.n), h('div', null, h('h3', null, c.t), h('p', null, c.d), h('div', { style: { marginTop: '10px', maxWidth: '260px' } }, bar(c.pct))), ring(c.pct)),
        ),
      ),
    ),

    h(
      'section',
      { class: 'grid c2' },
      h(
        'div',
        { class: 'card' },
        h('div', { class: 'row between' }, h('h3', null, 'This week\'s goals'), h('span', { class: 'tag volt' }, `${goalDone}/${goals.length}`)),
        h('div', { class: 'stack', style: { '--gap': '8px', marginTop: '12px' } },
          goals.map((g) => h('div', { class: `goal${g.done ? ' done' : ''}`, style: { cursor: 'default' } }, h('span', { 'aria-hidden': 'true', style: { fontSize: '1.2rem' } }, g.done ? '✅' : '⬜'), h('div', null, h('b', null, g.title), h('span', null, g.detail || g.body)))),
        ),
        h('div', { style: { marginTop: '14px' } }, h('a', { class: 'btn secondary sm', href: '#/plan' }, 'Open the plan')),
      ),
      h(
        'div',
        { class: 'card' },
        h('h3', null, 'Posting this week'),
        h('div', { class: 'row', style: { margin: '12px 0' } },
          h('div', { class: 'stat', style: { flex: 1 } }, h('div', { class: 'n' }, `${p.weekPosts}/${p.postGoal}`), h('div', { class: 'l' }, 'Posts logged')),
          h('div', { class: 'stat', style: { flex: 1 } }, h('div', { class: 'n' }, `${store.get('blueprint.stories', []).length}`), h('div', { class: 'l' }, 'Stories banked')),
        ),
        bar(p.posts.pct),
        h('p', { class: 'muted tiny', style: { marginTop: '10px' } }, 'Every post is a rep. Log it, notice what happened, take one lesson into the next.'),
        h('a', { class: 'btn secondary sm', href: '#/posts' }, 'Open post log'),
      ),
    ),

    h(
      'section',
      { class: 'card ink' },
      h('span', { class: 'eyebrow' }, 'The loop that wins'),
      h('h2', null, 'Learn. Post. Feedback. Apply. Repeat.'),
      h('p', { class: 'muted' }, 'The creators who grow are not the ones who consume the most. They run this loop more times.'),
      h('div', { class: 'loop', style: { marginTop: '12px' } }, LOOP.map((l, i) => h('div', { style: { color: 'var(--ink)' } }, h('i', null, `0${i + 1}`), h('b', null, l.label), h('span', null, l.body)))),
    ),

    h(
      'section',
      { class: 'card soft' },
      h('h3', null, 'The 5-week road'),
      h(
        'div',
        { class: 'roadmap' },
        ROADMAP.map((r) =>
          h(
            'div',
            { class: `rm${r.status === 'next' ? ' next-wk' : ''}` },
            h('div', { class: 'wk' }, h('small', null, 'WEEK'), r.week),
            h('div', null, h('b', null, r.title), r.status === 'next' && h('span', { class: 'tag line', style: { marginLeft: '8px' } }, 'Coming next'), h('p', { class: 'muted', style: { margin: '4px 0 0' } }, r.body), r.route && h('a', { href: r.route, class: 'link' }, 'Open')),
          ),
        ),
      ),
    ),
  );
}

function greeting() {
  const hr = new Date().getHours();
  return hr < 5 ? 'Late night' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
}
