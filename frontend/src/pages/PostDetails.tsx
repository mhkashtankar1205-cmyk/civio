import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/PostCard';
import { BottomNavbar } from '../components/BottomNavbar';
import { PostSkeleton } from '../components/Skeletons';
import { useTranslation } from '../services/i18n';



export const PostDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetPost } = usePosts();
  const { data: post, isLoading } = useGetPost(id || '');

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center" role="banner">
        <div className="w-full max-w-[600px] mx-auto px-margin-mobile flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            aria-label="Go back"
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
          >
            arrow_back
          </button>
          <h1 className="font-display-lg text-lg font-bold">{t('issue_details')}</h1>
          <div className="w-6 h-6"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-margin-mobile max-w-[600px] mx-auto min-h-screen flex flex-col" role="main">
        {isLoading ? (
          <div className="py-4">
            <PostSkeleton />
          </div>
        ) : post ? (
          <div className="py-4 space-y-4">
            <PostCard post={post} />

            {post.status === 'Resolved' && (
              <div className="p-4 rounded-3xl bg-emerald-950/20 border border-emerald-500/15 backdrop-blur-md flex items-center gap-3">
                <span className="material-symbols-outlined text-green-400">verified</span>
                <p className="text-xs text-green-300 font-medium">
                  {t('resolved_trust_indicator')}
                </p>
              </div>
            )}

            {post.status === 'Resolved' && (post.beforeImage || post.imageUrl || post.afterImage) && (
              <div className="p-4 rounded-3xl bg-surface-container/60 border border-white/5 backdrop-blur-md">
                <h3 className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider mb-3">{t('resolution_comparison')}</h3>
                {post.afterImage && (post.beforeImage || post.imageUrl) ? (
                  <div className="flex flex-col gap-4">
                    {/* Before Image */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={post.beforeImage || post.imageUrl} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                        {t('before')}
                      </div>
                    </div>
                    {/* Resolved Image */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={post.afterImage} alt="Resolved" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {t('resolved_image')}
                      </div>
                    </div>
                  </div>
                ) : post.afterImage ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10">
                    <img src={post.afterImage} alt="Resolved" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{t('resolved_image')}</div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10">
                    <img src={post.beforeImage || post.imageUrl} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">{t('before')}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container rounded-3xl p-6 border border-white/5 mt-4">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-3">campaign</span>
            <h2 className="font-headline-sm text-base font-bold text-white mb-2">{t('report_not_found')}</h2>
            <p className="font-body-md text-on-surface-variant text-xs mt-1.5 leading-relaxed">
              {t('report_not_found_desc')}
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('go_to_home_feed')}
            </button>
          </div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
};

export default PostDetails;
