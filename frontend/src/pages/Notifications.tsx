import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { BottomNavbar } from '../components/BottomNavbar';
import { NotificationSkeleton } from '../components/Skeletons';
import { t } from '../services/i18n';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { useGetNotifications, useMarkReadMutation } = useNotifications();
  const { data: notifications, isLoading } = useGetNotifications();
  const markReadMutation = useMarkReadMutation();
  const [now] = React.useState(() => Date.now());

  // Mark all notifications as read on load
  const mutate = markReadMutation.mutate;
  useEffect(() => {
    mutate();
  }, [mutate]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'support':
        return { icon: 'favorite', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
      case 'comment':
        return { icon: 'chat_bubble', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'trending':
        return { icon: 'local_fire_department', bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      case 'resolve':
        return { icon: 'task_alt', bg: 'bg-green-500/10 text-green-400 border-green-500/20' };
      case 'milestone':
        return { icon: 'workspace_premium', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
      default:
        return { icon: 'notifications', bg: 'bg-zinc-800 text-zinc-400' };
    }
  };

  const formatTime = (isoString: string) => {
    const diffMs = now - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return t('just_now');
    if (diffMins < 60) return `${diffMins}${t('m_ago')}`;
    if (diffHours < 24) return `${diffHours}${t('h_ago')}`;
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center">
        <div className="w-full max-w-[600px] mx-auto px-margin-mobile flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors"
          >
            arrow_back
          </button>
          <h1 className="font-display-lg text-lg font-bold">{t('notifications')}</h1>
          <div className="w-6 h-6"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-margin-mobile max-w-[600px] mx-auto min-h-screen flex flex-col">
        <section className="flex-1 space-y-3">
          {isLoading ? (
            <div className="space-y-4">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notif) => {
              const style = getNotifIcon(notif.type);
              return (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-2xl border flex gap-4 items-start transition-all relative ${
                    notif.read 
                      ? 'bg-surface-container/40 border-white/5 opacity-80' 
                      : 'bg-surface-container border-white/10 shadow-lg'
                  }`}
                >
                  {/* Indicator Dot */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary" />
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                    <span className="material-symbols-outlined text-lg block" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {style.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-4">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-label-bold text-xs text-white">{notif.title}</h3>
                      <span className="text-[10px] font-label-bold text-on-surface-variant/40">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-surface-container rounded-3xl p-6 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-3">inbox</span>
              <p className="font-body-md text-on-surface-variant">{t('inbox_empty')}</p>
            </div>
          )}
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
};
export default Notifications;
