// Week 0: the Launch Pad. Setup tasks, mindset principles and the starting-point reflections.

export const LAUNCH_CHECKS = [
  {
    id: 'platforms',
    title: 'Pick the 1 or 2 platforms you will work on',
    body: 'Depth beats spread. Choose where your people already are and commit to those for the next few weeks.',
  },
  {
    id: 'public',
    title: 'Make your accounts public and switch to a creator profile',
    body: 'Public accounts can be discovered and reviewed. On Instagram, switch to a Creator account to unlock insights.',
  },
  {
    id: 'handles',
    title: 'Save your handles in your profile',
    body: 'So your coach and this app know exactly which accounts you are building on.',
    auto: 'handles',
  },
  {
    id: 'calendar',
    title: 'Block your creation time',
    body: 'Put three short creation blocks in your calendar this week, the way you would protect practice.',
  },
  {
    id: 'safety',
    title: 'Read the athlete safety checklist',
    body: 'Privacy, team rules and sponsorship disclosure. Takes two minutes and saves headaches.',
    auto: 'safety',
  },
  {
    id: 'firstpost',
    title: 'Post one piece of content as your starting point',
    body: 'Do not wait until you know how to make it "better". A real post gives you and your coach something to work with from day one.',
    auto: 'firstpost',
  },
  {
    id: 'intro',
    title: 'Introduce yourself to your coach or community',
    body: 'Who you are, where you are in your creator journey, and what you want to build.',
  },
  {
    id: 'fun',
    title: 'Decide to have fun with it',
    body: 'You invested in yourself. Treat the next few weeks like a training block you actually enjoy.',
  },
];

export const SAFETY = [
  {
    id: 'rules',
    title: 'Know your sport and school rules before you monetise',
    body: 'Rules about name, image and likeness, sponsorships and brand deals differ by school, state and league and keep changing. Check with your compliance office or governing body before you sign or accept anything.',
  },
  {
    id: 'disclose',
    title: 'Label paid and gifted content clearly',
    body: 'If a brand paid you, gave you product or you earn a commission, say so plainly in the post, using the platform\'s paid-partnership label where it exists.',
  },
  {
    id: 'private',
    title: 'Protect your privacy and your team\'s',
    body: 'Do not share live locations, home addresses, travel itineraries or team plays and injuries that are not public. Post trips after you have left.',
  },
  {
    id: 'team',
    title: 'Check team and coach expectations',
    body: 'Some teams restrict filming in locker rooms, practices or travel. Ask first and keep teammates out of frame unless they agree.',
  },
];

export const YOUTH_NOTE =
  'Because you are under 18, bring a parent or guardian into this. They should know your accounts, review any brand contact and be part of any deal. Keep locations, school names and schedules out of your posts.';

export const MINDSET = [
  {
    id: 'eighty',
    title: 'Aim for 80 percent, then post',
    body: 'You cannot see what needs to change until the work meets real feedback. For your Blueprint, move on when you feel about 60 percent sure. You will come back to it. For posts: publish, watch, take one lesson into the next one. Most time lost in a program like this comes from overthinking.',
  },
  {
    id: 'time',
    title: 'Book the time like practice',
    body: 'Winning creators do not wait to find time. They protect blocks to create, separate from any calls or lessons. Filming at midnight is not a system you can keep.',
  },
  {
    id: 'focus',
    title: 'Do not do everything. Close the gap in front of you',
    body: 'The trap is consuming every lesson and resource and reaching week three with nothing posted. Find the one thing between you and your next level and put your time there.',
  },
  {
    id: 'doing',
    title: 'Learn by doing',
    body: 'Take one thing from each lesson and put it in a post, not just your notes. You do not go from scrambling eggs to running a kitchen overnight. Practise one thing at a time and the reps add up.',
  },
  {
    id: 'ready',
    title: 'Being ready is a decision',
    body: 'It is not a feeling that shows up on its own. This is your time to try, flop, feel cringe, learn and try again.',
  },
  {
    id: 'action',
    title: 'Lean toward action',
    body: 'When you have 30 free minutes, make the post instead of watching one more video. Learning feels productive. Action shows you what you actually know.',
  },
];

