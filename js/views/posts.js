// Post log + sound bank. Every post is a rep: log it, notice what happened, take one lesson into the next.
import { h, clear, uid, toast, confirmDialog, todayISO, fmtDate, autoGrow, safeUrl } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { FORMATS, FORMAT_BY_ID, displayName } from '../content/formats.js';
import { PLATFORMS } from '../content/archetypes.js';
import { MISSIONS, MISSION_BY_ID } from '../content/missions.js';
import { postsThisWeek, progress } from '../progress.js';
import { crumbs, pageHead, bar, emptyState } from '../ui/components.js';

const platformLabel = (id) => PLATFORMS.find((p) => p.id === id)?.label || id;
const num = (v) => (v === '' || v === undefined || v === null ? null : Number(v));

export function render(route) {
  const sub = route.parts[1];
  return h(
    'div',
    { class: 'stack', style: { '--gap': '22px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Post Log' }),
    pageHead({ eyebrow: 'Learn, post, feedback, apply', title: 'Post Log', lede: 'Posting is where learning becomes progress. Log each post, note what happened, and take one lesson into the next one. Not because quantity beats quality, but because every post is another rep.' }),
    h('div', { class: 'tabs', role: 'tablist' },
      h('a', { class: 'tab', role: 'tab', href: '#/posts', 'aria-current': sub !== 'sounds' ? 'page' : null }, 'Posts'),
      h('a', { class: 'tab', role: 'tab', href: '#/posts/sounds', 'aria-current': sub === 'sounds' ? 'page' : null }, 'Sound bank')),
    sub === 'sounds' ? sounds() : log(route),
  );
}

