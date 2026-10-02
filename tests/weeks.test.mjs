import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreHook, HOOK_TYPES } from '../public/js/content/hooks.js';
import { rates, diagnose, median } from '../public/js/content/analytics.js';
import { mixFromPosts, mixAdvice, RECOMMENDED_MIX } from '../public/js/content/missions.js';
import { offerChecks, pitchChecks, assemblePitch, readinessTier, ROADMAP_PATHS } from '../public/js/content/sales.js';
import { WEEKS } from '../public/js/content/weeks.js';

test('a strong hook scores high and a filler hook scores low', () => {
  const strong = scoreHook("I'm 20 and I'm embarrassed to admit I still call my mom after every loss");
  const filler = scoreHook('Hey guys so today in this video I want to talk about some stuff about training and recovery and sleep');
  assert.ok(strong.score >= 60, `strong ${strong.score}`);
  assert.ok(filler.score <= 40, `filler ${filler.score}`);
  assert.ok(strong.types.includes('confession'));
  assert.ok(filler.tips.length >= 3);
});

test('hook type detection', () => {
  assert.ok(scoreHook('3 things I wish I knew before my first college game').types.includes('number'));
  assert.ok(scoreHook('Stop emailing 100 coaches the same message if you want an offer').types.includes('stop'));
  assert.deepEqual(scoreHook('').checks, []);
  assert.ok(HOOK_TYPES.every((t) => t.example && t.formula));
});

test('rates handle missing and zero data', () => {
  assert.equal(rates({ metrics: {} }), null);
  assert.equal(rates({ metrics: { views: '0' } }), null);
  const r = rates({ metrics: { views: '1000', likes: '50', saves: '20', shares: '30', follows: '10' } });
  assert.equal(r.saveRate, 0.02);
  assert.equal(r.followRate, 0.01);
  assert.equal(r.engagement, 0.1);
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
});

const mk = (views, extra = {}, rest = {}) => ({ id: String(Math.random()), date: new Date().toISOString().slice(0, 10), metrics: { views: String(views), ...extra }, ...rest });

test('diagnose flags breakouts and under-performers relative to own median, only with enough data', () => {
  assert.equal(diagnose([mk(100)]).enough, false);
  assert.equal(diagnose([mk(100), mk(120)]).perPost.every((p) => p.flags.length === 0), true);
  const posts = [mk(100), mk(110), mk(90), mk(500), mk(30)];
  const d = diagnose(posts);
  assert.equal(d.medianViews, 100);
  const byViews = Object.fromEntries(d.perPost.map((p) => [p.rates.views, p.flags.map((f) => f.id)]));
  assert.ok(byViews[500].includes('breakout'));
  assert.ok(byViews[30].includes('under'));
});

test('diagnose spots reach without follows and strong shares', () => {
  const base = (v, follows, shares) => mk(v, { follows: String(follows), shares: String(shares) });
  const posts = [base(1000, 20, 10), base(1100, 22, 11), base(900, 18, 9), base(2000, 2, 80)];
  const d = diagnose(posts);
  const big = d.perPost.find((p) => p.rates.views === 2000);
  const ids = big.flags.map((f) => f.id);
  assert.ok(ids.includes('noFollow'), ids.join());
  assert.ok(ids.includes('shares'), ids.join());
});

test('mission mix counts only recent tagged posts and gives advice', () => {
  const today = new Date().toISOString().slice(0, 10);
  const old = new Date(Date.now() - 40 * 86400000).toISOString().slice(0, 10);
  const posts = [
    { date: today, mission: 'attract' }, { date: today, mission: 'attract' }, { date: today, mission: 'attract' },
    { date: today, mission: 'attract' }, { date: today, mission: 'nurture' }, { date: old, mission: 'convert' }, { date: today },
  ];
  const mix = mixFromPosts(posts, 14);
  assert.equal(mix.total, 6);
  assert.equal(mix.tagged, 5);
  assert.equal(mix.counts.attract, 4);
  assert.ok(mixAdvice(mix).some((a) => /not tagged/.test(a)));
  assert.ok(mixAdvice(mix).some((a) => /positioning|convert|asked/i.test(a)));
  assert.equal(Object.values(RECOMMENDED_MIX).reduce((a, b) => a + b, 0), 100);
});

test('offer, pitch and readiness helpers', () => {
  assert.ok(offerChecks({}).every((c) => !c.ok));
  const good = offerChecks({ who: 'high school juniors chasing recruitment', problem: 'no replies from coaches', promise: 'Get replies within 30 days', inside: 'five templates', proof: 'I got six offers', price: '$29' });
  assert.ok(good.every((c) => c.ok), JSON.stringify(good));
  const pitch = { struggle: 'You email coaches and nobody replies, and you start to doubt yourself.', move: 'I rebuilt my outreach from scratch and this guide gives you the exact system.', win: 'You get replies, calls and a shortlist of programs.', offer: 'The Reply Guide: five templates', forwho: 'For juniors and seniors chasing offers', price: '$29', cta: 'DM me GUIDE today' };
  assert.ok(pitchChecks(pitch).every((c) => c.ok), JSON.stringify(pitchChecks(pitch)));
  assert.match(assemblePitch({ ...pitch, disclosure: 'Ad: sponsored' }), /^Ad: sponsored/);
  assert.equal(pitchChecks({ ...pitch, cta: 'DM me and book a call or buy now and join' }).at(-1).ok, false);
  assert.equal(readinessTier(7, 8).id, 'go');
  assert.equal(readinessTier(4, 8).id, 'close');
  assert.equal(readinessTier(1, 8).id, 'build');
});

test('weeks 2 to 4 are well formed with unique task and goal ids', () => {
  const taskIds = new Set();
  for (const n of [2, 3, 4]) {
    const w = WEEKS[n];
    assert.equal(w.days.length, 7);
    assert.ok(w.goals.length >= 5);
    w.days.forEach((d) => d.tasks.forEach((t) => { assert.ok(!taskIds.has(t.id), `dup ${t.id}`); taskIds.add(t.id); }));
  }
  for (const p of ROADMAP_PATHS) {
    assert.equal(p.weeks.length, 4);
    p.weeks.forEach((w) => assert.equal(w.actions.length, 3));
  }
});
