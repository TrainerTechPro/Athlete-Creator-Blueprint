// Lesson 1: build the Blueprint (Say, Reach, Why), the story bank, the message statement and the health check.
import { h, clear, uid, toast, debounce, autoGrow } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { PARTS, DOS, DONTS, QUESTIONS, questionsFor, FAQ, STORY_PROMPTS, STORY_TAGS, THREE_BEATS, STATEMENT_FIELDS, assembleStatement } from '../content/blueprint.js';
import { archetypeById } from '../content/archetypes.js';
import { progress, isAnswered } from '../progress.js';
import { health } from '../blueprintHealth.js';
import { analyze, pickQuote } from '../coach.js';
import { splitStory, clauseCut } from '../story.js';
import { askAI, aiReady, AIError, blueprintContext } from '../ai.js';
import { crumbs, pageHead, bar, ring, jersey, chips, checklistLine, arrow } from '../ui/components.js';
import { questionFlow } from '../ui/questionFlow.js';

export function render(route) {
  const sub = route.parts[1];
  if (['say', 'reach', 'why'].includes(sub)) {
    if (sub === 'why' && route.parts[2] === 'bank') return storyBank();
    return flow(sub, route);
  }
  if (sub === 'statement') return statement();
  return overview();
}

// ---------------------------------------------------------------- overview
function overview() {
  const p = progress();
  return h(
    'div',
    { class: 'stack', style: { '--gap': '24px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Your Blueprint' }),
    pageHead({
      eyebrow: 'Lesson 1 · Becoming the niche',
      title: 'Your Blueprint',
      lede: 'The internet tells creators to pick a niche. Here is a better idea: you are the niche. You are bigger than a single topic. Your Blueprint is the overlap of what you say, who you say it to, and why it matters to you.',
    }),
    h(
      'div',
      { class: 'journey' },
      PARTS.map((part) => {
        const pp = p.byPart[part.id];
        return h('a', { class: 'j-card', href: `#/blueprint/${part.id}` }, jersey(part.num), h('div', null, h('span', { class: 'eyebrow', style: { marginBottom: '2px' } }, part.question), h('h3', null, part.title), h('p', null, part.blurb), h('div', { style: { marginTop: '10px', maxWidth: '260px' } }, bar(pp.pct))), ring(pp.pct));
      }),
      h('a', { class: 'j-card', href: '#/blueprint/statement' }, jersey('04'), h('div', null, h('span', { class: 'eyebrow', style: { marginBottom: '2px' } }, 'Pull it together'), h('h3', null, 'Statement and check'), h('p', null, 'Write your one-sentence message and run the Blueprint health check.')), h('span', { class: 'tag' }, 'Open')),
    ),
    h(
      'div',
      { class: 'two' },
      h('div', { class: 'card do' }, h('span', { class: 'eyebrow' }, 'Do this'), DOS.map((d) => h('div', { style: { marginTop: '10px' } }, h('b', null, d.title), h('div', { class: 'muted' }, d.body)))),
      h('div', { class: 'card dont' }, h('span', { class: 'eyebrow', style: { color: 'var(--hot)' } }, 'Do not do this'), DONTS.map((d) => h('div', { style: { marginTop: '10px' } }, h('b', null, d.title), h('div', { class: 'muted' }, d.body)))),
    ),
    h('div', { class: 'callout' }, h('b', null, 'Move on at 60%'), 'You do not need perfect clarity. Your Blueprint will evolve as you post, test and learn. Answer honestly, let the coach push you once or twice, and keep moving.'),
    h('div', { class: 'card soft' }, h('h3', null, 'Common questions'), h('div', { style: { marginTop: '10px' } }, FAQ.map((f) => h('details', { style: { padding: '10px 0', borderBottom: '1.5px solid var(--line)' } }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, f.q), h('p', { class: 'muted', style: { marginTop: '8px' } }, f.a))))),
  );
}

// ---------------------------------------------------------------- guided question flow
const NEXT = { say: '/blueprint/reach', reach: '/blueprint/why', why: '/blueprint/why/bank' };
const NEXT_LABEL = { say: 'Next: Who you say it to →', reach: 'Next: Why it matters →', why: 'Next: Build your story bank →' };

