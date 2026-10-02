// Goals, seven daily plans with check-ins, and the end-of-week review for Weeks 2 to 4.
import { h, clear, debounce, autoGrow } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { weekGoals, weekProgress } from '../progress.js';
import { WEEKS } from '../content/weeks.js';
import { REVIEW_PROMPTS } from '../content/plan.js';

export function weekBoard(n, { onChange } = {}) {
  const cfg = WEEKS[n];
  const base = `weeks.w${n}`;

  const goalsHost = h('div', { class: 'stack', style: { '--gap': '8px' } });
  const progressTag = h('span', { class: 'tag volt' });
  const drawGoals = () => {
    clear(goalsHost);
    const goals = weekGoals(n);
    progressTag.textContent = `${goals.filter((g) => g.done).length}/${goals.length} goals`;
    goals.forEach((g) => {
      const cb = h('input', { type: 'checkbox', checked: g.done, id: `w${n}-goal-${g.id}`, 'aria-label': g.title });
      cb.addEventListener('change', () => { store.set(`${base}.goals.${g.id}`, cb.checked); drawGoals(); onChange?.(); });
      goalsHost.append(
        h('label', { class: `goal${g.done ? ' done' : ''}`, for: `w${n}-goal-${g.id}` }, cb,
          h('div', null, h('b', null, g.title), h('span', null, g.body), g.isAuto && h('span', { class: 'tag line', style: { marginLeft: '8px' } }, 'auto-tracked')),
        ),
      );
    });
  };
  drawGoals();

  const started = new Date(store.get('profile.createdAt', Date.now())).getTime();
  const days = cfg.days.map((d) => {
    const done = () => d.tasks.filter((t) => store.get(`${base}.tasks.${t.id}`)).length;
    const count = h('span', { class: 'tag volt', style: { marginLeft: 'auto' } }, `${done()}/${d.tasks.length}`);
    const checkin = h('textarea', { rows: 3, placeholder: 'A few honest lines…', 'aria-label': `Week ${n} day ${d.n} check-in` });
    checkin.value = store.get(`${base}.checkins.d${d.n}`, '');
    autoGrow(checkin);
    const save = debounce(() => store.set(`${base}.checkins.d${d.n}`, checkin.value), 250);
    checkin.addEventListener('input', save);
    checkin.addEventListener('blur', () => save.flush());
    return h('article', { class: 'day' },
      h('header', null, h('div', { class: 'jersey' }, String(d.n)), h('div', null, h('span', { class: 'tiny mono', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, `Day ${d.n}`), h('h3', null, d.focus)), count),
      h('div', { class: 'tasks' }, d.tasks.map((t) => {
        const cb = h('input', { type: 'checkbox', id: t.id, checked: !!store.get(`${base}.tasks.${t.id}`) });
        const row = h('label', { class: `task${cb.checked ? ' done' : ''}`, for: t.id }, cb, h('span', null, t.text), t.link && h('a', { href: t.link, class: 'link' }, 'Open'));
        cb.addEventListener('change', () => {
          store.set(`${base}.tasks.${t.id}`, cb.checked);
          row.classList.toggle('done', cb.checked);
          count.textContent = `${done()}/${d.tasks.length}`;
          drawGoals();
          onChange?.();
        });
        return row;
      })),
      h('div', { class: 'checkin' }, h('div', { class: 'lbl' }, 'Quick check-in'), h('p', { class: 'help' }, d.checkin), checkin),
    );
  });
  void started;

  const review = REVIEW_PROMPTS.map((r) => {
    const ta = h('textarea', { rows: 2, id: `w${n}-rv-${r.id}` });
    ta.value = store.get(`${base}.review.${r.id}`, '');
    autoGrow(ta);
    const save = debounce(() => store.set(`${base}.review.${r.id}`, ta.value), 250);
    ta.addEventListener('input', save);
    return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `w${n}-rv-${r.id}` }, r.label), ta);
  });

  const p = weekProgress(n);
  return h('div', { class: 'stack', style: { '--gap': '22px' } },
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Weekly goals'), progressTag), h('p', { class: 'muted' }, 'Know what you are working toward from the start. Goals the app can see tick themselves.'), goalsHost),
    h('div', { class: 'days' }, days),
    h('div', { class: 'card pop' }, h('span', { class: 'eyebrow' }, 'Day 7 · Review, refine, repeat'), h('h3', null, 'Your weekly review'), h('div', { class: 'stack', style: { marginTop: '12px', '--gap': '14px' } }, review), h('p', { class: 'muted tiny', style: { marginTop: '12px' } }, `${p.tasksDone} of ${p.tasksTotal} tasks done this week.`)),
  );
}
