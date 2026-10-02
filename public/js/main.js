import { h, clear } from './lib/dom.js';
import * as store from './lib/store.js';
import { onRoute, go } from './lib/router.js';
import { CONFIG } from './config.js';
import { progress } from './progress.js';
import { aiStatus } from './ai.js';
import { bar } from './ui/components.js';

import * as home from './views/home.js';
import * as welcome from './views/welcome.js';
import * as launch from './views/launch.js';
import * as blueprint from './views/blueprint.js';
import * as formats from './views/formats.js';
import * as lab from './views/lab.js';
import * as challenge from './views/challenge.js';
import * as plan from './views/plan.js';
import * as posts from './views/posts.js';
import * as doc from './views/doc.js';
import * as settings from './views/settings.js';

const ROUTES = {
  '': home,
  welcome,
  launch,
  blueprint,
  formats,
  lab,
  challenge,
  plan,
  posts,
  doc,
  settings,
};

const NAV = [
  { href: '#/', key: '', icon: '⌂', label: 'Home' },
  { sep: 'The journey' },
  { href: '#/launch', key: 'launch', icon: '0', label: 'Launch Pad', prog: 'launch' },
  { href: '#/blueprint', key: 'blueprint', icon: '1', label: 'Your Blueprint', prog: 'blueprint' },
  { href: '#/formats', key: 'formats', icon: '2', label: 'Formats', prog: 'formats' },
  { href: '#/challenge', key: 'challenge', icon: '3', label: 'Weekly Challenge', prog: 'challenge' },
  { href: '#/plan', key: 'plan', icon: '4', label: 'Week 1 Plan', prog: 'plan' },
  { sep: 'Tools' },
  { href: '#/lab', key: 'lab', icon: '✦', label: 'Idea Lab' },
  { href: '#/posts', key: 'posts', icon: '▶', label: 'Post Log' },
  { href: '#/doc', key: 'doc', icon: '▤', label: 'My Blueprint' },
  { href: '#/settings', key: 'settings', icon: '⚙', label: 'Settings' },
];

applyTheme();

const app = document.getElementById('app');
const sideNav = h('nav', { class: 'nav', 'aria-label': 'Main' });
const overall = h('div', { class: 'overall' });
const main = h('main', { class: 'main', id: 'main', tabindex: '-1' });

const side = h(
  'aside',
  { class: 'side', id: 'side' },
  h(
    'a',
    { class: 'brand', href: '#/' },
    h('span', { class: 'brand-mark' }, 'B'),
    h('span', { class: 'brand-name' }, CONFIG.brand.split(' ').slice(0, 2).join(' '), h('br'), CONFIG.brand.split(' ').slice(2).join(' ')),
  ),
  sideNav,
  h('div', { class: 'side-foot' }, overall),
);

const topbar = h(
  'div',
  { class: 'topbar' },
  h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-mark' }, 'B'), h('span', { class: 'brand-name' }, CONFIG.brand)),
  h('button', { class: 'btn secondary sm', type: 'button', 'aria-controls': 'side', 'aria-expanded': 'false', onclick: toggleNav }, 'Menu'),
);

function toggleNav(force) {
  const open = typeof force === 'boolean' ? force : !document.body.classList.contains('nav-open');
  document.body.classList.toggle('nav-open', open);
  topbar.querySelector('button').setAttribute('aria-expanded', String(open));
}
document.addEventListener('click', (e) => {
  if (document.body.classList.contains('nav-open') && !e.target.closest('#side') && !e.target.closest('.topbar')) toggleNav(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleNav(false);
});

app.append(h('div', { class: 'shell' }, side, h('div', null, topbar, main)));

function renderNav(activeKey) {
  clear(sideNav);
  const p = progress();
  for (const item of NAV) {
    if (item.sep) {
      sideNav.append(h('div', { class: 'sep' }, item.sep));
      continue;
    }
    const pct = item.prog ? p[item.prog].pct : null;
    sideNav.append(
      h(
        'a',
        { href: item.href, 'aria-current': item.key === activeKey ? 'page' : null, onclick: () => toggleNav(false) },
        h('span', { class: 'num' }, item.icon),
        h('span', { class: 'lbl' }, item.label),
        pct !== null && h('span', { class: 'pct' }, `${pct}%`),
      ),
    );
  }
  clear(overall);
  overall.append(
    h('div', { class: 'tiny', style: { fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' } }, 'Overall progress'),
    h('div', { class: 'big' }, `${p.overall}%`),
    bar(p.overall),
  );
}

let activeKey = '';
let navTimer;
store.subscribe(() => {
  clearTimeout(navTimer);
  navTimer = setTimeout(() => renderNav(activeKey), 350);
});

onRoute((route) => {
  const key = route.parts[0] || '';
  activeKey = key;
  const view = ROUTES[key];
  const needsWelcome = !store.get('profile.createdAt') && key !== 'welcome' && key !== 'settings';
  if (needsWelcome) {
    go('/welcome');
    return;
  }
  document.body.classList.toggle('welcome-mode', key === 'welcome');
  side.classList.toggle('hide', key === 'welcome');
  topbar.classList.toggle('hide', key === 'welcome');
  document.querySelector('.shell').style.gridTemplateColumns = key === 'welcome' ? '1fr' : '';
  renderNav(key);
  clear(main);
  try {
    main.append(view ? view.render(route) : notFound());
  } catch (err) {
    console.error(err);
    main.append(h('div', { class: 'card warnbox' }, h('h3', null, 'Something went wrong'), h('p', null, 'This screen hit an error. Your answers are safe. Try going Home.'), h('a', { class: 'btn', href: '#/' }, 'Go home')));
  }
  main.classList.remove('reveal');
  void main.offsetWidth;
  main.classList.add('reveal');
  window.scrollTo(0, 0);
  document.getElementById('page-title')?.focus({ preventScroll: true });
});

function notFound() {
  return h('div', { class: 'card' }, h('h2', null, 'Page not found'), h('p', null, 'That page does not exist.'), h('a', { class: 'btn', href: '#/' }, 'Go home'));
}

function applyTheme() {
  const t = store.get('ui.theme', 'auto');
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
window.addEventListener('acb:theme', applyTheme);

aiStatus();
