import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ── English ───────────────────────────────────────────────────────────────────
import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enPlans from "./locales/en/plans.json";

// ── Hindi ─────────────────────────────────────────────────────────────────────
import hiCommon from "./locales/hi/common.json";
import hiLanding from "./locales/hi/landing.json";
import hiAuth from "./locales/hi/auth.json";
import hiDashboard from "./locales/hi/dashboard.json";
import hiPlans from "./locales/hi/plans.json";

// ── Tamil ─────────────────────────────────────────────────────────────────────
import taCommon from "./locales/ta/common.json";
import taLanding from "./locales/ta/landing.json";
import taAuth from "./locales/ta/auth.json";
import taDashboard from "./locales/ta/dashboard.json";
import taPlans from "./locales/ta/plans.json";

// ── Marathi ───────────────────────────────────────────────────────────────────
import mrCommon from "./locales/mr/common.json";
import mrLanding from "./locales/mr/landing.json";
import mrAuth from "./locales/mr/auth.json";
import mrDashboard from "./locales/mr/dashboard.json";
import mrPlans from "./locales/mr/plans.json";

// ── Telugu ────────────────────────────────────────────────────────────────────
import teCommon from "./locales/te/common.json";
import teLanding from "./locales/te/landing.json";
import teAuth from "./locales/te/auth.json";
import teDashboard from "./locales/te/dashboard.json";
import tePlans from "./locales/te/plans.json";

// ── Gujarati ──────────────────────────────────────────────────────────────────
import guCommon from "./locales/gu/common.json";
import guLanding from "./locales/gu/landing.json";
import guAuth from "./locales/gu/auth.json";
import guDashboard from "./locales/gu/dashboard.json";
import guPlans from "./locales/gu/plans.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "ta", "mr", "te", "gu"],

    // Namespace config
    defaultNS: "common",
    fallbackNS: "common",
    ns: ["common", "landing", "auth", "dashboard", "plans"],

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: { common: enCommon, landing: enLanding, auth: enAuth, dashboard: enDashboard, plans: enPlans },
      hi: { common: hiCommon, landing: hiLanding, auth: hiAuth, dashboard: hiDashboard, plans: hiPlans },
      ta: { common: taCommon, landing: taLanding, auth: taAuth, dashboard: taDashboard, plans: taPlans },
      mr: { common: mrCommon, landing: mrLanding, auth: mrAuth, dashboard: mrDashboard, plans: mrPlans },
      te: { common: teCommon, landing: teLanding, auth: teAuth, dashboard: teDashboard, plans: tePlans },
      gu: { common: guCommon, landing: guLanding, auth: guAuth, dashboard: guDashboard, plans: guPlans },
    },
  });

export default i18n;
