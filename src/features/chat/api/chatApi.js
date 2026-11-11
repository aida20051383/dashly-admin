import { ApiError } from "@/lib/ApiError.js";
import { normalizeText } from "@/lib/text.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => Date.now() - ms;

let nextMessageId = 100;
const msg = (from, text, at) => ({ id: nextMessageId++, from, text, at });

const REPLIES = [
  "Sounds good, thanks!",
  "Got it. I will look into it and get back to you.",
  "Perfect, let us do that.",
  "Can we talk about this tomorrow?",
  "Thanks for letting me know!",
  "Great idea 👍",
  "I will send over the details shortly.",
  "Let me double-check and confirm in a bit.",
];

let conversations = [
  {
    id: 1,
    contact: { name: "Olivia Hughes", role: "Operations", online: true },
    unread: 2,
    messages: [
      msg(
        "me",
        "Hi Olivia, did the new shipment arrive?",
        ago(2 * HOUR + 10 * MIN),
      ),
      msg("them", "Yes, it came in this morning.", ago(2 * HOUR)),
      msg(
        "them",
        "I am checking the boxes now and will update the sheet.",
        ago(25 * MIN),
      ),
      msg(
        "them",
        "Also, the carrier left a note about order #4821.",
        ago(24 * MIN),
      ),
    ],
  },
  {
    id: 2,
    contact: { name: "Liam Walker", role: "Sales", online: true },
    unread: 0,
    messages: [
      msg("them", "The October report looks great!", ago(1 * DAY + 3 * HOUR)),
      msg(
        "me",
        "Thanks, the new collection really helped.",
        ago(1 * DAY + 2 * HOUR),
      ),
      msg(
        "them",
        "Should we run the same promo in December?",
        ago(1 * DAY + 1 * HOUR),
      ),
      msg("me", "Let us plan it next week.", ago(1 * DAY)),
    ],
  },
  {
    id: 3,
    contact: { name: "Sophia Bennett", role: "Design", online: false },
    unread: 1,
    messages: [
      msg(
        "me",
        "Can you share the pricing page mockups?",
        ago(1 * DAY + 5 * HOUR),
      ),
      msg(
        "them",
        "Sure! I just uploaded them to the shared folder.",
        ago(5 * HOUR),
      ),
    ],
  },
  {
    id: 4,
    contact: { name: "Noah Carter", role: "Supplier", online: false },
    unread: 0,
    messages: [
      msg("them", "Our new price list is ready.", ago(3 * DAY)),
      msg("me", "Great, I will review it today.", ago(3 * DAY - 10 * MIN)),
    ],
  },
  {
    id: 5,
    contact: { name: "Mina Rahimi", role: "Photography", online: true },
    unread: 0,
    messages: [
      msg("them", "The product shoot photos are ready 📸", ago(5 * DAY)),
      msg(
        "me",
        "Amazing, I loved the selected folder!",
        ago(5 * DAY - 20 * MIN),
      ),
      msg("them", "Glad you like them!", ago(5 * DAY - 25 * MIN)),
    ],
  },
  {
    id: 6,
    contact: { name: "Emma Moore", role: "HR", online: false },
    unread: 0,
    messages: [msg("them", "Welcome packet for Mia is done.", ago(6 * DAY))],
  },
];

const find = (id) => {
  const conversation = conversations.find((c) => c.id === id);
  if (!conversation) throw new ApiError("NOT_FOUND");
  return conversation;
};

const patch = (id, changes) => {
  conversations = conversations.map((c) =>
    c.id === id ? { ...c, ...changes } : c,
  );
};

export async function getConversations({ search = "" } = {}) {
  await delay(350);

  const q = normalizeText(search);
  const items = conversations
    .map((c) => ({
      id: c.id,
      contact: c.contact,
      last: c.messages.at(-1),
      unread: c.unread,
    }))
    .filter(
      (c) =>
        !q ||
        normalizeText(`${c.contact.name} ${c.last?.text ?? ""}`).includes(q),
    )
    .sort((a, b) => b.last.at - a.last.at);

  return {
    items,
    totalUnread: conversations.reduce((sum, c) => sum + c.unread, 0),
  };
}

export async function getConversation(id) {
  await delay(250);
  return find(id);
}

export async function sendMessage({ id, text }) {
  await delay(400);
  const conversation = find(id);
  const value = text.trim();
  if (!value) throw new ApiError("EMPTY");

  const message = msg("me", value, Date.now());
  patch(id, { messages: [...conversation.messages, message] });
  return message;
}

// «سرور» بعد از چند ثانیه یه جواب می‌فرسته
export async function receiveReply(id) {
  await delay(1600 + Math.random() * 1400);
  const conversation = find(id);
  const reply = msg(
    "them",
    REPLIES[Math.floor(Math.random() * REPLIES.length)],
    Date.now(),
  );
  patch(id, {
    messages: [...conversation.messages, reply],
    unread: conversation.unread + 1,
  });
  return reply;
}

export async function markConversationRead(id) {
  await delay(150);
  find(id);
  patch(id, { unread: 0 });
  return { id };
}