function flow(partId, route) {
  const part = PARTS.find((x) => x.id === partId);
  const qs = questionsFor(partId);
  const startAt = Math.max(0, qs.findIndex((q) => q.id === route.query.q));
  return h(
    'div',
    { class: 'stack' },
    crumbs({ label: 'Your Blueprint', href: '#/blueprint' }, { label: `${part.num} · ${part.title}` }),
    h('h1', { id: 'page-title', tabindex: '-1', class: 'sr' }, part.title),
    h('div', { class: 'row between' }, h('div', null, h('span', { class: 'eyebrow', style: { marginBottom: 0 } }, part.question), h('h2', null, part.title)), h('a', { class: 'btn ghost sm', href: '#/blueprint' }, 'Overview')),
    questionFlow(qs, {
      partLabel: part.title,
      startAt,
      getAnswer: (q) => store.get('blueprint.answers', {})[q.id] || '',
      setAnswer: (q, v) => store.set(`blueprint.answers.${q.id}`, v),
      getPillar: (id) => store.get('blueprint.pillars', {})[id] || '',
      setPillar: (id, v) => store.set(`blueprint.pillars.${id}`, v),
      isDone: (q) => isAnswered(q, store.get('blueprint.answers', {}), store.get('blueprint.pillars', {})),
      onFinish: () => go(NEXT[partId]),
      onExit: () => go('/blueprint'),
      finishLabel: NEXT_LABEL[partId],
    }),
  );
}

// ---------------------------------------------------------------- story bank
function newStory(extra = {}) {
  return { id: uid(), title: '', tag: 'Other', problem: '', pursuit: '', payoff: '', ...extra };
}

function storyBank() {
  const host = h('div', { class: 'stack', style: { '--gap': '16px' } });
  const stories = () => store.get('blueprint.stories', []);
  const save = (list) => store.set('blueprint.stories', list);

  const draw = () => {
    clear(host);
    const list = stories();
    const usedSources = new Set(list.map((s) => s.source).filter(Boolean));
    const answers = store.get('blueprint.answers', {});
    const mineable = QUESTIONS.filter((q) => q.part === 'why' && (answers[q.id] || '').trim().split(/\s+/).length >= 20 && !usedSources.has(q.id));

    host.append(
      h('div', { class: 'card' },
        h('h3', null, 'Struggle. Move. Win.'),
        h('p', { class: 'muted' }, 'Every story that holds attention has three beats. Break each of yours into them and you will never run out of material.'),
        h('div', { class: 'grid c3' }, THREE_BEATS.map((b) => h('div', { class: 'leaf' }, h('small', null, b.formal), h('b', null, b.label), h('p', { class: 'muted' }, b.body)))),
      ),
    );

    if (mineable.length) {
      host.append(
        h('div', { class: 'card volt' }, h('h3', null, 'Turn your answers into story cards'), h('p', null, 'You already wrote these. One click splits each into Struggle, Move and Win, and you can edit from there.'),
          h('div', { class: 'row' }, mineable.map((q) => h('button', { class: 'btn secondary', type: 'button', onclick: () => {
            const parts = splitStory(answers[q.id]);
            const tag = q.id === 'why-changed' ? 'Identity' : q.id === 'why-origin' ? 'Setback' : 'Other';
            save([...stories(), newStory({ title: q.id === 'why-origin' ? 'Origin story' : q.id === 'why-changed' ? 'A belief I changed' : 'Something I learned the hard way', tag, source: q.id, ...parts })]);
            draw();
            toast('Story card created. Tidy it up.');
          } }, q.id === 'why-origin' ? 'Origin story' : q.id === 'why-changed' ? 'Changed belief' : 'Lesson learned')))),
      );
    }

    if (!list.length) host.append(h('div', { class: 'empty' }, h('h3', null, 'Your story bank is empty'), h('p', null, 'Start from a prompt below or add a blank card. Aim for 3 to 5 stories.')));
    list.forEach((s) => host.append(storyCard(s, draw)));

    host.append(
      h('div', { class: 'card soft' },
        h('h3', null, 'Story prompts'),
        h('p', { class: 'muted' }, 'Pick one that gives you a little jolt. Do not overthink the title.'),
        h('div', { class: 'chips' }, STORY_PROMPTS.map((sp) => h('button', { class: 'chip', type: 'button', onclick: () => { save([...stories(), newStory({ title: sp.label, tag: sp.tag })]); draw(); } }, '+ ' + sp.label))),
        h('div', { style: { marginTop: '14px' } }, h('button', { class: 'btn secondary', type: 'button', onclick: () => { save([...stories(), newStory()]); draw(); } }, '+ Blank story')),
      ),
    );

    const full = stories().filter((s) => s.problem.trim() && s.pursuit.trim() && s.payoff.trim()).length;
    host.append(
      h('div', { class: 'row between' }, h('a', { class: 'btn secondary', href: '#/blueprint/why' }, '← Back to questions'), h('a', { class: 'btn lg', href: '#/blueprint/statement' }, full ? 'Next: your statement →' : 'Skip to statement →')),
    );
  };
  draw();

  return h('div', { class: 'stack' }, crumbs({ label: 'Your Blueprint', href: '#/blueprint' }, { label: '03 · Why it matters' }, { label: 'Story bank' }), pageHead({ eyebrow: 'Why it matters to you', title: 'Story bank', lede: 'Your stories are what make strangers feel like they know you. You do not squeeze them into one. You collect them and pull from them when you create.' }), host);
}

