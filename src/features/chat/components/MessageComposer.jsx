import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SendHorizontal } from "lucide-react";

export default function MessageComposer({ onSend }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const ref = useRef(null);

  // ارتفاع textarea با متن بزرگ می‌شه، تا یه سقف
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [text]);

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 border-t border-border p-3 sm:p-4"
    >
      <textarea
        ref={ref}
        rows={1}
        dir="auto"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={t("chat.placeholder")}
        aria-label={t("chat.placeholder")}
        className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-heading outline-none placeholder:text-muted focus:border-primary"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label={t("chat.send")}
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
      >
        <SendHorizontal size={19} className="rtl:-scale-x-100" />
      </button>
    </form>
  );
}
