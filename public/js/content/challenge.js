// Week 1 challenge: publish at least one. Each option has a guided builder.
// Field types: text, longtext, select, list (repeatable rows), pairs (expectation vs reality).

export const SPEAK_WPS = 2.6; // words per second for a natural, slightly brisk delivery

export const CHALLENGES = [
  {
    id: 'confession',
    formatId: 'confession',
    num: 1,
    title: 'Confession B-roll',
    type: 'Non-talking',
    flames: 2,
    time: '25 min',
    pitch: 'One short clip, a big text hook and a caption that carries the emotional weight.',
    steps: [
      'Pick one strong emotion: frustration or defeat, or triumph or courage.',
      'Film a 6 to 8 second clip of yourself, on a tripod or handheld, face visible.',
      'Add large on-screen text in two short lines, clear of the app buttons.',
      'Write the caption: rehook line, 5 to 10 bullets, one-line conclusion.',
    ],
    fields: [
      { id: 'age', label: 'Your age', type: 'text', placeholder: '20', width: 'sm' },
      {
        id: 'emotion', label: 'The emotion', type: 'select',
        options: ['Frustration', 'Defeat', 'Fear', 'Embarrassment', 'Doubt', 'Triumph', 'Courage', 'Relief'],
      },
      { id: 'confession', label: 'What are you embarrassed to admit?', type: 'text', placeholder: 'I still call my mom after every bad game' },
      { id: 'overlay1', label: 'On-screen text, line 1', type: 'text', placeholder: "I'm 20 and I'm a bit embarrassed" },
      { id: 'overlay2', label: 'On-screen text, line 2', type: 'text', placeholder: 'to admit this:' },
      { id: 'rehook', label: 'Caption first line (rehook)', type: 'text', placeholder: 'Nobody tells you how lonely a good season can be.' },
      { id: 'bullets', label: 'Caption bullets (5 to 10)', type: 'list', min: 5, max: 10, placeholder: 'One specific struggle, 1 to 3 sentences.' },
      { id: 'closing', label: 'Closing line', type: 'text', placeholder: 'If this is you too, follow along. I am figuring it out in public.' },
    ],
    hookFrom: (d) => [d.overlay1, d.overlay2].filter(Boolean).join(' '),
    check(d) {
      const out = [];
      const bullets = (d.bullets || []).filter((b) => b.trim());
      const overlayWords = `${d.overlay1 || ''} ${d.overlay2 || ''}`.trim().split(/\s+/).filter(Boolean).length;
      out.push({ ok: overlayWords > 0 && overlayWords <= 16, text: `On-screen text is short and readable (${overlayWords} words, aim for 16 or fewer).` });
      out.push({ ok: !!(d.rehook || '').trim(), text: 'Caption starts with a rehook line.' });
      out.push({ ok: bullets.length >= 5 && bullets.length <= 10, text: `5 to 10 bullets (you have ${bullets.length}).` });
      const long = bullets.filter((b) => b.split(/\s+/).length > 45);
      out.push({ ok: bullets.length > 0 && long.length === 0, text: 'Each bullet stays scannable (1 to 3 sentences).' });
      const vague = bullets.filter((b) => /^(it was hard|i struggled|tough|difficult)\b/i.test(b.trim()));
      out.push({ ok: bullets.length > 0 && vague.length === 0, text: 'Bullets name specific struggles, not just "it was hard".' });
      out.push({ ok: !!(d.closing || '').trim(), text: 'Ends with a short invitation for people like you.' });
      return out;
    },
    caption(d) {
      const bullets = (d.bullets || []).filter((b) => b.trim());
      return [d.rehook, '', ...bullets.map((b) => `• ${b.trim()}`), '', d.closing].filter((l) => l !== undefined).join('\n').trim();
    },
  },
  {
    id: 'rank',
    formatId: 'rank',
    num: 2,
    title: 'Bad, Good, Excellent',
    type: 'Talking with overlays',
    flames: 2,
    time: '45 min',
    pitch: 'Rank advice on one goal, with an image overlay for each. Contrarian opener, steady rhythm.',
    steps: [
      'Pick one dream outcome and judge every piece of advice by it.',
      'Choose a bad, a good and an excellent piece of advice. Make the "bad" one something people think is good.',
      'Practise each tier separately and time your script to 40 to 60 seconds.',
      'Keep the words "bad, good, excellent" in the same place on screen the whole video.',
    ],
    fields: [
      { id: 'goal', label: 'The goal everything is judged by', type: 'text', placeholder: 'getting recruited' },
      { id: 'bad', label: 'Bad advice (something many think is good)', type: 'text', placeholder: 'Emailing 100 coaches the same message' },
      { id: 'badImg', label: 'Image to show for bad', type: 'text', placeholder: 'A screenshot of a mass email', width: 'half' },
      { id: 'good', label: 'Good advice', type: 'text', placeholder: 'Sending a personal email to 10 programs' },
      { id: 'goodImg', label: 'Image to show for good', type: 'text', placeholder: 'A single email draft', width: 'half' },
      { id: 'excellent', label: 'Excellent advice', type: 'text', placeholder: 'Getting your current coach to call the college coach' },
      { id: 'excellentImg', label: 'Image to show for excellent', type: 'text', placeholder: 'Phone with a call', width: 'half' },
      { id: 'script', label: 'Your script (aim for 40 to 60 seconds)', type: 'longtext', placeholder: 'Write what you will say, line by line.', rows: 9 },
      { id: 'why', label: 'Caption: one or two sentences per ranking, from your experience', type: 'longtext', rows: 6, placeholder: 'Mass emails are bad because… Personal emails are good because… Excellent because…' },
    ],
    hookFrom: (d) => (d.bad && d.goal ? `${d.bad} is bad for ${d.goal}.` : ''),
    check(d) {
      const out = [];
      const words = (d.script || '').trim().split(/\s+/).filter(Boolean).length;
      const secs = Math.round(words / SPEAK_WPS);
      out.push({ ok: words === 0 ? false : secs >= 35 && secs <= 65, text: `Script length is about ${secs}s at a natural pace (aim for 40 to 60s).` });
      out.push({ ok: !!(d.goal || '').trim(), text: 'Everything is judged against one clear goal.' });
      out.push({ ok: !!(d.bad || '').trim() && !!(d.good || '').trim() && !!(d.excellent || '').trim(), text: 'All three tiers are filled in.' });
      out.push({ ok: !!(d.badImg || '').trim() && !!(d.goodImg || '').trim() && !!(d.excellentImg || '').trim(), text: 'Each tier has an image planned.' });
      out.push({ ok: (d.why || '').trim().split(/\s+/).filter(Boolean).length >= 25, text: 'Caption explains your rankings with lived experience.' });
      return out;
    },
    caption: (d) => (d.why || '').trim(),
  },
  {
    id: 'expectation',
    formatId: 'expectation',
    num: 3,
    title: 'Expectation vs Reality',
    type: 'Split-screen carousel',
    flames: 2,
    time: '40 min',
    pitch: 'Five to eight slides pairing the milestone you expected with the reality of when it happened.',
    steps: [
      'Choose one expectation you want to challenge.',
      'List 5 to 8 pairs, in ascending age or experience order.',
      'Pair each with a photo from that season of life, or take a new one.',
      'Write the caption in struggle, move, win order.',
    ],
    fields: [
      { id: 'theme', label: 'The expectation you are challenging', type: 'text', placeholder: 'That I would have it figured out by 22' },
      { id: 'pairs', label: 'Your slides', type: 'pairs', min: 5, max: 8 },
      { id: 'rehook', label: 'Caption first line (the problem)', type: 'text', placeholder: 'For a long time I thought I was behind.' },
      { id: 'pursuit', label: 'What actually happened (the move)', type: 'longtext', rows: 4, placeholder: 'How your path unfolded differently.' },
      { id: 'payoff', label: 'What you believe now (the win)', type: 'longtext', rows: 3, placeholder: 'What the experience taught you.' },
    ],
    hookFrom: (d) => {
      const p = (d.pairs || []).find((x) => x.label && x.expectAge && x.realAge);
      return p ? `${p.label} at ${p.realAge}, not ${p.expectAge}` : '';
    },
    check(d) {
      const out = [];
      const pairs = (d.pairs || []).filter((p) => p.label && p.label.trim());
      out.push({ ok: pairs.length >= 5 && pairs.length <= 8, text: `5 to 8 slides (you have ${pairs.length}).` });
      out.push({ ok: pairs.length > 0 && pairs.every((p) => p.expectAge && p.realAge), text: 'Every slide has an expected age and a real age.' });
      const ages = pairs.map((p) => Number(p.realAge)).filter((n) => !Number.isNaN(n));
      const asc = ages.every((n, i) => i === 0 || n >= ages[i - 1]);
      out.push({ ok: ages.length > 1 && asc, text: 'Slides run in ascending age order.' });
      out.push({ ok: !!(d.theme || '').trim(), text: 'There is one specific expectation behind the whole carousel.' });
      out.push({ ok: !!(d.rehook || '').trim() && !!(d.pursuit || '').trim() && !!(d.payoff || '').trim(), text: 'Caption has all three beats: problem, pursuit, payoff.' });
      return out;
    },
    caption: (d) => [d.rehook, '', d.pursuit, '', d.payoff].filter((x) => x !== undefined).join('\n').trim(),
  },
];

export const CHALLENGE_BY_ID = Object.fromEntries(CHALLENGES.map((c) => [c.id, c]));
