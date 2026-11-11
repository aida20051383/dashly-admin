import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessagesSquare, Search } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import ConversationList from "@/features/chat/components/ConversationList.jsx";
import ChatThread from "@/features/chat/components/ChatThread.jsx";
import {
  useConversations,
  useReceiveReply,
  useSendMessage,
} from "@/features/chat/hooks/useChat.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { cn } from "@/lib/cn.js";

export default function ChatPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [selectedId, setSelectedId] = useState(null);
  const [typingId, setTypingId] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isPending, isError, refetch } = useConversations({
    search: debouncedSearch,
  });
  const send = useSendMessage();
  const reply = useReceiveReply();

  const sendMessage = (text) => {
    const id = selectedId;
    send.mutate(
      { id, text },
      {
        onSuccess: () => {
          setTypingId(id);
          reply.mutate(id, {
            onSettled: () =>
              setTypingId((current) => (current === id ? null : current)),
          });
        },
        onError: () => toast.error(t("chat.toast.failed")),
      },
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-heading">{t("chat.title")}</h1>

      <Card className="grid min-h-[34rem] overflow-hidden lg:h-[calc(100vh-13rem)] lg:grid-cols-[22rem_1fr]">
        <section
          aria-label={t("chat.title")}
          className={cn(
            "flex min-h-0 flex-col border-border lg:border-e",
            selectedId !== null && "hidden lg:flex",
          )}
        >
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("chat.search")}
                aria-label={t("chat.search")}
                className="h-10 w-full rounded-lg border border-border bg-transparent ps-9 pe-3 text-sm text-heading outline-none placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ConversationList
              items={data?.items ?? []}
              isPending={isPending}
              isError={isError}
              refetch={refetch}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </section>

        <section
          className={cn("min-h-0", selectedId === null && "hidden lg:block")}
        >
          {selectedId !== null ? (
            <ChatThread
              key={selectedId}
              id={selectedId}
              typing={typingId === selectedId}
              onBack={() => setSelectedId(null)}
              onSend={sendMessage}
            />
          ) : (
            <div className="grid h-full place-items-center p-10 text-center">
              <div>
                <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
                  <MessagesSquare size={26} />
                </span>
                <p className="text-sm text-muted">{t("chat.selectHint")}</p>
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  );
}
