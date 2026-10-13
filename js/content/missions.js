// Week 3: content missions. Every post has a job. Four jobs stack like a funnel:
// at every layer you lose people but keep the right ones, and trust builds as you go down.

export const MISSIONS = [
  {
    id: 'attract',
    name: 'Attract',
    job: 'Reach new people who do not know you yet.',
    asks: 'Is this for me?',
    kpi: 'Shares / sends and views from non-followers',
    formats: ['confession', 'pov', 'expectation', 'silent-film', 'broll-identity'],
    angles: ['Relatable struggle', 'Surprising take', 'Identity callout', 'Trend with your angle'],
    examples: ['"I\'m 17 and I\'m embarrassed to admit I\'m scared of being cut"', 'POV: it is the night before your first college game'],
    cta: 'Soft: follow, send this to a teammate',
    risk: 'Only attracting gives you reach with no connection. People watch, never follow.',
    color: 'hot',
  },
  {
    id: 'nurture',
    name: 'Nurture',
    job: 'Turn viewers into followers who feel they know you.',
    asks: 'Do I like this person?',
    kpi: 'Saves, comments, follows per view',
    formats: ['lesson-loss', 'day-in-life', 'direct-list', 'before-after', 'rank'],
    angles: ['Behind the scenes', 'Story from your Story Bank', 'Lessons learned', 'Day in the life'],
    examples: ['The loss that taught me what confidence is', 'Day in my life as a student-athlete with a 9am lab'],
    cta: 'Engage: comment your answer, save for later',
    risk: 'Only nurturing makes you relatable but unfindable, and no one knows what you can do for them.',
    color: 'ok',
  },
  {
    id: 'position',
    name: 'Position',
    job: 'Show what you know and why you are the one to listen to.',
    asks: 'Can I trust their advice?',
    kpi: 'Saves, shares, profile visits',
    formats: ['rank', 'film-room', 'listicle-swap', 'how-to-become', 'mindset-split', 'direct-list'],
    angles: ['A framework only you teach', 'Contrarian expertise', 'Results and proof', 'Myth busting'],
    examples: ['Bad, good, excellent: ranking recruiting advice', 'What I see on film that most freshmen miss'],
    cta: 'Capture: follow for more, check the link',
    risk: 'Only positioning feels like a lecture. People respect you but do not relate to you.',
    color: 'warn',
  },
  {
    id: 'convert',
    name: 'Convert',
    job: 'Invite the right people to take a next step: buy, book, join, partner.',
    asks: 'Is this worth my time or money?',
    kpi: 'Clicks, DMs, bookings, sales',
    formats: ['direct-list', 'before-after', 'lesson-loss', 'how-to-become'],
    angles: ['A client or student win', 'The problem your offer solves', 'Behind the product', 'Direct invitation'],
    examples: ['"3 things I wish I knew" ending with a free guide', 'How I went from invisible to 4 offers (link in bio)'],
    cta: 'Direct: DM me the word, book, buy, join',
    risk: 'Only selling builds a wall. People tune out and your long-term growth stalls.',
    color: 'accent',
  },
];

export const MISSION_BY_ID = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));

// A starting split, not a law. It is deliberately top-heavy because reach and trust come before sales.
export const RECOMMENDED_MIX = { attract: 40, nurture: 30, position: 20, convert: 10 };

export function mixFromPosts(posts, days = 14) {
  const cutoff = Date.now() - days * 86400000;
  const recent = posts.filter((p) => p.date && new Date(p.date).getTime() >= cutoff);
  const counts = { attract: 0, nurture: 0, position: 0, convert: 0 };
  let tagged = 0;
  recent.forEach((p) => {
    if (counts[p.mission] !== undefined) {
      counts[p.mission]++;
      tagged++;
    }
  });
  const pctOf = (n) => (tagged ? Math.round((n / tagged) * 100) : 0);
  return {
    total: recent.length,
    tagged,
    counts,
    pct: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, pctOf(v)])),
  };
}

export function mixAdvice(mix) {
  const out = [];
  if (!mix.total) return ['Log some posts and tag each with a mission to see your mix.'];
  if (mix.tagged < mix.total) out.push(`${mix.total - mix.tagged} recent post${mix.total - mix.tagged > 1 ? 's are' : ' is'} not tagged with a mission yet.`);
  if (mix.tagged < 3) return [...out, 'Tag at least 3 posts to see patterns.'];
  const { pct, counts } = mix;
  if (counts.convert === 0 && mix.tagged >= 5) out.push('You have not asked for anything yet. When your attract and nurture posts are working, add one convert post.');
  if (pct.convert > 40) out.push('More than 40% of your posts are selling. Balance it with attract and nurture posts or growth will stall.');
  if (pct.attract > 70) out.push('Mostly attract posts: you will get views but little connection. Add nurture posts from your Story Bank.');
  if (pct.attract === 0) out.push('No attract posts: nobody new is finding you. Try a confession B-roll or an expectation vs reality carousel.');
  if (pct.nurture === 0) out.push('No nurture posts: followers do not know you yet. Tell a story from your Story Bank.');
  if (pct.position === 0) out.push('No positioning posts: show what you know with a ranking or a film-room breakdown.');
  if (!out.length) out.push('Your mix is healthy. Keep testing and let your analytics tell you what to do more of.');
  return out;
}

export const FUNNEL_NOTES = [
  'If you only post trends, you get reach and no connection.',
  'If you only sell, you build a wall to your own growth.',
  'If you only share highlights, people cannot relate to you.',
];
