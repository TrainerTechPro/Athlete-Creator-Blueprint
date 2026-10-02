// Week 4: plan an Instagram Stories sequence. Connect, teach, validate or sell.
import { h, clear, uid, debounce, autoGrow, toast, copyText, confirmDialog } from '../../lib/dom.js';
import * as store from '../../lib/store.js';
import { STORY_TEMPLATES, STICKERS } from '../../content/sales.js';
import { MISSION_BY_ID } from '../../content/missions.js';
import { toolShell } from '../../ui/toolShell.js';
import { checklistLine } from '../../ui/components.js';

const wc = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length;

function checksFor(seq) {
  const filled = seq.frames.filter((f) => (f.text || '').trim());
  const out = [
    { ok: filled.length >= 5, text: `At least 5 frames written (${filled.length}).` },
    { ok: seq.frames.length <= 10, text: 'No more than 10 frames. Shorter beats longer.' },
    { ok: !!seq.frames[0] && wc(seq.frames[0].text) > 0 && wc(seq.frames[0].text) <= 14, text: 'Frame 1 is a hook of 14 words or fewer.' },
    { ok: seq.frames.every((f) => wc(f.text) <= 30), text: 'Every frame is 30 words or fewer, so it is readable in 3 seconds.' },
    { ok: seq.frames.some((f) => f.sticker && f.sticker !== 'None'), text: 'At least one frame invites a reply (poll, question box, link).' },
  ];
  if (seq.templateId === 'sell') {
    const all = seq.frames.map((f) => f.text || '').join(' ');
    out.push({ ok: /\$|free|price|cost|£|€/i.test(all), text: 'The price (or "free") is stated.' });
    out.push({ ok: seq.frames.some((f) => /link|countdown/i.test(f.sticker || '')) || /\bDM\b/i.test(all), text: 'There is one clear way to take the next step.' });
  }
  return out;
}

