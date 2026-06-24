import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import { useNotifications } from '../hooks/useNotifications';
import { PostCard } from '../components/PostCard';
import { StoryCategory } from '../components/StoryCategory';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { BottomNavbar } from '../components/BottomNavbar';
import { PostSkeleton } from '../components/Skeletons';
import { useTranslation } from '../services/i18n';

export const Feed: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { useGetPosts } = usePosts();
  const { data: posts, isLoading } = useGetPosts();
  const { useGetCurrentUser } = useUser();
  const { data: currentUser } = useGetCurrentUser();
  const { useGetNotifications } = useNotifications();
  const { data: notifications } = useGetNotifications();

  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const unreadNotifications = notifications?.some(n => !n.read) ?? false;

  // Filter posts based on selected area story
  const filteredPosts = posts?.filter(post => {
    if (selectedArea) {
      return post.area.toLowerCase().includes(selectedArea.toLowerCase());
    }
    return true;
  });

  // Story categories mocking Image 5
  const stories = [
    { id: 'all', label: t('all_alerts'), avatar: currentUser?.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner', areaKey: null },
    { id: 'koregaon', label: 'Koregaon', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDno3CwGoDf12Zm0srTvasCo-2saJqkhU4J7Zalnm6ecLn7a6Q-gwjjsFEDgE6KiDuy-yqhBtLPnpz0ipUkcNB8CMye56-5tyzbo6fTL-srK7-1p1epJHjp-rroQsSCpMMbJD6atH0uk2qe2j-8XpM4ncxwAuExybKh0RiMwbclmmGyijuo6qXDgKZlKLOqOU8dbUFGUirw3utXKWl9OVwnsVSz3YcHUdGltQOW7wIRzgDOVRcVK67bl2vDF3ab7GbLRg5g9GM9LQE', areaKey: 'Koregaon' },
    { id: 'viman', label: 'Viman Ngr', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtT2rB9gm1gFfUshb9_Vfpt5Bze4F5m14dsM9SIaCA-22Uk9svtx2KXijJu6NA1AnRxoyVxUSjMk06BlpS0u7WQ88GC2-GOHcKnEHGPijKxExnc2Fw_hYKIsZueOaTZ45RmauwLf-3yOtep3Vbr4Os6eeSQmtaJ7jUtKF0GSESLIz6Aw_y5FBlXdMQ-wPhV0AEjtee4n8Ng_4pvs_-Yy-DU2FehiZGH8cgRRXidGP_QerG6p9cBtO3v7AKHaKzhUs6W0uib8s9fKc', areaKey: 'Viman' },
    { id: 'kalyani', label: 'Kalyani', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO_RmGucupRyvGKvIJnPA1U9tZdajmxj7GbhbtiOTafZ44BwJL8ML9MXJCr_BHVLsKz-fzr0YyUucxGkfNbitYPSC7iBMglXh_y6q2QW1G8wrFjRAnWgb2d7m7f0pOebcbj1bjVufglGWuh_aoccz0NZ-q9cj9TYRxjQ0wFz_YlOymFo_mQ2yiqCwtpMCeKTwgvZvw2s-Xk81OS81KhkzkV3PzOryGFOtOodEl6U6bJcxuiineVWRVHLISc_Nl7ICrKCapbrk68Io', areaKey: 'Kalyani' },
    { id: 'hadapsar', label: 'Hadapsar', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXM-Th-DWwO2Pg4gykfErUNERm4KCrLHQPG7xWPXBbNOs_UCP9kyDIlJ4lefEt-zrpDdYOtpmiQ8gD_p2QVpfhtCJXvP0RHCRJFptsZSMjbFTuxBDRDTC7BaOGzDFONH7WAfFXfapxBf3wus676fuKAt8pC_sRrdscMSLGStaYtNCFSFVFTpdSYLeM4sRKLYO0339MfVkWLADzIEklyybb2p8E6348mbpeW5qGYpvgu9E9RdN95N4ZcSIE8mhnKzOFankxMjiG6yE', areaKey: 'Hadapsar' }
  ];


  // Community Overview computations
  const totalReports = posts ? posts.length : 0;
  const resolvedIssues = posts ? posts.filter(p => p.status === 'Resolved').length : 0;
  const activeIssues = totalReports - resolvedIssues;

  // Compute top category
  const categoryCounts = posts ? posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};
  const topCategory = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
    : 'None';

  // Get Top 3 Trending Issues
  const trendingIssuesList = posts 
    ? [...posts].sort((a, b) => b.supportedBy.length - a.supportedBy.length).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-[600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display-lg text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold cursor-pointer" onClick={() => navigate('/')}>
              Civio
            </span>
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/nearby')}
              className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity"
            >
              map
            </button>
            <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
              <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity">
                notifications
              </button>
              {unreadNotifications && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Feed Container */}
      <main className="pt-16 max-w-[600px] mx-auto min-h-screen flex flex-col px-margin-mobile gap-6">
        {/* Post cards list - Primary Focus */}
        <section className="flex-grow flex flex-col gap-4 mt-4">
          {isLoading ? (
            <div className="space-y-6">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-20 bg-surface-container rounded-3xl p-6 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-3">campaign</span>
              <p className="font-body-md text-on-surface-variant text-xs mt-1.5 leading-relaxed">{t('no_posts_yet')}</p>
              {selectedArea && (
                <button 
                  onClick={() => setSelectedArea(null)}
                  className="mt-3 text-xs text-primary font-bold hover:underline"
                >
                  {t('clear_filters')}
                </button>
              )}
            </div>
          )}
        </section>

        {/* Compact Community Overview Statistics row (Height <= 80px) */}
        {!isLoading && posts && posts.length > 0 && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-3 shadow-xl flex items-center justify-around h-20">
            <div className="text-center">
              <span className="text-[8px] font-label-bold text-on-surface-variant/40 block">{t('total_reports')}</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{totalReports}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-center">
              <span className="text-[8px] font-label-bold text-on-surface-variant/40 block">{t('active_issues')}</span>
              <span className="text-sm font-bold text-secondary mt-0.5 block">{activeIssues}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-center">
              <span className="text-[8px] font-label-bold text-on-surface-variant/40 block">{t('resolved_issues')}</span>
              <span className="text-sm font-bold text-green-400 mt-0.5 block">{resolvedIssues}</span>
            </div>
          </section>
        )}

        {/* Compact Trending Nearby list */}
        {!isLoading && trendingIssuesList.length > 0 && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl mb-6">
            <h2 className="text-[9px] font-label-bold text-on-surface-variant/75 uppercase tracking-widest mb-2.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] text-secondary">local_fire_department</span>
              {t('trending_nearby')}
            </h2>
            <div className="divide-y divide-white/5">
              {trendingIssuesList.map(issue => (
                <div 
                  key={issue.id}
                  onClick={() => navigate(`/post/${issue.id}`)}
                  className="py-2 first:pt-0 last:pb-0 flex justify-between items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-xs font-bold text-white truncate flex-1">{issue.title}</h3>
                  <span className="text-[10px] text-secondary font-label-bold flex items-center gap-0.5 flex-shrink-0">
                    <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    {issue.supportedBy.length} {t('support')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <BottomNavbar />
    </div>
  );
};
export default Feed;