function log(route) {
  const host = h('div', { class: 'stack', style: { '--gap': '18px' } });
  let editing = route.query.edit && store.get('posts', []).some((x) => x.id === route.query.edit) ? route.query.edit : route.query.hook || route.query.new ? 'new' : null;
  const prefill = { hook: route.query.hook || '', formatId: route.query.f || '' };

  const draw = () => {
    clear(host);
    const p = progress();
    const posts = store.get('posts', []);
    host.append(
      h('div', { class: 'mini' },
        stat(`${p.weekPosts}/${p.postGoal}`, 'This week'),
        stat(String(posts.length), 'All time'),
        stat(String(posts.filter((x) => x.best).length), 'Resonated'),
        stat(String(posts.filter((x) => x.learned?.trim()).length), 'Lessons noted'),
      ),
      bar(p.posts.pct),
    );
    host.append(editing ? form(editing === 'new' ? null : posts.find((x) => x.id === editing)) : h('div', null, h('button', { class: 'btn lg', type: 'button', onclick: () => { editing = 'new'; draw(); } }, '+ Log a post')));

    if (!posts.length) host.append(emptyState('No posts yet', 'Your first post does not need to be good. It needs to exist. Log it here so you and your coach can see where you are starting.'));
    posts.forEach((x) => host.append(card(x)));
    if (posts.length >= 2) host.append(insights(posts));
  };

  const stat = (n, l) => h('div', { class: 'stat' }, h('div', { class: 'n' }, n), h('div', { class: 'l' }, l));

  const card = (x) => {
    const f = FORMAT_BY_ID[x.formatId];
    const m = x.metrics || {};
    const metricBits = [['views', 'views'], ['avgWatch', '% watched'], ['likes', 'likes'], ['comments', 'comments'], ['saves', 'saves'], ['shares', 'shares'], ['follows', 'follows'], ['profileVisits', 'profile visits'], ['clicks', 'clicks']].filter(([k]) => num(m[k]) !== null).map(([k, l]) => `${Number(m[k]).toLocaleString()} ${l}`);
    return h('article', { class: `post${x.best ? ' best' : ''}` },
      h('div', { class: 'jersey', style: { width: '44px', height: '44px', fontSize: '1rem' } }, fmtDate(x.date) || '—'),
      h('div', null,
        h('div', { class: 'hook' }, x.hook || 'Untitled post'),
        h('div', { class: 'meta' }, h('span', { class: 'tag' }, platformLabel(x.platform)), f && h('span', { class: 'tag line' }, displayName(f)), x.pillar && h('span', { class: 'tag line' }, x.pillar), MISSION_BY_ID[x.mission] && h('span', { class: 'tag line' }, MISSION_BY_ID[x.mission].name), x.best && h('span', { class: 'tag volt' }, 'Resonated ★'), ...metricBits.map((b) => h('span', { class: 'tag line' }, b))),
        x.learned && h('p', { style: { margin: '8px 0 0' } }, h('b', null, 'Lesson: '), x.learned),
        safeUrl(x.link) && h('a', { class: 'link tiny', href: safeUrl(x.link), target: '_blank', rel: 'noopener noreferrer' }, 'Open post'),
      ),
      h('div', { class: 'row' },
        h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { editing = x.id; draw(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }, 'Edit'),
        h('button', { class: 'btn ghost sm', type: 'button', onclick: async () => { if (await confirmDialog('Delete this post from your log?', 'Delete')) { store.update('posts', (l) => l.filter((y) => y.id !== x.id), []); draw(); } } }, 'Delete')),
    );
  };

  const form = (existing) => {
    const d = existing ? structuredClone(existing) : { id: uid(), date: todayISO(), platform: store.get('profile.platforms', [])[0] || 'instagram', formatId: prefill.formatId, hook: prefill.hook, pillar: '', link: '', metrics: {}, learned: '', best: false };
    d.metrics ||= {};
    const inp = (id, label, type = 'text', ph = '') => {
      const el = h('input', { id: `pf-${id}`, type, value: d[id] ?? '', placeholder: ph, autocomplete: 'off' });
      el.addEventListener('input', () => (d[id] = el.value));
      return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `pf-${id}` }, label), el);
    };
    const met = (k, label) => {
      const el = h('input', { id: `pm-${k}`, type: 'number', min: 0, inputmode: 'numeric', value: d.metrics[k] ?? '' });
      el.addEventListener('input', () => (d.metrics[k] = el.value));
      return h('div', { class: 'field' }, h('label', { class: 'lbl', for: `pm-${k}` }, label), el);
    };
    const plat = h('select', { id: 'pf-platform' }, PLATFORMS.map((p) => h('option', { value: p.id }, p.label)));
    plat.value = d.platform;
    plat.addEventListener('change', () => (d.platform = plat.value));
    const fsel = h('select', { id: 'pf-format' }, h('option', { value: '' }, 'Choose a format…'), FORMATS.map((f) => h('option', { value: f.id }, displayName(f))));
    fsel.value = d.formatId || '';
    fsel.addEventListener('change', () => (d.formatId = fsel.value));
    const pillars = Object.entries(store.get('blueprint.pillars', {})).filter(([, v]) => (v || '').trim());
    const psel = h('select', { id: 'pf-pillar' }, h('option', { value: '' }, 'Which pillar?'), pillars.map(([k]) => h('option', { value: k }, k[0].toUpperCase() + k.slice(1))));
    psel.value = d.pillar || '';
    psel.addEventListener('change', () => (d.pillar = psel.value));
    const msel = h('select', { id: 'pf-mission' }, h('option', { value: '' }, 'What job did it do?'), MISSIONS.map((m) => h('option', { value: m.id }, m.name)));
    msel.value = d.mission || '';
    msel.addEventListener('change', () => (d.mission = msel.value));
    const learned = h('textarea', { id: 'pf-learned', rows: 3, placeholder: 'What happened? What would you do differently? One lesson to take into the next post.' });
    learned.value = d.learned || '';
    autoGrow(learned);
    learned.addEventListener('input', () => (d.learned = learned.value));
    const best = h('input', { type: 'checkbox', id: 'pf-best', checked: !!d.best });
    best.addEventListener('change', () => (d.best = best.checked));

    return h('form', { class: 'card pop stack', style: { '--gap': '14px' }, onsubmit: (e) => {
      e.preventDefault();
      if (!(d.hook || '').trim()) return toast('Add the hook or a short description', 'warn');
      store.update('posts', (list) => (existing ? list.map((x) => (x.id === d.id ? d : x)) : [d, ...list]), []);
      editing = null;
      toast(existing ? 'Post updated' : 'Post logged. That is a rep.');
      draw();
    } },
      h('h3', null, existing ? 'Edit post' : 'Log a post'),
      h('div', { class: 'fields' }, inp('date', 'Date', 'date'), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-platform' }, 'Platform'), plat), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-format' }, 'Format'), fsel), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-pillar' }, 'Pillar'), psel), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-mission' }, 'Mission'), msel)),
      inp('hook', 'Hook or short description', 'text', 'The first line or on-screen text'),
      inp('link', 'Link (optional)', 'url', 'https://…'),
      h('details', { open: !!(d.metrics && Object.values(d.metrics).some((v) => v !== '' && v !== undefined)) }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'Add numbers (optional, check back after a day or two)'), h('div', { class: 'fields', style: { marginTop: '10px' } }, met('views', 'Views'), met('avgWatch', 'Avg % watched'), met('likes', 'Likes'), met('comments', 'Comments'), met('saves', 'Saves'), met('shares', 'Shares / sends'), met('follows', 'Follows gained'), met('profileVisits', 'Profile visits'), met('clicks', 'Link clicks / DMs'))),
      h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'pf-learned' }, 'Feedback → what I learned'), learned),
      h('label', { class: 'choice' }, best, h('span', null, h('b', null, 'This one resonated'), h('small', null, 'Flag the posts to learn from and repeat.'))),
      h('div', { class: 'row' }, h('button', { class: 'btn lg', type: 'submit' }, existing ? 'Save changes' : 'Log post'), h('button', { class: 'btn ghost', type: 'button', onclick: () => { editing = null; draw(); } }, 'Cancel')),
    );
  };

  const insights = (posts) => {
    const by = (key) => {
      const map = {};
      posts.forEach((p) => {
        const k = p[key];
        if (!k) return;
        const v = num(p.metrics?.views);
        (map[k] ||= { n: 0, views: 0, withViews: 0, best: 0 });
        map[k].n++;
        if (v !== null) { map[k].views += v; map[k].withViews++; }
        if (p.best) map[k].best++;
      });
      return Object.entries(map).sort((a, b) => b[1].best - a[1].best || b[1].n - a[1].n);
    };
    const fm = by('formatId');
    const pl = by('pillar');
    const rowFor = ([k, v], label) => h('div', { class: 'row between', style: { padding: '8px 0', borderBottom: '1.5px solid var(--line)' } }, h('b', null, label(k)), h('span', { class: 'tiny muted' }, `${v.n} post${v.n > 1 ? 's' : ''}${v.best ? ` · ${v.best} resonated` : ''}${v.withViews ? ` · avg ${Math.round(v.views / v.withViews).toLocaleString()} views` : ''}`));
    return h('div', { class: 'card ink' }, h('span', { class: 'eyebrow' }, 'Run the loop'), h('h3', null, 'What your posts are telling you'),
      h('div', { class: 'grid c2', style: { marginTop: '12px', color: 'var(--ink)' } },
        h('div', { class: 'card' }, h('h4', null, 'By format'), fm.length ? fm.map((e) => rowFor(e, (k) => (FORMAT_BY_ID[k] ? displayName(FORMAT_BY_ID[k]) : k))) : h('p', { class: 'muted tiny' }, 'Tag a format on your posts to see patterns.')),
        h('div', { class: 'card' }, h('h4', null, 'By pillar'), pl.length ? pl.map((e) => rowFor(e, (k) => k[0].toUpperCase() + k.slice(1))) : h('p', { class: 'muted tiny' }, 'Tag a pillar on your posts to see patterns.'))),
      h('p', { class: 'muted', style: { marginTop: '12px' } }, 'Pick one pattern you notice and apply it to your next post. That is the loop.'));
  };

  draw();
  return host;
}

