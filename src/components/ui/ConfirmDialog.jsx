import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal.jsx";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  loadingLabel,
  loading = false,
  error,
}) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-danger/15 text-danger">
          <TriangleAlert size={22} />
        </span>
        <p className="text-sm">{message}</p>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover"
        >
          {t("common.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-danger px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? loadingLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
