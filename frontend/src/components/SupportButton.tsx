import React from 'react';
import { t } from '../services/i18n';

interface SupportButtonProps {
  isSupported: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  isSupported,
  onToggle,
  isLoading = false
}) => {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      aria-label={isSupported ? 'Withdraw support from this issue' : 'Support this issue'}
      className={`px-6 py-2 rounded-full font-label-bold text-label-bold transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isSupported
          ? 'bg-surface-container-highest text-on-surface-variant border border-white/10 hover:bg-surface-variant'
          : 'bg-tertiary text-on-tertiary-fixed hover:opacity-90 shadow-tertiary/20'
      }`}
    >
      {isLoading ? (
        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : isSupported ? (
        <>
          <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
          {t('supported').toUpperCase()}
        </>
      ) : (
        t('support').toUpperCase()
      )}
    </button>
  );
};
export default SupportButton;
