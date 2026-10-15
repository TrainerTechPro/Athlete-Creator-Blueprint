// Week 1 plan: goals, seven days of tasks, daily check-ins, audit prep, and the roadmap ahead.

export const GOALS = [
  { id: 'learn', title: 'Work through both lessons', body: 'The Blueprint and the Format Bank, with notes in the app.', auto: 'lessons' },
  { id: 'blueprint', title: 'Build your Blueprint', body: 'Define what you say, who you say it to, and why it matters to you.', auto: 'blueprint' },
  { id: 'post', title: 'Post this week', body: 'Publish at least 3 pieces of content if you are a beginner, 5 if you are advanced.', auto: 'posts' },
  { id: 'review', title: 'Get feedback once', body: 'Bring one post and one clear question to a content review with your coach.', auto: null },
  { id: 'challenge', title: 'Complete a weekly challenge', body: 'Publish at least one of the three challenge options.', auto: 'challenge' },
  { id: 'bio', title: 'Bonus: optimise your bio', body: 'Once your Blueprint exists, make your bio say it in one glance.', auto: 'bio' },
];

export const DAYS = [
  {
    n: 1,
    focus: 'Get clear on where you are starting.',
    tasks: [
      { id: 'd1a', text: 'Run the Blueprint intro and answer the "What you say" questions.', link: '#/blueprint/say' },
      { id: 'd1b', text: 'Finish your Launch Pad checklist if anything is open.', link: '#/launch' },
      { id: 'd1c', text: 'Check today\'s coaching session or catch up on what you missed.' },
    ],
    checkin: 'What feels most unclear about your content right now?',
  },
  {
    n: 2,
    focus: 'Look for the patterns.',
    tasks: [
      { id: 'd2a', text: 'Complete the "Who you say it to" and "Why it matters" sections.', link: '#/blueprint/reach' },
      { id: 'd2b', text: 'Keep learning: finish any lesson or recording you have not watched.' },
      { id: 'd2c', text: 'Show up to today\'s content review. Listen, learn, raise your hand if you have a question.' },
    ],
    checkin: 'What are you starting to notice about yourself or your content?',
  },
  {
    n: 3,
    focus: 'Build your Blueprint.',
    tasks: [
      { id: 'd3a', text: 'Create your first draft. Use your reflections to build the Message statement.', link: '#/blueprint/statement' },
      { id: 'd3b', text: 'Bring your draft to a workshop and use the session to get clearer, not perfect.' },
      { id: 'd3c', text: 'Refine what you wrote after the workshop.', link: '#/doc' },
    ],
    checkin: 'What is the topic you could talk about for hours?',
  },
  {
    n: 4,
    focus: 'Turn clarity into content.',
    tasks: [
      { id: 'd4a', text: 'Choose one part of your Blueprint (a belief, perspective or story) to create from.', link: '#/doc' },
      { id: 'd4b', text: 'Turn it into a post with the Idea Lab. Draft or publish one piece.', link: '#/lab' },
      { id: 'd4c', text: 'Use your review: bring the post and one specific question to your coach.', link: '#/plan/audit' },
    ],
    checkin: 'What is one thing you want to test instead of overthinking?',
  },
  {
    n: 5,
    focus: 'Create, do not overthink.',
    tasks: [
      { id: 'd5a', text: 'Pick one content example in the Format Bank and break it down as a guide.', link: '#/formats' },
      { id: 'd5b', text: 'Make it yours: connect the format back to your Blueprint and adapt the hook.', link: '#/lab' },
      { id: 'd5c', text: 'Post it. Done is more useful than another draft in your camera roll.', link: '#/posts' },
    ],
    checkin: 'What felt easier to create now that you have more direction?',
  },
  {
    n: 6,
    focus: 'Learn from what you are doing.',
    tasks: [
      { id: 'd6a', text: 'Keep posting. Work toward your weekly post goal.', link: '#/posts' },
      { id: 'd6b', text: 'Look back at your content and notice what resonated most.', link: '#/posts' },
      { id: 'd6c', text: 'Share your progress: drop a post, win, realisation or lesson with your community.' },
    ],
    checkin: 'What are you learning by actually posting that you could not learn from planning?',
  },
  {
    n: 7,
    focus: 'Review, refine, repeat.',
    tasks: [
      { id: 'd7a', text: 'Check your weekly goals and tick off what you completed.', link: '#/plan' },
      { id: 'd7b', text: 'Challenge time: publish one of the three challenge options.', link: '#/challenge' },
      { id: 'd7c', text: 'Learn from your final review. Write down one takeaway to apply next week.' },
    ],
    checkin: 'What is one thing you understand about your content now that you did not a week ago?',
  },
];

export const REVIEW_PROMPTS = [
  { id: 'keep', label: 'One thing I want to keep doing' },
  { id: 'try', label: 'One thing I want to try differently' },
  { id: 'commit', label: 'My commitment to myself next week is' },
];

