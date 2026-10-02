# Athlete Creator Blueprint

An interactive guided workbook that helps athletes turn who they are on and off the field into a clear creator brand: a message, an audience, a story bank, formats that fit them, and a first week of posting.

It replaces "read a PDF and write on the lines" with a guided experience: one question at a time, a live **depth meter** that scores how specific each answer is, a **Dig deeper** coach that asks sharper follow-ups when an answer is vague, and an **optional live AI coach** powered by Claude.

## What is in it

| Step | What the client does |
| --- | --- |
| **0 Launch Pad** | Setup checklist, mindset principles, an athlete safety checklist (NIL, privacy, disclosure, minors) and 8 starting-point reflections. |
| **1 Blueprint** | Three guided parts: **Say** (beliefs, contrarian view, what people ask them for, 4 content pillars), **Reach** (one primary person: who, pain, desire, who they want to become) and **Why** (story mining into a *Struggle / Move / Win* story bank). Ends with a one-sentence **message statement** and a **health check** against the Do and Don't principles. |
| **2 Formats** | A bank of 15 formats (talking, non-talking, carousel), a 5-question **format matcher**, and the **Idea Lab** which fills hook templates from the client's own Blueprint. |
| **3 Weekly Challenge** | Three guided builders (confession B-roll, Bad/Good/Excellent, Expectation vs Reality) with a live phone preview, caption builder and quality checklist. |
| **4 Week 1 Plan** | Weekly goals (auto-tracked where possible), 7 days of tasks and check-ins, a review-question coach, a bio builder and a weekly review. |
| **Tools** | Post Log with a learn loop, Sound Bank, **My Blueprint** document (print to PDF, copy as text, download Markdown), backup and restore. |
| **Week 2: Formats and workflow** | **Reference breakdowns** (study 7 posts and find the pattern), **Hook Lab** (a transparent 6-point hook checklist and a hook bank), **Content Calendar** (idea to posted, with batch tips), **Edit and pre-flight** checklist, **How discovery works** (with sources) and an **Offer Sketch**. |
| **Week 3: Content missions** | **Mission Planner** (attract, nurture, position, convert; your 14-day mix vs a suggested split; a week plan), **Analytics Reader** (compares each post to *your own* median and flags breakouts, weak holds, reach without follows), **Leads and CTAs** (call-to-action ladder, lead path, profile check) and a **Monetisation check** (readiness quiz, six paths, FTC disclosure and athlete-earnings rules). |
| **Week 4: Stories and selling** | **Story sequencer** (connect, teach, validate and sell templates with checks), **Offer pitch** (Struggle, Move, Win, with caption and DM reply), **30-day roadmap** (four paths, editable and tick-off) and a printable **Strategy one-pager** with journey stats. |

Each of Weeks 2 to 4 also has goals (auto-tracked from the tools where possible), seven days of tasks with check-ins, Do's and Don'ts, a mini FAQ and a weekly review.

> **How Weeks 2 to 4 were made.** The workbooks provided covered onboarding and Week 1 in full, and only an outline (themes and lesson titles) for Weeks 2 to 4. Those weeks are therefore original designs built from that outline, not a translation of the full workbooks. Platform and rules notes were checked against public sources in October 2026 and are labelled as such in the app. Review them before you rely on them.

## Run it

```bash
npm install
npm start          # http://localhost:3000
npm test           # unit tests for the coach, content logic and API
```

Requires Node 20 or newer. There is no build step: `public/` is plain HTML, CSS and ES modules.

## Turn on the live AI coach (optional)

The app works fully without it. With it, every question gets an **Ask the AI coach** button, the statement page gets **Draft with the AI coach**, the Idea Lab gets more hooks, and My Blueprint gets an **AI review**.

```bash
cp .env.example .env     # or set these in your host's dashboard
ANTHROPIC_API_KEY=sk-ant-...
COACH_ACCESS_CODE=team2026      # recommended: clients enter this once in Settings
COACH_MODEL=claude-opus-5-5     # default. claude-sonnet-5-5 costs less.
```

Notes:

