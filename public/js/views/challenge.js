// Weekly challenge: three guided builders. Publish at least one.
import { h, clear, uid, toast, copyText, debounce, autoGrow, todayISO } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { CHALLENGES, CHALLENGE_BY_ID, SPEAK_WPS } from '../content/challenge.js';
import { FORMAT_BY_ID } from '../content/formats.js';
import { archetypeById, PLATFORMS } from '../content/archetypes.js';
import { crumbs, pageHead, checklistLine, bar } from '../ui/components.js';

export function render(route) {
  const c = CHALLENGE_BY_ID[route.parts[1]];
  return c ? builder(c) : overview();
}

function overview() {
  const posted = store.get('challenge.posted', {});
  const drafts = store.get('challenge.drafts', {});
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Weekly Challenge' }),
    pageHead({ eyebrow: 'Put it all into practice', title: 'Your challenge this week', lede: 'Use your Blueprint to choose a topic or story, then pick ONE of three prompts and turn it into a reel or carousel. Publish at least one. Want more reps? Do two or all three.' }),
    h('div', { class: 'callout' }, h('b', null, 'Mindset'), 'Action is the win, not virality. This is not about the perfect post or the perfect result. It is a chance to push yourself, apply what you learned and get a real rep in.'),
    h('div', { class: 'ch-list' }, CHALLENGES.map((c) => {
      const isPosted = !!posted[c.id];
      const hasDraft = Object.keys(drafts[c.id] || {}).length > 0;
      return h('a', { class: 'j-card', href: `#/challenge/${c.id}` },
        h('div', { class: 'jersey' }, String(c.num)),
        h('div', null, h('div', { class: 'row' }, h('span', { class: 'tag' }, c.type), h('span', { class: 'tag line' }, c.time)), h('h3', { style: { marginTop: '6px' } }, c.title), h('p', null, c.pitch)),
        isPosted ? h('span', { class: 'tag ok' }, 'Posted ✓') : hasDraft ? h('span', { class: 'tag volt' }, 'In progress') : h('span', { class: 'tag line' }, 'Start'),
      );
    })),
    h('div', { class: 'row end' }, h('a', { class: 'btn secondary', href: '#/posts' }, 'Open post log')),
  );
}

