import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal.jsx";
import { useIncreaseBudget } from "@/features/dashboard/hooks/useDashboard.js";
import { formatCurrency, formatYear } from "@/lib/format.js";

const quickAmounts = [1000, 5000, 10000];
const whole = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

export default function IncreaseBudgetModal({ open, onClose, year }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const [amount, setAmount] = useState("");
  const { mutate, reset, isPending, isError } = useIncreaseBudget();

  // هر بار باز شد، فرم و خطای قبلی پاک بشه
  useEffect(() => {
    if (open) {
      setAmount("");
      reset();
    }
  }, [open, reset]);

  const value = Number(amount);
  const valid = amount !== "" && Number.isFinite(value) && value > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    mutate({ year, amount: value }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("dashboard.revenue.modal.title")}
    >
      <form onSubmit={submit}>
        <p className="mb-4 text-sm">
          {t("dashboard.revenue.modal.description", {
            year: formatYear(year, lng),
          })}
        </p>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-heading">
            {t("dashboard.revenue.modal.amount")}
          </span>
          <input
            autoFocus
            type="number"
            min="1"
            step="any"
            inputMode="decimal"
            dir="ltr"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-transparent px-3 text-heading outline-none transition-colors focus:border-primary"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(String(a))}
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              +{formatCurrency(a, lng, whole)}
            </button>
          ))}
        </div>

        {isError && (
          <p role="alert" className="mt-4 text-sm text-danger">
            {t("dashboard.revenue.modal.error")}
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
            type="submit"
            disabled={!valid || isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending
              ? t("dashboard.revenue.modal.saving")
              : t("dashboard.revenue.modal.submit")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
