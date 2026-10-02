import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, pickFollowups, wordCount } from '../public/js/coach.js';

test('empty text is "not started"', () => {
  const r = analyze('', { kind: 'belief' });
  assert.equal(r.level.id, 'empty');
  assert.equal(r.score, 0);
  assert.deepEqual(pickFollowups(r), []);
});

test('vague generic answer scores low and asks about it', () => {
  const r = analyze('I want to inspire people and motivate others to be the best.', { kind: 'belief' });
  assert.ok(r.score < 40, `score was ${r.score}`);
  assert.ok(r.issues.includes('generic'));
  const f = pickFollowups(r, {}, [], 3);
  assert.ok(f.length >= 1);
  assert.ok(f.some((x) => x.code === 'generic' || x.code === 'short'));
});

test('a specific belief with contrast scores much higher than the vague one', () => {
  const vague = analyze('I want to inspire people to work hard and never give up.', { kind: 'belief' });
  const strong = analyze(
    "I believe recovery is part of the work, not a break from it. At 19 I tore my hamstring at Fresno State because I kept stacking sessions, and my coach told me rest was for people who didn't want it enough. I was wrong, and so was he. Most athletes never learn that until they're hurt.",
    { kind: 'belief' },
  );
  assert.ok(strong.score > vague.score + 30, `${strong.score} vs ${vague.score}`);
  assert.ok(['specific', 'sharp'].includes(strong.level.id));
});

test('topic lists are flagged as topics, not messages', () => {
  const r = analyze('fitness, mindset, recovery, nutrition, football, school', { kind: 'belief' });
  assert.ok(r.issues.includes('topic'));
});

test('audience "everyone" is flagged as too broad', () => {
  const r = analyze('Everyone who wants to get better at sports and anyone who needs motivation.', { kind: 'audience' });
  assert.ok(r.issues.includes('broad'));
  assert.ok(r.issues.includes('nodemo'));
});

test('good audience answer has demographics and feeling', () => {
  const r = analyze(
    "A 16 year old high school sophomore who is on JV, feels invisible to the varsity coach, and is afraid they'll never get recruited.",
    { kind: 'audience' },
  );
  assert.ok(!r.issues.includes('broad'));
  assert.ok(!r.issues.includes('nodemo'));
  assert.ok(r.score >= 45, `score was ${r.score}`);
});

test('story arc detection finds missing beats', () => {
  const onlyProblem = analyze(
    'I got cut from varsity as a sophomore and I was embarrassed. I felt lost and alone in the locker room that day and I could not stop thinking about it for weeks.',
    { kind: 'story' },
  );
  assert.ok(onlyProblem.issues.includes('nostory_pursuit'));
  const full = analyze(
    "I got cut from varsity as a sophomore and I was embarrassed and scared. So I started waking up at 5am to train before school, and I asked the assistant coach to send me film every Sunday. I kept showing up every day for a year. Looking back, that cut taught me I was not behind, I just needed a system. Now I coach younger players through the same thing.",
    { kind: 'story' },
  );
  assert.ok(!full.issues.some((i) => i.startsWith('nostory')));
  assert.ok(full.strengths.some((s) => s.includes('full arc')));
});

test('follow-ups do not repeat what was already asked', () => {
  const r = analyze('I like sports.', { kind: 'belief' });
  const first = pickFollowups(r, {}, [], 2);
  const second = pickFollowups(r, {}, first.map((x) => x.text), 2);
  const firstTexts = new Set(first.map((x) => x.text));
  for (const s of second) assert.ok(!firstTexts.has(s.text));
});

test('strong answers get a pressure-test follow-up instead of nagging', () => {
  const r = analyze(
    "Most coaches say toughness means never showing weakness, but at 21 I played through a stress fracture at Ohio State because I believed that, and it cost me my senior season. I felt ashamed asking for help. Now I teach younger athletes that telling someone you're hurt is the toughest thing you can do.",
    { kind: 'contrarian' },
  );
  assert.ok(r.score >= 55, `score was ${r.score}`);
  const f = pickFollowups(r, {}, [], 2);
  assert.ok(f.length >= 1);
});

test('wordCount handles punctuation and empty input', () => {
  assert.equal(wordCount(''), 0);
  assert.equal(wordCount("It's  a   test, okay?"), 4);
});

test('scores always stay within 0-100', () => {
  for (const kind of ['reflect', 'belief', 'contrarian', 'help', 'pillar', 'audience', 'pain', 'desire', 'identity', 'story', 'vision']) {
    for (const text of ['a', 'word '.repeat(400), 'I I I I I I I I I I I I I I I I I I I I I I I I I I I I']) {
      const r = analyze(text, { kind });
      assert.ok(r.score >= 0 && r.score <= 100, `${kind}: ${r.score}`);
    }
  }
});
