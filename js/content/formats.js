// Lesson 2: formats. Message + format = content that works.
// Hook templates use {tokens}. The Idea Lab fills them from the client's own Blueprint.

export const TOKENS = {
  age: { label: 'Your age', placeholder: '21' },
  identity: { label: 'Identity or role', placeholder: 'college athlete' },
  sport: { label: 'Your sport', placeholder: 'soccer' },
  problem: { label: 'Problem or struggle', placeholder: 'feeling invisible to coaches' },
  desire: { label: 'Desire or outcome', placeholder: 'get recruited' },
  pursuit: { label: 'What you did', placeholder: 'sending coaches film every week' },
  payoff: { label: 'Result or lesson', placeholder: 'I finally got a reply' },
  n: { label: 'Number', placeholder: '3' },
  x: { label: 'Option X (or lower age)', placeholder: '17' },
  y: { label: 'Option Y (or upper age)', placeholder: '19' },
  advice: { label: 'Common advice', placeholder: 'training twice a day' },
  goal: { label: 'Goal', placeholder: 'getting faster' },
  thing: { label: 'Habit or action', placeholder: 'recovery habits' },
  moment: { label: 'Moment', placeholder: 'your first start on a Friday night' },
  loss: { label: 'The setback', placeholder: 'getting cut' },
  accomplishment: { label: 'Accomplishment', placeholder: 'Became a starter' },
  time: { label: 'Time anchor', placeholder: 'at 22' },
};

export const KIND_LABEL = { 'non-talking': 'Non-talking', talking: 'Talking', carousel: 'Carousel' };

