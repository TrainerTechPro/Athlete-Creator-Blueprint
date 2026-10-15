// Idea Lab: pick a format, seed it from your Blueprint, get hooks written in your own words.
import { h, clear, uid, toast, copyText, debounce } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { FORMATS, FORMAT_BY_ID, TOKENS, fillHook, missingTokens, displayName, KIND_LABEL } from '../content/formats.js';
import { archetypeById } from '../content/archetypes.js';
import { clauseCut } from '../story.js';
import { askAI, aiReady, AIError, blueprintContext } from '../ai.js';
import { crumbs, pageHead } from '../ui/components.js';

// Trim a long answer into something that reads like a hook ingredient.
function snippet(text, maxWords = 12) {
  return clauseCut(text, maxWords).replace(/^(they|he|she)\s+(are|is|feel|feels|want|wants)\s+/i, '');
}

function seeds() {
  const a = store.get('blueprint.answers', {});
  const out = [{ id: 'none', label: 'Start from scratch', tokens: {} }];
  if ((a['who-pain'] || '').trim()) out.push({ id: 'pain', label: 'My audience’s struggle', tokens: { problem: snippet(a['who-pain']) } });
  if ((a['who-want'] || '').trim()) out.push({ id: 'want', label: 'What my audience wants', tokens: { desire: snippet(a['who-want']) } });
  store.get('blueprint.stories', []).forEach((s) => {
    if (s.problem?.trim() || s.payoff?.trim()) {
      out.push({ id: `story:${s.id}`, label: `Story: ${s.title || 'Untitled'}`, tokens: { problem: snippet(s.problem), pursuit: snippet(s.pursuit), payoff: snippet(s.payoff), loss: snippet(s.problem, 8) } });
    }
  });
  const p = store.get('blueprint.pillars', {});
  Object.entries(p).forEach(([k, v]) => {
    if ((v || '').trim()) out.push({ id: `pillar:${k}`, label: `Pillar (${k}): ${snippet(v, 6)}`, tokens: { thing: snippet(v, 6), goal: snippet(v, 6), advice: snippet(v, 6) } });
  });
  return out;
}