* The key lives only on the server (`api/coach.js`). It is never sent to the browser.
* **Set `COACH_ACCESS_CODE`.** Without it, anyone with the link can spend your API credit. There is also a per-IP rate limit and a request-size cap.
* Client text is wrapped as untrusted data in the prompt, and structured output is validated with a schema.
* Requests opt into the API's server-side refusal fallback.
* Typical cost is a fraction of a cent to a few cents per tap, depending on the model.

## Deploy

**Vercel (recommended).** Import the repo. `vercel.json` serves `public/` and runs `api/coach.js` as a serverless function. Add the environment variables above. Done.

**Any Node host.** `npm start` serves the app and the API from one process (set `PORT`).

**Static only.** Upload `public/` anywhere. Everything works except the AI coach.

Strict security headers (CSP, no-sniff, no-referrer) are set in both `vercel.json` and `server.mjs`.

## White-label it

`public/js/config.js` controls the brand name, tagline, how the app refers to the coach (`coachName`, `auditName`), weekly posting goals and optional community/calendar/support links.

Content lives in `public/js/content/`:

| File | Contains |
| --- | --- |
| `blueprint.js` | The Say / Reach / Why questions, per-athlete-type examples, sentence starters, tailored follow-up probes, FAQ |
| `formats.js` | The 15 formats, hook templates, format matcher |
| `challenge.js` | The three challenge builders and their quality checks |
| `plan.js` | Week 1 goals and days, review-question checker, bio helper, roadmap |
| `weeks.js` | Weeks 2 to 4: goals, seven days each, check-ins, Do's and Don'ts, FAQ |
| `hooks.js`, `analytics.js`, `missions.js`, `sales.js`, `editing.js` | Hook scoring, analytics diagnosis, missions and mix, offers/CTAs/stories/pitch/roadmap, pre-flight and discovery |
| `start.js` | Launch checklist, mindset, athlete safety, starting-point reflections |
| `archetypes.js` | Athlete types (college, pro, youth, retired, coach), pillar ideas, platforms |

To add a tool, add an entry to `content/toolmeta.js`, a file in `views/tools/`, and register it in `views/tools.js`. Week hubs list tools via `content/weeks.js`.

## How the built-in coach works

`public/js/coach.js` is a pure, tested module. For each answer it estimates specificity from length, concrete detail (numbers, names, moments), feeling words, and fit for the question type (a belief needs a point of view, a contrarian view needs contrast, an audience needs demographics *and* feelings, a story needs struggle, move and win). It flags generic phrases ("inspire people"), topic lists, "everyone" audiences and repetition, then picks follow-up questions that do not repeat.

It is a **heuristic**, not a judge. It never blocks anyone, and it can be wrong about unusual writing. The AI coach is what gives genuinely personalised depth.

## Privacy

Everything a client writes is saved in their browser (`localStorage`) on their device. Nothing is uploaded, except the text of a question when they tap an AI coach button (and only if you enabled it). Clients can download a JSON backup and restore it on another device. There are no accounts and no coach dashboard in this version.

## Before you share this with clients

* **Source material and trademarks.** This app was designed from two licensed workbooks whose notices say they may not be copied or redistributed, and whose frameworks carry trademark marks. Everything here is written from scratch: original wording, original examples, athlete-specific content and different names for the frameworks (*Blueprint*, *Say / Reach / Why*, *Struggle / Move / Win*, *Format Bank*). Idea-level structure is similar by design. Check your licence terms or get written permission from the publisher before selling or distributing it commercially.
* **Athlete compliance.** The safety content is general guidance, not legal advice. Name, image and likeness rules vary by school, state and league and keep changing. Keep the "check with your compliance office" language.
* **Minors.** The "youth" athlete type shows parent and guardian guidance. Review it against your own policies.

## Project layout

```
public/            static app (served as-is)
  index.html
  css/             styles.css, fonts.css (self-hosted, OFL-licensed fonts)
  fonts/
  js/
    main.js        shell, router, nav
    coach.js       built-in answer coach (pure)
    ai.js          client for /api/coach
    progress.js    progress and "next best action"
    views/         one file per screen
    ui/            question flow and shared components
    content/       all the questions, formats and copy
    lib/           dom helpers, store, router
api/coach.js       optional AI coach (Vercel function / Node handler)
server.mjs         local server (static files + API)
tests/             node:test suites
```
