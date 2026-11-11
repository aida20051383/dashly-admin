import { ApiError } from "@/lib/ApiError.js";
import { normalizeText } from "@/lib/text.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => Date.now() - ms;

const ME = { name: "John Doe", email: "admin@dashly.dev" };
const person = (name, domain = "example.com") => ({
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@${domain}`,
});

let emails = [
  {
    id: 1,
    folder: "inbox",
    from: person("Olivia Hughes"),
    to: ME.email,
    subject: "Order #4821 shipping delay",
    body: "Hi John,\n\nThe carrier has pushed delivery of order #4821 back by two days. I have already emailed the customer, but you may want to follow up personally since it is a large order.\n\nLet me know if you want me to arrange a discount code.\n\nThanks,\nOlivia",
    date: ago(25 * MIN),
    read: false,
    starred: true,
  },
  {
    id: 2,
    folder: "inbox",
    from: person("Liam Walker"),
    to: ME.email,
    subject: "Monthly sales report is ready",
    body: "Hello,\n\nThe October sales report is attached to the shared drive. Revenue is up 12% compared with September, mostly driven by the new collection.\n\nHighlights:\n- Top product: Wireless Headphones\n- Best day: October 28\n- Returns: down 3%\n\nBest,\nLiam",
    date: ago(3 * HOUR),
    read: false,
    starred: false,
  },
  {
    id: 3,
    folder: "inbox",
    from: person("Sophia Bennett"),
    to: ME.email,
    subject: "Quick question about the new pricing page",
    body: "Hey John,\n\nCan we meet tomorrow to go over the new pricing page? I have a couple of ideas about how to present the yearly plan.\n\nAnything after 2 pm works for me.\n\nSophia",
    date: ago(7 * HOUR),
    read: false,
    starred: false,
  },
  {
    id: 4,
    folder: "inbox",
    from: person("Noah Carter", "supplier.io"),
    to: ME.email,
    subject: "Updated price list for Q1",
    body: "Dear John,\n\nPlease find our updated price list for the first quarter. Prices on most items stay the same, and a few of them are slightly lower thanks to the new shipping route.\n\nReach out if you would like to schedule a call.\n\nKind regards,\nNoah",
    date: ago(1 * DAY + 2 * HOUR),
    read: true,
    starred: true,
  },
  {
    id: 5,
    folder: "inbox",
    from: person("Emma Moore"),
    to: ME.email,
    subject: "Welcome to the team!",
    body: "Hi everyone,\n\nPlease welcome Mia Reed, who joins our support team today. She will be handling live chat and email in the mornings.\n\nWarm regards,\nEmma",
    date: ago(2 * DAY),
    read: true,
    starred: false,
  },
  {
    id: 6,
    folder: "inbox",
    from: person("Mason Foster", "payments.io"),
    to: ME.email,
    subject: "Your invoice for November",
    body: "Hello,\n\nYour invoice for November is now available. The amount will be charged automatically on the 15th.\n\nThank you for your business.\n\nMason",
    date: ago(3 * DAY),
    read: true,
    starred: false,
  },
  {
    id: 7,
    folder: "inbox",
    from: person("Mina Rahimi"),
    to: ME.email,
    subject: "Photos from the product shoot",
    body: 'Hi John,\n\nThe photos from yesterday\'s shoot are uploaded. I picked my favorites and put them in a separate folder called "Selected".\n\nTell me what you think!\n\nMina',
    date: ago(5 * DAY),
    read: true,
    starred: false,
  },
  {
    id: 8,
    folder: "sent",
    from: ME,
    to: "olivia.hughes@example.com",
    subject: "Re: Weekend inventory check",
    body: "Hi Olivia,\n\nThanks for the update. Please go ahead with the recount on Saturday and send me the numbers by Sunday evening.\n\nJohn",
    date: ago(1 * DAY),
    read: true,
    starred: false,
  },
  {
    id: 9,
    folder: "sent",
    from: ME,
    to: "liam.walker@example.com",
    subject: "Budget approval for the spring campaign",
    body: "Hi Liam,\n\nI approved the budget for the spring campaign. Let us start planning the creatives next week.\n\nJohn",
    date: ago(4 * DAY),
    read: true,
    starred: true,
  },
  {
    id: 10,
    folder: "trash",
    prevFolder: "inbox",
    from: person("Newsletter", "deals.io"),
    to: ME.email,
    subject: "Last chance: 50% off hosting",
    body: "Don't miss out! Our biggest sale of the year ends tonight.",
    date: ago(6 * DAY),
    read: true,
    starred: false,
  },
];

const find = (id) => {
  const email = emails.find((e) => e.id === id);
  if (!email) throw new ApiError("NOT_FOUND");
  return email;
};

const patch = (id, changes) => {
  emails = emails.map((e) => (e.id === id ? { ...e, ...changes } : e));
};

export async function getEmails({ folder = "inbox", search = "" } = {}) {
  await delay(350);

  const q = normalizeText(search);
  const matches = (e) =>
    !q ||
    normalizeText(`${e.subject} ${e.body} ${e.from.name} ${e.to}`).includes(q);

  const inFolder = (e) =>
    folder === "starred"
      ? e.starred && e.folder !== "trash"
      : e.folder === folder;

  return {
    items: emails
      .filter((e) => inFolder(e) && matches(e))
      .sort((a, b) => b.date - a.date),
    counts: {
      inboxUnread: emails.filter((e) => e.folder === "inbox" && !e.read).length,
    },
  };
}

export async function getEmail(id) {
  await delay(200);
  return find(id);
}

export async function markRead({ id, read }) {
  await delay(200);
  find(id);
  patch(id, { read });
  return { id };
}

export async function toggleStar(id) {
  await delay(200);
  const email = find(id);
  patch(id, { starred: !email.starred });
  return { id };
}

export async function trashEmail(id) {
  await delay(300);
  const email = find(id);
  patch(id, { folder: "trash", prevFolder: email.folder });
  return { id };
}

export async function restoreEmail(id) {
  await delay(300);
  const email = find(id);
  patch(id, { folder: email.prevFolder ?? "inbox", prevFolder: undefined });
  return { id };
}

export async function deleteEmail(id) {
  await delay(300);
  find(id);
  emails = emails.filter((e) => e.id !== id);
  return { id };
}

export async function sendEmail({ to, subject, body }) {
  await delay(700);
  const email = {
    id: Math.max(0, ...emails.map((e) => e.id)) + 1,
    folder: "sent",
    from: ME,
    to: to.trim(),
    subject: subject.trim() || "(no subject)",
    body: body.trim(),
    date: Date.now(),
    read: true,
    starred: false,
  };
  emails = [email, ...emails];
  return email;
}
