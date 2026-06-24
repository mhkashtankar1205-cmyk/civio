import { useState, useEffect } from 'react';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { mr } from '../i18n/mr';

let currentLang = localStorage.getItem('civio_lang') || 'en';
const listeners = new Set<() => void>();

export const getLanguage = (): string => {
  return currentLang;
};

export const setLanguage = (lang: 'en' | 'hi' | 'mr') => {
  currentLang = lang;
  localStorage.setItem('civio_lang', lang);
  listeners.forEach(l => l());
};

export const isHindiMode = (): boolean => {
  return currentLang === 'hi';
};

const translations: Record<string, Record<string, string>> = { en, hi, mr };

export const t = (key: string): string => {
  return translations[currentLang]?.[key] || translations['en']?.[key] || key;
};

export const useTranslation = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const forceUpdate = () => setTick(t => t + 1);
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);

  const translate = (key: string): string => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  return {
    t: translate,
    language: currentLang,
    setLanguage
  };
};
