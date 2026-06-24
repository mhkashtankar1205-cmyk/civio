import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/PostCard';
import { BottomNavbar } from '../components/BottomNavbar';
import { t } from '../services/i18n';

type Tab = 'supported' | 'growing' | 'attention';

export const Trending: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('supported');
  const { useGetPosts } = usePosts();
  const { data: posts, isLoading } = useGetPosts();

  const getSortedPosts = () => {
    if (!posts) return [];
    
    // Create copy for sorting
    const postCopy = [...posts];

    switch (activeTab) {
      case 'supported':
        // 🔥 Most Supported (sorted by support counts)
        return postCopy.sort((a, b) => b.supportedBy.length - a.supportedBy.length);
      case 'growing':
        // 📈 Fastest Growing (sorted by creation date)
        return postCopy.sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return bTime - aTime;
        });
      case 'attention':
        // 🏆 Community Attention (sorted by comments)
        return postCopy.sort((a, b) => b.commentsCount - a.commentsCount);
      default:
        return posts;
    }
  };

  const trendingPosts = getSortedPosts();

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center">
        <div className="w-full max-w-[600px] mx-auto px-margin-mobile flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors"
          >
            arrow_back
          </button>
          <h1 className="font-display-lg text-lg font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
            {t('trending_alerts')}
          </h1>
          <div className="w-6 h-6"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16 max-w-[600px] mx-auto min-h-screen flex flex-col">
        {/* Navigation Tabs */}
        <section className="sticky top-16 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="flex w-full select-none">
            <button 
              onClick={() => setActiveTab('supported')}
              className="flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200"
              style={{
                borderColor: activeTab === 'supported' ? 'var(--md-sys-color-primary)' : 'transparent',
                color: activeTab === 'supported' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
              }}
            >
              <span className="material-symbols-outlined text-lg">local_fire_department</span>
              <span>🔥 {t('most_supported')}</span>
            </button>

            <button 
              onClick={() => setActiveTab('growing')}
              className="flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200"
              style={{
                borderColor: activeTab === 'growing' ? 'var(--md-sys-color-primary)' : 'transparent',
                color: activeTab === 'growing' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
              }}
            >
              <span className="material-symbols-outlined text-lg">insights</span>
              <span>📈 {t('fastest_growing')}</span>
            </button>

            <button 
              onClick={() => setActiveTab('attention')}
              className="flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200"
              style={{
                borderColor: activeTab === 'attention' ? 'var(--md-sys-color-primary)' : 'transparent',
                color: activeTab === 'attention' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
              }}
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>🏆 {t('attention')}</span>
            </button>
          </div>
        </section>

        {/* Sorted Posts List */}
        <section className="flex-grow flex flex-col gap-6 p-margin-mobile">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <span className="text-xs font-label-bold">{t('loading_trending_statistics')}</span>
            </div>
          ) : trendingPosts && trendingPosts.length > 0 ? (
            trendingPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-20 bg-surface-container rounded-3xl p-6 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-3">trending_down</span>
              <p className="font-body-md text-on-surface-variant">{t('no_trending_issues')}</p>
            </div>
          )}
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
};
export default Trending;
