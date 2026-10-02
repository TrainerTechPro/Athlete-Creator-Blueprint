// Lesson 1: the Blueprint. Three parts: SAY (what), REACH (who), WHY (stories).
// The framework is the same idea as a "creator vision": the intersection of what you say,
// who you say it to, and why it matters to you. Wording and examples are original and athlete-specific.

export const PARTS = [
  {
    id: 'say',
    num: '01',
    title: 'What you say',
    short: 'Say',
    blurb: 'The belief, perspective or philosophy that runs through everything you post.',
    question: 'What do you stand for?',
  },
  {
    id: 'reach',
    num: '02',
    title: 'Who you say it to',
    short: 'Reach',
    blurb: 'One primary person you are making content for: their situation, struggle, hopes and who they want to become.',
    question: 'Who needs this?',
  },
  {
    id: 'why',
    num: '03',
    title: 'Why it matters to you',
    short: 'Why',
    blurb: 'The experiences and turning points that give your message weight. They become your story bank.',
    question: 'Why you?',
  },
];

export const DOS = [
  { id: 'experience', title: 'Build from experience', body: 'Let what you have lived, overcome and practised shape what you are known for.' },
  { id: 'specific', title: 'Get specific', body: 'Dig beneath broad topics to the beliefs and moments that make your view yours.' },
  { id: 'connect', title: 'Connect the dots', body: 'Your message, pillars, audience and stories should reinforce each other.' },
  { id: 'psycho', title: 'Think psychographics', body: 'Go beyond age and sport. Include struggles, desires, fears and who they want to become.' },
];

export const DONTS = [
  { id: 'topics', title: 'Do not confuse topics with a message', body: '"Fitness, mindset, recovery" are categories. Your message is the belief that connects them.' },
  { id: 'everyone', title: 'Do not try to speak to everyone', body: 'Pick one primary person to resonate with first.' },
  { id: 'hide', title: 'Do not hide behind information', body: 'Expertise matters. Your experience and perspective are what make the brand personal.' },
  { id: 'generic', title: 'Do not stay generic', body: '"I want to inspire people" is not specific enough to guide a single post.' },
];

