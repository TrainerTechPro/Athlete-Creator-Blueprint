// Week 3: an honest readiness check, the main paths, and the rules athletes need to know.
import { h, clear } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { READINESS, readinessTier, MONETIZE_PATHS, DISCLOSURE_RULES } from '../../content/sales.js';
import { offerChecks } from '../../content/sales.js';
import { postsThisWeek } from '../../progress.js';
import { archetypeById } from '../../content/archetypes.js';
import { YOUTH_NOTE } from '../../content/start.js';
import { toolShell, sourceLink } from '../../ui/toolShell.js';
import { bar } from '../../ui/components.js';

const SCALE = [
  { v: 0, label: 'Not yet' },
  { v: 1, label: 'Partly' },
  { v: 2, label: 'Yes' },
];

// What the app can see, offered as a hint. The person's own answer always wins.
function hint(q) {
  if (q.auto === 'consistency') return store.get('posts', []).filter((p) => p.date && Date.now() - new Date(p.date).getTime() < 14 * 86400000).length >= 6 ? 'Your post log shows 6+ posts in 14 days.' : null;
  if (q.auto === 'statement') return store.get('blueprint.statement.who') && store.get('blueprint.statement.outcome') ? 'You have written a message statement.' : null;
  if (q.auto === 'offer') return offerChecks(store.get('offer', {})).filter((c) => c.ok).length >= 4 ? 'Your Offer Sketch looks solid.' : null;
  return null;
}

export function render() {
  const arch = archetypeById(store.get('profile.archetype'));
  const quiz = h('div', { class: 'stack', style: { '--gap': '12px' } });
  const result = h('div');

  const drawResult = () => {
    clear(result);
    const answers = store.get('readiness.answers', {});
    const answered = READINESS.filter((q) => answers[q.id] !== undefined);
    const score = answered.reduce((s, q) => s + answers[q.id], 0);
    const max = READINESS.length * 2;
    if (answered.length < READINESS.length) return result.append(h('p', { class: 'muted' }, `Answer all ${READINESS.length} to see your result (${answered.length} done).`));
    const tier = readinessTier(score, max);
    const gaps = READINESS.filter((q) => answers[q.id] < 2);
    result.append(
      h('div', { class: `card pop ${tier.id === 'go' ? 'okbox' : tier.id === 'close' ? 'volt' : ''}` },
        h('span', { class: 'eyebrow' }, 'Your result'), h('h2', null, tier.label), h('p', null, tier.text),
        h('div', { style: { margin: '10px 0' } }, bar(Math.round((score / max) * 100))),
        gaps.length > 0 && h('div', null, h('b', null, 'Gaps to close first'), h('ul', { style: { margin: '6px 0 0', paddingLeft: '18px' } }, gaps.map((g) => h('li', null, g.q)))),
      ),
    );
  };

  const drawQuiz = () => {
    clear(quiz);
    const answers = store.get('readiness.answers', {});
    READINESS.forEach((q, i) => {
      const hh = hint(q);
      quiz.append(
        h('div', { class: 'card' }, h('div', { class: 'row top' }, h('b', { style: { fontFamily: 'var(--f-display)', fontSize: '1.4rem' } }, String(i + 1)), h('div', { class: 'grow' }, h('p', { style: { margin: '0 0 8px', fontWeight: 600 } }, q.q), hh && h('p', { class: 'tiny', style: { margin: '0 0 8px', color: 'var(--ok)' } }, `✓ ${hh}`),
          h('div', { class: 'chips', role: 'radiogroup', 'aria-label': q.q }, SCALE.map((s) => h('button', { type: 'button', class: `chip${answers[q.id] === s.v ? ' on' : ''}`, role: 'radio', 'aria-checked': String(answers[q.id] === s.v), onclick: () => { store.set(`readiness.answers.${q.id}`, s.v); drawQuiz(); drawResult(); } }, s.label)))))),
      );
    });
  };
  drawQuiz(); drawResult();

  const paths = MONETIZE_PATHS.map((p) => h('div', { class: 'card' }, h('h3', null, p.name), h('p', { style: { margin: '6px 0 4px' } }, h('b', null, 'You need: '), p.needs), h('p', { style: { margin: '0 0 4px' } }, h('b', null, 'First step: '), p.first), h('p', { class: 'muted tiny', style: { margin: 0 } }, p.note)));

  return toolShell('monetize', h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'Advanced goal'), 'Monetisation is the advanced goal of Week 3. Take it on once your basics are in place. If they are not, leave it for later and keep building.'),
    arch.youth && h('div', { class: 'card warnbox' }, h('h4', null, 'You are under 18'), h('p', { style: { margin: '6px 0 0' } }, YOUTH_NOTE)),
    h('section', null, h('h2', { style: { marginBottom: '12px' } }, 'Are you ready?'), quiz, h('div', { style: { marginTop: '16px' } }, result)),
    h('section', null, h('h2', { style: { marginBottom: '12px' } }, 'Six paths'), h('div', { class: 'grid c2' }, paths)),
    h('div', { class: 'card warnbox' },
      h('h3', null, 'The rules that matter'),
      h('h4', { style: { marginTop: '12px' } }, 'Disclosure'),
      h('ul', { style: { margin: '6px 0', paddingLeft: '18px' } }, DISCLOSURE_RULES.map((r) => h('li', null, r))),
      h('div', { style: { display: 'flex', gap: '14px', flexWrap: 'wrap' } },
        sourceLink({ label: 'FTC: Disclosures 101 for social media influencers', href: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' })),
      h('h4', { style: { marginTop: '14px' } }, 'Athlete earnings'),
      h('p', { style: { margin: '6px 0' } }, 'Rules about what athletes can earn, and how deals are reported and reviewed, differ by sport, level, school and state, and they keep changing. Recent reports say college athletes’ third-party deals above a set amount are reviewed through a clearinghouse. Always check with your compliance office, governing body and a parent or guardian before you sign or accept anything.'),
      sourceLink({ label: 'Overview of the House settlement and NIL review (law firm summary)', href: 'https://www.phelps.com/insights/house-v-ncaa-settlement-approved-changing-the-landscape-of-college-sports.html' }),
      h('p', { class: 'tiny muted', style: { marginTop: '10px' } }, 'General information, not legal or financial advice. Last checked October 2026.'),
    ),
  ), { lede: 'Before you try to earn from content, check your base, understand the rules and choose one path.' });
}
