import { h, clear, toast, download, confirmDialog } from '../lib/dom.js';
import * as store from '../lib/store.js';
import { go } from '../lib/router.js';
import { CONFIG } from '../config.js';
import { aiStatus, askAI } from '../ai.js';
import { crumbs, pageHead } from '../ui/components.js';
import { profileForm } from './welcome.js';

export function render() {
  const aiBox = h('div', { class: 'stack', style: { '--gap': '10px' } }, h('p', { class: 'muted' }, 'Checking…'));
  const drawAI = async () => {
    const s = await aiStatus(true);
    clear(aiBox);
    if (!s.available) {
      aiBox.append(h('p', null, h('span', { class: 'tag' }, 'Built-in coach'), ' The AI coach is not connected on this server, so the app uses its built-in coach. Everything still works.'), h('p', { class: 'muted tiny' }, 'To switch on the live AI coach, the app owner sets ANTHROPIC_API_KEY on the server. See the README.'));
      return;
    }
    aiBox.append(h('p', null, h('span', { class: 'tag ok' }, 'Connected'), ' The live AI coach is available. You will see an “Ask the AI coach” button on questions.'));
    if (s.needsCode) {
      const input = h('input', { type: 'password', id: 'ai-code', value: store.get('ai.code', ''), placeholder: 'Access code from your coach', autocomplete: 'off' });
      input.addEventListener('input', () => store.set('ai.code', input.value));
      aiBox.append(h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'ai-code' }, 'Access code'), input));
    }
  };
  drawAI();

  const importIn = h('input', { type: 'file', accept: 'application/json', class: 'hide', id: 'import-file' });
  importIn.addEventListener('change', async () => {
    const file = importIn.files?.[0];
    if (!file) return;
    try {
      store.importJSON(await file.text());
      toast('Backup restored');
      go('/');
    } catch (e) {
      toast(e.message || 'Could not read that file', 'warn');
    }
  });

  const themeSel = h('select', { id: 'theme' }, [['auto', 'Match my device'], ['light', 'Light'], ['dark', 'Dark (night game)']].map(([v, l]) => h('option', { value: v }, l)));
  themeSel.value = store.get('ui.theme', 'auto');
  themeSel.addEventListener('change', () => { store.set('ui.theme', themeSel.value); window.dispatchEvent(new Event('acb:theme')); });

  return h(
    'div',
    { class: 'stack', style: { '--gap': '24px' } },
    crumbs({ label: 'Home', href: '#/' }, { label: 'Settings' }),
    pageHead({ eyebrow: 'Make it yours', title: 'Settings' }),
    store.isMemoryOnly() && h('div', { class: 'card warnbox' }, h('b', null, 'Saving is blocked in this browser. '), 'Your answers will be lost when you close the tab. Turn off private browsing or allow site storage, and use Backup below.'),
    h('div', { class: 'card' }, h('h3', null, 'Your profile'), h('p', { class: 'muted' }, 'Changes update the examples and goals you see.'), profileForm({ submitLabel: 'Save profile', onSaved: () => toast('Profile saved') })),
    h('div', { class: 'card' }, h('h3', null, 'Appearance'), h('div', { class: 'field' }, h('label', { class: 'lbl', for: 'theme' }, 'Theme'), themeSel)),
    h('div', { class: 'card' }, h('h3', null, 'AI coach'), aiBox),
    h('div', { class: 'card' }, h('h3', null, 'Your data'), h('p', { class: 'muted' }, 'Everything you write is saved in this browser on this device. It is not uploaded anywhere, except the text of a question when you tap an AI coach button. Export a backup so you can move devices or keep a copy for your coach.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => download('blueprint-backup.json', store.exportJSON(), 'application/json') }, 'Download backup'),
        h('label', { class: 'btn secondary', for: 'import-file', tabindex: '0', role: 'button' }, 'Restore backup'), importIn,
        h('button', { class: 'btn danger', type: 'button', onclick: async () => { if (await confirmDialog('Erase everything in this app on this device? Download a backup first if you want to keep it.', 'Erase all')) { store.reset(); go('/welcome'); } } }, 'Erase everything'))),
    h('p', { class: 'muted tiny' }, `${CONFIG.brand}. Frameworks and examples are original and written for athletes.`),
  );
}
