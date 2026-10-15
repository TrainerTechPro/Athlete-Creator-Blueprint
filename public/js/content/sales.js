// Weeks 2 to 4: offers, calls to action, readiness, stories, pitch and the 30-day roadmap.
// General guidance, not legal or financial advice. Rules about athlete earnings and disclosure change.

// ------------------------------------------------------------------ Offer sketch (Week 2)
export const PRODUCT_TYPES = [
  { id: 'guide', name: 'Guide or playbook (PDF)', effort: 1, example: 'The recruiting email playbook with 5 templates', validate: 'Do 10 people ask you for it?' },
  { id: 'template', name: 'Template or planner', effort: 1, example: 'A game-week planner for student-athletes', validate: 'Do people save posts about this routine?' },
  { id: 'challenge', name: 'Short challenge or cohort', effort: 2, example: 'A 7-day confidence reset for first-year athletes', validate: 'Would 5 people join for free first?' },
  { id: 'course', name: 'Mini-course', effort: 3, example: 'Film study for beginners in 5 short videos', validate: 'Have you taught this live to at least 3 people?' },
  { id: 'clinic', name: 'Clinic, camp or group session', effort: 2, example: 'A Saturday speed and agility clinic', validate: 'Can you fill a free pilot session?' },
  { id: 'one', name: '1:1 coaching or review', effort: 2, example: 'A 45 minute recruiting profile review', validate: 'Have people already DMed you for this help?' },
  { id: 'community', name: 'Membership or community', effort: 3, example: 'A private group for athletes in your sport', validate: 'Do you have an audience that asks for ongoing support?' },
];

export const OFFER_FIELDS = [
  { id: 'who', label: 'Who is it for?', type: 'text', placeholder: 'High school juniors chasing recruitment' },
  { id: 'problem', label: 'What painful problem does it solve?', type: 'text', placeholder: 'They email coaches and never hear back' },
  { id: 'promise', label: 'The promise (the result)', type: 'text', placeholder: 'Get replies from coaches within 30 days' },
  { id: 'type', label: 'Format', type: 'select', options: PRODUCT_TYPES.map((p) => p.name) },
  { id: 'inside', label: 'What do they get?', type: 'longtext', rows: 3, placeholder: '5 email templates, a film checklist, a follow-up schedule' },
  { id: 'proof', label: 'Why you?', type: 'text', placeholder: 'I went from 0 replies to 6 offers' },
  { id: 'price', label: 'Price (or "free for now")', type: 'text', placeholder: '$29 or free pilot' },
];

export function offerChecks(o = {}) {
  const has = (k) => (o[k] || '').trim().length > 2;
  return [
    { ok: has('who') && (o.who || '').trim().split(/\s+/).length >= 3, text: 'Names a specific person, not "athletes".' },
    { ok: has('problem'), text: 'Starts from a problem they already feel.' },
    { ok: has('promise') && /\d|within|in \w+ (days|weeks)|without|from .* to/i.test(o.promise || ''), text: 'The promise is concrete (a result, a timeframe or a number).' },
    { ok: has('inside'), text: 'Says exactly what they get.' },
    { ok: has('proof'), text: 'Has a reason you are the right person.' },
    { ok: has('price'), text: 'Has a price or a clear free pilot.' },
  ];
}

export const VALIDATION_SIGNALS = [
  'People comment or DM asking how you do something.',
  'The same question appears in your DMs three times.',
  'A post about the problem gets saved or sent more than your usual.',
  'Five people say yes to a free pilot.',
];

// ------------------------------------------------------------------ CTA ladder (Week 3)
export const CTA_LADDER = [
  {
    id: 'soft',
    name: 'Soft',
    ask: 'Follow, save or send to a teammate',
    when: 'Attract posts',
    script: 'Send this to the teammate who needs to hear it.',
    risk: 'Too light is fine here. It is a first step.',
  },
  {
    id: 'engage',
    name: 'Engage',
    ask: 'Comment an answer or vote',
    when: 'Nurture posts',
    script: 'Comment your biggest fear before game day and I will reply to every one.',
    risk: 'Only reply if you will really reply.',
  },
  {
    id: 'capture',
    name: 'Capture',
    ask: 'Comment a keyword or tap the link for a free resource',
    when: 'Position posts',
    script: 'Comment GUIDE and I will send you the free checklist.',
    risk: 'A free resource must be useful on its own. Do not bait with nothing.',
  },
  {
    id: 'convert',
    name: 'Convert',
    ask: 'Book, buy, join or partner',
    when: 'Convert posts',
    script: 'Spots in the pilot are open. DM me PILOT to join.',
    risk: 'Say who it is for and what it costs. Disclose anything paid or gifted.',
  },
];

