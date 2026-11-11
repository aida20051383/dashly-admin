import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MailOpen, Search } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import EmailFolders from "@/features/email/components/EmailFolders.jsx";
import EmailList from "@/features/email/components/EmailList.jsx";
import EmailDetail from "@/features/email/components/EmailDetail.jsx";
import ComposePanel from "@/features/email/components/ComposePanel.jsx";
import {
  useEmails,
  useMarkRead,
  useToggleStar,
} from "@/features/email/hooks/useEmails.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { cn } from "@/lib/cn.js";

export default function EmailPage() {
  const { t } = useTranslation();

  const [folder, setFolder] = useState("inbox");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [composing, setComposing] = useState(null); // null یا { to, subject, reply }

  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isPending, isError, refetch } = useEmails({
    folder,
    search: debouncedSearch,
  });
  const markRead = useMarkRead();
  const star = useToggleStar();

  const changeFolder = (id) => {
    setFolder(id);
    setSelectedId(null);
    setComposing(null);
  };

  const select = (email) => {
    setComposing(null);
    setSelectedId(email.id);
    if (!email.read) markRead.mutate({ id: email.id, read: true });
  };

  const compose = (initial = { to: "", subject: "", reply: false }) => {
    setSelectedId(null);
    setComposing(initial);
  };

  const reply = (email) =>
    compose({
      to: email.folder === "sent" ? email.to : email.from.email,
      subject: /^re:/i.test(email.subject)
        ? email.subject
        : `Re: ${email.subject}`,
      reply: true,
    });

  const detailOpen = Boolean(composing) || selectedId !== null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-heading">{t("email.title")}</h1>

      <Card className="grid min-h-[34rem] overflow-hidden lg:h-[calc(100vh-13rem)] lg:grid-cols-[14rem_22rem_1fr]">
        <div
          className={cn(
            "border-border lg:border-e",
            detailOpen && "hidden lg:block",
          )}
        >
          <EmailFolders
            active={folder}
            unread={data?.counts.inboxUnread ?? 0}
            onChange={changeFolder}
            onCompose={() => compose()}
          />
        </div>

        <section
          aria-label={t(`email.folders.${folder}`)}
          className={cn(
            "flex min-h-0 flex-col border-border lg:border-e",
            detailOpen && "hidden lg:flex",
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
                placeholder={t("email.search")}
                aria-label={t("email.search")}
                className="h-10 w-full rounded-lg border border-border bg-transparent ps-9 pe-3 text-sm text-heading outline-none placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <EmailList
              items={data?.items ?? []}
              isPending={isPending}
              isError={isError}
              refetch={refetch}
              folder={folder}
              selectedId={selectedId}
              onSelect={select}
              onToggleStar={(id) => star.mutate(id)}
            />
          </div>
        </section>

        <section className={cn("min-h-0", !detailOpen && "hidden lg:block")}>
          {composing ? (
            <ComposePanel
              key={`${composing.to}|${composing.subject}`}
              initial={composing}
              onClose={() => setComposing(null)}
              onSent={() => {
                setComposing(null);
                setFolder("sent");
              }}
            />
          ) : selectedId !== null ? (
            <EmailDetail
              key={selectedId}
              id={selectedId}
              onBack={() => setSelectedId(null)}
              onReply={reply}
              onGone={() => setSelectedId(null)}
            />
          ) : (
            <div className="grid h-full place-items-center p-10 text-center">
              <div>
                <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
                  <MailOpen size={26} />
                </span>
                <p className="text-sm text-muted">{t("email.selectHint")}</p>
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  );
}
