import { useTranslation } from "react-i18next";
import { ArrowLeft, Reply, RotateCcw, Star, Trash2, X } from "lucide-react";
import {
  useDeleteEmail,
  useEmail,
  useRestoreEmail,
  useToggleStar,
  useTrashEmail,
} from "@/features/email/hooks/useEmails.js";
import { formatFull } from "@/features/email/format.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { getInitials } from "@/lib/text.js";
import { cn } from "@/lib/cn.js";

const actionClass =
  "grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-heading";

export default function EmailDetail({ id, onBack, onReply, onGone }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { data: email, isPending, isError } = useEmail(id);

  const star = useToggleStar();
  const trash = useTrashEmail();
  const restore = useRestoreEmail();
  const remove = useDeleteEmail();

  const run = (mutation, successKey) => () =>
    mutation.mutate(id, {
      onSuccess: () => {
        toast.success(t(`email.toast.${successKey}`));
        onGone();
      },
      onError: () => toast.error(t("email.toast.failed")),
    });

  const back = (
    <button
      type="button"
      onClick={onBack}
      aria-label={t("email.back")}
      className={cn(actionClass, "lg:hidden")}
    >
      <ArrowLeft size={20} className="rtl:rotate-180" />
    </button>
  );

  if (isPending) {
    return (
      <div aria-hidden="true" className="space-y-4 p-6">
        <div className="h-8 w-2/3 animate-pulse rounded-md bg-hover" />
        <div className="h-16 animate-pulse rounded-md bg-hover" />
        <div className="h-40 animate-pulse rounded-md bg-hover" />
      </div>
    );
  }

  if (isError || !email) {
    return (
      <div role="alert" className="p-6">
        {back}
        <p className="mt-4 text-sm text-danger">{t("email.error.title")}</p>
      </div>
    );
  }

  const inTrash = email.folder === "trash";

  return (
    <article className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-border px-3 py-2 sm:px-4">
        {back}
        <div className="ms-auto flex items-center">
          <button
            type="button"
            onClick={() => star.mutate(id)}
            aria-label={
              email.starred
                ? t("email.actions.unstar")
                : t("email.actions.star")
            }
            aria-pressed={email.starred}
            className={cn(
              actionClass,
              email.starred && "text-warning hover:text-warning",
            )}
          >
            <Star size={18} fill={email.starred ? "currentColor" : "none"} />
          </button>

          {!inTrash && (
            <button
              type="button"
              onClick={() => onReply(email)}
              aria-label={t("email.actions.reply")}
              className={actionClass}
            >
              <Reply size={18} className="rtl:-scale-x-100" />
            </button>
          )}

          {inTrash ? (
            <>
              <button
                type="button"
                onClick={run(restore, "restored")}
                aria-label={t("email.actions.restore")}
                className={actionClass}
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                onClick={run(remove, "deleted")}
                aria-label={t("email.actions.deleteForever")}
                className={cn(actionClass, "hover:text-danger")}
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={run(trash, "trashed")}
              aria-label={t("email.actions.trash")}
              className={cn(actionClass, "hover:text-danger")}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <h2 className="text-xl font-bold text-heading">{email.subject}</h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary">
            {getInitials(email.from.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-heading">
              {email.from.name}{" "}
              <bdi dir="ltr" className="text-xs font-normal text-muted">
                &lt;{email.from.email}&gt;
              </bdi>
            </p>
            <p className="truncate text-xs text-muted">
              {t("email.to")}: <bdi dir="ltr">{email.to}</bdi>
            </p>
          </div>
          <time className="ms-auto shrink-0 text-xs text-muted">
            {formatFull(email.date, i18n.language)}
          </time>
        </div>

        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground">
          {email.body}
        </p>
      </div>
    </article>
  );
}