export const LEAD_PATH_STEPS = [
  { id: 'hook', label: 'A post earns attention', fieldHint: 'Which post type?' },
  { id: 'keyword', label: 'They comment or DM a keyword', fieldHint: 'Your keyword (one easy word)' },
  { id: 'resource', label: 'You deliver a free resource', fieldHint: 'What do they get?' },
  { id: 'nextstep', label: 'You invite the next step', fieldHint: 'Offer, call or pilot' },
];

export const PROFILE_AUDIT = [
  { id: 'bio', text: 'My bio says who I help and the result in one glance.' },
  { id: 'link', text: 'My link goes to one clear next step, not ten links.' },
  { id: 'pins', text: 'My pinned posts show: who I am, what I know, and proof.' },
  { id: 'photo', text: 'My profile photo is clear and recognisable at a small size.' },
  { id: 'dm', text: 'I know how I will reply when someone DMs my keyword.' },
  { id: 'disclose', text: 'I know how I label any paid, gifted or affiliate content.' },
];

// ------------------------------------------------------------------ Monetization (Week 3 and 4)
export const READINESS = [
  { id: 'consistent', q: 'I have posted at least 3 times a week for 2 weeks.', auto: 'consistency' },
  { id: 'clarity', q: 'I can say who I help and what I stand for in one sentence.', auto: 'statement' },
  { id: 'audience', q: 'People outside my friends and team engage with my posts.' },
  { id: 'ask', q: 'People have asked me for help, advice or a service.' },
  { id: 'rules', q: 'I have checked my school, league and local rules on earning money.' },
  { id: 'offer', q: 'I have a simple offer sketched with a clear promise.', auto: 'offer' },
  { id: 'disclose', q: 'I know how to label paid, gifted or affiliate content.' },
  { id: 'time', q: 'I can protect time each week to deliver on what I sell.' },
];

export function readinessTier(score, total) {
  const p = total ? score / total : 0;
  if (p >= 0.8) return { id: 'go', label: 'Ready to start small', text: 'You have the basics. Pick one path and run a small pilot.' };
  if (p >= 0.5) return { id: 'close', label: 'Almost there', text: 'Close the one or two gaps below, then try a free pilot first.' };
  return { id: 'build', label: 'Keep building the base', text: 'Focus on posting consistently and finding your people. Monetisation works best on top of a clear message and a small, engaged audience.' };
}

export const MONETIZE_PATHS = [
  {
    id: 'grow',
    name: 'Grow an audience first',
    needs: 'A clear Blueprint and consistent posting',
    first: 'Post 4 to 5 times a week for 30 days and track what works.',
    note: 'The foundation for every other path.',
  },
  {
    id: 'product',
    name: 'Sell a first digital product',
    needs: 'A problem people ask you about, and a small audience',
    first: 'Pilot a guide or short challenge with 5 people before building anything big.',
    note: 'Digital products are yours to price. Collect and handle payments properly and follow platform rules.',
  },
  {
    id: 'coaching',
    name: 'Coaching, clinics or camps',
    needs: 'Proven skill, safety training and the right credentials for your sport',
    first: 'Offer a free pilot session, then a paid small group.',
    note: 'If you coach minors, follow your sport governing body’s safeguarding rules and get appropriate insurance.',
  },
  {
    id: 'brand',
    name: 'Brand partnerships',
    needs: 'A defined niche audience and permission under your athletic rules',
    first: 'Make a one-page media sheet and pitch 5 local or niche brands that fit your message.',
    note: 'College athletes: rules on name, image and likeness deals vary and keep changing. Recent reports say Division I athletes generally report third-party deals of $600 or more through a platform called NIL Go, and the system is still changing. Check current rules with your compliance office before agreeing to anything.',
  },
  {
    id: 'affiliate',
    name: 'Affiliate links',
    needs: 'Products you really use, and clear disclosure',
    first: 'Share a product you already use and say you earn a commission.',
    note: 'Affiliate links are a material connection and must be disclosed clearly.',
  },
  {
    id: 'platform',
    name: 'Platform payouts and subscriptions',
    needs: 'Meeting each platform’s program rules',
    first: 'Check which programs your accounts qualify for.',
    note: 'Eligibility and payout rules change often and differ by country.',
  },
];

export const DISCLOSURE_RULES = [
  'If a brand paid you, gave you product, or you earn a commission, that is a material connection and it must be disclosed.',
  'Disclose clearly and where people will see it: in the video or caption itself, not buried in your bio or a pile of hashtags.',
  'Plain words work best: "Ad", "Sponsored" or "Affiliate". Use the platform’s paid-partnership label too.',
  'Under 18? A parent or guardian should be part of any deal.',
];

