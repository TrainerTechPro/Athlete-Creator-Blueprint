// Week 2: Hook Lab. Write, score and bank hooks.
import { h, clear, uid, toast, copyText, debounce, autoGrow, confirmDialog } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { HOOK_TYPES, scoreHook, hookLabel } from '../../content/hooks.js';
import { askAI, aiReady, AIError, blueprintContext } from '../../ai.js';
import { toolShell } from '../../ui/toolShell.js';
import { meter, checklistLine, bar } from '../../ui/components.js';

export function render() {
  const input = h('textarea', { id: 'hook-in', rows: 2, placeholder: 'Type a hook. Aim for 6 to 12 words.', 'aria-describedby': 'hook-score' });
  autoGrow(input);
  const scoreHost = h('div', { id: 'hook-score', 'aria-live': 'polite' });
  const bankHost = h('div', { class: 'stack', style: { '--gap': '10px' } });
  const bankCount = h('span', { class: 'tag volt' });
  const bankBar = h('div');

  const level = (s) => (s >= 80 ? { id: 'sharp' } : s >= 60 ? { id: 'specific' } : s >= 40 ? { id: 'warming' } : { id: 'surface' });

  const drawScore = () => {
    clear(scoreHost);
    const r = scoreHook(input.value);
    if (!r.words) return scoreHost.append(h('p', { class: 'muted' }, 'Write a hook to see how it scores.'));
    scoreHost.append(
      h('div', { class: 'row' }, meter(r.score, level(r.score)), h('b', null, `${r.score}/100`), h('span', { class: 'tag' }, hookLabel(r.score)), ...r.types.map((t) => h('span', { class: 'tag line' }, HOOK_TYPES.find((x) => x.id === t).name))),
      h('div', { class: 'checks', style: { marginTop: '12px' } }, r.checks.map((c) => checklistLine(c.ok, c.text))),
      r.tips.length > 0 && h('div', { class: 'callout', style: { marginTop: '12px' } }, h('b', null, 'To strengthen it'), h('ul', { style: { margin: '6px 0 0', paddingLeft: '18px' } }, r.tips.slice(0, 3).map((t) => h('li', null, t)))),
      h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn', type: 'button', onclick: save }, 'Save to my hook bank')),
    );
  };
  input.addEventListener('input', debounce(drawScore, 150));

  function save() {
    const text = input.value.trim();
    if (!text) return;
    const r = scoreHook(text);
    store.update('hooks', (list) => [...list, { id: uid(), text, score: r.score, types: r.types, createdAt: new Date().toISOString() }], []);
    input.value = '';
    drawScore();
    drawBank();
    toast('Saved to your hook bank');
  }

  function drawBank() {
    clear(bankHost);
    const list = [...store.get('hooks', [])].sort((a, b) => b.score - a.score);
    bankCount.textContent = `${list.length}/10`;
    clear(bankBar);
    bankBar.append(bar(Math.min(100, list.length * 10)));
    if (!list.length) return bankHost.append(h('div', { class: 'empty' }, 'Your hook bank is empty. Write ten, keep the best.'));
    list.forEach((x) =>
      bankHost.append(
        h('div', { class: 'idea' },
          h('div', { class: 'row between' }, h('b', null, `“${x.text}”`), h('span', { class: `tag ${x.score >= 60 ? 'ok' : 'warn'}` }, String(x.score))),
          h('div', { class: 'row', style: { marginTop: '8px' } },
            h('a', { class: 'btn sm', href: `#/posts?hook=${encodeURIComponent(x.text)}` }, 'Log as a post'),
            h('a', { class: 'btn secondary sm', href: `#/tools/calendar?hook=${encodeURIComponent(x.text)}` }, 'Add to calendar'),
            h('button', { class: 'btn ghost sm', type: 'button', onclick: () => copyText(x.text) }, 'Copy'),
            h('button', { class: 'btn ghost sm', type: 'button', onclick: async () => { if (await confirmDialog('Delete this hook?', 'Delete')) { store.update('hooks', (l) => l.filter((y) => y.id !== x.id), []); drawBank(); } } }, 'Delete'),
          ),
        ),
      ),
    );
  }
  drawBank();
  drawScore();

  const aiHost = h('div');
  const aiBtn = h('button', { class: `btn ai${aiReady() ? '' : ' hide'}`, type: 'button' }, '✦ Get hook ideas from the AI coach');
  aiBtn.addEventListener('click', async () => {
    aiBtn.disabled = true; aiBtn.textContent = 'Thinking…';
    try {
      const r = await askAI('hooks', { format: 'Any short-form video', formatKind: 'any', patterns: HOOK_TYPES.map((t) => t.formula), seed: input.value || 'Use my Blueprint', context: blueprintContext() });
      clear(aiHost);
      aiHost.append(h('div', { class: 'ai-out stack', style: { '--gap': '8px' } }, r.hooks.map((x) => h('div', { class: 'idea' }, h('b', null, x.hook), h('div', { class: 'tiny muted' }, x.why), h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm', type: 'button', onclick: () => { input.value = x.hook; input.dispatchEvent(new Event('input')); window.scrollTo({ top: 0, behavior: 'smooth' }); } }, 'Try it'))))));
    } catch (e) { toast(e instanceof AIError ? e.message : 'The AI coach is unavailable.', 'warn'); }
    finally { aiBtn.disabled = false; aiBtn.textContent = '✦ Get hook ideas from the AI coach'; }
  });

  const types = HOOK_TYPES.map((t) =>
    h('details', { style: { padding: '10px 0', borderBottom: '1.5px solid var(--line)' } },
      h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, t.name),
      h('p', { class: 'muted', style: { margin: '8px 0 4px' } }, t.why),
      h('p', { style: { margin: '0 0 4px' } }, h('b', null, 'Formula: '), t.formula),
      h('p', { style: { margin: '0 0 8px' } }, h('b', null, 'Example: '), t.example),
      h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { input.value = t.formula; input.dispatchEvent(new Event('input')); input.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }, 'Start from this'),
    ),
  );

  return toolShell('hooks', h('div', { class: 'stack', style: { '--gap': '20px' } },
    h('div', { class: 'callout' }, h('b', null, 'What the score is'), 'A checklist for the habits of strong hooks: short, specific, tension, a clear person, no filler, one idea. It does not predict views. Test your best three and let your analytics decide.'),
    h('div', { class: 'card pop stack', style: { '--gap': '12px' } }, h('label', { class: 'lbl', for: 'hook-in' }, 'Write a hook'), input, scoreHost, aiBtn, aiHost),
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Your hook bank'), bankCount), h('p', { class: 'muted' }, 'Goal: 10 hooks banked. Best scores first.'), bankBar, h('div', { style: { marginTop: '12px' } }, bankHost)),
    h('div', { class: 'card soft' }, h('h3', null, '9 hook types to start from'), h('div', { style: { marginTop: '8px' } }, types)),
  ));
}