export function render() {
  const host = h('div', { class: 'stack', style: { '--gap': '18px' } });
  let openId = null;

  const seqs = () => store.get('stories', []);
  const saveAll = (list) => store.set('stories', list);

  const draw = () => {
    clear(host);
    if (openId) {
      const seq = seqs().find((s) => s.id === openId);
      if (seq) return host.append(editor(seq));
      openId = null;
    }
    host.append(
      h('div', { class: 'grid c2' }, STORY_TEMPLATES.map((t) =>
        h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'tag' }, `${t.frames.length} frames`), h('span', { class: 'tag line' }, MISSION_BY_ID[t.goal].name)), h('h3', { style: { marginTop: '8px' } }, t.name), h('ol', { class: 'steps' }, t.frames.map((f) => h('li', null, h('span', null, h('b', null, f.purpose), ': ', f.prompt)))),
          h('div', { style: { marginTop: '12px' } }, h('button', { class: 'btn', type: 'button', onclick: () => {
            const seq = { id: uid(), templateId: t.id, name: t.name, frames: t.frames.map((f) => ({ ...f, text: '' })), posted: false };
            saveAll([...seqs(), seq]);
            openId = seq.id;
            draw();
          } }, 'Plan this sequence')))),
      ),
      h('h2', null, 'Your sequences'),
      !seqs().length && h('div', { class: 'empty' }, 'Pick a template above to plan your first sequence.'),
      [...seqs()].reverse().map((s) => {
        const c = checksFor(s);
        return h('div', { class: 'idea' }, h('div', { class: 'row between' }, h('div', null, h('b', null, s.name), h('div', { class: 'tiny muted' }, `${s.frames.filter((f) => (f.text || '').trim()).length}/${s.frames.length} frames written · ${c.filter((x) => x.ok).length}/${c.length} checks`)), h('div', { class: 'row' }, s.posted && h('span', { class: 'tag ok' }, 'Posted'), h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { openId = s.id; draw(); } }, 'Open'))));
      }),
    );
  };

  function editor(seq) {
    const update = (patch) => saveAll(seqs().map((s) => (s.id === seq.id ? Object.assign(seq, patch) : s)));
    const checks = h('div', { class: 'checks' });
    const drawChecks = () => { clear(checks); checksFor(seq).forEach((c) => checks.append(checklistLine(c.ok, c.text))); };
    const frameHost = h('div', { class: 'stack', style: { '--gap': '12px' } });
    const drawFrames = () => {
      clear(frameHost);
      seq.frames.forEach((f, i) => {
        const ta = h('textarea', { rows: 2, placeholder: f.prompt, 'aria-label': `Frame ${i + 1} text` });
        ta.value = f.text || '';
        autoGrow(ta);
        const count = h('span', { class: 'tiny mono muted' });
        const upd = () => { count.textContent = `${wc(ta.value)} words`; };
        upd();
        const save = debounce(() => { f.text = ta.value; update({}); drawChecks(); }, 250);
        ta.addEventListener('input', () => { upd(); save(); });
        const sel = h('select', { 'aria-label': `Frame ${i + 1} sticker`, style: { width: 'auto', minHeight: '36px' } }, STICKERS.concat(f.sticker && !STICKERS.includes(f.sticker) ? [f.sticker] : []).map((s) => h('option', { value: s }, s)));
        sel.value = f.sticker || 'None';
        sel.addEventListener('change', () => { f.sticker = sel.value; update({}); drawChecks(); });
        frameHost.append(
          h('div', { class: 'card', style: { padding: '14px' } },
            h('div', { class: 'row top' }, h('div', { class: 'jersey', style: { width: '40px', height: '40px', fontSize: '1.3rem' } }, String(i + 1)),
              h('div', { class: 'grow' }, h('div', { class: 'row between' }, h('b', null, f.purpose), seq.frames.length > 3 && h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': `Remove frame ${i + 1}`, onclick: () => { seq.frames.splice(i, 1); update({}); drawFrames(); drawChecks(); } }, 'Remove')), h('p', { class: 'help' }, f.prompt), ta, h('div', { class: 'row between', style: { marginTop: '8px' } }, count, h('label', { class: 'row tiny' }, 'Sticker', sel))))),
        );
      });
      if (seq.frames.length < 10) frameHost.append(h('div', null, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { seq.frames.push({ purpose: 'Extra', prompt: 'One more beat', sticker: 'None', text: '' }); update({}); drawFrames(); } }, '+ Add a frame')));
    };
    drawFrames(); drawChecks();

    const script = () => seq.frames.map((f, i) => `Frame ${i + 1} (${f.purpose})${f.sticker && f.sticker !== 'None' ? ` [${f.sticker}]` : ''}\n${f.text || ''}`).join('\n\n');
    const nameIn = h('input', { type: 'text', value: seq.name, 'aria-label': 'Sequence name' });
    nameIn.addEventListener('input', debounce(() => update({ name: nameIn.value }), 250));
    const posted = h('input', { type: 'checkbox', id: 'seq-posted', checked: !!seq.posted });
    posted.addEventListener('change', () => { update({ posted: posted.checked }); if (posted.checked) toast('Nice. Now read every reply.'); });

    return h('div', { class: 'stack', style: { '--gap': '16px' } },
      h('div', { class: 'row between' }, h('button', { class: 'btn secondary', type: 'button', onclick: () => { openId = null; draw(); } }, '← All sequences'), h('button', { class: 'btn danger sm', type: 'button', onclick: async () => { if (await confirmDialog('Delete this sequence?', 'Delete')) { saveAll(seqs().filter((s) => s.id !== seq.id)); openId = null; draw(); } } }, 'Delete')),
      h('div', { class: 'field' }, h('label', { class: 'lbl' }, 'Name'), nameIn),
      h('div', { class: 'lab' },
        h('div', { class: 'stack', style: { '--gap': '12px' } }, frameHost),
        h('div', { class: 'stack', style: { '--gap': '14px', position: 'sticky', top: '12px' } },
          h('div', { class: 'card' }, h('b', null, 'Sequence checks'), h('div', { style: { marginTop: '10px' } }, checks)),
          h('div', { class: 'card' }, h('label', { class: 'choice' }, posted, h('span', null, h('b', null, 'I posted this'))), h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn', type: 'button', onclick: () => copyText(script()) }, 'Copy script'))),
        ),
      ),
    );
  }

  draw();
  return toolShell('stories', h('div', { class: 'stack', style: { '--gap': '18px' } },
    h('div', { class: 'callout' }, h('b', null, 'Stories are where trust deepens'), 'Your feed attracts. Your Stories are where people who already follow you see the real you, tell you what they need and take the next step. Keep each frame short and finish with one invitation.'),
    host,
  ));
}