// ------------------------------------------------------------------ Stories (Week 4)
export const STORY_TEMPLATES = [
  {
    id: 'connect',
    name: 'Connect: a day behind the scenes',
    goal: 'nurture',
    frames: [
      { purpose: 'Hook', prompt: 'A one-line promise about the day', sticker: 'Question or poll' },
      { purpose: 'Scene', prompt: 'Show the real, unpolished moment', sticker: 'None' },
      { purpose: 'Feeling', prompt: 'Say how it felt, honestly', sticker: 'Emoji slider' },
      { purpose: 'Lesson', prompt: 'What you took from it', sticker: 'None' },
      { purpose: 'Invite', prompt: 'Ask them something back', sticker: 'Question box' },
    ],
  },
  {
    id: 'teach',
    name: 'Teach: one tip in five frames',
    goal: 'position',
    frames: [
      { purpose: 'Hook', prompt: 'The mistake or myth', sticker: 'Poll: did you know?' },
      { purpose: 'Why it matters', prompt: 'What it costs you', sticker: 'None' },
      { purpose: 'The fix', prompt: 'Show the better way', sticker: 'None' },
      { purpose: 'Proof', prompt: 'Your result or a quick demo', sticker: 'None' },
      { purpose: 'Save it', prompt: 'Ask them to share it with someone who needs it', sticker: 'Share' },
    ],
  },
  {
    id: 'validate',
    name: 'Validate: test an offer idea',
    goal: 'position',
    frames: [
      { purpose: 'Problem', prompt: 'Name the problem in their words', sticker: 'Poll: is this you?' },
      { purpose: 'Story', prompt: 'A short Struggle, Move, Win story', sticker: 'None' },
      { purpose: 'Idea', prompt: 'Describe the thing you are thinking of making', sticker: 'Poll: would you use this?' },
      { purpose: 'Question', prompt: 'Ask what would make it most useful', sticker: 'Question box' },
      { purpose: 'Next', prompt: 'Tell them how to get early access', sticker: 'Link or DM prompt' },
    ],
  },
  {
    id: 'sell',
    name: 'Sell: a seven-frame invitation',
    goal: 'convert',
    frames: [
      { purpose: 'Problem', prompt: 'The struggle your offer solves', sticker: 'Poll: does this sound like you?' },
      { purpose: 'Story', prompt: 'Why you care (your Struggle)', sticker: 'None' },
      { purpose: 'Turn', prompt: 'What you did about it (your Move)', sticker: 'None' },
      { purpose: 'Offer', prompt: 'What it is, who it is for, what it costs', sticker: 'Link' },
      { purpose: 'Proof', prompt: 'A result or a testimonial (with permission)', sticker: 'None' },
      { purpose: 'Answer', prompt: 'The one question people always ask', sticker: 'Question box' },
      { purpose: 'Invitation', prompt: 'The single next step', sticker: 'Link or countdown' },
    ],
  },
];

export const STICKERS = ['None', 'Poll', 'Question box', 'Emoji slider', 'Quiz', 'Countdown', 'Link', 'Share'];

// ------------------------------------------------------------------ Offer pitch (Week 4)
export const PITCH_FIELDS = [
  { id: 'struggle', label: 'Their struggle (Struggle)', type: 'longtext', rows: 3, placeholder: 'You send emails to coaches and nobody replies, and you start to wonder if you are good enough.' },
  { id: 'move', label: 'What I did and what the offer does (Move)', type: 'longtext', rows: 3, placeholder: 'I rebuilt my outreach from scratch. This guide gives you the exact five-email system.' },
  { id: 'win', label: 'What changes for them (Win)', type: 'longtext', rows: 3, placeholder: 'You get replies, calls and a clear shortlist of programs that want you.' },
  { id: 'offer', label: 'The offer in one line', type: 'text', placeholder: 'The Recruiting Reply Guide: 5 templates + a follow-up schedule' },
  { id: 'forwho', label: 'Who it is for (and not for)', type: 'text', placeholder: 'For high school juniors and seniors. Not for already-committed athletes.' },
  { id: 'price', label: 'Price and what is included', type: 'text', placeholder: '$29, instant download' },
  { id: 'cta', label: 'One next step', type: 'text', placeholder: 'DM me GUIDE and I will send the link' },
  { id: 'disclosure', label: 'Disclosure (if a brand or affiliate is involved)', type: 'text', placeholder: 'Leave blank if none. Otherwise e.g. "Ad: sponsored by …"' },
];

export function pitchChecks(p = {}) {
  const has = (k, n = 3) => (p[k] || '').trim().split(/\s+/).filter(Boolean).length >= n;
  return [
    { ok: has('struggle', 8), text: 'Starts with their struggle, not with your product.' },
    { ok: has('move', 8), text: 'Explains what you did and what the offer does.' },
    { ok: has('win', 6), text: 'Describes what changes for them.' },
    { ok: has('offer', 3), text: 'Names the offer clearly.' },
    { ok: has('forwho', 4), text: 'Says who it is for.' },
    { ok: has('price', 1), text: 'States the price or that it is free.' },
    { ok: has('cta', 3) && !/\b(and|or)\b.*\b(and|or)\b/i.test(p.cta || ''), text: 'One clear next step (not three).' },
  ];
}

