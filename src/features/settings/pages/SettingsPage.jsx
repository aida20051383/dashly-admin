import { useTranslation } from "react-i18next";
import AppearanceCard from "@/features/settings/components/AppearanceCard.jsx";
import NotificationPrefsCard from "@/features/settings/components/NotificationPrefsCard.jsx";
import DangerZoneCard from "@/features/settings/components/DangerZoneCard.jsx";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("settings.subtitle")}</p>
      </div>

      <AppearanceCard />
      <NotificationPrefsCard />
      <DangerZoneCard />
    </div>
  );
}
