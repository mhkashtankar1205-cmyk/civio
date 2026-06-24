import React from 'react';
import { useTranslation } from '../services/i18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const handleLangChange = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
  };

  const isEnglish = language === 'en';
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  return (
    <div className="flex items-center bg-surface-container-highest rounded-full px-3 py-1 gap-1 border border-white/5 select-none" role="group" aria-label="Language Selector">
      <button
        onClick={() => handleLangChange('en')}
        aria-label="Switch language to English"
        className={`text-[10px] font-bold px-1.5 py-0.5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full ${
          isEnglish ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        EN
      </button>
      <span className="text-[10px] font-bold text-on-surface-variant/30">|</span>
      <button
        onClick={() => handleLangChange('hi')}
        aria-label="Switch language to Hindi"
        className={`text-[10px] font-bold px-1.5 py-0.5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full ${
          isHindi ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        हिं
      </button>
      <span className="text-[10px] font-bold text-on-surface-variant/30">|</span>
      <button
        onClick={() => handleLangChange('mr')}
        aria-label="Switch language to Marathi"
        className={`text-[10px] font-bold px-1.5 py-0.5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full ${
          isMarathi ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        मर
      </button>
    </div>
  );
};
export default LanguageSwitcher;
