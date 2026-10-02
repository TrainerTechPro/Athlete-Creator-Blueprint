// Athlete archetypes drive which examples, suggestions and safety notes people see.

export const ARCHETYPES = [
  {
    id: 'college',
    label: 'College athlete',
    blurb: 'Competing at the college level and balancing sport, school and life.',
    youth: false,
    pillarIdeas: {
      skill: ['Training breakdowns', 'Film study', 'Recovery habits', 'Nutrition on a student budget'],
      perspective: ['Handling pressure', 'Bouncing back from setbacks', 'Being a student first'],
      lifestyle: ['Game-week routine', 'Student-athlete schedule', 'Life on the road'],
      passion: ['Music', 'Fashion', 'Faith', 'Cooking', 'Gaming'],
    },
    audienceSeeds: ['High schoolers chasing recruitment', 'Freshmen athletes adjusting to college'],
  },
  {
    id: 'pro',
    label: 'Pro or elite athlete',
    blurb: 'Competing professionally or at a national or Olympic level.',
    youth: false,
    pillarIdeas: {
      skill: ['Technique and skill work', 'Mental performance', 'Pro-level recovery'],
      perspective: ['What the highlight reel hides', 'Longevity', 'Money and the athlete career'],
      lifestyle: ['A normal day in the pro life', 'Family and travel', 'Off-season life'],
      passion: ['Investing', 'Fashion', 'Cooking', 'Giving back to my hometown'],
    },
    audienceSeeds: ['College athletes who want to go pro', 'Fans who want the real story'],
  },
  {
    id: 'youth',
    label: 'High school or youth athlete',
    blurb: 'Competing in high school or youth sport, building toward what comes next.',
    youth: true,
    pillarIdeas: {
      skill: ['Skill drills', 'Getting recruited', 'Training on a budget'],
      perspective: ['Nerves and confidence', 'Comparing myself to teammates', 'Balancing school and sport'],
      lifestyle: ['A day in my life', 'Game day routine', 'Practice to homework'],
      passion: ['Music', 'Art', 'Faith', 'Gaming', 'Friends'],
    },
    audienceSeeds: ['Younger athletes in my sport', 'Teammates who feel behind'],
  },
  {
    id: 'post',
    label: 'Retired or transitioning athlete',
    blurb: 'Finished competing, or moving into what comes after the sport.',
    youth: false,
    pillarIdeas: {
      skill: ['What my sport taught me about work', 'Coaching and mentoring', 'Training for regular life'],
      perspective: ['Identity after sport', 'Letting go', 'Starting over'],
      lifestyle: ['My new routine', 'Family', 'Career change'],
      passion: ['Business', 'Travel', 'Fitness for fun', 'Creative projects'],
    },
    audienceSeeds: ['Athletes near the end of their careers', 'Anyone starting over at a new stage'],
  },
  {
    id: 'coach',
    label: 'Coach or trainer',
    blurb: 'Coaching, training or developing other athletes.',
    youth: false,
    pillarIdeas: {
      skill: ['Technique cues', 'Programming', 'Injury prevention'],
      perspective: ['Coaching philosophy', 'What parents and athletes get wrong', 'Culture over talent'],
      lifestyle: ['Behind the scenes of a training day', 'Balancing family and coaching'],
      passion: ['Reading', 'Music', 'Travel', 'Food'],
    },
    audienceSeeds: ['Athletes who feel coached poorly', 'Parents of young athletes'],
  },
];

export const archetypeById = (id) => ARCHETYPES.find((a) => a.id === id) || ARCHETYPES[0];

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube Shorts' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
];

// Used in example text so answers feel like the person's own sport.
export function sportWord(profile, fallback = 'my sport') {
  return (profile?.sport || '').trim() || fallback;
}
