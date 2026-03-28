/**
 * Newsletter issues by date.
 * URL format: /newsletter/3-15-26 (month-day-year)
 */
export interface NewsletterIssue {
  date: string; // URL slug e.g. "3-15-26"
  displayDate: string; // e.g. "March 15, 2026"
  title: string;
  description: string;
  content?: {
    sections: Array<{
      heading?: string;
      text?: string;
      items?: string[];
      note?: string;
    }>;
  };
}

export const newsletterIssues: NewsletterIssue[] = [
  {
    date: '3-15-26',
    displayDate: 'March 15, 2026',
    title: 'I wasted 3 days building the wrong thing',
    description: 'Why most people are using AI backward, and the boring step I skipped that cost me hours of work.',
    content: {
      sections: [
        {
          text: "I changed my mind about something this week.\n\nI spent the last three days building a complex, multi-agent AI workflow for LaunchBox. I had three different models talking to each other. It was technically impressive.\n\nAnd it was a complete waste of time."
        },
        {
          heading: "The trap of the tool",
          text: "When you're learning to build with AI, it's easy to fall into the trap of thinking the *tool* is the advantage.\n\nI thought that if I just chained enough prompts together, the output would magically become valuable.\n\nI was wrong.\n\nThe output was generic. The agents kept getting stuck in loops. And worst of all, I realized I hadn't actually defined the core problem I was trying to solve.\n\nI was using AI backward. I started with the technology instead of the workflow."
        },
        {
          heading: "The boring step everyone skips",
          text: "Here's the thing.\n\nAI doesn't fix a broken process. It just scales it.\n\nIf you don't know exactly what steps a human would take to get the result you want, the AI won't know either.\n\nBefore you write a single prompt, you need to map the workflow on paper. It's boring. It doesn't feel like \"building.\" But it's the only way to know if you're actually solving a problem or just playing with new tech."
        },
        {
          heading: "Try this instead",
          items: [
            "**Stop prompting.** Close the AI window.",
            "**Write it down.** Map out the exact 5 steps you would take to do the task manually.",
            "**Find the friction.** Identify which of those 5 steps is the slowest or most repetitive.",
            "**Automate the friction.** Build a prompt *only* for that specific step."
          ]
        },
        {
          text: "You probably don't need to make this as complicated as you think.\n\nStart smaller."
        },
        {
          note: "If you're building something with AI and it feels too complicated right now, hit reply and tell me what it is. I read every reply."
        }
      ]
    }
  },
];

export const getNewsletterByDate = (dateSlug: string): NewsletterIssue | undefined =>
  newsletterIssues.find((issue) => issue.date === dateSlug);
