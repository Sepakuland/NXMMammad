import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Importing translation files
import translationEN from "../locales/en/translation.json";
import translationFA from "../locales/fa/translation.json";
import translationAR from "../locales/ar/translation.json";
//Creating object with the variables of imported translation files
const resources = {
    ar: {
        translation: translationAR,
    },
    en: {
        translation: translationEN,
    },
    fa: {
        translation: translationFA,
    },
};
//i18N Initialization
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') == null ? "fa" : localStorage.getItem('language'), //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });
export default i18n;