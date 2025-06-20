import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  // Load translations using http backend
  // See: https://github.com/i18next/i18next-http-backend
  .use(HttpBackend)
  // Detect user language
  // See: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // See: https://www.i18next.com/overview/configuration-options
  .init({
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    defaultNS: 'common', // Default namespace
    ns: ['common'], // Namespaces to load
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      // Keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      // Cache user language on
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 10, // Time in minutes to cache language in cookie
      cookieOptions: { path: '/' } // Cookie options
    }
  });

export default i18n;