function storyCard(s, redraw) {
  const update = (patch) => store.set('blueprint.stories', store.get('blueprint.stories', []).map((x) => (x.id === s.id ? { ...x, ...patch } : x)));
  const missing = THREE_BEATS.filter((b) => !(s[b.id] || '').trim());
  const title = h('input', { type: 'text', value: s.title, placeholder: 'Name this story…', 'aria-label': 'Story title' });
  title.addEventListener('input', debounce(() => update({ title: title.value }), 200));
  const tag = h('select', { 'aria-label': 'Story tag', style: { width: 'auto', minHeight: '36px', padding: '4px 10px' } }, STORY_TAGS.map((t) => h('option', { value: t }, t)));
  tag.value = s.tag || 'Other';
  tag.addEventListener('change', () => update({ tag: tag.value }));
  const del = h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Delete story ${s.title || ''}`, onclick: () => { store.set('blueprint.stories', store.get('blueprint.stories', []).filter((x) => x.id !== s.id)); redraw(); } }, 'Delete');

  const beats = THREE_BEATS.map((b) => {
    const ta = h('textarea', { rows: 4, placeholder: { problem: 'What went wrong? The moment it felt hard.', pursuit: 'What did you do about it? Real steps.', payoff: 'What changed? A result, lesson or new belief.' }[b.id] });
    ta.value = s[b.id] || '';
    autoGrow(ta);
    const note = h('span', { class: 'tiny muted' });
    const check = () => {
      const r = analyze(ta.value, { kind: 'story' });
      note.textContent = ta.value.trim() ? `${r.words} words` : '';
    };
    const saveBeat = debounce(() => update({ [b.id]: ta.value }), 200);
    ta.addEventListener('input', () => { check(); saveBeat(); });
    ta.addEventListener('blur', () => update({ [b.id]: ta.value }));
    check();
    return h('div', { class: 'beat' }, h('h4', null, b.label, h('span', null, b.formal)), ta, note);
  });
  return h('article', { class: 'story' }, h('div', { class: 'story-head' }, title, tag, missing.length === 0 ? h('span', { class: 'tag ok' }, 'Complete') : h('span', { class: 'tag warn' }, `Missing: ${missing.map((m) => m.label).join(', ')}`), del), h('div', { class: 'beats' }, beats));
}

// ---------------------------------------------------------------- statement + health
function statement() {
  const answers = store.get('blueprint.answers', {});
  const saved = { ...store.get('blueprint.statement', {}) };
  const out = h('p', { class: 'statement-out', 'aria-live': 'polite' });
  const dump = () => store.set('blueprint.statement', saved);
  const draw = () => {
    const sentence = assembleStatement(saved);
    out.textContent = sentence || 'Your statement will appear here as you fill in the blanks.';
    out.style.opacity = sentence ? 1 : 0.55;
  };

  const fields = STATEMENT_FIELDS.map((f) => {
    const input = h('input', { id: `st-${f.id}`, type: 'text', value: saved[f.id] || '', placeholder: f.placeholder, autocomplete: 'off' });
    input.addEventListener('input', () => { saved[f.id] = input.value; draw(); persist(); });
    const source = (answers[f.from] || '').trim();
    const suggestion = source ? toPhrase(f.id, source) : '';
    const pull = source
      ? h('div', { class: 'pullbox' }, h('span', { class: 'tiny muted' }, 'From your answer:'), h('q', null, pickQuote(source, 140)),
          suggestion && h('button', { class: 'link tiny', type: 'button', onclick: () => { input.value = suggestion; saved[f.id] = suggestion; draw(); persist(); refreshHealth(); } }, `Use “${suggestion}”`))
      : null;
    return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `st-${f.id}` }, f.label), input, pull);
  });
  const persist = debounce(dump, 250);

  const tagline = h('input', { id: 'tagline', type: 'text', value: saved.tagline || '', placeholder: 'Optional: a short line you could put in your bio', maxlength: 100 });
  tagline.addEventListener('input', () => { saved.tagline = tagline.value; persist(); });

  const healthHost = h('div', { class: 'stack', style: { '--gap': '14px' } });
  const drawHealth = () => {
    clear(healthHost);
    const r = health({ answers: store.get('blueprint.answers', {}), pillars: store.get('blueprint.pillars', {}), stories: store.get('blueprint.stories', []), statement: store.get('blueprint.statement', {}) });
    const row = (it) => h('div', { class: `h-item ${it.status}` }, h('div', { class: 'h-ico', 'aria-hidden': 'true' }, it.status === 'pass' ? '✓' : it.status === 'warn' ? '!' : '·'), h('div', null, h('b', null, it.label), h('span', null, it.note)), it.status !== 'pass' && h('a', { class: 'btn secondary sm', href: it.fix }, 'Fix'));
    healthHost.append(h('div', { class: 'row between' }, h('h3', null, 'Blueprint health check'), h('span', { class: 'tag volt' }, `Avg depth ${r.avg}/100`)), h('h4', null, 'Do this'), h('div', { class: 'health' }, r.dos.map(row)), h('h4', null, 'Avoid this'), h('div', { class: 'health' }, r.donts.map(row)));
  };
  drawHealth();
  const refreshHealth = debounce(drawHealth, 300);
  [...fields].forEach((f) => f.addEventListener('input', refreshHealth));

  const aiHost = h('div');
  const aiBtn = h('button', { class: `btn ai${aiReady() ? '' : ' hide'}`, type: 'button' }, '✦ Draft with the AI coach');
  aiBtn.addEventListener('click', async () => {
    aiBtn.disabled = true; aiBtn.textContent = 'Thinking…';
    try {
      const r = await askAI('synthesize', { archetype: store.get('profile.archetype'), sport: store.get('profile.sport'), context: blueprintContext() });
      clear(aiHost);
      aiHost.append(h('div', { class: 'ai-out' },
        h('span', { class: 'tag' }, 'AI draft'),
        h('p', { class: 'statement-out', style: { fontSize: '1.5rem', margin: '10px 0' } }, r.statement),
        h('div', { class: 'chips' }, (r.taglines || []).map((t) => h('button', { class: 'chip', type: 'button', onclick: () => { tagline.value = t; saved.tagline = t; persist(); } }, t))),
        r.bios?.length ? h('div', null, h('b', null, 'Bio ideas'), h('ul', null, r.bios.map((b) => h('li', null, b)))) : null,
        r.gaps?.length ? h('div', null, h('b', null, 'Still missing'), h('ul', null, r.gaps.map((g) => h('li', null, g)))) : null,
      ));
    } catch (e) { toast(e instanceof AIError ? e.message : 'The AI coach is unavailable.', 'warn'); }
    finally { aiBtn.disabled = false; aiBtn.textContent = '✦ Draft with the AI coach'; }
  });

  draw();
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Your Blueprint', href: '#/blueprint' }, { label: 'Statement and check' }),
    pageHead({ eyebrow: 'Pull it together', title: 'Your message statement', lede: 'One sentence that says who you help, with what, and how. It is the spine of your Blueprint. Make it yours, not perfect. You can revise it every week.' }),
    h('div', { class: 'card volt pop' }, h('span', { class: 'eyebrow' }, 'Your statement'), out),
    h('div', { class: 'card' }, h('div', { class: 'fields' }, fields), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'tagline' }, 'Tagline (optional)'), tagline), h('div', { style: { marginTop: '14px' } }, aiBtn), aiHost),
    h('div', { class: 'card soft' }, healthHost),
    h('div', { class: 'row between' }, h('a', { class: 'btn secondary', href: '#/doc' }, 'See the full Blueprint'), h('a', { class: 'btn lg', href: '#/formats' }, 'Next: formats →')),
  );
}

const firstSentence = (t) => (t.match(/^[^.!?]+[.!?]?/) || [t])[0].trim().replace(/[.!?]$/, '');
const lowerFirst = (x) => (x && /^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);

// Turn a free-form answer into a phrase that reads naturally inside the statement.
// Only the "who" and "struggle" blanks can be pulled reliably; the others need a verb the person chooses.
function toPhrase(fieldId, text) {
  let t = firstSentence(text);
  if (fieldId === 'who') {
    t = t.split(/,|\s+who\s+|\s+that\s+/i)[0];
    return lowerFirst(t.replace(/^(a|an|the)\s+/i, (m) => m.toLowerCase())).trim();
  }
  if (fieldId === 'struggle') {
    t = t
      .replace(/^(every day |all the time )?(they|he|she)\s+(are|is|feel|feels|keep|keeps|worry|worries|fear|fears)\s+(also\s+)?(afraid|scared|worried|anxious|stuck)?\s*(of|that|about|like)?\s*/i, '')
      .replace(/^and\s+/i, '');
    return clauseCut(t, 14);
  }
  return '';
}
