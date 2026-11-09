import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { CircleCheck, CircleX, X } from "lucide-react";

const ToastContext = createContext(null);

const tones = {
  success: { icon: CircleCheck, className: "text-success" },
  error: { icon: CircleX, className: "text-danger" },
};

export function ToastProvider({ children }) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback(
    (id) => setToasts((list) => list.filter((x) => x.id !== id)),
    [],
  );

  const show = useCallback(
    (message, tone) => {
      const id = ++nextId.current;
      setToasts((list) => [...list, { id, message, tone }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-6 end-6 z-[70] flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-3"
        >
          {toasts.map(({ id, message, tone }) => {
            const { icon: Icon, className } = tones[tone];
            return (
              <div
                key={id}
                role="status"
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <Icon size={20} className={`mt-0.5 shrink-0 ${className}`} />
                <p className="flex-1 text-sm text-heading">{message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(id)}
                  aria-label={t("common.close")}
                  className="text-muted transition-colors hover:text-heading"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