function builder(c) {
  const arch = store.get('profile.archetype', 'college');
  const fmt = FORMAT_BY_ID[c.formatId];
  const draft = structuredClone(store.get(`challenge.drafts.${c.id}`, {}));
  if (!Array.isArray(draft.bullets)) draft.bullets = [];
  draft.pairs = Array.isArray(draft.pairs) ? draft.pairs.filter((p) => p && typeof p === 'object') : [];
  if (c.id === 'confession' && !draft.age) draft.age = '';
  const persist = debounce(() => store.set(`challenge.drafts.${c.id}`, draft), 250);
  const changed = () => { persist(); refresh(); };

  // ---- form
  const form = h('div', { class: 'stack', style: { '--gap': '18px' } });
  c.fields.forEach((f) => form.append(fieldEl(f, draft, changed)));

  // ---- side
  const phone = h('div');
  const checks = h('div', { class: 'checks' });
  const caption = h('div', { class: 'preview' });
  const status = h('div');
  const refresh = () => {
    clear(phone); clear(checks); clear(caption); clear(status);
    const hook = (c.hookFrom?.(draft) || '').trim();
    phone.append(h('div', { class: 'phone', role: 'img', 'aria-label': 'Phone preview of your on-screen hook' }, h('div', { class: 'safe' }), h('div', { class: 'txt' }, hook ? h('span', null, hook) : h('span', { style: { opacity: 0.4 } }, 'Your hook shows here')), h('small', null, 'Keep text inside the dashed area')));
    const results = c.check(draft);
    results.forEach((r) => checks.append(checklistLine(r.ok, r.text)));
    const done = results.filter((r) => r.ok).length;
    status.append(h('div', { class: 'row between' }, h('b', null, 'Ready to post?'), h('span', { class: `tag ${done === results.length ? 'ok' : 'volt'}` }, `${done}/${results.length}`)), bar(Math.round((done / results.length) * 100)));
    const text = c.caption(draft);
    caption.textContent = text || 'Your caption preview will appear as you fill in the blanks.';
    caption.style.opacity = text ? 1 : 0.55;
    caption.dataset.text = text;
  };
  refresh();

  // ---- posted panel
  const posted = store.get(`challenge.posted.${c.id}`);
  const dateIn = h('input', { type: 'date', id: 'p-date', value: posted?.date || todayISO() });
  const platIn = h('select', { id: 'p-plat' }, PLATFORMS.map((p) => h('option', { value: p.id }, p.label)));
  platIn.value = posted?.platform || store.get('profile.platforms', [])[0] || 'instagram';
  const linkIn = h('input', { type: 'url', id: 'p-link', placeholder: 'https://… (optional)', value: posted?.link || '' });
  const markBtn = h('button', { class: 'btn lg', type: 'button' }, posted ? 'Update posted details' : 'I posted it 🎉');
  markBtn.addEventListener('click', () => {
    const record = { date: dateIn.value, platform: platIn.value, link: linkIn.value.trim() };
    store.set(`challenge.posted.${c.id}`, record);
    store.set(`challenge.drafts.${c.id}`, draft);
    if (!posted) {
      store.update('posts', (list) => [{ id: uid(), date: record.date, platform: record.platform, formatId: c.formatId, hook: (c.hookFrom?.(draft) || c.title).trim(), link: record.link, challengeId: c.id, metrics: {}, learned: '' }, ...list], []);
      toast('Logged. Come back in a day to note what happened.');
    } else toast('Updated');
    go('/challenge');
  });

  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Weekly Challenge', href: '#/challenge' }, { label: c.title }),
    pageHead({ eyebrow: `Challenge option ${c.num} · ${c.type}`, title: c.title, lede: c.pitch }),
    h('div', { class: 'grid c2' },
      h('div', { class: 'card' }, h('h3', null, 'How to make it'), h('ol', { class: 'steps' }, c.steps.map((s) => h('li', null, s)))),
      h('div', { class: 'grid', style: { gap: '12px' } },
        h('div', { class: 'card do' }, h('h4', null, 'Do this'), h('ul', null, fmt.dos.slice(0, 3).map((d) => h('li', null, d)))),
        h('div', { class: 'card dont' }, h('h4', null, 'Do not do this'), h('ul', null, fmt.donts.slice(0, 3).map((d) => h('li', null, d)))),
      ),
    ),
    fmt.ex?.[arch] && h('div', { class: 'hookline' }, h('span', { class: 'tiny muted', style: { display: 'block' } }, `Hook idea for a ${archetypeById(arch).label.toLowerCase()}`), fmt.ex[arch]),
    h('div', { class: 'lab' },
      h('div', { class: 'card pop' }, h('h3', { style: { marginBottom: '14px' } }, 'Your worksheet'), form),
      h('div', { class: 'stack', style: { '--gap': '16px', position: 'sticky', top: '12px' } },
        h('div', { class: 'card' }, status, h('div', { style: { marginTop: '12px' } }, checks)),
        phone,
        h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', null, 'Caption preview'), h('button', { class: 'btn secondary sm', type: 'button', onclick: () => caption.dataset.text ? copyText(caption.dataset.text) : toast('Nothing to copy yet', 'warn') }, 'Copy')), h('div', { style: { marginTop: '10px' } }, caption)),
      ),
    ),
    h('div', { class: 'card volt pop' }, h('h3', null, 'Done? Log it.'), h('p', null, 'Done is more useful than another draft in your camera roll. Logging it unlocks your post tracker and counts toward your weekly goal.'),
      h('div', { class: 'fields' }, h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'p-date' }, 'Date posted'), dateIn), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'p-plat' }, 'Platform'), platIn), h('div', { class: 'field full' }, h('label', { class: 'lbl', for: 'p-link' }, 'Link'), linkIn)),
      h('div', { style: { marginTop: '14px' } }, markBtn)),
  );
}

