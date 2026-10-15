// Router for the Week 2 to 4 tools: #/tools/<id>
import { h } from '../lib/dom.js';
import { TOOL_META } from '../content/toolmeta.js';
import * as swipe from './tools/swipe.js';
import * as hooks from './tools/hooks.js';
import * as calendar from './tools/calendar.js';
import * as edit from './tools/edit.js';
import * as discovery from './tools/discovery.js';
import * as offer from './tools/offer.js';
import * as missions from './tools/missions.js';
import * as analytics from './tools/analytics.js';
import * as leads from './tools/leads.js';
import * as monetize from './tools/monetize.js';
import * as stories from './tools/stories.js';
import * as pitch from './tools/pitch.js';
import * as roadmap from './tools/roadmap.js';
import * as strategy from './tools/strategy.js';

const TOOLS = { swipe, hooks, calendar, edit, discovery, offer, missions, analytics, leads, monetize, stories, pitch, roadmap, strategy };

export function render(route) {
  const id = route.parts[1];
  if (!TOOLS[id] || !TOOL_META[id]) {
    return h('div', { class: 'card' }, h('h2', null, 'Tool not found'), h('a', { class: 'btn', href: '#/' }, 'Go home'));
  }
  return TOOLS[id].render(route);
}
