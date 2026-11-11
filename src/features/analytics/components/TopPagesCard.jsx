import { useTranslation } from "react-i18next";
import { Card, CardHeader } from "@/components/ui/Card.jsx";
import { formatCompactInt, formatRate } from "@/features/analytics/format.js";

export default function TopPagesCard({ pages }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

  return (
    <Card className="p-6">
      <CardHeader title={t("analytics.pages.title")} />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted">
              <th scope="col" className="pb-3 text-start font-medium">
                {t("analytics.pages.page")}
              </th>
              <th scope="col" className="pb-3 text-end font-medium">
                {t("analytics.pages.views")}
              </th>
              <th scope="col" className="pb-3 text-end font-medium">
                {t("analytics.pages.bounce")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.map((page) => (
              <tr key={page.path}>
                <td className="py-3.5 font-medium text-heading">
                  <bdi dir="ltr">{page.path}</bdi>
                </td>
                <td className="py-3.5 text-end">
                  {formatCompactInt(page.views, lng)}
                </td>
                <td className="py-3.5 text-end">
                  {formatRate(page.bounce, lng)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