function fieldEl(f, draft, changed) {
  const wrap = h('div', { class: 'field' });
  const label = h('label', { class: 'lbl', for: `f-${f.id}` }, f.label);
  if (f.type === 'text') {
    const el = h('input', { type: 'text', id: `f-${f.id}`, value: draft[f.id] || '', placeholder: f.placeholder || '', autocomplete: 'off' });
    el.addEventListener('input', () => { draft[f.id] = el.value; changed(); });
    return wrap.append(label, el), wrap;
  }
  if (f.type === 'longtext') {
    const el = h('textarea', { id: `f-${f.id}`, rows: f.rows || 5, placeholder: f.placeholder || '' });
    el.value = draft[f.id] || '';
    autoGrow(el);
    const note = h('div', { class: 'tiny muted', style: { marginTop: '4px' } });
    const upd = () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      note.textContent = f.id === 'script' ? `${words} words ≈ ${Math.round(words / SPEAK_WPS)} seconds out loud` : `${words} words`;
    };
    el.addEventListener('input', () => { draft[f.id] = el.value; upd(); changed(); });
    upd();
    return wrap.append(label, el, note), wrap;
  }
  if (f.type === 'select') {
    const el = h('select', { id: `f-${f.id}` }, h('option', { value: '' }, 'Choose…'), f.options.map((o) => h('option', { value: o }, o)));
    el.value = draft[f.id] || '';
    el.addEventListener('change', () => { draft[f.id] = el.value; changed(); });
    return wrap.append(label, el), wrap;
  }
  if (f.type === 'list') {
    const rows = h('div', { class: 'rows' });
    const draw = () => {
      clear(rows);
      if (!draft[f.id].length) draft[f.id] = Array.from({ length: f.min }, () => '');
      draft[f.id].forEach((val, i) => {
        const ta = h('textarea', { rows: 2, placeholder: f.placeholder, 'aria-label': `${f.label} ${i + 1}`, style: { minHeight: '64px' } });
        ta.value = val;
        autoGrow(ta);
        ta.addEventListener('input', () => { draft[f.id][i] = ta.value; changed(); });
        rows.append(h('div', { class: 'rowin' }, h('span', { class: 'n' }, String(i + 1)), ta, draft[f.id].length > f.min ? h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Remove ${i + 1}`, onclick: () => { draft[f.id].splice(i, 1); draw(); changed(); } }, '✕') : h('span')));
      });
      if (draft[f.id].length < f.max) rows.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { draft[f.id].push(''); draw(); } }, '+ Add')));
    };
    draw();
    return wrap.append(label, rows), wrap;
  }
  if (f.type === 'pairs') {
    const rows = h('div', { class: 'rows' });
    const draw = () => {
      clear(rows);
      if (!draft[f.id].length) draft[f.id] = Array.from({ length: f.min }, () => ({ label: '', expectAge: '', realAge: '' }));
      draft[f.id].forEach((p, i) => {
        const mk = (key, ph, aria, type = 'text') => {
          const el = h('input', { type, value: p[key] || '', placeholder: ph, 'aria-label': `Slide ${i + 1} ${aria}`, inputmode: type === 'number' ? 'numeric' : null });
          el.addEventListener('input', () => { p[key] = el.value; changed(); });
          return el;
        };
        rows.append(h('div', { class: 'pairrow' }, h('span', { class: 'n', style: { fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: '1.3rem', paddingBottom: '10px' } }, String(i + 1)), h('div', { class: 'lab-col' }, i === 0 && h('div', { class: 'tiny muted' }, 'Milestone'), mk('label', 'First car', 'milestone')), h('div', null, i === 0 && h('div', { class: 'tiny muted' }, 'Expected at'), mk('expectAge', '16', 'expected age', 'number')), h('div', null, i === 0 && h('div', { class: 'tiny muted' }, 'Actually at'), mk('realAge', '23', 'real age', 'number')), draft[f.id].length > f.min ? h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Remove slide ${i + 1}`, onclick: () => { draft[f.id].splice(i, 1); draw(); changed(); } }, '✕') : h('span')));
      });
      if (draft[f.id].length < f.max) rows.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { draft[f.id].push({ label: '', expectAge: '', realAge: '' }); draw(); } }, '+ Add slide')));
    };
    draw();
    return wrap.append(label, rows), wrap;
  }
  return wrap;
}
