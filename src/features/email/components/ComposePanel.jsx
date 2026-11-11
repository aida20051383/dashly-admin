import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import TextField from "@/components/ui/TextField.jsx";
import { useSendEmail } from "@/features/email/hooks/useEmails.js";
import { useToast } from "@/app/ToastProvider.jsx";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ComposePanel({ initial, onClose, onSent }) {
  const { t } = useTranslation();
  const toast = useToast();
  const send = useSendEmail();

  const [to, setTo] = useState(initial.to);
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const addresses = to
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const toError = !submitted
    ? null
    : addresses.length === 0
      ? t("email.errors.toRequired")
      : addresses.some((a) => !emailPattern.test(a))
        ? t("email.errors.toInvalid")
        : null;
  const bodyError =
    submitted && !body.trim() ? t("email.errors.bodyRequired") : null;

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      addresses.length === 0 ||
      addresses.some((a) => !emailPattern.test(a)) ||
      !body.trim()
    )
      return;

    send.mutate(
      { to: addresses.join(", "), subject, body },
      {
        onSuccess: () => {
          toast.success(t("email.toast.sent"));
          onSent();
        },
        onError: () => toast.error(t("email.toast.failed")),
      },
    );
  };

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-5">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("email.back")}
          className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-heading lg:hidden"
        >
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </button>
        <h2 className="text-base font-semibold text-heading">
          {initial.reply
            ? t("email.composer.reply")
            : t("email.composer.title")}
        </h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        <TextField
          label={t("email.composer.to")}
          dir="ltr"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          error={toError}
          hint={t("email.composer.toHint")}
          autoComplete="off"
        />
        <TextField
          label={t("email.composer.subject")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          multiline
          rows={9}
          label={t("email.composer.message")}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={bodyError}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover"
        >
          {t("email.composer.discard")}
        </button>
        <button
          type="submit"
          disabled={send.isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {send.isPending
            ? t("email.composer.sending")
            : t("email.composer.send")}
        </button>
      </div>
    </form>
  );
}
