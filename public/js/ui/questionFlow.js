// The guided question experience: one question at a time, a live depth meter,
// sentence starters, examples, and a "dig deeper" coach that asks sharper follow-ups.
import { h, clear, debounce, autoGrow, toast } from '../lib/dom.js';
import { analyze, pickFollowups, ISSUE_LABELS, wordCount } from '../coach.js';
import { meter } from './components.js';
import { exampleFor } from '../content/blueprint.js';
import { askAI, aiReady, AIError, blueprintContext } from '../ai.js';
import { archetypeById } from '../content/archetypes.js';
import * as store from '../lib/store.js';

const sub = (text, sport) => (text || '').replaceAll('{sport}', sport || 'my sport');

/**
 * questions: array of question objects
 * ctx: { getAnswer(q), setAnswer(q, val), getPillar(id), setPillar(id, val), startAt, onFinish(), onExit(), partLabel }
 */
export function questionFlow(questions, ctx) {
  const root = h('div', { class: 'qf' });
  const profile = store.get('profile', {});
  const arch = profile.archetype || 'college';
  const sport = profile.sport;
  const askedByQ = {};
  let index = Math.max(0, Math.min(questions.length - 1, ctx.startAt || 0));

  function render() {
    clear(root);
    const q = questions[index];
    root.append(header(q), q.type === 'pillars' ? pillarsCard(q) : questionCard(q), footer(q));
    const title = root.querySelector('.q-prompt');
    if (title) title.focus({ preventScroll: true });
  }

  function header() {
    const dots = h(
      'div',
      { class: 'dots', role: 'list', 'aria-label': 'Questions' },
      questions.map((qq, i) =>
        h('button', {
          type: 'button',
          role: 'listitem',
          class: `dot${i === index ? ' cur' : ''}${ctx.isDone(qq) ? ' done' : ''}`,
          'aria-label': `Question ${i + 1}${ctx.isDone(qq) ? ', answered' : ''}`,
          'aria-current': i === index ? 'step' : null,
          onclick: () => {
            index = i;
            render();
          },
        }),
      ),
    );
    return h('div', { class: 'qf-head' }, h('span', { class: 'tag volt' }, `${ctx.partLabel || 'Question'} ${index + 1}/${questions.length}`), dots);
  }

  function questionCard(q) {
    const answerBox = h('textarea', { id: 'answer', rows: 5, placeholder: 'Write it like you would say it to a teammate…', 'aria-describedby': 'meter-line' });
    answerBox.value = ctx.getAnswer(q) || '';
    autoGrow(answerBox);

    const meterHost = h('div', { class: 'meter-wrap', id: 'meter-line' });
    const flagsHost = h('div', { class: 'flags' });
    const coachHost = h('div');
    const stemsHost = h('div', { class: 'stems' });
    const exampleHost = h('div');

    const state = { shown: false };

    const refresh = () => {
      const text = answerBox.value;
      const res = analyze(text, { kind: q.kind });
      clear(meterHost);
      meterHost.append(
        meter(res.score, res.level),
        h('span', { class: 'meter-label' }, res.words ? `${res.level.label}` : 'Not started'),
        h('span', { class: 'tiny muted' }, `${res.words} word${res.words === 1 ? '' : 's'}`),
      );
      clear(flagsHost);
      if (res.words) {
        const list = h('ul');
        res.strengths.forEach((s) => list.append(h('li', { class: 'strengths' }, '✓ ' + s)));
        res.issues.slice(0, 2).forEach((i) => ISSUE_LABELS[i] && list.append(h('li', null, '→ ' + ISSUE_LABELS[i])));
        if (list.childNodes.length) flagsHost.append(list);
      }
      return res;
    };
    const refreshSoon = debounce(refresh, 220);
    const save = debounce(() => ctx.setAnswer(q, answerBox.value), 200);

    answerBox.addEventListener('input', () => {
      refreshSoon();
      save();
    });
    answerBox.addEventListener('blur', () => save.flush());

    // Sentence starters
    const stems = (q.stems || []).map((s) => sub(s, sport));
    if (stems.length) {
      stemsHost.append(
        h('div', { class: 'tiny muted', style: { marginBottom: '6px' } }, 'Stuck? Start with one of these:'),
        h(
          'div',
          { class: 'chips' },
          stems.map((s) =>
            h(
              'button',
              {
                type: 'button',
                class: 'chip',
                onclick: () => {
                  const cur = answerBox.value.trimEnd();
                  answerBox.value = (cur ? cur + '\n\n' : '') + s + ' ';
                  answerBox.focus();
                  answerBox.setSelectionRange(answerBox.value.length, answerBox.value.length);
                  answerBox.dispatchEvent(new Event('input'));
                },
              },
              s,
            ),
          ),
        ),
      );
    }

    // Example for this archetype
    const exText = sub(exampleFor(q, arch), sport);
    const exBtn = h('button', { type: 'button', class: 'btn secondary sm' }, 'See an example');
    exBtn.addEventListener('click', () => {
      state.shown = !state.shown;
      clear(exampleHost);
      exBtn.textContent = state.shown ? 'Hide example' : 'See an example';
      if (state.shown) {
        exampleHost.append(
          h(
            'div',
            { class: 'example' },
            h('span', { class: 'tag line' }, `Example · ${archetypeById(arch).label}`),
            h('q', null, exText),
            h('p', { class: 'tiny muted', style: { margin: '8px 0 0' } }, 'Use it for the level of detail, not the content. Your answer should only be yours.'),
          ),
        );
      }
    });

    // Dig deeper
    const digBtn = h('button', { type: 'button', class: 'btn' }, 'Dig deeper');
    digBtn.addEventListener('click', () => {
      save.flush();
      const res = refresh();
      showCoach(q, res, answerBox, coachHost, refresh);
    });

    const aiBtn = h('button', { type: 'button', class: `btn ai${aiReady() ? '' : ' hide'}` }, '✦ Ask the AI coach');
    aiBtn.addEventListener('click', () => runAI(q, answerBox, coachHost, aiBtn, refresh));

    const first = refresh();
    if (first.words) showCoach(q, first, answerBox, coachHost, refresh, true);

    return h(
      'section',
      { class: 'card pop q-card' },
      h('span', { class: 'eyebrow' }, q.group || ctx.partLabel),
      h('h2', { class: 'q-prompt', tabindex: '-1' }, sub(q.prompt, sport)),
      h('p', { class: 'q-why' }, q.why),
      h('div', { class: 'answer' }, answerBox),
      h('div', { class: 'answer-foot' }, meterHost, h('div', { class: 'row' }, exBtn, digBtn, aiBtn)),
      flagsHost,
      stemsHost,
      exampleHost,
      coachHost,
    );
  }

  function pillarsCard(q) {
    const archIdeas = archetypeById(arch).pillarIdeas;
    const cards = q.pillars.map((p) => {
      const ta = h('textarea', { rows: 2, placeholder: p.hint, 'aria-label': p.label });
      ta.value = ctx.getPillar(p.id) || '';
      autoGrow(ta);
      const persist = debounce(() => ctx.setPillar(p.id, ta.value), 200);
      ta.addEventListener('input', persist);
      ta.addEventListener('blur', () => persist.flush());
      return h(
        'div',
        { class: 'pillar' },
        h('h4', null, p.label),
        h('p', { class: 'help' }, p.hint),
        ta,
        h(
          'div',
          { class: 'chips' },
          (archIdeas[p.id] || []).map((idea) =>
            h(
              'button',
              {
                type: 'button',
                class: 'chip',
                onclick: () => {
                  const cur = ta.value.trim();
                  if (cur.toLowerCase().includes(idea.toLowerCase())) return;
                  ta.value = cur ? `${cur}, ${idea}` : idea;
                  ta.dispatchEvent(new Event('input'));
                },
              },
              '+ ' + idea,
            ),
          ),
        ),
      );
    });
    const exText = exampleFor(q, arch);
    return h(
      'section',
      { class: 'card pop q-card' },
      h('span', { class: 'eyebrow' }, ctx.partLabel),
      h('h2', { class: 'q-prompt', tabindex: '-1' }, q.prompt),
      h('p', { class: 'q-why' }, q.why),
      h('div', { class: 'pillars' }, cards),
      h('div', { class: 'example' }, h('span', { class: 'tag line' }, 'Example'), h('q', null, exText)),
      h('p', { class: 'tiny muted' }, 'Each pillar should open up lots of post ideas AND connect back to your message. If you cannot explain how a pillar supports your message, rethink it.'),
    );
  }

  function footer() {
    const last = index === questions.length - 1;
    return h(
      'div',
      { class: 'row between', style: { marginTop: '22px' } },
      h(
        'button',
        {
          class: 'btn secondary',
          type: 'button',
          onclick: () => {
            if (index === 0) ctx.onExit?.();
            else {
              index--;
              render();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          },
        },
        index === 0 ? '← Back' : '← Previous',
      ),
      h(
        'button',
        {
          class: 'btn lg',
          type: 'button',
          onclick: () => {
            document.activeElement?.blur?.();
            if (last) ctx.onFinish();
            else {
              index++;
              render();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          },
        },
        last ? ctx.finishLabel || 'Finish →' : 'Save and next →',
      ),
    );
  }

  function showCoach(q, res, answerBox, host, refresh, quiet = false) {
    clear(host);
    if (!res.words) {
      host.append(h('div', { class: 'coach' }, coachHead('Coach'), h('div', { class: 'coach-body' }, h('p', null, 'Write a few lines first. Rough is fine. Then I will help you sharpen it.'))));
      return;
    }
    const asked = (askedByQ[q.id] ||= []);
    const probes = pickFollowups(res, q.probes || {}, asked, 3);
    if (quiet && res.score >= 52 && !res.issues.length) return; // nothing to add yet
    probes.forEach((p) => asked.push(p.text));

    const body = h('div', { class: 'coach-body' });
    if (res.score >= 76) body.append(h('div', { class: 'strengths' }, '✦ This is sharp. Here is one pressure test to make it unmistakably yours.'));
    else body.append(h('p', { style: { margin: 0 } }, intro(res)));
    probes.forEach((p, i) => body.append(probeCard(p, i, answerBox, refresh)));

    const more = h('button', { type: 'button', class: 'btn secondary sm' }, 'Another angle');
    more.addEventListener('click', () => showCoach(q, analyze(answerBox.value, { kind: q.kind }), answerBox, host, refresh));
    body.append(h('div', null, more));
    host.append(h('div', { class: 'coach', role: 'region', 'aria-label': 'Coach follow-up questions' }, coachHead('Coach · dig deeper'), body));
  }

  function intro(res) {
    if (res.score < 28) return 'Good start. This is still at the surface. Pick one of these and answer it in a sentence or two, then add it to your answer.';
    if (res.score < 52) return 'You are getting warmer. These questions will pull out the detail that makes it yours.';
    return 'Solid. A bit more precision and this will be unmistakably you.';
  }

  function probeCard(p, i, answerBox, refresh) {
    const input = h('textarea', { rows: 2, class: 'hide', placeholder: 'Your answer…', 'aria-label': 'Your answer to the follow-up' });
    autoGrow(input);
    const add = h('button', { type: 'button', class: 'btn sm hide' }, 'Add to my answer');
    const open = h('button', { type: 'button', class: 'btn secondary sm' }, 'Answer this');
    open.addEventListener('click', () => {
      input.classList.remove('hide');
      add.classList.remove('hide');
      open.classList.add('hide');
      input.focus();
    });
    add.addEventListener('click', () => {
      const v = input.value.trim();
      if (!v) return;
      const cur = answerBox.value.trimEnd();
      answerBox.value = (cur ? cur + '\n\n' : '') + v;
      answerBox.dispatchEvent(new Event('input'));
      input.value = '';
      input.classList.add('hide');
      add.classList.add('hide');
      open.classList.add('hide');
      card.classList.add('answered');
      note.classList.remove('hide');
      refresh();
      toast('Added to your answer');
    });
    const note = h('p', { class: 'strengths hide', style: { margin: 0 } }, '✓ Added to your answer. Watch the meter.');
    const card = h('div', { class: 'probe' }, h('b', null, String(i + 1)), h('div', { class: 'grow stack', style: { '--gap': '8px' } }, h('p', null, p.text), h('div', { class: 'row' }, open), input, h('div', null, add), note));
    return card;
  }

  async function runAI(q, answerBox, host, btn, refresh) {
    const text = answerBox.value.trim();
    if (wordCount(text) < 3) return toast('Write a little first, then ask the AI coach.', 'warn');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Thinking…';
    try {
      const out = await askAI('followup', {
        question: q.prompt,
        kind: q.kind,
        stems: q.stems,
        answer: text,
        archetype: arch,
        sport,
        context: blueprintContext(),
      });
      const box = h(
        'div',
        { class: 'ai-out' },
        h('span', { class: 'tag' }, `AI coach · ${String(out.verdict || '').replace('_', ' ')} · ${Math.round(out.score ?? 0)}/100`),
        h('p', { style: { margin: '10px 0' } }, out.reflection),
        (out.followups || []).slice(0, 3).map((f, i) => probeCard({ text: f }, i, answerBox, refresh)),
        out.rewrite_example && h('div', { class: 'example' }, h('span', { class: 'tag line' }, 'A sharper version, using your own facts'), h('q', null, out.rewrite_example)),
      );
      clear(host);
      host.append(box);
    } catch (err) {
      toast(err instanceof AIError ? err.message : 'The AI coach is unavailable. The built-in coach still works.', 'warn');
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function coachHead(label) {
    return h('div', { class: 'coach-head' }, h('span', null, '▲'), label);
  }

  render();
  return root;
}
