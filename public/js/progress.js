// Progress calculations and "what should I do next" logic. Reads from the store.
import * as store from './lib/store.js';
import { CONFIG } from './config.js';
import { QUESTIONS, questionsFor } from './content/blueprint.js';
import { START_QUESTIONS, LAUNCH_CHECKS } from './content/start.js';
import { DAYS, GOALS } from './content/plan.js';
import { wordCount } from './coach.js';

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);
const part = (done, total) => ({ done, total, pct: pct(done, total) });

export function isAnswered(q, answers, pillars) {
  if (q.type === 'pillars') return Object.values(pillars || {}).filter((v) => wordCount(v || '') >= 1).length >= 3;
  return wordCount(answers?.[q.id] || '') >= 8;
}

export function launchChecks() {
  const checks = store.get('launch.checks', {});
  const profile = store.get('profile', {});
  const handles = Object.values(profile.handles || {}).some((v) => (v || '').trim());
  const posts = store.get('posts', []);
  const auto = { handles, firstpost: posts.length > 0, safety: !!checks.safety };
  return LAUNCH_CHECKS.map((c) => ({ ...c, done: c.auto && c.auto !== 'safety' ? !!auto[c.auto] || !!checks[c.id] : !!checks[c.id] }));
}

export function progress() {
  const checks = launchChecks();
  const startDone = START_QUESTIONS.filter((q) => wordCount(store.get('start.answers', {})[q.id] || '') >= 8).length;
  const launch = part(checks.filter((c) => c.done).length + startDone, checks.length + START_QUESTIONS.length);

  const answers = store.get('blueprint.answers', {});
  const pillars = store.get('blueprint.pillars', {});
  const stories = store.get('blueprint.stories', []).filter((s) => s.problem?.trim() && s.pursuit?.trim() && s.payoff?.trim());
  const statement = store.get('blueprint.statement', {});
  const answered = QUESTIONS.filter((q) => isAnswered(q, answers, pillars)).length;
  const bpDone = answered + Math.min(1, stories.length) + (statement.who && statement.outcome ? 1 : 0);
  const blueprint = part(bpDone, QUESTIONS.length + 2);
  const byPart = Object.fromEntries(
    ['say', 'reach', 'why'].map((p) => {
      const qs = questionsFor(p);
      const done = qs.filter((q) => isAnswered(q, answers, pillars)).length;
      return [p, part(done, qs.length)];
    }),
  );

  const f = store.get('formats', {});
  const matcherDone = Object.keys(f.matcher || {}).length >= 5;
  const formats = part((matcherDone ? 1 : 0) + Math.min(3, (f.saved || []).length) + Math.min(2, (f.ideas || []).length), 6);

  const posted = store.get('challenge.posted', {});
  const challenge = part(Math.min(1, Object.keys(posted).length), 1);

  const tasks = store.get('plan.tasks', {});
  const allTasks = DAYS.flatMap((d) => d.tasks);
  const plan = part(allTasks.filter((t) => tasks[t.id]).length, allTasks.length);

  const goal = CONFIG.postGoal[store.get('profile.level', 'beginner')] || 3;
  const weekPosts = postsThisWeek().length;
  const posts = part(Math.min(goal, weekPosts), goal);

  const overall = Math.round(
    (launch.pct * 0.15 + blueprint.pct * 0.35 + formats.pct * 0.15 + challenge.pct * 0.1 + plan.pct * 0.1 + posts.pct * 0.15),
  );
  return { launch, blueprint, byPart, formats, challenge, plan, posts, overall, postGoal: goal, weekPosts };
}

export function postsThisWeek() {
  const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
  return store.get('posts', []).filter((p) => p.date && new Date(p.date).getTime() >= cutoff);
}

// Weekly goals with automatic completion where the app can tell.
export function weeklyGoals() {
  const p = progress();
  const manual = store.get('plan.goals', {});
  const bio = store.get('bio', {});
  const auto = {
    lessons: p.blueprint.pct >= 60 && p.formats.pct >= 50,
    blueprint: p.blueprint.pct >= 85,
    posts: p.weekPosts >= p.postGoal,
    challenge: p.challenge.pct >= 100,
    bio: !!(bio.final || '').trim(),
  };
  return GOALS.map((g) => ({
    ...g,
    done: g.auto ? !!auto[g.auto] || !!manual[g.id] : !!manual[g.id],
    auto: g.auto,
    detail:
      g.auto === 'posts'
        ? `${Math.min(p.postGoal, p.weekPosts)} of ${p.postGoal} this week`
        : g.auto === 'blueprint'
          ? `${p.blueprint.pct}% complete`
          : '',
  }));
}

export function nextAction() {
  const profile = store.get('profile', {});
  const p = progress();
  if (!profile.name) return { title: 'Set up your profile', desc: 'Tell the app who you are so examples fit you.', route: '#/welcome', cta: 'Start' };
  const unread = START_QUESTIONS.filter((q) => wordCount(store.get('start.answers', {})[q.id] || '') < 8).length;
  if (p.launch.pct < 40 && p.blueprint.pct === 0) return { title: 'Finish your Launch Pad', desc: 'Accounts, time, mindset and your starting point. About 10 minutes.', route: '#/launch', cta: 'Open Launch Pad' };
  if (p.byPart.say.pct < 100) return { title: 'Define what you say', desc: 'Your beliefs, your take, and your four content pillars.', route: '#/blueprint/say', cta: 'Continue: What you say' };
  if (p.byPart.reach.pct < 100) return { title: 'Define who you say it to', desc: 'Describe the one person you are making content for.', route: '#/blueprint/reach', cta: 'Continue: Who you say it to' };
  if (p.byPart.why.pct < 100) return { title: 'Mine your stories', desc: 'The moments that give your message weight.', route: '#/blueprint/why', cta: 'Continue: Why it matters' };
  if (!(store.get('blueprint.statement', {}).who && store.get('blueprint.statement', {}).outcome))
    return { title: 'Write your message statement', desc: 'One sentence that pulls everything together.', route: '#/blueprint/statement', cta: 'Build my statement' };
  if (Object.keys(store.get('formats.matcher', {})).length < 5)
    return { title: 'Find the formats that fit you', desc: 'Five quick questions, then a ranked shortlist.', route: '#/formats/match', cta: 'Find my formats' };
  if (store.get('formats.ideas', []).length < 1)
    return { title: 'Turn your Blueprint into a post idea', desc: 'The Idea Lab fills hooks with your own words.', route: '#/lab', cta: 'Open the Idea Lab' };
  if (p.weekPosts < p.postGoal)
    return { title: `Post (${p.weekPosts}/${p.postGoal} this week)`, desc: 'Done beats perfect. Log it so you can learn from it.', route: '#/challenge', cta: 'Pick a challenge' };
  if (unread > 0) return { title: 'Finish your starting-point reflections', desc: 'A few more minutes of honest writing.', route: '#/launch/start', cta: 'Continue' };
  return { title: 'Review your week', desc: 'Look back, pick one lesson, set your commitment.', route: '#/plan', cta: 'Open the week plan' };
}
