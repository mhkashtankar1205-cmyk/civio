import React from 'react';
import { User } from '../types';
import { useTranslation } from '../services/i18n';

interface ProfileHeaderProps {
  user: User;
  onEditProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile
}) => {
  const { t } = useTranslation();

  return (
    <section className="px-margin-mobile pt-4 flex flex-col items-center">
      {/* Avatar Container */}
      <div className="relative">
        <div className="rounded-full w-32 h-32 flex items-center justify-center bg-gradient-to-tr from-primary via-secondary to-tertiary p-[3px]">
          <div className="bg-surface rounded-full w-full h-full p-1 overflow-hidden">
            <img 
              className="w-full h-full object-cover rounded-full" 
              src={user.avatar} 
              alt={user.name} 
            />
          </div>
        </div>
        {user.verified && (
          <div className="absolute bottom-1 right-1 bg-primary text-on-primary p-1 rounded-full border-4 border-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
        )}
      </div>

      {/* Name and Area */}
      <div className="mt-4 text-center">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white">{user.name}</h2>
        <p className="text-on-surface-variant font-label-bold text-xs mt-1 uppercase tracking-widest">
          {user.verified ? t('verified_resident') : t('resident')} • {user.area}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 w-full mt-8">
        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-4 rounded-xl text-center hover:scale-105 active:scale-95 duration-200 cursor-pointer">
          <p className="text-primary font-stat-lg text-stat-lg">{user.issuesReported}</p>
          <p className="text-on-surface-variant font-label-bold text-[10px] mt-1 uppercase">{t('issues_reported')}</p>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-4 rounded-xl text-center hover:scale-105 active:scale-95 duration-200 cursor-pointer">
          <p className="text-secondary font-stat-lg text-stat-lg">{user.issuesSupported}</p>
          <p className="text-on-surface-variant font-label-bold text-[10px] mt-1 uppercase">{t('issues_supported')}</p>
        </div>

        <div className="bg-primary-container/20 border border-primary/20 p-4 rounded-xl text-center relative overflow-hidden hover:scale-105 active:scale-95 duration-200 cursor-pointer">
          <div className="flex items-center justify-center gap-1">
            <p className="text-white font-stat-lg text-stat-lg">{user.impactScore}</p>
            <span className="material-symbols-outlined text-green-400 text-lg">north_east</span>
          </div>
          <p className="text-on-primary-container font-label-bold text-[10px] mt-1 uppercase">{t('impact_score')}</p>
        </div>
      </div>

      <button 
        onClick={onEditProfile}
        className="w-full mt-6 bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/90 font-label-bold py-3 rounded-full transition-transform active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {t('edit_profile')}
      </button>
    </section>
  );
};
export default ProfileHeader;
