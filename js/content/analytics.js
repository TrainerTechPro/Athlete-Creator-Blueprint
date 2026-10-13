// Week 3: reading your numbers. Everything is relative to YOUR own posts, because benchmarks
// differ by sport, platform and audience size. These are prompts to investigate, not verdicts.

export const METRICS = [
  { id: 'views', label: 'Views', help: 'Total views or plays.' },
  { id: 'avgWatch', label: 'Avg watched %', help: 'Average percent of the video watched, if your analytics show it.' },
  { id: 'likes', label: 'Likes', help: '' },
  { id: 'comments', label: 'Comments', help: '' },
  { id: 'saves', label: 'Saves', help: '' },
  { id: 'shares', label: 'Shares / sends', help: 'Sends to friends count here.' },
  { id: 'follows', label: 'Follows gained', help: 'New followers that came from this post, if shown.' },
  { id: 'profileVisits', label: 'Profile visits', help: '' },
  { id: 'clicks', label: 'Link clicks / DMs', help: 'Clicks on your link, or DMs you can trace to this post.' },
];

const num = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function median(values) {
  const v = values.filter((x) => x !== null && x !== undefined).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

export function rates(post) {
  const m = post.metrics || {};
  const views = num(m.views);
  if (!views) return null;
  const interactions = ['likes', 'comments', 'saves', 'shares'].map((k) => num(m[k])).filter((x) => x !== null);
  const r = {
    views,
    avgWatch: num(m.avgWatch),
    engagement: interactions.length ? interactions.reduce((a, b) => a + b, 0) / views : null,
    saveRate: num(m.saves) !== null ? num(m.saves) / views : null,
    shareRate: num(m.shares) !== null ? num(m.shares) / views : null,
    followRate: num(m.follows) !== null ? num(m.follows) / views : null,
    profileRate: num(m.profileVisits) !== null ? num(m.profileVisits) / views : null,
    clickRate: num(m.clicks) !== null ? num(m.clicks) / views : null,
  };
  return r;
}

export const pct = (x, digits = 1) => (x === null || x === undefined ? '–' : `${(x * 100).toFixed(digits)}%`);

const FLAGS = {
  breakout: { tone: 'ok', label: 'Breakout', text: 'Reached far more people than your usual. Study the hook, format and topic, then make a close sibling of it.' },
  under: { tone: 'warn', label: 'Under your usual', text: 'Reached fewer people than your usual. Test one change next time: a sharper first line, a different format, or a clearer topic.' },
  holdWeak: { tone: 'warn', label: 'Weak hold', text: 'People are leaving early. Rework the first 3 seconds and cut slow setup before the point.' },
  holdStrong: { tone: 'ok', label: 'Strong hold', text: 'People stay. The pacing and payoff work. Keep the structure.' },
  shares: { tone: 'ok', label: 'Very shareable', text: 'Shares are high relative to your usual. This is relatable or useful enough to send. Great for reaching new people.' },
  saves: { tone: 'ok', label: 'High save rate', text: 'People want to come back to it. This is reference-worthy. Use the style for nurture and positioning posts.' },
  noFollow: { tone: 'warn', label: 'Reach but few follows', text: 'It travelled but did not convert to follows. Make sure the video says who you are and who follows you, and add a soft call to action.' },
  noClick: { tone: 'warn', label: 'Visits but few clicks', text: 'People looked at your profile but did not act. Check your bio, link and pinned posts: is the next step obvious?' },
};

export function diagnose(posts) {
  const withViews = posts.map((p) => ({ post: p, r: rates(p) })).filter((x) => x.r);
  const out = { n: withViews.length, medianViews: null, perPost: [], insights: [], enough: withViews.length >= 3 };
  if (!withViews.length) return out;

  const medViews = median(withViews.map((x) => x.r.views));
  const medWatch = median(withViews.map((x) => x.r.avgWatch).filter((x) => x !== null));
  const medShare = median(withViews.map((x) => x.r.shareRate).filter((x) => x !== null));
  const medSave = median(withViews.map((x) => x.r.saveRate).filter((x) => x !== null));
  const medFollow = median(withViews.map((x) => x.r.followRate).filter((x) => x !== null));
  const medClick = median(withViews.map((x) => x.r.clickRate).filter((x) => x !== null));
  out.medianViews = medViews;

  out.perPost = withViews.map(({ post, r }) => {
    const flags = [];
    const ratio = medViews ? r.views / medViews : 1;
    if (out.enough) {
      if (ratio >= 2) flags.push('breakout');
      else if (ratio <= 0.5) flags.push('under');
      if (r.avgWatch !== null && medWatch) {
        if (r.avgWatch <= medWatch * 0.75) flags.push('holdWeak');
        else if (r.avgWatch >= medWatch * 1.25) flags.push('holdStrong');
      }
      if (r.shareRate !== null && medShare && r.shareRate >= medShare * 1.5) flags.push('shares');
      if (r.saveRate !== null && medSave && r.saveRate >= medSave * 1.5) flags.push('saves');
      if (ratio >= 1 && r.followRate !== null && medFollow && r.followRate <= medFollow * 0.5) flags.push('noFollow');
      if (r.clickRate !== null && medClick && r.clickRate <= medClick * 0.5 && (r.profileRate || 0) > 0) flags.push('noClick');
    } else if (r.avgWatch !== null && r.avgWatch < 0.3 * 100) {
      flags.push('holdWeak');
    }
    return { post, rates: r, ratio, flags: flags.map((id) => ({ id, ...FLAGS[id] })) };
  });

  // Group insights: need at least 2 posts in a group to say anything.
  const groupBy = (key) => {
    const g = {};
    out.perPost.forEach((p) => {
      const k = p.post[key];
      if (!k) return;
      (g[k] ||= []).push(p.rates.views);
    });
    return Object.entries(g)
      .filter(([, v]) => v.length >= 2)
      .map(([k, v]) => ({ key: k, n: v.length, median: median(v) }))
      .sort((a, b) => b.median - a.median);
  };
  out.byFormat = groupBy('formatId');
  out.byMission = groupBy('mission');
  out.byPillar = groupBy('pillar');
  const best = [...out.perPost].sort((a, b) => b.rates.views - a.rates.views)[0];
  out.best = best;
  if (out.enough && out.byFormat.length > 1) {
    out.insights.push({ id: 'format', text: `Your best-performing format so far (by median views) is "${out.byFormat[0].key}". Make two more before deciding.` });
  }
  if (!out.enough) out.insights.push({ id: 'few', text: 'Log numbers for at least 3 posts to unlock comparisons against your own usual.' });
  return out;
}

export const WHERE_TO_LOOK = [
  { title: 'Open your analytics for each post', body: 'Switch to a creator or business account if you have not. Then open a post and look for its insights or analytics view. Menus change, so look for views, watch time, shares, saves and follows.' },
  { title: 'Wait a few days before judging', body: 'Most of a short video’s reach arrives early, but some posts keep growing. Check once after a day and again after a week.' },
  { title: 'Compare to yourself', body: 'Your median post is your baseline. A great post is one that beats your baseline, not someone else’s.' },
  { title: 'Change one thing at a time', body: 'If you change the hook, format and topic together you will not know what worked.' },
];
