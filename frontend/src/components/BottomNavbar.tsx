import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../services/i18n';

export const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/hindi';
    }
    return location.pathname === path;
  };

  return (
    <nav aria-label="Main Navigation" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex justify-around items-center px-gutter pb-6 h-20 bg-surface/80 backdrop-blur-xl border-t border-white/10 z-50 rounded-t-2xl shadow-lg">
      <button
        onClick={() => navigate('/')}
        aria-label="Home Feed"
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 ${
          isActive('/') ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="font-label-bold text-[10px] mt-1">{t('home')}</span>
      </button>

      <button
        onClick={() => navigate('/nearby')}
        aria-label="Nearby Issues"
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 ${
          isActive('/nearby') ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: isActive('/nearby') ? "'FILL' 1" : "'FILL' 0" }}
        >
          location_on
        </span>
        <span className="font-label-bold text-[10px] mt-1">{t('nearby')}</span>
      </button>

      <button
        onClick={() => navigate('/create')}
        aria-label="Report New Issue"
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 ${
          isActive('/create') ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        <div className="bg-primary-container p-2.5 rounded-xl text-on-primary-container mb-1 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
          <span
            className="material-symbols-outlined text-xl block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
        </div>
      </button>

      <button
        onClick={() => navigate('/trending')}
        aria-label="Trending Issues"
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 ${
          isActive('/trending') ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: isActive('/trending') ? "'FILL' 1" : "'FILL' 0" }}
        >
          trending_up
        </span>
        <span className="font-label-bold text-[10px] mt-1">{t('trending')}</span>
      </button>

      <button
        onClick={() => navigate('/profile')}
        aria-label="User Profile"
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 relative ${
          isActive('/profile') ? 'text-primary' : 'text-on-surface-variant hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: isActive('/profile') ? "'FILL' 1" : "'FILL' 0" }}
        >
          person
        </span>
        <span className="font-label-bold text-[10px] mt-1">{t('profile')}</span>
      </button>
    </nav>
  );
};
export default BottomNavbar;
