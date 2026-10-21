export const steps = [
  {
    id: 'prepare', number: '01', phase: 'Before the call', title: 'Arrive with better questions.',
    description: 'Start a Gemini conversation with the inquiry and the business’s public website. Ask what the business does, what the person needs, and what you still need to learn. Keep this conversation for the rest of the workflow.',
    prompt: `I’m preparing for a discovery call with [NAME] at [BUSINESS].
Here is their inquiry: [PASTE EMAIL].
Their website is [WEBSITE].

Research the public website and summarize what they do, who they serve, and what they are asking me for. Separate facts from your suggestions and link to your sources. If you cannot access the website, ask me to paste the relevant text.

Give me five focused discovery questions about their priorities, current workflow, constraints, privacy requirements, and what success would look like. Use plain language. Do not contact anyone.`,
    check: 'Open the website yourself. Are the business details correct? Do the five questions help you understand the work before suggesting a solution?',
    result: 'A short business brief + five discovery questions.',
    recorded: 'Part 1 · inquiry, website research, and discovery questions',
  },
  {
    id: 'context', number: '02', phase: 'After the call', title: 'Bring the conversation back.',
    description: 'Add the meeting transcript or your own notes to the same Gemini conversation. In the demo, Ian references a staged transcript in Google Drive. Identify the exact file by title and participants; check that Gemini used the right meeting.',
    prompt: `Continue with the same business and discovery call.
Use [EXACT TRANSCRIPT TITLE] in Google Drive, for [PARTICIPANTS] on [DATE]. If you cannot access that file, ask me to paste or upload the transcript instead.

First identify the source you used. Then summarize the priorities, constraints, decisions, open questions, and commitments. Put action items in a table with owner and due date. Mark anything unstated as “not agreed”; do not invent it. Distinguish a target or suggestion from a commitment. Do not create or send anything yet.`,
    check: 'Compare the summary with your notes. Check names, owners, dates, and which next steps were actually agreed.',
    result: 'A checked meeting summary and action list.',
    recorded: 'Part 1 · transcript referenced through Google Drive',
  },
  {
    id: 'proposal', number: '03', phase: 'Make the work tangible', title: 'Draft a proposal you can defend.',
    description: 'Use the meeting context to produce a proposal. Ian opens the resulting Google Doc and scrolls through it. Give the document a useful title and inspect the actual content before sharing it.',
    prompt: `Using the checked meeting summary, draft a proposal for [BUSINESS].
Include the problem in their words, objectives, proposed scope, deliverables, responsibilities, timeline, open questions, and next step. Clearly label anything suggested rather than agreed. Leave price and unconfirmed dates as [TO CONFIRM]. Do not promise savings, compliance, or privacy guarantees we have not verified.

Show me the draft for review. I will then save or export it to Google Docs as “[BUSINESS] — Draft proposal”. Do not share the document or change its access.`,
    check: 'Read the Doc itself. Confirm scope, price, timeline, and sharing permissions. Goals from a discovery call are not guaranteed results.',
    result: 'A reviewed proposal draft in Google Docs.',
    recorded: 'Part 1 · generated proposal opened and reviewed in Docs',
  },
  {
    id: 'availability', number: '04', phase: 'Choose a real next step', title: 'Find a time. Check the date.',
    description: 'Ask Gemini to check your own calendar if that connection is available. Verify the suggested slot in Google Calendar yourself. A free slot on your calendar does not mean the other person has accepted it.',
    prompt: `Check my Google Calendar for a [DURATION]-minute follow-up with [NAME] between [START DATE] and [END DATE]. My time zone is [TIME ZONE].

Suggest up to three open slots during [WORKING HOURS]. Show each complete date, day of week, time, and time zone. If you cannot access my calendar, ask me for my available times. Do not create an event or invite anyone.`,
    check: 'Open Calendar. Match the full date, time, time zone, and duration. Resolve any disagreement between the transcript, proposal, and suggested slot.',
    result: 'One or more verified times to propose.',
    recorded: 'Part 1 · Calendar availability checked for the proposed time',
  },
  {
    id: 'follow-up', number: '05', phase: 'Keep the relationship moving', title: 'Write the email. Then approve it.',
    description: 'Ask for a short follow-up that connects the conversation, the draft proposal, and the proposed time. In the recording, Gemini shows a Gmail draft and Ian explicitly approves sending. In your own workflow, stop at the draft until you have checked every detail.',
    prompt: `Draft a follow-up email to [NAME] at [VERIFIED EMAIL].
Thank them for our conversation, briefly recap their main priority, introduce the draft proposal, and suggest [VERIFIED DATE, TIME, TIME ZONE] for a [DURATION]-minute review. Ask whether that works for them. Use [PROPOSAL LINK] only if I have checked the link and their access; otherwise leave a clear placeholder.

Keep it warm, concise, and in my voice. Show the subject, recipient, and body for review. Draft only. Do not send.`,
    check: 'Check the recipient, proposal link/access, tone, and proposed time. Remove placeholders. Send from Gmail only after you approve the complete message.',
    result: 'A personal follow-up ready for your approval.',
    recorded: 'Part 2 · Gmail draft, explicit approval, and sent confirmation',
  },
  {
    id: 'hold', number: '06', phase: 'Close the loop', title: 'Give the next action a place.',
    description: 'Reserve the proposed time on your own calendar if useful. Keep it clearly tentative until the other person confirms. Finish by checking the email, proposal, and calendar rather than relying on a chat response alone.',
    prompt: `Prepare a private calendar hold for [VERIFIED DATE, TIME, TIME ZONE], lasting [DURATION]. Title it “Tentative — [NAME] proposal review”.

Include a short agenda and [PROPOSAL LINK]. Do not add guests or send invitations. Show all event details first and wait for my approval before creating it. If you cannot create the event, give me the details to add manually.`,
    check: 'Confirm the hold exists on the correct calendar. Check date/time again. Track “awaiting confirmation”; invite the other person only when you intend to do so.',
    result: 'A tentative hold and a clear next action.',
    recorded: 'Part 2 · placeholder created and opened in Google Calendar',
  },
] as const;

export const tools = [
  { name: 'Google Gemini', role: 'LLM / AI assistant', text: 'Research, carry the context, and prepare drafts.', icon: '/workshop-kits/find-leads/google-gemini.png', href: 'https://gemini.google.com/' },
  { name: 'Google Meet', role: 'Conversation / meeting capture', text: 'Hold the discovery call. Use a transcript or your own notes.', icon: '/learn/meeting-follow-through/google-meet.svg', href: 'https://meet.google.com/' },
  { name: 'Google Drive', role: 'Source / connected app', text: 'Keep the meeting transcript available to reference.', icon: '/learn/meeting-follow-through/google-drive.svg', href: 'https://drive.google.com/' },
  { name: 'Google Docs', role: 'Proposal / working document', text: 'Review and refine the proposal before sharing.', icon: '/learn/meeting-follow-through/google-docs.svg', href: 'https://docs.google.com/' },
  { name: 'Gmail', role: 'Follow-up / connected app', text: 'Review the message and choose when to send it.', icon: '/learn/meeting-follow-through/gmail.svg', href: 'https://mail.google.com/' },
  { name: 'Google Calendar', role: 'Scheduling / connected app', text: 'Verify your availability and reserve the next step.', icon: '/learn/meeting-follow-through/google-calendar.svg', href: 'https://calendar.google.com/' },
] as const;