// Each question: id, part, kind (for the coach), prompt, why, stems, probes (extra follow-ups), ex by archetype.
export const QUESTIONS = [
  // ------------------------------------------------------------------ SAY
  {
    id: 'say-beliefs',
    part: 'say',
    kind: 'belief',
    prompt: 'What ideas about sport, training or life do you keep coming back to when you talk with teammates, friends or on camera?',
    why: 'The ideas you repeat without trying are your message in disguise. Look for the one that shows up everywhere.',
    stems: ['I keep coming back to the idea that…', 'I am convinced that…', 'The thing nobody told me about {sport} is…'],
    probes: {
      nobelief: [
        'You described what you talk about. What is your take on it? Finish: "Most athletes think ___, but I believe ___."',
      ],
    },
    ex: {
      college:
        'I keep saying that being a good teammate is a skill you train, not a personality trait. At my school the guys who were the loudest in the locker room were rarely the ones who held us together in week eight.',
      pro: 'That the highlight is the smallest part of the job. The invisible habits, sleep, boredom, saying no, are what make a long career. I say it to every rookie.',
      youth:
        'That you do not have to be the best on the team to belong in the sport. I was on JV for two years and I still believe showing up with effort matters more than talent at 15.',
      post: 'That your identity was never the sport. It was the way you handled it. I said that at my retirement and I keep saying it to athletes who are scared of what is next.',
      coach:
        'That most young athletes are not under-trained, they are under-recovered and under-listened to. I coach people to build the base first and I will argue it with anyone.',
    },
  },
  {
    id: 'say-contrarian',
    part: 'say',
    kind: 'contrarian',
    prompt: 'Where do you disagree with the standard advice in your sport or in life because of what you have actually lived?',
    why: 'A contrarian view shaped by real experience is what makes a stranger stop scrolling and trust you.',
    stems: ['Everyone tells athletes to ___, but…', 'The advice I would throw out is…', 'I used to believe ___ until…'],
    probes: {
      nocontrast: ['Think of one piece of advice a coach or influencer gave you that turned out wrong for you. What happened?'],
    },
    ex: {
      college:
        'Everyone says you have to give up your social life to be a serious athlete. I did that freshman year and my performance dropped because I was isolated. Friendships kept me in the sport.',
      pro: 'People say grind harder in the off-season. I got my best season after I cut my volume by a third and slept nine hours.',
      youth:
        'Everyone says play one sport year-round to get recruited. I stayed in three until junior year and my coaches said it made me more athletic, not less.',
      post: 'They say retirement is the end of your career. For me it was the first time I got to choose what I did instead of what I was told.',
      coach:
        'The standard advice is to push through pain. I have seen that end more careers than any injury. My rule is: tell me early, not late.',
    },
  },
  {
    id: 'say-help',
    part: 'say',
    kind: 'help',
    prompt: 'What do teammates, younger athletes, friends or family naturally come to you for help or advice about?',
    why: 'What people ask you about without prompting is the value you already deliver.',
    stems: ['People text me when they need help with…', 'Younger players always ask me how to…'],
    ex: {
      college: 'Teammates ask me how I keep my grades up during season, how I prep for a game, and how I get over a bad performance quickly.',
      pro: 'Younger pros ask how I handle contract stress, travel, and not letting a bad week define me.',
      youth: 'My teammates ask me how to get over nerves before games and how I stay calm when the coach yells.',
      post: 'Former teammates ask how to figure out what is next after sport, and how I handled losing my routine.',
      coach: 'Parents ask me what their kid should be doing, athletes ask me why they plateau, and other coaches ask how I run practice.',
    },
  },
  {
    id: 'say-pillars',
    part: 'say',
    kind: 'pillar',
    type: 'pillars',
    prompt: 'What are your four content pillars: your skill, your perspective, your lifestyle and your passion?',
    why: 'Pillars give you endless post ideas while keeping everything tied to your message. Lifestyle and passion are allowed. You are the niche, not just your expertise.',
    pillars: [
      { id: 'skill', label: 'Skill', hint: 'What you can teach or show.' },
      { id: 'perspective', label: 'Perspective', hint: 'How you see the game, pressure or life.' },
      { id: 'lifestyle', label: 'Lifestyle', hint: 'How you live around the sport.' },
      { id: 'passion', label: 'Passion', hint: 'What you love outside your main thing.' },
    ],
    ex: {
      all: 'Skill: speed and acceleration drills. Perspective: handling pressure. Lifestyle: game-week routine as a student-athlete. Passion: cooking.',
    },
  },

  // ------------------------------------------------------------------ REACH
  {
    id: 'who-who',
    part: 'reach',
    kind: 'audience',
    prompt: 'Who do you most want to reach? Think age, life stage, level of sport, location.',
    why: 'Start with a younger version of yourself. Who were you, what were you stuck on, what do you wish someone had explained? People a few steps behind you need what you already learned.',
    stems: ['I am talking to a…', 'The person I picture is…'],
    ex: {
      college:
        'A 17 year old high school junior in my sport who is trying to get recruited and has no idea how the process works, whose parents are supportive but unfamiliar with college sports.',
      pro: 'A 20 year old college senior who dreams of playing pro and thinks everything about the pro life is glamorous.',
      youth: 'A 13 to 15 year old in my sport who is a bit smaller or later to develop and starting to feel left behind.',
      post: 'A 22 to 30 year old athlete whose career just ended or is about to, who feels like they do not know who they are without it.',
      coach: 'A parent of a 10 to 14 year old athlete who wants the best for their kid but is not sure how to support them.',
    },
  },
  {
    id: 'who-pain',
    part: 'reach',
    kind: 'pain',
    prompt: 'What is this person struggling with right now? Frustrations, obstacles, fears.',
    why: 'Pain points are the doorway. If your content names what they are feeling, they feel seen.',
    stems: ['They are afraid that…', 'Every day they feel…', 'What keeps them up is…'],
    ex: {
      college: 'They are afraid of getting to college and being exposed as not good enough. They feel like they are guessing about recruiting emails and every coach seems to ignore them.',
      pro: 'They feel the pressure of being the one who made it. They are scared to admit they are tired, hurt or lonely because everyone expects them to be grateful.',
      youth: 'They feel invisible next to teammates who grew earlier, and they are embarrassed to ask for extra help.',
      post: 'They feel empty without the structure and applause. They are anxious about money and ashamed that they do not feel excited.',
      coach: 'They worry they are doing too much or too little for their kid. They feel guilty about the cost and stressed about playing time.',
    },
  },
  {
    id: 'who-want',
    part: 'reach',
    kind: 'desire',
    prompt: 'What do they deeply want that they do not have yet? Outcomes, opportunities, feelings.',
    why: 'Desire is what they would pay, follow and share for. Name the outcome and the feeling underneath it.',
    stems: ['More than anything they want…', 'They would give anything to feel…'],
    ex: {
      college: 'They want an offer, but underneath that they want to feel like they belong and that the sacrifices were worth it.',
      pro: 'They want a long career and the freedom to enjoy it without carrying everyone else\'s expectations.',
      youth: 'They want to make the team and have their friends and coach take them seriously.',
      post: 'They want a sense of purpose again and permission to be proud of their career without being defined by it.',
      coach: 'They want their kid to be happy, confident and healthy, and to have a real shot at what the kid loves.',
    },
  },
  {
    id: 'who-become',
    part: 'reach',
    kind: 'identity',
    prompt: 'Who are they trying to become? Think identity, lifestyle, career, relationships, the version of themselves they aspire to.',
    why: 'People follow creators who help them become someone. This is the identity your content invites them into.',
    stems: ['They want to be the kind of person who…', 'In a year they want to be seen as…'],
    ex: {
      college: 'A confident college athlete who handles school, sport and a social life without burning out, and who teammates look to as a leader.',
      pro: 'A professional who is respected for how they act when no one is watching, and who has a plan beyond the sport.',
      youth: 'A confident player who walks into tryouts calm, has real friends on the team, and is known as someone who works hard.',
      post: 'A person who proudly says what they did in sport and is excited about what they are building now.',
      coach: 'A calm, informed sports parent who is the safe place for their kid, not another source of pressure.',
    },
  },

  // ------------------------------------------------------------------ WHY (story mining)
  {
    id: 'why-origin',
    part: 'why',
    kind: 'story',
    prompt: 'What experiences from your early life or first years in sport shaped how you see yourself, other people or the world?',
    why: 'Origin stories explain why your beliefs are yours. Think Problem, then Pursuit, then Payoff.',
    stems: ['When I was ___ I…', 'The first time I realised…', 'My dad / mom / coach told me…'],
    ex: {
      all: 'When I was 12 I got cut from the travel team and the coach told me I would never be fast enough. I was embarrassed and told nobody. So I started running stairs before school with my brother counting for me. Two years later I beat that same coach\'s son in the 100 and I realised speed was something you build, not something you are born with.',
    },
  },
  {
    id: 'why-changed',
    part: 'why',
    kind: 'story',
    prompt: 'What did you once believe that you no longer believe, and what changed your mind?',
    why: 'Changed beliefs give you transformation stories and perspective shifts, which are the heart of strong content.',
    stems: ['I used to think ___. Then…', 'What changed my mind was…'],
    ex: {
      all: 'I used to think resting was weakness. In college I played through a stress fracture because I felt guilty sitting out. It cost me my senior season. That is when I realised the toughest thing you can do is tell someone you are hurt, and now I teach that.',
    },
  },
  {
    id: 'why-tried',
    part: 'why',
    kind: 'story',
    prompt: 'What have you tried, built, survived or chased, in or outside sport, that taught you something worth sharing?',
    why: 'Do not limit this to your sport. Lifestyle, money, relationships, school and side projects all count.',
    stems: ['The thing I chased was…', 'I learned the hard way that…'],
    ex: {
      all: 'I started a small training business in my dorm with three clients and lost money the first month because I did not charge enough. I raised my price, got specific about who I help, and got 20 clients by spring. The lesson was that being clear beats being cheap.',
    },
  },
];

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const questionsFor = (part) => QUESTIONS.filter((q) => q.part === part);