export function render(route) {
  const profile = store.get('profile', {});
  const arch = archetypeById(profile.archetype);
  const st = {
    formatId: FORMAT_BY_ID[route.query.f] ? route.query.f : store.get('formats.saved', [])[0] || 'confession',
    seedId: 'none',
    vals: { sport: profile.sport || '', identity: arch.label.toLowerCase() },
    chosen: 0,
  };

  const left = h('div', { class: 'card pop stack', style: { '--gap': '16px' } });
  const right = h('div', { class: 'stack', style: { '--gap': '16px' } });
  const bank = h('div', { class: 'stack', style: { '--gap': '10px' } });

  const fmt = () => FORMAT_BY_ID[st.formatId];

  const drawLeft = () => {
    clear(left);
    const f = fmt();
    const formatSel = h('select', { id: 'lab-format' }, FORMATS.map((x) => h('option', { value: x.id }, `${displayName(x)} (${KIND_LABEL[x.kind]})`)));
    formatSel.value = st.formatId;
    formatSel.addEventListener('change', () => { st.formatId = formatSel.value; st.chosen = 0; drawLeft(); drawRight(); });

    const seedList = seeds();
    const seedSel = h('select', { id: 'lab-seed' }, seedList.map((s) => h('option', { value: s.id }, s.label)));
    seedSel.value = st.seedId;
    seedSel.addEventListener('change', () => {
      st.seedId = seedSel.value;
      const seed = seedList.find((s) => s.id === st.seedId);
      Object.entries(seed?.tokens || {}).forEach(([k, v]) => { if (v) st.vals[k] = v; });
      drawLeft(); drawRight();
    });

    left.append(
      h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'lab-format' }, '1. Pick a format'), formatSel),
      h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'lab-seed' }, '2. Seed it from your Blueprint'), h('p', { class: 'help' }, seedList.length > 1 ? 'We pull a starting phrase from your answers. Edit anything.' : 'Complete some of your Blueprint to seed ideas from your own words.'), seedSel),
      h('div', null, h('div', { class: 'lbl' }, '3. Fill in the blanks'), h('div', { class: 'fields' }, f.tokens.map((t) => {
        const input = h('input', { type: 'text', id: `tk-${t}`, value: st.vals[t] || '', placeholder: TOKENS[t].placeholder, autocomplete: 'off' });
        input.addEventListener('input', () => { st.vals[t] = input.value; drawRight(); });
        return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `tk-${t}` }, TOKENS[t].label), input);
      }))),
      h('a', { class: 'link tiny', href: `#/formats/${f.id}` }, `How the ${displayName(f)} format works →`),
    );
  };

  const drawRight = () => {
    clear(right);
    const f = fmt();
    const options = f.hooks.map((t) => ({ t, text: fillHook(t, st.vals), missing: missingTokens(t, st.vals) }));
    if (st.chosen >= options.length) st.chosen = 0;
    const cur = options[st.chosen];
    const parts = [
      h('div', null, h('div', { class: 'lbl' }, 'Your hook'), h('div', { class: 'hook-out', 'aria-live': 'polite' }, cur.text), cur.missing.length ? h('p', { class: 'tiny muted' }, `Still to fill: ${cur.missing.map((m) => TOKENS[m].label.toLowerCase()).join(', ')}`) : h('p', { class: 'tiny', style: { color: 'var(--ok)', fontWeight: 600 } }, '✓ Ready to use')),
      options.length > 1 && h('div', { class: 'chips', role: 'group', 'aria-label': 'Hook patterns' }, options.map((o, i) => h('button', { class: `chip${i === st.chosen ? ' on' : ''}`, type: 'button', onclick: () => { st.chosen = i; drawRight(); } }, `Pattern ${i + 1}`))),
      h('div', { class: 'callout' }, h('b', null, 'Caption'), f.caption),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => saveIdea(cur.text) }, 'Save idea'),
        h('button', { class: 'btn secondary', type: 'button', onclick: () => copyText(cur.text) }, 'Copy hook'),
        h('a', { class: 'btn secondary', href: `#/challenge` }, 'Guided challenges'),
      ),
      aiReady() && aiBlock(f),
    ];
    right.append(...parts.filter(Boolean));
  };

  const aiHost = h('div');
  function aiBlock(f) {
    const btn = h('button', { class: 'btn ai', type: 'button' }, '✦ More hooks from the AI coach');
    btn.addEventListener('click', async () => {
      btn.disabled = true; btn.textContent = 'Thinking…';
      try {
        const seed = seeds().find((s) => s.id === st.seedId);
        const r = await askAI('hooks', { format: displayName(f), formatKind: f.kind, patterns: f.hooks, seed: `${seed?.label || ''} ${JSON.stringify(st.vals)}`, context: blueprintContext() });
        clear(aiHost);
        aiHost.append(h('div', { class: 'ai-out stack', style: { '--gap': '8px' } }, r.hooks.map((x) => h('div', { class: 'idea' }, h('b', null, x.hook), h('div', { class: 'tiny muted' }, x.why), h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm', type: 'button', onclick: () => saveIdea(x.hook) }, 'Save'))))));
      } catch (e) { toast(e instanceof AIError ? e.message : 'The AI coach is unavailable.', 'warn'); }
      finally { btn.disabled = false; btn.textContent = '✦ More hooks from the AI coach'; }
    });
    return h('div', { class: 'stack', style: { '--gap': '10px' } }, btn, aiHost);
  }

  function saveIdea(hook) {
    store.update('formats.ideas', (list) => [{ id: uid(), formatId: st.formatId, hook, createdAt: new Date().toISOString() }, ...list], []);
    drawBank();
    toast('Saved to your idea bank');
  }

  const drawBank = () => {
    clear(bank);
    const ideas = store.get('formats.ideas', []);
    if (!ideas.length) return bank.append(h('div', { class: 'empty' }, 'Saved ideas will show up here.'));
    ideas.forEach((i) => {
      const f = FORMAT_BY_ID[i.formatId];
      bank.append(
        h('div', { class: 'idea' },
          h('span', { class: 'tag line' }, f ? displayName(f) : 'Idea'),
          h('p', { style: { margin: '8px 0', fontWeight: 600 } }, i.hook),
          h('div', { class: 'row' },
            h('a', { class: 'btn sm', href: `#/posts?hook=${encodeURIComponent(i.hook)}&f=${i.formatId}` }, 'Log it as a post'),
            h('button', { class: 'btn ghost sm', type: 'button', onclick: () => copyText(i.hook) }, 'Copy'),
            h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { store.update('formats.ideas', (l) => l.filter((x) => x.id !== i.id), []); drawBank(); } }, 'Delete'),
          ),
        ),
      );
    });
  };

  drawLeft(); drawRight(); drawBank();
  return h(
    'div',
    { class: 'stack', style: { '--gap': '24px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Idea Lab' }),
    pageHead({ eyebrow: 'Make the post', title: 'Idea Lab', lede: 'Choose a format, seed it with something real from your Blueprint, and get a hook in your own words. Done is more useful than another draft in your camera roll.' }),
    h('div', { class: 'lab' }, left, right),
    h('div', { class: 'card soft' }, h('h3', null, 'Your idea bank'), h('div', { style: { marginTop: '12px' } }, bank)),
  );
}
