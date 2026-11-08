import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Headphones,
  Keyboard,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Watch,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown.jsx";
import IconButton from "@/components/ui/IconButton.jsx";
import { useCart } from "@/features/cart/CartContext.jsx";
import { formatCurrency, formatNumber } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const kindStyle = {
  headphones: { icon: Headphones, tone: "bg-primary/15 text-primary" },
  watch: { icon: Watch, tone: "bg-info/15 text-info" },
  keyboard: { icon: Keyboard, tone: "bg-warning/15 text-warning" },
};

const stepBtn =
  "grid size-7 place-items-center text-foreground transition-colors hover:bg-hover hover:text-primary disabled:pointer-events-none disabled:opacity-40";

export default function CartMenu() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const { items, count, total, setQty, remove, clear } = useCart();

  const badge =
    count > 9
      ? `${formatNumber(9, lng)}+`
      : count
        ? formatNumber(count, lng)
        : 0;

  return (
    <Dropdown
      className="w-[24rem] max-w-[calc(100vw-2rem)]"
      trigger={({ open, toggle }) => (
        <IconButton
          label={t("navbar.cart")}
          badge={badge}
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <ShoppingCart size={22} />
        </IconButton>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-heading">{t("cart.title")}</h3>
            {count > 0 && (
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                {t("cart.itemsCount", { n: formatNumber(count, lng) })}
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="grid place-items-center px-6 py-12 text-center">
              <ShoppingBag size={32} className="mb-3 text-muted" />
              <p className="font-medium text-heading">{t("cart.empty")}</p>
              <p className="mt-1 text-sm text-muted">{t("cart.emptyHint")}</p>
            </div>
          ) : (
            <>
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {items.map((item) => {
                  const { icon: Icon, tone } =
                    kindStyle[item.kind] ?? kindStyle.headphones;
                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-lg",
                          tone,
                        )}
                      >
                        <Icon size={22} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-heading">
                          {t(item.nameKey)}
                        </p>
                        <p className="text-xs text-muted">
                          {formatCurrency(item.price, lng)}
                        </p>

                        <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg border border-border">
                          <button
                            type="button"
                            className={stepBtn}
                            onClick={() => setQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            aria-label={t("cart.decrease")}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-8 text-center text-sm font-medium text-heading">
                            {formatNumber(item.qty, lng)}
                          </span>
                          <button
                            type="button"
                            className={stepBtn}
                            onClick={() => setQty(item.id, item.qty + 1)}
                            disabled={item.qty >= 99}
                            aria-label={t("cart.increase")}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label={t("cart.remove")}
                          title={t("cart.remove")}
                          className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className="text-sm font-semibold text-heading">
                          {formatCurrency(item.price * item.qty, lng)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted">{t("cart.total")}</span>
                  <span className="text-lg font-bold text-heading">
                    {formatCurrency(total, lng)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover"
                  >
                    {t("cart.clear")}
                  </button>
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
                  >
                    {t("cart.checkout")}
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Dropdown>
  );
}