export const LOOP = [
  { id: 'learn', label: 'Learn', body: 'Take one idea from your Blueprint or a lesson.' },
  { id: 'post', label: 'Post', body: 'Put it in your next post while it is fresh.' },
  { id: 'feedback', label: 'Feedback', body: 'Bring the post and one question to your coach, or review the numbers yourself.' },
  { id: 'apply', label: 'Apply', body: 'Change one thing, then run the loop again.' },
];

// Reflection questions asked during Week 0. Rewritten for athletes.
export const START_QUESTIONS = [
  {
    id: 'j-pull',
    group: 'Your creator journey',
    kind: 'reflect',
    prompt: 'What made you want to start creating content in the first place? What pulled you toward it?',
    why: 'Your original reason is the energy you will lean on when posting gets hard.',
    stems: ['I first thought about posting when…', 'What pulled me in was…'],
    ex: {
      all: 'After my injury I realised nobody was talking about the part nobody sees: the rehab, the mental side. I wanted to be the account I needed to find when I was sitting out.',
    },
  },
  {
    id: 'j-leaving',
    group: 'Your creator journey',
    kind: 'reflect',
    prompt: 'What would you be leaving on the table if you did not take action over the next five weeks?',
    why: 'Naming the cost of waiting is more motivating than naming the goal.',
    stems: ['If I do nothing, in five weeks I will still…', 'The opportunity I do not want to miss is…'],
    ex: { all: 'Another season of watching other athletes get noticed and brand opportunities while my story stays in my head.' },
  },
  {
    id: 'j-hardest',
    group: 'Your creator journey',
    kind: 'reflect',
    prompt: 'What feels hardest about content creation for you right now?',
    why: 'The hardest part tells your coach, and this app, where to focus.',
    stems: ['The part I avoid is…', 'I get stuck when…'],
    ex: { all: 'Putting my face and my voice on camera. I overthink every take and end up posting nothing.' },
  },
  {
    id: 'j-natural',
    group: 'Your creator journey',
    kind: 'reflect',
    prompt: 'What have you already learned about yourself as a creator? What feels natural to you?',
    why: 'Strengths you already have are the fastest route to a consistent style.',
    stems: ['People tell me I am good at…', 'It comes easy when I…'],
    ex: { all: 'Explaining things simply. Teammates always ask me to break down plays and techniques.' },
  },
  {
    id: 'c-five',
    group: 'Your next chapter',
    kind: 'vision',
    prompt: 'Five weeks from now, what do you want to be able to do that you cannot do today?',
    why: 'You cannot create toward a future you have not described. The more specific, the easier it is to work toward.',
    stems: ['In five weeks I want to be able to…', 'I will know it worked if…'],
    ex: { all: 'Post three times a week without dreading it, and have a clear idea of what my page is about in one sentence.' },
  },
  {
    id: 'c-known',
    group: 'Your next chapter',
    kind: 'vision',
    prompt: 'What do you want people to know you for?',
    why: 'This is the early draft of your message. It will get sharper in the Blueprint.',
    stems: ['I want to be known as the athlete who…', 'When people think of me they should think…'],
    ex: { all: 'The athlete who made the mental side of sport normal to talk about.' },
  },
  {
    id: 'c-year',
    group: 'Your next chapter',
    kind: 'vision',
    prompt: 'Where do you want to be as a creator one year from now?',
    why: 'A one-year picture gives your weekly work a direction.',
    stems: ['A year from now I want…', 'My page looks like…'],
    ex: { all: 'A page with a real community, a few brand partnerships that fit me, and a routine I enjoy.' },
  },
  {
    id: 'c-freedom',
    group: 'Your next chapter',
    kind: 'vision',
    prompt: 'What would you create if you stopped worrying about what would perform?',
    why: 'This often points to the content you will actually keep making.',
    stems: ['If nobody was counting views I would…', 'The video I keep not making is…'],
    ex: { all: 'Honest videos about what it is like to lose and keep going, not just highlights.' },
  },
];
