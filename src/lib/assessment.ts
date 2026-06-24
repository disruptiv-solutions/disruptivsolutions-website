// AI Snapshot — the lead-magnet assessment.
// Pure logic (no React / no server-only) so both the client component and the
// capture API can import it. Answers in, readout out — deterministic, instant,
// no AI call in the critical path so it never fails live in a room.

export type Choice = { value: string; label: string };

export type Answers = Record<string, string | string[]>;

export type Question = {
  id: string;
  prompt: string;
  helper?: string;
  type: 'single' | 'multi' | 'text';
  choices?: Choice[];
  maxSelect?: number;
  placeholder?: string;
  optional?: boolean;
  // Only show this question when the predicate passes (conditional follow-up).
  showIf?: (answers: Answers) => boolean;
  // For single-select: reveal a free-text field when "other" is picked.
  allowOther?: boolean;
};

export type Stage = { level: 1 | 2 | 3 | 4; name: string; blurb: string };
export type Opportunity = { title: string; detail: string };
export type Readout = {
  stage: Stage;
  opportunities: Opportunity[];
  quickWin: string;
  launchbox: { fit: boolean; note: string };
};

// Order is intentional: open with an easy, engaging click to build momentum;
// the free-text (high-intent, gold for the call) comes last and is optional so
// it never blocks completion.
export const QUESTIONS: Question[] = [
  {
    id: 'bizType',
    prompt: 'What kind of business do you run?',
    helper: 'This points your snapshot at your actual world, not generic advice.',
    type: 'single',
    choices: [
      { value: 'coaching', label: 'Coaching or consulting' },
      { value: 'community', label: 'Course, community, or membership' },
      { value: 'service', label: 'Local or service business' },
      { value: 'agency', label: 'Agency, studio, or freelance' },
      { value: 'ecom', label: 'Ecommerce or retail' },
      { value: 'pro', label: 'Professional services (legal, finance, real estate)' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'aiStage',
    prompt: 'Where are you with AI right now?',
    helper: 'No wrong answer. This just sets your starting line.',
    type: 'single',
    choices: [
      { value: 'none', label: "Haven't really started" },
      { value: 'dabbling', label: 'Dabbling with ChatGPT' },
      { value: 'fewtools', label: 'Using a few tools' },
      { value: 'embedded', label: 'Built into how we work' },
    ],
  },
  {
    id: 'tools',
    prompt: 'Which AI tools are you using today?',
    helper: 'Select all that apply.',
    type: 'multi',
    maxSelect: 6,
    choices: [
      { value: 'claude', label: 'Claude' },
      { value: 'chatgpt', label: 'ChatGPT' },
      { value: 'gemini', label: 'Gemini' },
      { value: 'copilot', label: 'Microsoft Copilot' },
      { value: 'other', label: 'Other' },
      { value: 'none', label: 'Not using any yet' },
    ],
  },
  {
    id: 'timeLeak',
    prompt: 'What eats up the most time in your week?',
    helper: 'Pick up to two.',
    type: 'multi',
    maxSelect: 2,
    choices: [
      { value: 'admin', label: 'Admin & paperwork' },
      { value: 'marketing', label: 'Marketing & content' },
      { value: 'followup', label: 'Customer follow-up & email' },
      { value: 'research', label: 'Research & digging for answers' },
      { value: 'reporting', label: 'Reporting & numbers' },
      { value: 'scheduling', label: 'Scheduling & ops' },
      { value: 'hiring', label: 'Hiring & onboarding' },
    ],
  },
  {
    id: 'teamSize',
    prompt: 'How big is your team?',
    type: 'single',
    choices: [
      { value: 'solo', label: 'Just me' },
      { value: 'small', label: '2–10' },
      { value: 'mid', label: '11–50' },
      { value: 'large', label: '50+' },
    ],
  },
  {
    id: 'community',
    prompt: 'Do you have a community, or want to build one?',
    helper: 'A paid group, course, or membership. This helps me point you the right way.',
    type: 'single',
    choices: [
      { value: 'yes', label: 'Yes, I run one now' },
      { value: 'building', label: "I'm building / planning one" },
      { value: 'interested', label: "I'm interested" },
      { value: 'no', label: 'No, just my business' },
    ],
  },
  {
    id: 'communityPlatform',
    prompt: 'What platform do you run it on?',
    helper: 'Just so I know what you are working with.',
    type: 'single',
    allowOther: true,
    showIf: (a) => a.community === 'yes',
    choices: [
      { value: 'facebook', label: 'Facebook group' },
      { value: 'circle', label: 'Circle' },
      { value: 'skool', label: 'Skool' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'blocker',
    prompt: "What's the biggest thing in the way?",
    type: 'single',
    choices: [
      { value: 'start', label: "Don't know where to start" },
      { value: 'toomany', label: 'Too many tools, too confusing' },
      { value: 'trust', label: "Not sure I can trust it" },
      { value: 'notime', label: 'No time to set it up' },
      { value: 'privacy', label: 'Worried about privacy / security' },
    ],
  },
  {
    id: 'dreamTask',
    prompt: 'If you could hand one task to an AI assistant tomorrow, what would it be?',
    helper: 'Optional, but this is the one that makes your snapshot sharp.',
    type: 'text',
    optional: true,
    placeholder: 'e.g. "draft all my customer follow-up emails" or "build my weekly report"',
  },
];

const STAGES: Record<string, Stage> = {
  none: {
    level: 1,
    name: 'Curious',
    blurb:
      "You haven't really started yet, and that's an advantage. The highest-leverage wins are the easiest to grab, and you get to skip the mistakes everyone else made.",
  },
  dabbling: {
    level: 2,
    name: 'Experimenting',
    blurb:
      "You're poking at ChatGPT and seeing flashes of what's possible. The gap now is turning one-off chats into repeatable workflows that save real hours every week.",
  },
  fewtools: {
    level: 3,
    name: 'Operationalizing',
    blurb:
      "You've got a few tools working. The next jump is connecting them so they run without you babysitting every step, and cutting the ones you're paying for but not using.",
  },
  embedded: {
    level: 4,
    name: 'Scaling',
    blurb:
      "AI is already in how you work. Now it's about custom agents and automation that compound, doing the grunt work while you stay the decision-maker.",
  },
};

const OPPS: Record<string, Opportunity> = {
  admin: {
    title: 'Put your admin on autopilot',
    detail:
      'Repetitive paperwork, filing, and follow-ups become a one-prompt workflow. AI does the grunt work, you just approve.',
  },
  marketing: {
    title: 'A marketing engine in your voice',
    detail:
      'A custom AI that writes the way you do: posts, emails, and pages in minutes instead of hours, without sounding like a robot.',
  },
  followup: {
    title: 'Never let a follow-up slip',
    detail:
      'AI drafts every reply and follow-up for you to send. Nothing falls through the cracks, and your inbox stops running your day.',
  },
  research: {
    title: 'Send AI to do the digging',
    detail:
      'Competitors, pricing, options, regulations. AI does the deep research and hands you back a one-page answer you can act on.',
  },
  reporting: {
    title: 'Turn hours of reporting into minutes',
    detail:
      'The weekly number-crunching that eats your afternoon becomes a 2-minute summary that tells you what actually changed.',
  },
  scheduling: {
    title: 'Kill the back-and-forth',
    detail:
      'Scheduling, reminders, and the ops glue that quietly eats your week, automated so it just happens.',
  },
  hiring: {
    title: 'Onboarding that runs itself',
    detail:
      'A custom assistant that onboards new hires and answers their questions, so your team stops repeating itself.',
  },
};

const QUICKWINS: Record<string, string> = {
  start:
    'This week: open one free AI tool and point it at your single biggest time-suck. One task, one prompt. Momentum beats a master plan.',
  toomany:
    'This week: stop adding tools. Pick the ONE that touches your biggest headache and go deep. Consolidation is the win, not more apps.',
  trust:
    "This week: run AI on something low-stakes you already know the answer to. Watching it nail the easy stuff is how trust gets built, and you always stay the editor.",
  notime:
    'This week: spend 15 minutes automating the thing you do most often. The setup pays for itself by Friday.',
  privacy:
    'This week: use AI on public, non-sensitive work first: research and drafting. Never paste private data. You get the speed without the exposure.',
};

const LAUNCHBOX: Record<string, { fit: boolean; note: string }> = {
  yes: {
    fit: true,
    note: "You're already running a community. LaunchBox puts it, your courses, and your AI tools under one branded roof, so you stop stitching five tools together. This is squarely what it's built for.",
  },
  building: {
    fit: true,
    note: "You're building one. LaunchBox is the fastest way to launch it without duct-taping tools together, branded as yours from day one.",
  },
  interested: {
    fit: true,
    note: "You've thought about a community. LaunchBox makes launching one a weekend instead of a project. Worth a look when you're ready.",
  },
  no: { fit: false, note: '' },
};

export function computeReadout(answers: Answers): Readout {
  const stageKey = typeof answers.aiStage === 'string' ? answers.aiStage : 'dabbling';
  const stage = STAGES[stageKey] ?? STAGES.dabbling;

  const leaks = Array.isArray(answers.timeLeak) ? answers.timeLeak : [];
  const opportunities = leaks
    .map((l) => OPPS[l])
    .filter((o): o is Opportunity => Boolean(o))
    .slice(0, 2);
  if (opportunities.length === 0) opportunities.push(OPPS.admin);

  const blockerKey = typeof answers.blocker === 'string' ? answers.blocker : 'start';
  const quickWin = QUICKWINS[blockerKey] ?? QUICKWINS.start;

  const communityKey = typeof answers.community === 'string' ? answers.community : 'no';
  const launchbox = LAUNCHBOX[communityKey] ?? LAUNCHBOX.no;

  return { stage, opportunities, quickWin, launchbox };
}