export const FORMATS = [
  {
    id: 'confession',
    name: 'Confession B-roll',
    kind: 'non-talking',
    vulnerability: 3,
    effort: 1,
    camera: 1,
    assets: ['footage'],
    fit: ['why'],
    goal: ['connection'],
    summary:
      'A single 6 to 8 second clip with a big on-screen text hook, and a caption that carries the real story. The video sets the emotion; the caption does the explaining.',
    hooks: [
      "I'm {age} and I'm a little embarrassed to admit this:",
      '{age} years old and I still {problem}',
      "I'm {age} and scared to admit that {problem}",
    ],
    tokens: ['age', 'problem'],
    dos: [
      'Put the value in the caption. Name what you went through, including the part you are embarrassed about.',
      'Lead with the most relatable struggle so the first second stops the scroll.',
      'Let one strong emotion do the work. A negative emotion usually lands best.',
    ],
    donts: [
      'Do not make the on-screen text small or busy. Two short lines, big, away from the app buttons.',
      'Do not keep the caption vague. "It was hard" says nothing. Name more than one specific struggle.',
      'Do not explain what happened. Make people feel it.',
    ],
    caption:
      'Three parts: a first line that echoes your hook, 5 to 10 short bullets (1 to 3 sentences each) leaning into the uncertainty and contradictions, and a one-line conclusion or invitation for people like you to follow along.',
    ex: {
      college: "I'm 20 and I'm a little embarrassed to admit I still call my mom after every bad game:",
      pro: "I'm 29 and I'm a little embarrassed to admit I've never felt like I belong in this locker room:",
      youth: "I'm 15 and I'm a little embarrassed to admit I get so nervous before games I feel sick:",
      post: "I'm 31 and I'm a little embarrassed to admit I don't know who I am without my sport:",
      coach: "I've coached 400 athletes and I'm a little embarrassed to admit I still doubt my own plan before every season:",
    },
  },
  {
    id: 'rank',
    name: 'Bad, Good, Excellent',
    kind: 'talking',
    vulnerability: 1,
    effort: 3,
    camera: 3,
    assets: ['words'],
    fit: ['what'],
    goal: ['authority', 'reach'],
    summary:
      'A 40 to 60 second talking video that ranks three pieces of advice on one goal as bad, good and excellent, with an image overlay for each.',
    hooks: [
      '{advice} is bad for {goal}. [Second tip] is good. [Third tip] is excellent.',
      '{advice} is bad for {goal}…',
    ],
    tokens: ['advice', 'goal'],
    dos: [
      'Pick one outcome and judge everything by it.',
      'Keep a rhythm: "X is bad for growth. Y is good. Z is excellent."',
      'Show the point, do not just say it. Put an image on screen as you speak.',
      'Lead with a contrarian opener, something many people think is good for the goal.',
    ],
    donts: [
      'Do not mix up your labels. Keep "bad, good, excellent" on screen the whole video.',
      'Do not explain, just state. Short sentences keep the pace.',
      'Do not put overlays in the top 10 percent of the frame where the app covers them.',
    ],
    caption:
      'Explain your rankings in the same order as the video, 1 to 2 sentences each, especially the contrarian ones that look nonsensical without context. Use your lived experience to justify your stance.',
    ex: {
      college: 'All-nighters before games are bad for performance…',
      pro: 'Ice baths after every session are bad for building strength…',
      youth: 'Playing through pain is bad for getting recruited…',
      post: 'Staying in the sport for the identity is bad for your next chapter…',
      coach: 'Doing more reps is bad for skill development…',
    },
  },
  {
    id: 'expectation',
    name: 'Expectation vs Reality',
    kind: 'carousel',
    vulnerability: 2,
    effort: 2,
    camera: 0,
    assets: ['photos'],
    fit: ['why'],
    goal: ['connection', 'reach'],
    summary:
      'A split-screen carousel of 5 to 8 slides, each pairing the timeline or milestone you expected with the reality of when and how it happened.',
    hooks: ['{accomplishment} {time}, not {x}', '{accomplishment} at {y}, not {x}'],
    tokens: ['accomplishment', 'time', 'x', 'y'],
    dos: [
      'Keep the same structure on every slide so it is easy to follow.',
      'Make each contrast specific. "Started at 25, not 18" beats "Everyone has their own timeline".',
      'Use photos from each season of life that reinforce the story.',
      'List events in ascending age or experience order, and only pair events that make sense together.',
    ],
    donts: [
      'Do not make the expectation generic. Name a milestone, timeline or standard you thought you had to meet.',
      'Do not overcrowd the slide. Let one contrast do the work.',
      'Do not make it a comparison with other people. The point is your expectation versus your reality.',
    ],
    caption:
      'First line: the problem rehook (for a long time I thought I was behind). Then the pursuit: what actually happened and how your path unfolded differently. End with the payoff: what the experience taught you and what you believe now.',
    ex: {
      college: 'Committed to my school at 19, not 17',
      pro: 'Signed my first pro deal at 26, not 21',
      youth: 'Made varsity as a junior, not a freshman',
      post: 'Started over at 32, not 25',
      coach: 'Opened my own gym at 38, not 28',
    },
  },
  {
    id: 'silent-film',
    name: 'Silent film',
    kind: 'non-talking',
    vulnerability: 1,
    effort: 1,
    camera: 0,
    assets: ['footage', 'photos'],
    fit: ['why'],
    goal: ['connection'],
    summary: 'A short, moody clip with a line of text over footage or an old photo that contrasts a problem with a payoff, no talking.',
    hooks: ['"{problem}" vs {payoff} {time}', '"{problem}" {time}'],
    tokens: ['problem', 'payoff', 'time'],
    dos: ['Pair a real old photo or clip with the line.', 'Keep the text to one idea.', 'Use a sound with the emotion you want.'],
    donts: ['Do not over-edit.', 'Do not use more than one line of text.'],
    caption: 'Give the context the video withholds: what the line meant, what you did, what you believe now.',
    ex: {
      college: '"I wish I liked how I looked" vs I finally feel strong at 20',
      pro: '"They said I was too small" vs first pro start at 24',
      youth: '"I will never make the team" vs made it at 15',
      post: '"Who am I without it" vs building something new at 33',
      coach: '"Nobody will hire a kid coach" vs 12 athletes on my roster at 27',
    },
  },
  {
    id: 'before-after',
    name: 'Old me vs new me',
    kind: 'non-talking',
    vulnerability: 2,
    effort: 1,
    camera: 1,
    assets: ['footage', 'photos'],
    fit: ['why'],
    goal: ['connection'],
    summary: 'A before-and-after on a mindset or habit: the old problem and the new payoff, shown with matching clips.',
    hooks: ['Old me: {problem}. New me: {payoff}.'],
    tokens: ['problem', 'payoff'],
    dos: ['Pick one change, not five.', 'Match the framing so the contrast is obvious.'],
    donts: ['Do not make the old you a villain.', 'Do not say more than the text needs.'],
    caption: 'Explain what changed between the two. The caption is where the lesson lives.',
    ex: {
      college: 'Old me: overexplaining to coaches. New me: saying it in one line.',
      pro: 'Old me: playing for approval. New me: playing for the work.',
      youth: 'Old me: hiding on the bench. New me: asking for reps.',
      post: 'Old me: my sport was my identity. New me: it is one chapter.',
      coach: 'Old me: coaching to win. New me: coaching to develop.',
    },
  },
  {
    id: 'broll-identity',
    name: 'Things I do as a {age} year old…',
    kind: 'non-talking',
    vulnerability: 1,
    effort: 1,
    camera: 0,
    assets: ['footage'],
    fit: ['who'],
    goal: ['connection', 'reach'],
    summary: 'B-roll with a text hook listing things you do because of who you are, tied to an age and an identity.',
    hooks: ['Things I do as a {age} year old {identity}', "I'm {age} and my life got better when I realised {payoff}"],
    tokens: ['age', 'identity', 'payoff'],
    dos: ['Use an age and identity that your ideal viewer shares.', 'Show a different action in every cut.'],
    donts: ['Do not list generic habits.', 'Do not rush the cuts.'],
    caption: 'Explain the "why" behind two or three of the habits in the caption.',
    ex: {
      college: 'Things I do as a 20 year old D1 athlete that people think are weird',
      pro: 'Things I do as a 28 year old pro that no one posts about',
      youth: 'Things I do as a 16 year old athlete to stay ahead',
      post: 'Things I do as a 34 year old ex-athlete to feel like myself',
      coach: 'Things I do as a coach before every session',
    },
  },
  {
    id: 'direct-list',
    name: 'Things I wish I knew',
    kind: 'talking',
    vulnerability: 1,
    effort: 2,
    camera: 3,
    assets: ['words'],
    fit: ['what', 'why'],
    goal: ['authority'],
    summary: 'Direct to camera: a numbered list of things you wish someone had told you before a result or turning point.',
    hooks: ['{n} things I wish I knew before {payoff}', "You'll {desire} once you {pursuit}"],
    tokens: ['n', 'payoff', 'desire', 'pursuit'],
    dos: ['Number the points so people stay for all of them.', 'Keep each point to one or two sentences.', 'Say the hardest one last.'],
    donts: ['Do not add a long intro.', 'Do not exceed five points.'],
    caption: 'Add one real example for each point so it reads as lived advice, not a list from the internet.',
    ex: {
      college: '3 things I wish I knew before my first season of college sports',
      pro: '4 things I wish I knew before I signed my first contract',
      youth: '3 things I wish I knew before tryouts',
      post: '3 things I wish I knew before I retired',
      coach: '5 things I wish I knew before I started coaching',
    },
  },
  {
    id: 'mindset-split',
    name: 'Split-screen mindsets',
    kind: 'talking',
    vulnerability: 1,
    effort: 2,
    camera: 3,
    assets: ['words'],
    fit: ['what'],
    goal: ['authority', 'reach'],
    summary: 'Two sides of the screen: one mindset versus another, with you acting out or speaking each side.',
    hooks: ['{x} mindset vs {y} mindset'],
    tokens: ['x', 'y'],
    dos: ['Keep the two sides parallel and short.', 'Use the same wording structure on each side.'],
    donts: ['Do not preach.', 'Do not run longer than 30 seconds.'],
    caption: 'Explain which mindset you used to have and what shifted it.',
    ex: {
      college: 'Starter mindset vs bench mindset',
      pro: 'Comfort mindset vs contract mindset',
      youth: 'Comparison mindset vs growth mindset',
      post: 'Loss mindset vs rebuild mindset',
      coach: 'Control mindset vs development mindset',
    },
  },
  {
    id: 'listicle-swap',
    name: 'Do this instead',
    kind: 'carousel',
    vulnerability: 1,
    effort: 2,
    camera: 0,
    assets: ['photos', 'words'],
    fit: ['what'],
    goal: ['authority', 'reach'],
    summary: 'A listicle or carousel: things to do instead of a common problem behaviour.',
    hooks: ['{n} things to do instead of {problem}'],
    tokens: ['n', 'problem'],
    dos: ['Make each slide one clear alternative.', 'Open with the relatable problem.'],
    donts: ['Do not put paragraphs on slides.', 'Do not list more than seven.'],
    caption: 'Add the story of when you did the "problem" version yourself.',
    ex: {
      college: '5 things to do instead of doomscrolling the night before a game',
      pro: '4 things to do instead of overtraining in the off-season',
      youth: '3 things to do instead of comparing yourself to teammates',
      post: '5 things to do instead of waiting for the sport to call back',
      coach: '4 things to do instead of yelling in practice',
    },
  },
  {
    id: 'how-to-become',
    name: 'How to become…',
    kind: 'carousel',
    vulnerability: 1,
    effort: 2,
    camera: 0,
    assets: ['photos', 'words'],
    fit: ['what'],
    goal: ['authority', 'reach'],
    summary: 'A carousel that tells people how to become the version of themselves they want to be, with a surprising twist on how.',
    hooks: ['How to become {desire} (and no, it is not {advice})'],
    tokens: ['desire', 'advice'],
    dos: ['Make the promise specific.', 'End with a slide worth saving.'],
    donts: ['Do not overpromise.', 'Do not copy generic advice.'],
    caption: 'Tie the steps to your own story so it is not just information anyone could google.',
    ex: {
      college: 'How to become a captain (and no, it is not being the loudest)',
      pro: 'How to become the teammate everyone trusts (and no, it is not stats)',
      youth: 'How to become the player your coach notices (and no, it is not scoring)',
      post: 'How to become more than an ex-athlete (and no, it is not hiding it)',
      coach: 'How to become a coach athletes remember (and no, it is not winning)',
    },
  },
  {
    id: 'warning-age',
    name: 'Age-anchored warning',
    kind: 'non-talking',
    vulnerability: 2,
    effort: 1,
    camera: 1,
    assets: ['footage'],
    fit: ['who'],
    goal: ['reach'],
    summary: 'B-roll with a text hook anchored to your age and a window of ages, urging a habit before it is too late.',
    hooks: ["I'm {age}. If you're between {x} and {y}, start {thing} before it's too late"],
    tokens: ['age', 'x', 'y', 'thing'],
    dos: ['Name the habit clearly.', 'Back it up in the caption with your own cost of waiting.'],
    donts: ['Do not scare without helping.', 'Do not be vague about the age window.'],
    caption: 'Explain what waiting cost you and exactly how to start.',
    ex: {
      college: "I'm 21. If you're between 17 and 19, start learning how recruiting actually works before it's too late",
      pro: "I'm 30. If you're between 22 and 26, start your money habits before it's too late",
      youth: "I'm 16. If you're between 12 and 14, start playing more than one sport before it's too late",
      post: "I'm 33. If you're between 25 and 30, start building outside the sport before it's too late",
      coach: "I'm 40. If you're between 25 and 30, start asking for mentors before it's too late",
    },
  },
  {
    id: 'day-in-life',
    name: 'Day in my life',
    kind: 'non-talking',
    vulnerability: 1,
    effort: 3,
    camera: 1,
    assets: ['footage'],
    fit: ['who'],
    goal: ['connection'],
    summary: 'A tight, honest montage of your day, anchored by a hook about the tension in it (not just a highlight reel).',
    hooks: ['Day in my life as a {sport} athlete who {problem}', 'A normal day as a {age} year old {identity}'],
    tokens: ['sport', 'problem', 'age', 'identity'],
    dos: ['Show the unglamorous parts.', 'Keep each cut under two seconds.', 'Hook with the tension, not the schedule.'],
    donts: ['Do not show locations, home addresses or travel in real time.', 'Do not make it a time-lapse of nothing.'],
    caption: 'Share what that day taught you or what you wish people saw.',
    ex: {
      college: 'Day in my life as a D1 athlete who also has a 9am lab',
      pro: 'A normal in-season day when nobody is watching',
      youth: 'Day in my life as a high school athlete with early practice',
      post: 'A day in my life now that I do not have practice',
      coach: 'A day in my life coaching 40 athletes',
    },
  },
  {
    id: 'film-room',
    name: 'What I see on film',
    kind: 'talking',
    vulnerability: 1,
    effort: 2,
    camera: 3,
    assets: ['footage', 'words'],
    fit: ['what'],
    goal: ['authority', 'reach'],
    summary: 'You break down a clip and teach the one thing most people in your sport miss.',
    hooks: ['What I see on film that most {sport} players miss', 'The one thing separating {n} levels of {sport}'],
    tokens: ['sport', 'n'],
    dos: ['Teach one idea per video.', 'Draw on the clip as you talk.'],
    donts: ['Do not critique named athletes harshly.', 'Do not use footage you do not have rights to.'],
    caption: 'Give the drill or habit that fixes what you pointed out.',
    ex: {
      college: 'What I see on film that most freshmen miss',
      pro: 'What I look for in the first five minutes of a film session',
      youth: 'What I started noticing on my own film that changed my game',
      post: 'What I wish I had known earlier from film',
      coach: 'What I see on every kid\'s film that is easy to fix',
    },
  },
  {
    id: 'lesson-loss',
    name: 'The loss that taught me',
    kind: 'talking',
    vulnerability: 3,
    effort: 2,
    camera: 3,
    assets: ['words'],
    fit: ['why'],
    goal: ['connection', 'authority'],
    summary: 'A direct-to-camera story in three beats: the setback, what you did, and the lesson that followed.',
    hooks: ['The {loss} that taught me {payoff}', 'I almost quit after {loss}…'],
    tokens: ['loss', 'payoff'],
    dos: ['Tell it in struggle, move, win order.', 'Open on the lowest moment.', 'End with the lesson in one line.'],
    donts: ['Do not skip the struggle.', 'Do not turn it into a lecture.'],
    caption: 'Offer one question or action for people in a similar spot.',
    ex: {
      college: 'The benching that taught me nobody gives you confidence, you borrow it from the work',
      pro: 'The cut that taught me my value is not my contract',
      youth: 'The tryout I failed that taught me how to prepare',
      post: 'The injury that taught me I am more than my sport',
      coach: 'The season we lost every game that taught me what coaching is for',
    },
  },
  {
    id: 'pov',
    name: 'POV moment',
    kind: 'non-talking',
    vulnerability: 2,
    effort: 1,
    camera: 1,
    assets: ['footage'],
    fit: ['who', 'why'],
    goal: ['connection'],
    summary: 'A short POV clip that drops people into a specific moment from your sport life, with a text line that names the feeling.',
    hooks: ['POV: {moment}', 'POV: you are {age} and {problem}'],
    tokens: ['moment', 'age', 'problem'],
    dos: ['Pick one specific moment.', 'Name the feeling in the text.'],
    donts: ['Do not rely on a trending sound alone.', 'Do not make it too long.'],
    caption: 'Tell the real story behind the moment and what it taught you.',
    ex: {
      college: 'POV: it is the night before your first college game',
      pro: 'POV: your contract is up and you have not heard back',
      youth: 'POV: you are waiting to see if your name is on the roster',
      post: 'POV: your teammates are at practice and you are at your desk',
      coach: 'POV: your team is down at the half and everyone is looking at you',
    },
  },
];