// ---------------------------------------------------------------- Audit prep
export const AUDIT_TYPES = [
  { id: 'underperform', label: 'A post that did not perform', ask: 'Which part do you think was off: the hook, the format, the topic?' },
  { id: 'overperform', label: 'A post that did better than usual', ask: 'What do you think did it: the hook, the audience, the timing?' },
  { id: 'test', label: 'A format I want to test', ask: 'Which format, and what are you unsure about?' },
  { id: 'bio', label: 'My bio or profile', ask: 'What do you want a stranger to understand in five seconds?' },
  { id: 'idea', label: 'Help generating an idea', ask: 'What goal should the idea serve: trust, reach, or sales?' },
];

export const AUDIT_EXAMPLES = [
  'This reel did not perform well. Was it the hook?',
  'Should I share this Trial Reel to my main feed?',
  'Can you check my bio and tell me if it is clear about what I do?',
  'This video reached more non-followers than normal. What did I do right?',
  'Can you help me generate a content idea to increase sales?',
];

export function checkAuditQuestion(text) {
  const t = (text || '').trim();
  const words = t.split(/\s+/).filter(Boolean).length;
  const questions = (t.match(/\?/g) || []).length;
  const notes = [];
  if (!t) return { score: 0, notes: ['Write the one question you want answered.'], ok: false };
  if (questions > 1) notes.push('That is more than one question. You only get one per turn, so pick the one that matters most.');
  if (words < 6) notes.push('Add context: what did you post or what are you testing?');
  if (/^(thoughts|feedback|what do you think)\??$/i.test(t) || /\b(thoughts|any feedback|general feedback)\b/i.test(t)) {
    notes.push('"Thoughts?" is too open. Ask about a part: the hook, the format, the caption, the audience.');
  }
  if (!/\b(hook|format|caption|bio|idea|audience|sound|post|reel|video|carousel|story|views|reach|followers|trial|sales|topic|title|thumbnail)\b/i.test(t)) {
    notes.push('Name the thing you want help with (hook, format, caption, bio, audience…).');
  }
  if (words > 45) notes.push('Shorten it. A sharp question is under about 30 words.');
  const ok = notes.length === 0;
  return { score: ok ? 100 : Math.max(20, 100 - notes.length * 25), notes: ok ? ['Clear and answerable. Bring the post with it.'] : notes, ok };
}

// ---------------------------------------------------------------- Bio helper
export const BIO_LIMIT = 150;

export function bioDrafts(parts = {}) {
  const t = (x) => (x || '').trim().replace(/[.\s]+$/, '');
  const who = t(parts.identity);
  const help = t(parts.help);
  const proof = t(parts.proof);
  const cta = t(parts.cta);
  const out = [];
  if (who && help) out.push([who, `Helping ${help}`, proof, cta].filter(Boolean).join(' | '));
  if (who && help) out.push([`${help}`, who, proof].filter(Boolean).join(' | '));
  if (help) out.push([`I help ${help}`, proof, cta].filter(Boolean).join('\n'));
  return out.filter(Boolean);
}

export function checkBio(text) {
  const t = (text || '').trim();
  const checks = [
    { ok: t.length > 0 && t.length <= BIO_LIMIT, text: `Fits the ${BIO_LIMIT}-character limit (${t.length}).` },
    { ok: /\b(help|for|teach|show|share|coach|train|build|athlete|player|runner|swimmer|coach)\b/i.test(t), text: 'Says who you are or who you help.' },
    { ok: /\d/.test(t) || /\b(d1|d2|d3|ncaa|pro|olympic|national|all-|champion|captain|starter)\b/i.test(t), text: 'Includes a bit of proof (level, result, number).' },
    { ok: /(👇|⬇|→|link|dm|join|follow|subscribe|watch|newsletter|book)/i.test(t), text: 'Has a call to action.' },
  ];
  return checks;
}

// ---------------------------------------------------------------- Roadmap
export const ROADMAP = [
  {
    week: 0,
    title: 'Onboarding',
    body: 'Set up accounts, rhythm and mindset. Post one starting-point piece of content.',
    route: '#/launch',
    status: 'live',
  },
  {
    week: 1,
    title: 'Your content strategy: what to post',
    body: 'Build your Blueprint (what, who, why) and package ideas into formats designed to perform.',
    route: '#/blueprint',
    status: 'live',
  },
  {
    week: 2,
    title: 'Formats and editing that get views',
    body: 'Go deeper on formats. Find patterns in what already works for creators ahead of you and turn ideas into videos.',
    route: '#/week/2',
    status: 'live',
  },
  {
    week: 3,
    title: 'Content missions: turning views into trust',
    body: 'Post with an intention: attract, nurture, position or convert. The four stack like a funnel.',
    route: '#/week/3',
    status: 'live',
  },
  {
    week: 4,
    title: 'Stories and selling',
    body: 'Tie it together: stories that build trust, and how your content turns viewers into people who buy from you.',
    route: '#/week/4',
    status: 'live',
  },
];