// ---------------------------------------------------------------- sound bank
const MOODS = ['Defiant', 'Playful', 'Nostalgic', 'Uplifting', 'Reflective', 'Cinematic', 'Calm', 'Emotional'];

function sounds() {
  const host = h('div', { class: 'stack', style: { '--gap': '16px' } });
  const draft = { name: '', link: '', kind: 'non-talking', moods: [] };
  const draw = () => {
    clear(host);
    const list = store.get('sounds', []);
    const nameIn = h('input', { type: 'text', id: 's-name', placeholder: 'Song or audio name', value: draft.name });
    nameIn.addEventListener('input', () => (draft.name = nameIn.value));
    const linkIn = h('input', { type: 'url', id: 's-link', placeholder: 'Link to the audio (optional)', value: draft.link });
    linkIn.addEventListener('input', () => (draft.link = linkIn.value));
    const kindSel = h('select', { id: 's-kind' }, [['non-talking', 'Works for non-talking videos'], ['talking', 'Works under talking videos']].map(([v, l]) => h('option', { value: v }, l)));
    kindSel.value = draft.kind;
    kindSel.addEventListener('change', () => (draft.kind = kindSel.value));
    const moods = h('div', { class: 'chips' }, MOODS.map((m) => { const b = h('button', { type: 'button', class: `chip${draft.moods.includes(m) ? ' on' : ''}`, 'aria-pressed': String(draft.moods.includes(m)) }, m); b.addEventListener('click', () => { draft.moods = draft.moods.includes(m) ? draft.moods.filter((x) => x !== m) : [...draft.moods, m]; b.classList.toggle('on'); b.setAttribute('aria-pressed', String(draft.moods.includes(m))); }); return b; }));
    host.append(
      h('p', { class: 'muted' }, 'Keep a short list of sounds with the emotion you want. Match the sound to the feeling, and the right one does half the work for you. Aim to refresh around ten each week.'),
      h('form', { class: 'card pop stack', style: { '--gap': '12px' }, onsubmit: (e) => { e.preventDefault(); if (!draft.name.trim()) return toast('Add a name', 'warn'); store.update('sounds', (l) => [{ id: uid(), ...draft }, ...l], []); Object.assign(draft, { name: '', link: '', moods: [] }); draw(); toast('Sound saved'); } },
        h('div', { class: 'fields' }, h('div', { class: 'field' }, h('label', { class: 'lbl', for: 's-name' }, 'Sound'), nameIn), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 's-link' }, 'Link'), linkIn)),
        h('div', { class: 'field' }, h('label', { class: 'lbl', for: 's-kind' }, 'Best for'), kindSel),
        h('div', null, h('div', { class: 'lbl' }, 'Mood'), moods),
        h('div', null, h('button', { class: 'btn', type: 'submit' }, 'Save sound'))),
    );
    if (!list.length) host.append(emptyState('Your sound bank is empty', 'Add sounds as you find them while scrolling.'));
    list.forEach((s) => host.append(h('div', { class: 'idea' }, h('div', { class: 'row between' }, h('div', null, h('b', null, s.name), h('div', { class: 'meta', style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' } }, h('span', { class: 'tag' }, s.kind === 'talking' ? 'Talking' : 'Non-talking'), (s.moods || []).map((m) => h('span', { class: 'tag line' }, m)))), h('div', { class: 'row' }, safeUrl(s.link) && h('a', { class: 'btn secondary sm', href: safeUrl(s.link), target: '_blank', rel: 'noopener noreferrer' }, 'Open'), h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { store.update('sounds', (l) => l.filter((x) => x.id !== s.id), []); draw(); } }, 'Delete'))))));
  };
  draw();
  return host;
}
