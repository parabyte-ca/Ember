import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { resolveLocale } from '@ember/lib';

const locale = resolveLocale(Localization.getLocales()[0]?.languageCode);

i18n.use(initReactI18next).init({
  lng: locale,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        app: { name: 'Ember', tagline: 'Deepen your connection, one question at a time.' },
        auth: { signIn: 'Sign in', signOut: 'Sign out', magicLink: 'Send magic link' },
        dashboard: { todaysPrompt: "Today's question", yourStreak: 'Your streak', days: 'days' },
      },
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