// Extra prompts to mine the story bank. Each can be turned into a Problem / Pursuit / Payoff card.
export const STORY_PROMPTS = [
  { id: 'sp-loss', tag: 'Setback', label: 'A loss, cut, benching or injury that changed you' },
  { id: 'sp-quit', tag: 'Doubt', label: 'A moment you almost quit' },
  { id: 'sp-win', tag: 'Win', label: 'A small win nobody saw' },
  { id: 'sp-identity', tag: 'Identity', label: 'A time you did not know who you were without the sport' },
  { id: 'sp-money', tag: 'Money', label: 'A money, sponsor or business lesson' },
  { id: 'sp-people', tag: 'People', label: 'A teammate, coach or family moment that stuck with you' },
  { id: 'sp-body', tag: 'Body', label: 'A health, body or recovery story' },
  { id: 'sp-school', tag: 'Balance', label: 'A school-versus-sport balancing act' },
];

export const STORY_TAGS = ['Setback', 'Doubt', 'Win', 'Identity', 'Money', 'People', 'Body', 'Balance', 'Other'];

export const THREE_BEATS = [
  { id: 'problem', label: 'Struggle', formal: 'Problem', body: 'The challenge, tension or situation that created a need for change. It gives people a reason to care what happens next.' },
  { id: 'pursuit', label: 'Move', formal: 'Pursuit', body: 'What you did about it: decisions, attempts, obstacles and lessons.' },
  { id: 'payoff', label: 'Win', formal: 'Payoff', body: 'What happened: the result, transformation, realisation or lesson. This gives meaning to everything before it.' },
];