export function assemblePitch(p = {}) {
  const t = (x) => (x || '').trim();
  const lines = [];
  const disclosure = t(p.disclosure);
  if (disclosure) lines.push(disclosure, '');
  if (t(p.struggle)) lines.push(t(p.struggle), '');
  if (t(p.move)) lines.push(t(p.move), '');
  if (t(p.win)) lines.push(t(p.win), '');
  const meta = [t(p.offer), t(p.forwho), t(p.price)].filter(Boolean);
  if (meta.length) lines.push(...meta, '');
  if (t(p.cta)) lines.push(t(p.cta));
  return lines.join('\n').trim();
}

export function assembleDM(p = {}) {
  const t = (x) => (x || '').trim();
  const bits = [];
  bits.push('Hey! Thanks for reaching out.');
  if (t(p.struggle)) bits.push(`You mentioned: ${t(p.struggle).split(/(?<=[.!?])\s/)[0]}`);
  if (t(p.offer)) bits.push(`Here is what I made for exactly that: ${t(p.offer)}.`);
  if (t(p.price)) bits.push(`${t(p.price)}.`);
  bits.push('Want me to send the details?');
  return bits.join(' ');
}

// ------------------------------------------------------------------ Roadmap (Week 4)
export const ROADMAP_PATHS = [
  {
    id: 'grow',
    name: 'Grow my audience',
    metric: 'Followers gained, median views, shares per post',
    weeks: [
      { title: 'Lock the system', actions: ['Plan 5 posts using the Content Calendar', 'Batch film in one 2-hour block', 'Post at least 4 times'] },
      { title: 'Test hooks', actions: ['Write 10 hooks and score them in the Hook Lab', 'Post the 3 best, change only the hook', 'Review which won in Analytics'] },
      { title: 'Double down', actions: ['Make 2 follow-ups to your best post', 'Collaborate or reply to one creator in your niche', 'Tag every post with a mission'] },
      { title: 'Review and reset', actions: ['Compare month 1 to your baseline', 'Retire the weakest format, keep the strongest', 'Set next month’s post goal'] },
    ],
  },
  {
    id: 'product',
    name: 'Launch a first product',
    metric: 'Pilot signups, replies to your validation story, first sales',
    weeks: [
      { title: 'Validate', actions: ['Run a Validate story sequence', 'Talk to 5 people who replied', 'Finish your Offer Sketch'] },
      { title: 'Build the smallest version', actions: ['Create the first version in one weekend', 'Test it free with 3 people', 'Collect one testimonial (with permission)'] },
      { title: 'Warm up', actions: ['Post 2 position posts about the problem', 'Post 1 story-led nurture post', 'Share your pitch in Stories'] },
      { title: 'Open the doors', actions: ['Run the Sell story sequence', 'Post one clear convert post', 'Follow up with everyone who replied'] },
    ],
  },
  {
    id: 'brand',
    name: 'Land a brand partnership',
    metric: 'Pitches sent, replies, deals signed (cleared with your compliance office if required)',
    weeks: [
      { title: 'Check the rules', actions: ['Read your school, league and state rules on deals', 'Talk to your compliance office or a parent or guardian', 'Write down what you will and will not promote'] },
      { title: 'Build your media sheet', actions: ['One page: who you are, your audience, best posts', 'List 15 brands that really fit', 'Use their products for a week if you can'] },
      { title: 'Pitch', actions: ['Send 5 personal pitches', 'Follow up once after a week', 'Post authentic content about brands you already use (no deals needed)'] },
      { title: 'Deliver and learn', actions: ['If you get a yes, get terms in writing and clear them if required', 'Disclose clearly', 'Track the results to show the next brand'] },
    ],
  },
  {
    id: 'coaching',
    name: 'Get coaching or clinic clients',
    metric: 'Free pilot sessions, paid sessions, repeat clients',
    weeks: [
      { title: 'Define the session', actions: ['Write a one-sentence promise for a single session', 'Check the rules and credentials for coaching your age group', 'Decide your price or free pilot'] },
      { title: 'Pilot free', actions: ['Offer 3 free pilot sessions via Stories', 'Run them and ask for feedback', 'Get one testimonial (with permission)'] },
      { title: 'Show the work', actions: ['Post a before and after of a pilot client (with permission)', 'Post a film-room style teach video', 'Pin your best proof'] },
      { title: 'Open paid spots', actions: ['Run the Sell story sequence', 'Take your first paid bookings', 'Ask each client for a referral'] },
    ],
  },
];

export const ROADMAP_BY_ID = Object.fromEntries(ROADMAP_PATHS.map((p) => [p.id, p]));