export const FORMAT_BY_ID = Object.fromEntries(FORMATS.map((f) => [f.id, f]));

export function displayName(f, ctx = {}) {
  return f.name.replace('{age}', ctx.age || 'X');
}

// Fill a hook template with tokens. Missing tokens stay visible as [placeholders].
export function fillHook(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = (values[key] || '').trim();
    return v ? v : `[${(TOKENS[key]?.label || key).toLowerCase()}]`;
  });
}

export const missingTokens = (template, values = {}) =>
  [...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((k) => !(values[k] || '').trim());

// ---------------------------------------------------------------- Format matcher
export const MATCHER = [
  {
    id: 'camera',
    prompt: 'How do you feel about talking to the camera?',
    options: [
      { v: 0, label: 'I would rather stay off camera' },
      { v: 1, label: 'Quick clips are fine, no long talking' },
      { v: 2, label: 'Comfortable with short talking videos' },
      { v: 3, label: 'I love talking to the camera' },
    ],
  },
  {
    id: 'time',
    prompt: 'How much time can you give one post?',
    options: [
      { v: 1, label: 'Under 20 minutes' },
      { v: 2, label: '20 to 60 minutes' },
      { v: 3, label: 'An hour or more' },
    ],
  },
  {
    id: 'vuln',
    prompt: 'How personal are you ready to get?',
    options: [
      { v: 1, label: 'Keep it light: tips and insight' },
      { v: 2, label: 'Some personal stories' },
      { v: 3, label: 'Fully honest, including the hard stuff' },
    ],
  },
  {
    id: 'assets',
    prompt: 'What do you already have to work with? (pick all that apply)',
    multi: true,
    options: [
      { v: 'footage', label: 'Training or game footage' },
      { v: 'photos', label: 'Old photos from different seasons' },
      { v: 'words', label: 'Ideas and words, not much footage' },
    ],
  },
  {
    id: 'goal',
    prompt: 'What do you want your next few posts to do?',
    options: [
      { v: 'connection', label: 'Build connection with people like me' },
      { v: 'authority', label: 'Show what I know' },
      { v: 'reach', label: 'Reach new people' },
    ],
  },
];

export function matchFormats(answers = {}, limit = 5) {
  const camera = Number(answers.camera ?? 1);
  const time = Number(answers.time ?? 2);
  const vuln = Number(answers.vuln ?? 2);
  const assets = answers.assets || [];
  const goal = answers.goal;
  return FORMATS.map((f) => {
    let score = 50;
    const reasons = [];
    if (f.camera > camera) {
      score -= (f.camera - camera) * 14;
    } else if (f.camera > 0) {
      reasons.push('Matches your comfort on camera');
    } else {
      score += camera <= 1 ? 8 : 0;
      if (camera <= 1) reasons.push('No talking to camera needed');
    }
    if (f.effort > time) score -= (f.effort - time) * 12;
    else if (f.effort <= time && f.effort === 1) {
      score += 6;
      reasons.push('Quick to make');
    }
    if (f.vulnerability > vuln) score -= (f.vulnerability - vuln) * 12;
    else if (f.vulnerability === vuln) {
      score += 6;
      reasons.push('Right level of personal');
    }
    const hasAsset = f.assets.some((a) => assets.includes(a));
    if (assets.length) {
      if (hasAsset) {
        score += 12;
        reasons.push('Uses what you already have');
      } else score -= 10;
    }
    if (goal && f.goal.includes(goal)) {
      score += 14;
      reasons.push(`Good for ${goal === 'reach' ? 'reaching new people' : goal === 'authority' ? 'showing authority' : 'building connection'}`);
    }
    return { format: f, score: Math.max(0, Math.min(100, Math.round(score))), reasons: reasons.slice(0, 3) };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
