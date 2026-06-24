import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../services/i18n';

interface Slide {
  id: number;
  image: string;
  icon: string;
  iconColor: string;
  title: string;
  desc: string;
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);

  const slides: Slide[] = [
    {
      id: 0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtsraDfiLguH6DLVDR5Cpf99vom7IO-OP8jLdpTQTsQI-VrXt9rKwrscLQpBEzo-aNdJmsjeNjW-c4W9zHNMfR929bkmNtQ2Z8-C875RdmRPlufWdo46N96bCwtTCJYdf2ZjAj7mhRqGYNoHqs-Wx6tC5w8l_omdDg5GBGkM-sbvTHgeFpmPvfSpGpvo57OIkbAHowigQ698Mk7N_MM02DN-WRb1DlhoPsl3lRB8FNZD7vK91-43G2iDc6vl5vdX_YzrrfoIUGhqw",
      icon: "add_location",
      iconColor: "text-primary",
      title: t('onboarding_title_1'),
      desc: t('onboarding_desc_1')
    },
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBinXH9F4l52JXbYXwF9zfEsdGr8_MRmUDzHt4PP5kvPNkPHNs48-86QltuRPEAhZoZSFAX1TD5FBYiYj89olRZIMkgAWT1vzhlK2kg6ClumxymFQ6aRA9W7QubAlofz11815aaUtPuaODi3F1UV4uYReM7HxU2LIVmr87iGpawgVSGA6KjdX2vE9GAYoGAECGxjXuuOx29m9Ft25TlELOuBRBHlL41jIwgmZ7SRfB77manrjBEbngKHZxhMFy4q_D3oaQOqnTVmuo",
      icon: "pan_tool",
      iconColor: "text-secondary",
      title: t('onboarding_title_2'),
      desc: t('onboarding_desc_2')
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA0vfy_zz-dcRfsAF88ySpEGHzpOJeWCwPi9pAOEyKVcIMaIY3Bzl_4Ew9Qun-HH8dW5m962SoecNKwS-Zz0ZiJKrSsDw5zXjnsfk23-Rzw_hhnbEpQdnd9jeXBKd1bz9htPUxy07ZnlZUWJOI9UYyCdIOTa7cfrdQNQXup4Zh-WsX0KvadIFqZHdL6FfJAFSXbkBKT4nJ_rlgmVzRusU0z0UsdGxvc99V5vxkcSCfIhSaEAzdPMI6koUUsTITOXsU75w8XMlccKU",
      icon: "task_alt",
      iconColor: "text-tertiary",
      title: t('onboarding_title_3'),
      desc: t('onboarding_desc_3')
    }
  ];

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      // Swipe left -> next slide
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (diff < -50) {
      // Swipe right -> prev slide
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <main 
      className="relative z-10 w-full max-w-[600px] h-[100dvh] min-h-[750px] mx-auto flex flex-col justify-between items-center py-stack-lg overflow-hidden select-none bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header & Logo */}
      <header className="w-full px-margin-mobile text-center pt-8">
        <h1 className="font-display-lg text-4xl bg-gradient-to-r from-primary via-secondary to-secondary bg-clip-text text-transparent mb-2 tracking-tighter font-extrabold select-none">
          Civio
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant opacity-80">{t('onboarding_subtitle')}</p>
      </header>

      {/* Slide Carousel Area */}
      <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out w-[300%]"
          style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-[33.333%] flex-shrink-0 flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-[380px] h-[360px] sm:h-[440px] mb-6 relative rounded-[24px] overflow-hidden bg-surface-container/75 border border-white/10 backdrop-blur-md shadow-2xl">
                <img 
                  className="w-full h-full object-cover" 
                  src={slide.image} 
                  alt={slide.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent flex flex-col justify-end p-6 select-none">
                  <span className={`material-symbols-outlined ${slide.iconColor} text-4xl mb-2 block`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {slide.icon}
                  </span>
                  <h2 className="text-lg sm:text-xl text-white font-bold leading-tight select-none">{slide.title}</h2>
                  <p className="text-[11px] sm:text-xs text-on-surface-variant/90 mt-1.5 leading-relaxed overflow-y-auto no-scrollbar select-none max-h-[80px]">{slide.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="w-full px-margin-mobile flex flex-col items-center gap-stack-md pb-10">
        {/* Progress Dots */}
        <div className="flex gap-2.5 mb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-6 bg-primary shadow-glow shadow-primary/40' 
                  : 'w-2 bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate('/join')}
          className="w-full py-4 rounded-xl font-label-bold text-label-bold text-on-primary-fixed bg-gradient-to-r from-primary to-secondary uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_4px_24px_rgba(195,192,255,0.3)]"
        >
          {t('get_started')}
        </button>
        
        <button
          onClick={() => navigate('/join')}
          className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors mt-2"
        >
          {t('already_have_account')}{' '}
          <span className="font-label-bold text-primary hover:underline">{t('login_link')}</span>
        </button>
      </footer>
    </main>
  );
};
export default Onboarding;

