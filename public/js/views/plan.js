// Week 1 plan: goals, daily tasks and check-ins, review, audit prep, bio helper.
import { h, clear, debounce, autoGrow, toast, copyText } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { CONFIG } from '../config.js';
import { GOALS, DAYS, REVIEW_PROMPTS, AUDIT_TYPES, AUDIT_EXAMPLES, checkAuditQuestion, bioDrafts, checkBio, BIO_LIMIT } from '../content/plan.js';
import { weeklyGoals, progress } from '../progress.js';
import { crumbs, pageHead, bar, checklistLine } from '../ui/components.js';

export function render(route) {
  const sub = route.parts[1] || 'week';
  const tabs = [['week', 'The week'], ['audit', 'Prep a review question'], ['bio', 'Bio helper']];
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Week 1 Plan' }),
    pageHead({ eyebrow: 'Step 4 · Week 1', title: 'Your Week 1 plan', lede: 'Small daily actions keep you moving toward the week’s goals. Do the day’s tasks and you are on track. Skip a busy day, pick up the next one.' }),
    h('div', { class: 'tabs', role: 'tablist' }, tabs.map(([id, l]) => h('a', { class: 'tab', role: 'tab', href: `#/plan/${id === 'week' ? '' : id}`, 'aria-current': id === sub ? 'page' : null }, l))),
    sub === 'audit' ? audit() : sub === 'bio' ? bio() : week(),
  );
}

function week() {
  const goalsHost = h('div', { class: 'stack', style: { '--gap': '8px' } });
  const drawGoals = () => {
    clear(goalsHost);
    weeklyGoals().forEach((g) => {
      const cb = h('input', { type: 'checkbox', checked: g.done, id: `goal-${g.id}`, 'aria-label': g.title });
      cb.addEventListener('change', () => { store.set(`plan.goals.${g.id}`, cb.checked); drawGoals(); });
      goalsHost.append(h('label', { class: `goal${g.done ? ' done' : ''}`, for: `goal-${g.id}` }, cb, h('div', null, h('b', null, g.title), h('span', null, g.detail ? `${g.body} · ${g.detail}` : g.body), g.auto && h('span', { class: 'tag line', style: { marginLeft: '8px' } }, 'auto-tracked'))));
    });
  };
  drawGoals();

  const tasks = store.get('plan.tasks', {});
  const today = Math.min(7, Math.max(1, Math.floor((Date.now() - new Date(store.get('profile.createdAt', Date.now())).getTime()) / 86400000) + 1));

  const days = DAYS.map((d) => {
    const done = d.tasks.filter((t) => store.get(`plan.tasks.${t.id}`)).length;
    const checkin = h('textarea', { rows: 3, placeholder: 'A few honest lines…', 'aria-label': `Day ${d.n} check-in` });
    checkin.value = store.get(`plan.checkins.d${d.n}`, '');
    autoGrow(checkin);
    const save = debounce(() => store.set(`plan.checkins.d${d.n}`, checkin.value), 250);
    checkin.addEventListener('input', save);
    checkin.addEventListener('blur', () => save.flush());
    const countTag = h('span', { class: 'tag volt', style: { marginLeft: 'auto' } }, `${done}/${d.tasks.length}`);
    return h('article', { class: `day${d.n === today ? ' today' : ''}` },
      h('header', null, h('div', { class: 'jersey' }, String(d.n)), h('div', null, h('span', { class: 'tiny mono', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, d.n === today ? 'Today · Day ' + d.n : 'Day ' + d.n), h('h3', null, d.focus)), countTag),
      h('div', { class: 'tasks' }, d.tasks.map((t) => {
        const cb = h('input', { type: 'checkbox', id: t.id, checked: !!store.get(`plan.tasks.${t.id}`) });
        const row = h('label', { class: `task${cb.checked ? ' done' : ''}`, for: t.id }, cb, h('span', null, t.text), t.link && h('a', { href: t.link, class: 'link' }, 'Open'));
        cb.addEventListener('change', () => {
          store.set(`plan.tasks.${t.id}`, cb.checked);
          row.classList.toggle('done', cb.checked);
          countTag.textContent = `${d.tasks.filter((x) => store.get(`plan.tasks.${x.id}`)).length}/${d.tasks.length}`;
          drawGoals();
        });
        return row;
      })),
      h('div', { class: 'checkin' }, h('div', { class: 'lbl' }, 'Quick check-in'), h('p', { class: 'help' }, d.checkin), checkin),
    );
  });

  const review = REVIEW_PROMPTS.map((r) => {
    const ta = h('textarea', { rows: 2, id: `rv-${r.id}` });
    ta.value = store.get(`plan.review.${r.id}`, '');
    autoGrow(ta);
    const save = debounce(() => store.set(`plan.review.${r.id}`, ta.value), 250);
    ta.addEventListener('input', save);
    return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `rv-${r.id}` }, r.label), ta);
  });

  const p = progress();
  return h('div', { class: 'stack', style: { '--gap': '22px' } },
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Weekly goals'), h('span', { class: 'tag volt' }, `${p.plan.pct}% of tasks done`)), h('p', { class: 'muted' }, 'Know what you are working toward from the start. Return to these through the week.'), goalsHost),
    h('div', { class: 'days' }, days),
    h('div', { class: 'card pop' }, h('span', { class: 'eyebrow' }, 'Day 7 · Review, refine, repeat'), h('h3', null, 'Your weekly review'), h('div', { class: 'stack', style: { marginTop: '12px', '--gap': '14px' } }, review), h('div', { class: 'callout', style: { marginTop: '14px' } }, h('b', null, 'Remember'), 'You do not need to master everything in one week. Take what you learned, apply it and keep building. The next piece comes next week.')),
  );
}