export const FAQ = [
  { q: 'I have a lot of ideas. How do I know what my main message is?', a: 'Look for the strongest throughline across your reflections. Your message is the central belief, perspective or transformation that connects what you want to talk about.' },
  { q: 'What if my message still feels too broad?', a: 'Ask whether it could belong to thousands of other creators. If it could, get more specific about the belief you hold, the problem you address or the transformation you represent.' },
  { q: 'How do I know I chose the right pillars?', a: 'Each pillar should give you lots of content ideas while still connecting back to your central message. If you cannot explain how a pillar supports your message, reconsider it.' },
  { q: 'Can I include lifestyle or personal interests?', a: 'Yes. You are the niche, so your brand can reflect more than expertise. The goal is a personal brand, not an educational page. Lifestyle and interests help people connect with the person behind the information.' },
  { q: 'What if I could speak to more than one type of person?', a: 'That is fine, but choose one primary person for now. Your content may resonate beyond them, but one person in mind makes the messaging much more specific.' },
  { q: 'How do I turn all my stories into one blueprint?', a: 'You do not squeeze them into one story. Keep a story bank of setback stories, identity stories, money stories and so on that you can pull from when creating.' },
  { q: 'What if parts of my Blueprint do not feel connected?', a: 'Look for the throughline. Your message, audience, pillars and stories do not need to say the same thing, but they should feel like they belong to the same creator and support the same direction.' },
  { q: 'Is my Blueprint final once I finish?', a: 'No. This is your first draft. It should evolve as you post, test ideas, learn what resonates and gain clarity about yourself as a creator.' },
];

// The "Message statement" builder: four short fields, assembled into one sentence.
export const STATEMENT_FIELDS = [
  { id: 'who', label: 'I help', placeholder: 'e.g. high school athletes chasing recruitment', from: 'who-who' },
  { id: 'struggle', label: 'who struggle with', placeholder: 'e.g. feeling invisible to coaches', from: 'who-pain' },
  { id: 'outcome', label: 'to', placeholder: 'e.g. get seen and feel like they belong (start with a verb)', from: 'who-want' },
  { id: 'angle', label: 'through', placeholder: 'e.g. what I learned going from JV bench to starting', from: 'say-beliefs' },
];

export function assembleStatement(s = {}) {
  const t = (x) => (x || '').trim().replace(/[.\s]+$/, '');
  if (!t(s.who) && !t(s.struggle) && !t(s.outcome) && !t(s.angle)) return '';
  const bits = [];
  bits.push(`I help ${t(s.who) || '…'}`);
  if (t(s.struggle)) bits.push(`who struggle with ${t(s.struggle)}`);
  bits.push(`to ${t(s.outcome) || '…'}`);
  if (t(s.angle)) bits.push(`through ${t(s.angle)}`);
  return bits.join(' ') + '.';
}

export function exampleFor(question, archetype) {
  const ex = question.ex || {};
  return ex[archetype] || ex.all || '';
}
