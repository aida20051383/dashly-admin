import { useTranslation } from "react-i18next";
import { Languages, ShieldCheck, Zap } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo.jsx";

const features = [
  { key: "insights", icon: Zap },
  { key: "secure", icon: ShieldCheck },
  { key: "bilingual", icon: Languages },
];

export default function AuthHero() {
  const { t } = useTranslation();

  return (
    <section className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary to-[#9e95f5] p-12 text-white lg:flex">
      {/* دایره‌های تزئینی */}
      <div
        aria-hidden="true"
        className="absolute -end-24 -top-24 size-80 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -start-16 size-96 rounded-full bg-white/10"
      />

      <div className="relative flex items-center gap-3">
        <LogoMark className="size-10 rounded-xl ring-2 ring-white/40" />
        <span className="text-2xl font-bold tracking-tight">Dashly</span>
      </div>

      <div className="relative max-w-md">
        <h2 className="text-4xl font-bold leading-tight">
          {t("auth.hero.title")}
        </h2>
        <p className="mt-4 text-lg text-white/80">{t("auth.hero.text")}</p>

        <ul className="mt-10 space-y-4">
          {features.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/15">
                <Icon size={20} />
              </span>
              {t(`auth.hero.features.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/60">
        © {new Date().getFullYear()} Dashly
      </p>
    </section>
  );
}