function audit() {
  const saved = { type: '', question: '', ...store.get('plan.audit', {}) };
  const out = h('div', { 'aria-live': 'polite' });
  const draw = () => {
    clear(out);
    const r = checkAuditQuestion(saved.question);
    out.append(h('div', { class: 'checks' }, r.notes.map((n) => checklistLine(r.ok, n))));
  };
  const typeSel = h('div', { class: 'choices' }, AUDIT_TYPES.map((t) => {
    const input = h('input', { type: 'radio', name: 'at', value: t.id, checked: saved.type === t.id });
    input.addEventListener('change', () => { saved.type = t.id; store.set('plan.audit', saved); promptEl.textContent = t.ask; });
    return h('label', { class: 'choice' }, input, h('span', null, t.label));
  }));
  const promptEl = h('p', { class: 'help' }, AUDIT_TYPES.find((t) => t.id === saved.type)?.ask || 'Pick what you are bringing and we will help you ask it well.');
  const ta = h('textarea', { rows: 3, id: 'audit-q', placeholder: 'Write the ONE question you want answered…' });
  ta.value = saved.question || '';
  autoGrow(ta);
  ta.addEventListener('input', () => { saved.question = ta.value; store.set('plan.audit', saved); draw(); });
  draw();
  return h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, `How to use a ${CONFIG.auditName}`), `Come with something ${CONFIG.coachName} can respond to: a post you made, a format you want to test, or a part of your Blueprint you are unsure about. The clearer your question, the more you get. Bring one post and one question. You only get one question per turn so everyone gets support.`),
    h('div', { class: 'card pop stack', style: { '--gap': '14px' } },
      h('div', null, h('div', { class: 'lbl' }, 'What are you bringing?'), typeSel, promptEl),
      h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'audit-q' }, 'Your question'), ta),
      h('div', { class: 'card soft' }, h('b', null, 'Question check'), h('div', { style: { marginTop: '8px' } }, out)),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: () => ta.value.trim() ? copyText(ta.value.trim()) : toast('Write a question first', 'warn') }, 'Copy my question')),
    ),
    h('div', { class: 'card soft' }, h('h3', null, 'Good questions look like this'), h('div', { class: 'chips', style: { marginTop: '10px' } }, AUDIT_EXAMPLES.map((e) => h('button', { class: 'chip', type: 'button', onclick: () => { ta.value = e; saved.question = e; store.set('plan.audit', saved); draw(); ta.focus(); } }, e)))),
  );
}

function bio() {
  const parts = { ...store.get('bio', {}) };
  const st = store.get('blueprint.statement', {});
  parts.help ||= st.who ? `${st.who}${st.outcome ? ' to ' + st.outcome : ''}` : '';
  const finalIn = h('textarea', { id: 'bio-final', rows: 4, placeholder: 'Your final bio' });
  finalIn.value = parts.final || '';
  const count = h('span', { class: 'tiny mono' });
  const checks = h('div', { class: 'checks' });
  const drafts = h('div', { class: 'stack', style: { '--gap': '8px' } });
  const save = debounce(() => store.set('bio', parts), 250);
  const draw = () => {
    clear(checks); clear(drafts);
    count.textContent = `${finalIn.value.length}/${BIO_LIMIT}`;
    count.style.color = finalIn.value.length > BIO_LIMIT ? 'var(--hot)' : 'inherit';
    checkBio(finalIn.value).forEach((c) => checks.append(checklistLine(c.ok, c.text)));
    bioDrafts(parts).forEach((d) => drafts.append(h('div', { class: 'idea' }, h('p', { style: { margin: '0 0 8px', whiteSpace: 'pre-wrap' } }, d), h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${d.length} chars`), h('button', { class: 'btn sm', type: 'button', onclick: () => { finalIn.value = d; parts.final = d; save(); draw(); } }, 'Use this')))));
    if (!drafts.childNodes.length) drafts.append(h('p', { class: 'muted tiny' }, 'Fill in the boxes above to see draft bios.'));
  };
  finalIn.addEventListener('input', () => { parts.final = finalIn.value; save(); draw(); });
  const mk = (id, label, ph, help) => {
    const el = h('input', { type: 'text', id: `b-${id}`, value: parts[id] || '', placeholder: ph, autocomplete: 'off' });
    el.addEventListener('input', () => { parts[id] = el.value; save(); draw(); });
    return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `b-${id}` }, label), help && h('p', { class: 'help' }, help), el);
  };
  draw();
  return h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'Bonus goal'), 'Once your Blueprint exists, make your bio say it in one glance. A stranger should know who it is for and why to follow within five seconds.'),
    h('div', { class: 'card pop' }, h('div', { class: 'fields' },
      mk('identity', 'Who you are', 'D1 midfielder · pre-med', 'Level, role or identity.'),
      mk('help', 'Who you help and how', 'recruits get seen and stop guessing', 'Pulled from your statement if you have one.'),
      mk('proof', 'Proof', '2x all-conference', 'A result, level or number.'),
      mk('cta', 'Call to action', 'Free recruiting guide 👇', 'What you want them to do.'),
    )),
    h('div', { class: 'card' }, h('h3', null, 'Draft bios'), h('div', { style: { marginTop: '10px' } }, drafts)),
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('label', { class: 'lbl', for: 'bio-final', style: { margin: 0 } }, 'Your final bio'), count), finalIn, h('div', { style: { marginTop: '12px' } }, checks), h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn', type: 'button', onclick: () => finalIn.value.trim() ? copyText(finalIn.value) : toast('Write your bio first', 'warn') }, 'Copy bio'))),
  );
}
