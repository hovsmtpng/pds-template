import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/translation.json";
import id from "@/locales/id/translation.json";
import { getLocalStorage, setLocalStorage } from "@puninar-logistics/pds-sdk";

const language = (getLocalStorage("language") as string) || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: language,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language: string) => {
  setLocalStorage("language", language);
});

export default i18n;