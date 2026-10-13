// Weeks 2 to 4. Each week has a theme, goals (some auto-tracked from the tools), seven days of tasks
// with a check-in each, and a short recap with Do's and Don'ts and a mini FAQ.
// Goal `auto` keys are evaluated in progress.js.

export const WEEKS = {
  2: {
    n: 2,
    title: 'Formats and workflow that get views',
    short: 'Formats & workflow',
    route: '#/week/2',
    tagline: 'You can have the best message in the world and still not win without the right packaging.',
    overview:
      'Week 1 gave you a message. Week 2 is about packaging and process. You will study formats that already work for creators ahead of you, build a bank of hooks, plan and batch a week of content, tighten your editing, and sketch the first idea for something you could offer.',
    summary:
      'Format is the packaging of your idea, and it is what the platforms distribute. Find formats that already work for people ahead of you, adapt them to your Blueprint, and build a repeatable workflow so posting does not depend on motivation.',
    tools: ['swipe', 'hooks', 'calendar', 'edit', 'discovery', 'offer'],
    goals: [
      { id: 'refs', title: 'Break down 7 reference posts', body: 'Study what works for creators ahead of you and why.', auto: 'refs' },
      { id: 'hooks', title: 'Build a bank of 10 hooks', body: 'Write, score and save hooks in the Hook Lab.', auto: 'hooks' },
      { id: 'plan', title: 'Plan a week of content', body: 'Put at least 5 posts on your Content Calendar.', auto: 'calendar' },
      { id: 'post', title: 'Post this week', body: 'Publish at least your weekly post goal and log each one.', auto: 'posts' },
      { id: 'offer', title: 'Sketch your first offer', body: 'Who it is for, the problem and the promise.', auto: 'offer' },
      { id: 'review', title: 'Get feedback once', body: 'Bring one post and one clear question to your coach.', auto: null },
    ],
    days: [
      { n: 1, focus: 'Find the patterns that already work.', tasks: [
        { id: 'w2d1a', text: 'Collect and break down 3 reference posts from creators ahead of you.', link: '#/tools/swipe' },
        { id: 'w2d1b', text: 'Read how discovery works so you design for the right signals.', link: '#/tools/discovery' },
        { id: 'w2d1c', text: 'Check today’s coaching session or catch up on notes.' },
      ], checkin: 'What do the posts that work have in common?' },
      { n: 2, focus: 'Turn ideas into content.', tasks: [
        { id: 'w2d2a', text: 'Finish 7 reference breakdowns.', link: '#/tools/swipe' },
        { id: 'w2d2b', text: 'Pick 3 formats to test this week from your Format Bank shortlist.', link: '#/formats' },
        { id: 'w2d2c', text: 'Show up to a content review with one clear question.', link: '#/plan/audit' },
      ], checkin: 'Which format do you most want to try, and what scares you about it?' },
      { n: 3, focus: 'Write hooks.', tasks: [
        { id: 'w2d3a', text: 'Write 10 hooks and score them in the Hook Lab.', link: '#/tools/hooks' },
        { id: 'w2d3b', text: 'Save the 5 best to your Idea Bank.', link: '#/tools/hooks' },
        { id: 'w2d3c', text: 'Rewrite your weakest hook using the tips.' },
      ], checkin: 'Which hook would you stop scrolling for, and why?' },
      { n: 4, focus: 'Plan and batch.', tasks: [
        { id: 'w2d4a', text: 'Plan 5 posts on your Content Calendar: hook, format, pillar.', link: '#/tools/calendar' },
        { id: 'w2d4b', text: 'Script two of them using Struggle, Move, Win.', link: '#/tools/calendar' },
        { id: 'w2d4c', text: 'Block one batch-filming session in your calendar.' },
      ], checkin: 'What is the easiest time and place for you to film?' },
      { n: 5, focus: 'Film and edit.', tasks: [
        { id: 'w2d5a', text: 'Film at least 3 videos in one session.' },
        { id: 'w2d5b', text: 'Edit one using the pre-flight checklist.', link: '#/tools/edit' },
        { id: 'w2d5c', text: 'Post it and log it.', link: '#/posts' },
      ], checkin: 'What slowed you down in editing?' },
      { n: 6, focus: 'Sketch an offer.', tasks: [
        { id: 'w2d6a', text: 'Fill in your Offer Sketch: who, problem, promise.', link: '#/tools/offer' },
        { id: 'w2d6b', text: 'Look for validation signals in your comments and DMs.', link: '#/tools/offer' },
        { id: 'w2d6c', text: 'Keep posting toward your weekly goal.', link: '#/posts' },
      ], checkin: 'What do people already ask you for help with?' },
      { n: 7, focus: 'Review, refine, repeat.', tasks: [
        { id: 'w2d7a', text: 'Check your weekly goals and tick off what you completed.', link: '#/week/2' },
        { id: 'w2d7b', text: 'Log numbers for your posts and note one lesson each.', link: '#/posts' },
        { id: 'w2d7c', text: 'Pick the format you will double down on next week.' },
      ], checkin: 'What is one thing you understand about formats now that you did not a week ago?' },
    ],
    dos: ['Study formats that already work, then adapt them to your message.', 'Write the hook before you film.', 'Batch film, edit separately.', 'Use the pre-flight list before every post.'],
    donts: ['Do not copy someone else’s post. Borrow the structure, not the content.', 'Do not skip the hook to save time.', 'Do not edit while filming.', 'Do not wait for perfect. Done and posted beats polished and hidden.'],
    faq: [
      { q: 'How do I find formats that work?', a: 'Look at creators a few steps ahead of you in your niche. Break down 7 of their best posts: the hook, the format, the length, the sound, the payoff. Look for the pattern across them.' },
      { q: 'Can I reuse a format over and over?', a: 'Yes. The format is the container. Your story, topic and voice change every time. Many creators repeat 3 to 5 formats for months.' },
      { q: 'I hate editing. What should I do?', a: 'Pick formats that need little editing (a single clip with text, a carousel) and use the pre-flight list so the basics are covered.' },
    ],
  },

  3: {
    n: 3,
    title: 'Content missions: turn views into trust',
    short: 'Content missions',
    route: '#/week/3',
    tagline: 'Every post has a job. Post with an intention.',
    overview:
      'To build a lasting, monetisable brand you need a clear posting strategy. This week you assign every post one of four missions (attract, nurture, position, convert), read your analytics against your own baseline, and build the path that turns attention into conversations.',
    summary:
      'Four missions stack like a funnel. At every layer you lose people but keep the right ones, and trust builds as you go down. Only trends gives reach without connection. Only selling builds a wall. Only highlights makes you unrelatable. Monetisation is the advanced goal: take it on once the basics are in place.',
    tools: ['missions', 'analytics', 'leads', 'monetize'],
    goals: [
      { id: 'tag', title: 'Tag your posts with missions', body: 'Tag at least 4 recent posts with a mission.', auto: 'tagged' },
      { id: 'all', title: 'Post all four missions', body: 'At least one attract, nurture, position and convert post in two weeks.', auto: 'allMissions' },
      { id: 'numbers', title: 'Log numbers for 3 posts', body: 'You cannot learn from numbers you do not record.', auto: 'numbers' },
      { id: 'ladder', title: 'Build your call-to-action ladder', body: 'Soft, engage, capture and convert asks that match your offer.', auto: 'ladder' },
      { id: 'ready', title: 'Check your readiness', body: 'Honest self-check before you try to earn from content.', auto: 'ready' },
      { id: 'review', title: 'Get feedback once', body: 'Bring one post and one clear question to your coach.', auto: null },
    ],
    days: [
      { n: 1, focus: 'Understand the four missions.', tasks: [
        { id: 'w3d1a', text: 'Read the four missions and write an example post for each.', link: '#/tools/missions' },
        { id: 'w3d1b', text: 'Tag your recent posts with a mission.', link: '#/posts' },
        { id: 'w3d1c', text: 'Check today’s coaching session or catch up.' },
      ], checkin: 'Which mission is your current content doing the most, and which is missing?' },
      { n: 2, focus: 'Plan the funnel.', tasks: [
        { id: 'w3d2a', text: 'Plan a week with a mission on every post.', link: '#/tools/missions' },
        { id: 'w3d2b', text: 'Match each mission to a format from the Format Bank.', link: '#/formats' },
        { id: 'w3d2c', text: 'Post one attract post.', link: '#/posts' },
      ], checkin: 'Which mission feels hardest for you to make content for?' },
      { n: 3, focus: 'Read your numbers.', tasks: [
        { id: 'w3d3a', text: 'Add numbers to at least 3 posts.', link: '#/posts' },
        { id: 'w3d3b', text: 'Open the Analytics Reader and look for one pattern.', link: '#/tools/analytics' },
        { id: 'w3d3c', text: 'Post one nurture post from your Story Bank.', link: '#/blueprint/why/bank' },
      ], checkin: 'What is one thing your numbers surprised you with?' },
      { n: 4, focus: 'Position yourself.', tasks: [
        { id: 'w3d4a', text: 'Post one position post (ranking, film room or a how-to).', link: '#/posts' },
        { id: 'w3d4b', text: 'Audit your profile with the conversion checklist.', link: '#/tools/leads' },
        { id: 'w3d4c', text: 'Update your bio if needed.', link: '#/plan/bio' },
      ], checkin: 'If a stranger saw your profile for 5 seconds, what would they think you do?' },
      { n: 5, focus: 'Build the path to conversations.', tasks: [
        { id: 'w3d5a', text: 'Create your call-to-action ladder.', link: '#/tools/leads' },
        { id: 'w3d5b', text: 'Design a simple free resource that earns a keyword reply.', link: '#/tools/leads' },
        { id: 'w3d5c', text: 'Post one convert post with a clear, honest ask.', link: '#/posts' },
      ], checkin: 'What free resource could you give that is genuinely useful?' },
      { n: 6, focus: 'Check readiness.', tasks: [
        { id: 'w3d6a', text: 'Complete the monetisation readiness check.', link: '#/tools/monetize' },
        { id: 'w3d6b', text: 'Read the disclosure and rules notes.', link: '#/tools/monetize' },
        { id: 'w3d6c', text: 'Keep posting toward your weekly goal.', link: '#/posts' },
      ], checkin: 'What is the biggest gap between you and your first income from content?' },
      { n: 7, focus: 'Review, refine, repeat.', tasks: [
        { id: 'w3d7a', text: 'Check your mission mix for the last 14 days.', link: '#/tools/missions' },
        { id: 'w3d7b', text: 'Log lessons on your top and bottom posts.', link: '#/posts' },
        { id: 'w3d7c', text: 'Decide which mission to do more of next week.' },
      ], checkin: 'What will you change about your content mix next week?' },
    ],
    dos: ['Give every post one mission.', 'Compare your numbers to your own median.', 'Offer a free resource that is genuinely useful.', 'Label paid, gifted and affiliate content clearly.'],
    donts: ['Do not only chase trends, only sell, or only share highlights.', 'Do not judge a post by one number.', 'Do not promise results you cannot back up.', 'Do not accept or promote anything before checking your athletic eligibility rules.'],
    faq: [
      { q: 'Does every post need a mission?', a: 'Yes, but only one. A post trying to attract, teach and sell at once usually does none of them well.' },
      { q: 'How much should I sell?', a: 'Start with about one convert post for every nine others, then adjust. If your audience is small, build trust first.' },
      { q: 'I am under 18 or a college athlete. Can I earn money?', a: 'Often yes, but the rules differ by sport, school, state and age, and they change. Check with your compliance office and a parent or guardian before you sign or accept anything.' },
    ],
  },

  4: {
    n: 4,
    title: 'Stories, selling and what comes next',
    short: 'Stories & selling',
    route: '#/week/4',
    tagline: 'Tie it together: stories that build trust, and a plan for what you do next.',
    overview:
      'Every week built on the one before. This week you turn your story into Stories, learn to invite people to a next step without feeling pushy, choose your path forward and leave with a 30-day roadmap. By the end you have one cohesive strategy: a Blueprint that tells you what to post, formats you can repeat, missions for every post, and a way to turn viewers into people who trust you.',
    summary:
      'Selling is just an honest invitation to people who already trust you, built on a story: their struggle, your move, their win. Monetisation is the advanced goal of the week: take it on once your basics are in place, leave it for later if not.',
    tools: ['stories', 'pitch', 'roadmap', 'strategy'],
    goals: [
      { id: 'stories', title: 'Plan a story sequence', body: 'Build a sequence of at least 5 frames.', auto: 'stories' },
      { id: 'pitch', title: 'Write your offer pitch', body: 'Struggle, Move, Win and one clear ask.', auto: 'pitch' },
      { id: 'roadmap', title: 'Choose a path and build your 30-day roadmap', body: 'Pick one direction and commit to the first month.', auto: 'roadmap' },
      { id: 'post', title: 'Post this week', body: 'Publish at least your weekly post goal and log each one.', auto: 'posts' },
      { id: 'strategy', title: 'Review your strategy one-pager', body: 'See everything in one place and mark it complete.', auto: 'strategy' },
      { id: 'review', title: 'Get feedback once', body: 'Bring one post and one clear question to your coach.', auto: null },
    ],
    days: [
      { n: 1, focus: 'Turn your story into Stories.', tasks: [
        { id: 'w4d1a', text: 'Pick a story from your Story Bank to tell across 5 frames.', link: '#/tools/stories' },
        { id: 'w4d1b', text: 'Plan the sequence and post it.', link: '#/tools/stories' },
        { id: 'w4d1c', text: 'Check today’s coaching session or catch up.' },
      ], checkin: 'Which story from your bank would build the most trust?' },
      { n: 2, focus: 'Validate before you build.', tasks: [
        { id: 'w4d2a', text: 'Run a Validate sequence for your offer idea.', link: '#/tools/stories' },
        { id: 'w4d2b', text: 'Read every reply and note the real words people use.', link: '#/tools/offer' },
        { id: 'w4d2c', text: 'Update your Offer Sketch.', link: '#/tools/offer' },
      ], checkin: 'What did people say that you did not expect?' },
      { n: 3, focus: 'Write your pitch.', tasks: [
        { id: 'w4d3a', text: 'Write your pitch as Struggle, Move, Win.', link: '#/tools/pitch' },
        { id: 'w4d3b', text: 'Run the pitch checks and tighten it.', link: '#/tools/pitch' },
        { id: 'w4d3c', text: 'Write the DM reply you will send.', link: '#/tools/pitch' },
      ], checkin: 'Does your pitch sound like you, or like an ad?' },
      { n: 4, focus: 'Choose your path.', tasks: [
        { id: 'w4d4a', text: 'Pick one path for the next 30 days.', link: '#/tools/roadmap' },
        { id: 'w4d4b', text: 'Review your readiness result and the rules notes.', link: '#/tools/monetize' },
        { id: 'w4d4c', text: 'Customise the first week of your roadmap.', link: '#/tools/roadmap' },
      ], checkin: 'Why this path and not the others?' },
      { n: 5, focus: 'Sell honestly.', tasks: [
        { id: 'w4d5a', text: 'Run a Sell story sequence or post a convert post.', link: '#/tools/stories' },
        { id: 'w4d5b', text: 'Reply to every DM and comment within a day.' },
        { id: 'w4d5c', text: 'Log the post and what happened.', link: '#/posts' },
      ], checkin: 'How did it feel to ask? What would make it easier?' },
      { n: 6, focus: 'Bring it together.', tasks: [
        { id: 'w4d6a', text: 'Open your strategy one-pager and fill any gaps.', link: '#/tools/strategy' },
        { id: 'w4d6b', text: 'Print or save it as a PDF.', link: '#/tools/strategy' },
        { id: 'w4d6c', text: 'Keep posting toward your weekly goal.', link: '#/posts' },
      ], checkin: 'What is the clearest sentence you can now say about your brand?' },
      { n: 7, focus: 'Celebrate and commit.', tasks: [
        { id: 'w4d7a', text: 'Mark your strategy complete and see your journey stats.', link: '#/tools/strategy' },
        { id: 'w4d7b', text: 'Share a win with your community.' },
        { id: 'w4d7c', text: 'Put the first week of your roadmap in your calendar.', link: '#/tools/roadmap' },
      ], checkin: 'What are you most proud of from the last four weeks?' },
    ],
    dos: ['Tell the story first, then the offer.', 'Ask for one clear next step.', 'Validate with real people before you build.', 'Disclose anything paid, gifted or affiliate.'],
    donts: ['Do not sell before you have built trust.', 'Do not hide the price or who it is for.', 'Do not use testimonials without permission.', 'Do not skip your eligibility and compliance checks.'],
    faq: [
      { q: 'I do not feel ready to sell. Is that okay?', a: 'Yes. If your basics are not in place, choose the "Grow my audience" path. Selling works best on top of trust.' },
      { q: 'What if nobody replies to my validation Stories?', a: 'That is data. Try a different problem, or ask a smaller question to a smaller group of people you know.' },
      { q: 'How many Stories should I post?', a: 'Five frames is plenty for a first sequence. Quality and one clear idea beat length.' },
    ],
  },
};

export const WEEK_NUMBERS = [2, 3, 4];
export const ALL_WEEK_TASKS = (n) => WEEKS[n].days.flatMap((d) => d.tasks);
