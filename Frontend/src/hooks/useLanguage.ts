import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import translations, { type Lang } from '@/i18n/translations';

/**
 * Returns the current translation dictionary and a function to change language.
 * Also manages RTL direction on <html> when Arabic is selected.
 */
export function useLanguage() {
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);

  const t = translations[language] || translations.fr;

  // Set RTL on the document when Arabic
  useEffect(() => {
    const html = document.documentElement;
    if (language === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'fr');
    }
  }, [language]);

  const changeLang = useCallback((lang: Lang) => {
    setLanguage(lang);
  }, [setLanguage]);

  return { t, language, changeLang };
}
