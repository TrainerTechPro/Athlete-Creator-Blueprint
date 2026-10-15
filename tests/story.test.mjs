import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitStory } from '../public/js/story.js';
import { assembleStatement } from '../public/js/content/blueprint.js';
import { fillHook, matchFormats, missingTokens } from '../public/js/content/formats.js';
import { checkAuditQuestion, checkBio } from '../public/js/content/plan.js';
import { CHALLENGES } from '../public/js/content/challenge.js';

test('splitStory finds struggle, move and win', () => {
  const t =
    'I got cut from varsity and I was embarrassed. I felt lost for weeks. So I started waking up at 5am to train. I asked the assistant coach for film every Sunday. Looking back, that cut taught me I just needed a system. Now I coach younger players.';
  const s = splitStory(t);
  assert.match(s.problem, /cut from varsity/);
  assert.match(s.pursuit, /5am/);
  assert.match(s.payoff, /taught me/);
});

test('splitStory handles very short input without crashing', () => {
  assert.deepEqual(splitStory(''), { problem: '', pursuit: '', payoff: '' });
  assert.equal(splitStory('One sentence only.').problem, 'One sentence only.');
});

test('message statement assembles from parts', () => {
  assert.equal(assembleStatement({}), '');
  assert.equal(
    assembleStatement({ who: 'high school athletes', struggle: 'feeling invisible', outcome: 'get seen', angle: 'my story' }),
    'I help high school athletes who struggle with feeling invisible to get seen through my story.',
  );
});

test('hook templates fill tokens and show placeholders for missing ones', () => {
  const t = "I'm {age} and I'm a little embarrassed to admit this:";
  assert.equal(fillHook(t, { age: '20' }), "I'm 20 and I'm a little embarrassed to admit this:");
  assert.equal(fillHook(t, {}), "I'm [your age] and I'm a little embarrassed to admit this:");
  assert.deepEqual(missingTokens(t, {}), ['age']);
});

test('format matcher respects camera comfort and effort', () => {
  const shy = matchFormats({ camera: 0, time: 1, vuln: 1, assets: ['photos'], goal: 'connection' }, 20);
  const talking = shy.filter((r) => r.format.camera === 3);
  const top3 = shy.slice(0, 3);
  assert.ok(top3.every((r) => r.format.camera <= 1), 'top picks for camera-shy people should not need camera');
  assert.ok(talking.every((r) => r.score < top3[0].score));
  const bold = matchFormats({ camera: 3, time: 3, vuln: 3, assets: ['words'], goal: 'authority' }, 3);
  assert.ok(bold.some((r) => r.format.kind === 'talking'));
});

test('audit question checker flags multiple and vague questions', () => {
  assert.equal(checkAuditQuestion('').ok, false);
  assert.equal(checkAuditQuestion('Thoughts?').ok, false);
  assert.equal(checkAuditQuestion('Is the hook too slow? Should I change the sound? And the caption?').ok, false);
  assert.equal(checkAuditQuestion('This reel got half my usual views. Was the hook too slow in the first two seconds?').ok, true);
});

test('bio checker looks for who, proof and a call to action', () => {
  const good = checkBio('D1 soccer player | Helping recruits get seen | 3x all-conference | Free guide 👇');
  assert.ok(good.every((c) => c.ok), JSON.stringify(good));
  assert.equal(checkBio('x'.repeat(200))[0].ok, false);
});

test('every challenge has a working check() and caption()', () => {
  for (const c of CHALLENGES) {
    const empty = c.check({});
    assert.ok(empty.length >= 4);
    assert.ok(empty.some((x) => !x.ok), `${c.id}: empty draft should not pass everything`);
    assert.equal(typeof c.caption({ bullets: ['a'], pairs: [] }), 'string');
  }
  const c = CHALLENGES.find((x) => x.id === 'expectation');
  const pairs = [1, 2, 3, 4, 5].map((i) => ({ label: `Event ${i}`, expectAge: String(15 + i), realAge: String(18 + i) }));
  const res = c.check({ theme: 'x', pairs, rehook: 'a', pursuit: 'b', payoff: 'c' });
  assert.ok(res.every((x) => x.ok), JSON.stringify(res));
});

test('clauseCut keeps the first clause and respects the word limit', async () => {
  const { clauseCut } = await import('../public/js/story.js');
  assert.equal(
    clauseCut('They are afraid of getting to college and being exposed as not good enough, and every day they feel like coaches ignore their emails.', 14),
    'They are afraid of getting to college and being exposed as not good enough',
  );
  assert.equal(clauseCut('They want an offer, but underneath that they want to belong.', 12), 'They want an offer');
  assert.equal(clauseCut('one two three four five six', 3), 'one two three');
  assert.equal(clauseCut('', 5), '');
});
