// Hash router: #/blueprint/say?x=1  ->  { parts: ['blueprint','say'], query: {x:'1'} }

export function parseRoute() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  return { path: '/' + parts.join('/'), parts, query };
}

export function go(path) {
  if (location.hash === '#' + path) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = path;
}

export function onRoute(fn) {
  window.addEventListener('hashchange', () => fn(parseRoute()));
  fn(parseRoute());
}
