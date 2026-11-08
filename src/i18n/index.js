import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fa from "./locales/fa.json";

const getSavedLang = () => {
  try {
    return localStorage.getItem("lang") === "fa" ? "fa" : "en";
  } catch {
    return "en";
  }
};

// زبان صفحه، جهت (rtl/ltr) و ذخیره در localStorage
const applyLang = (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "fa" ? "rtl" : "ltr";
  try {
    localStorage.setItem("lang", lng);
  } catch {
    /* ignore */
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: getSavedLang(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React خودش escape می‌کنه
});

applyLang(i18n.language);
i18n.on("languageChanged", applyLang);

export default i18n;
