// Week 2: editing, pre-flight checks and how discovery works.

export const PREFLIGHT = [
  {
    group: 'First 3 seconds',
    items: [
      { id: 'hookfirst', text: 'The hook is on screen or spoken in the first second.' },
      { id: 'noIntro', text: 'No greeting, logo or slow intro before the point.' },
      { id: 'firstframe', text: 'The first frame is interesting on its own (face, motion or bold text).' },
    ],
  },
  {
    group: 'Keep them watching',
    items: [
      { id: 'cutdead', text: 'I cut every pause, filler word and slow moment.' },
      { id: 'visualchange', text: 'Something changes on screen every 2 to 3 seconds (cut, zoom, b-roll, text).' },
      { id: 'payoff', text: 'The payoff arrives before the viewer would lose interest.' },
      { id: 'loop', text: 'The ending flows back into the start, or ends cleanly with no long outro.' },
    ],
  },
  {
    group: 'Readable and watchable on mute',
    items: [
      { id: 'captions', text: 'Captions or on-screen text carry the message without sound.' },
      { id: 'safezone', text: 'Text sits clear of the app buttons and caption area (top and bottom).' },
      { id: 'contrast', text: 'Text is large and high contrast against the footage.' },
      { id: 'audio', text: 'Speech is clear and music does not drown it out.' },
    ],
  },
  {
    group: 'Before you hit post',
    items: [
      { id: 'cover', text: 'The cover or first frame looks right in the profile grid.' },
      { id: 'caption', text: 'The caption has a first line worth tapping, then the value.' },
      { id: 'cta', text: 'There is one clear call to action, matched to the mission of the post.' },
      { id: 'privacy', text: 'No locations, school names, schedules, or private info in frame (especially under 18).' },
      { id: 'disclosure', text: 'Anything paid, gifted or affiliate is labelled clearly.' },
      { id: 'rights', text: 'I have the rights to the footage and music, and teammates in frame are OK with it.' },
    ],
  },
];

export const WORKFLOW_STEPS = [
  { id: 'idea', label: 'Idea', hint: 'A hook plus a format, tied to a pillar.' },
  { id: 'script', label: 'Scripted', hint: 'Beats written: hook, point, payoff.' },
  { id: 'filmed', label: 'Filmed', hint: 'Raw footage captured.' },
  { id: 'edited', label: 'Edited', hint: 'Cut, captioned, pre-flight checked.' },
  { id: 'posted', label: 'Posted', hint: 'Live and logged in the Post Log.' },
];

export const BATCH_TIPS = [
  'Film several videos in one session. Change a top and location between takes so they feel different.',
  'Script in the app first. A script you can read in 40 seconds beats a perfect one you never film.',
  'Edit in a separate session from filming. Your filming brain and editing brain are different jobs.',
  'Keep a "good enough" rule. If it passes the pre-flight list, it is ready.',
];

// ---------------------------------------------------------------- how discovery works
export const DISCOVERY = [
  {
    title: 'What TikTok says drives your feed',
    body: 'TikTok describes its For You feed as personalised from three kinds of information: what people do (likes, shares, follows, comments, what they create), information about the video (captions, sounds, hashtags), and, as lesser factors, device and account settings like language and country.',
    takeaway: 'Be clear in your captions, sounds and topics so the system can tell who your video is for.',
    source: { label: 'TikTok Newsroom: How TikTok recommends videos for you', href: 'https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you/' },
  },
  {
    title: 'What Instagram’s head has said about Reels',
    body: 'Instagram’s head, Adam Mosseri, has said the signals that matter most for Reels reach are watch time, sends per reach (how often people send it to a friend) and likes per reach. This is reported second-hand by marketing outlets, so treat the details as a guide, not a rulebook.',
    takeaway: 'Make videos worth finishing and worth sending to a friend. Those are your two best levers.',
    source: { label: 'Overview: How the Instagram algorithm works in 2026', href: 'https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026' },
  },
  {
    title: 'What this means for how you make videos',
    body: 'Both platforms reward people who stay, react and share. That is a content-quality problem you can work on: a faster hook, one clear idea, a payoff that arrives, and a reason to send it to someone.',
    takeaway: 'Design for watch time and sends: write for one specific friend.',
  },
  {
    title: 'What nobody can promise',
    body: 'Nobody outside the platforms knows the exact formula, and it changes. Anyone selling a guaranteed "algorithm hack" is guessing. Your own analytics are the only evidence that is about you.',
    takeaway: 'Test, measure against your own median, and keep what works.',
  },
];

export const SIGNAL_CHECKLIST = [
  { id: 'hold', text: 'People stay: strong first 3 seconds and no dead air.' },
  { id: 'send', text: 'It is worth sending: would a friend get this and forward it?' },
  { id: 'save', text: 'It is worth saving: is there something to come back to?' },
  { id: 'clear', text: 'It is clear who it is for: caption, on-screen text and sound match the topic.' },
  { id: 'comment', text: 'It invites a real reply: a question people want to answer.' },
];
