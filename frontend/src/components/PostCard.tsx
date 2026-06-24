import React, { useState } from 'react';
import { Post } from '../types';
import { SupportButton } from './SupportButton';
import { useSupport } from '../hooks/useSupport';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import { useTranslation } from '../services/i18n';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleClipboardFallback = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Unable to copy link. Please copy the URL manually.");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin + '/post/' + post.id;
    const shareTitle = `${post.title} - Civio`;
    const shareText = `${post.title} at ${post.area} (${post.status}) - Civio`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showToast("Post shared successfully");
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          await handleClipboardFallback(shareUrl);
        }
      }
    } else {
      await handleClipboardFallback(shareUrl);
    }
  };

  // Close comments drawer with Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowComments(false);
        setShowStatusMenu(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  const { useGetCurrentUser } = useUser();
  const { data: currentUser } = useGetCurrentUser();
  const { useSupportMutation, useUpvoteMutation } = useSupport();
  const { useGetComments, useAddCommentMutation, useUpdatePostStatusMutation } = usePosts();
  
  const { data: comments, isLoading: loadingComments } = useGetComments(post.id);
  const addCommentMutation = useAddCommentMutation(post.id);
  const supportMutation = useSupportMutation();
  const upvoteMutation = useUpvoteMutation();
  const updateStatusMutation = useUpdatePostStatusMutation();
  

  const isSupported = currentUser ? post.supportedBy.includes(currentUser.id) : false;
  const isUpvoted = currentUser ? post.upvotedBy?.includes(currentUser.id) : false;

  const handleSupportToggle = () => {
    supportMutation.mutate(post.id);
  };

  const handleUpvoteToggle = () => {
    upvoteMutation.mutate(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText, {
      onSuccess: () => {
        setCommentText('');
      }
    });
  };

  const changeStatus = (newStatus: Post['status']) => {
    updateStatusMutation.mutate({ postId: post.id, status: newStatus });
    setShowStatusMenu(false);
  };

  // Status badge styling helper
  const getStatusStyle = (status: Post['status']) => {
    switch (status) {
      case 'Reported':
        return 'bg-zinc-800 text-zinc-400 border border-white/5';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  return (
    <article className="bg-surface-container rounded-3xl overflow-hidden border border-white/5 transition-all duration-300 hover:scale-[1.01] shadow-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between p-margin-mobile">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-primary to-secondary">
            <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden">
              <img className="w-full h-full object-cover" src={post.authorAvatar} alt={post.authorName} loading="lazy" />
            </div>
          </div>
          <div>
            <h3 className="font-label-bold text-on-surface">{post.authorName}</h3>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span>📍 {post.area}</span>
              <span>•</span>
              <span>{post.distance === 'Nearby' ? t('nearby_label') : post.distance.replace('km away', t('km_away')).replace('m away', t('m_away'))}</span>
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)} 
            aria-label="Toggle status change menu"
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
          >
            more_horiz
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl bg-surface-container-highest border border-white/10 p-2 z-30 shadow-2xl glass-panel">
              <p className="text-[10px] font-label-bold text-on-surface-variant/60 px-2 py-1 uppercase">{t('set_status')}</p>
              {(['Reported', 'Under Review', 'In Progress', 'Resolved'] as Post['status'][]).map((status) => (
                <button
                  key={status}
                  onClick={() => changeStatus(status)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-label-bold text-on-surface hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t(status.toLowerCase().replace(/\s+/g, '_'))}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Section */}
      <div className="relative w-full overflow-hidden bg-surface-container-highest group">
        {post.status === 'Resolved' && (post.beforeImage || post.imageUrl) && post.afterImage ? (
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5 m-3 flex flex-col gap-3">
            {/* Before Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
              <img 
                src={post.beforeImage || post.imageUrl} 
                alt="Before" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" 
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                {t('before')}
              </div>
            </div>
            
            {/* Resolved Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
              <img 
                src={post.afterImage} 
                alt="Resolved" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" 
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/20 backdrop-blur-md text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                {t('resolved_image')}
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-square w-full overflow-hidden">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={(post.status === 'Resolved' && post.afterImage) ? post.afterImage : (post.beforeImage || post.imageUrl)} 
              alt={post.title} 
              loading="lazy"
            />
          </div>
        )}
        
        {/* Category Badge overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-full font-label-bold text-[10px] flex items-center gap-1 border border-white/10">
            {post.category === 'Pothole' && '⚠️'}
            {post.category === 'Garbage' && '🗑️'}
            {post.category === 'Water' && '💧'}
            {post.category === 'Lighting' && '💡'}
            {t(post.category.toLowerCase()).toUpperCase()}
          </span>
        </div>

        {/* Status Badge overlay */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full font-label-bold text-[10px] uppercase backdrop-blur-md ${getStatusStyle(post.status)}`}>
            {post.status === 'Resolved' && post.afterImage 
              ? t('resolved_badge_with_check').toUpperCase() 
              : t(post.status.toLowerCase().replace(/\s+/g, '_')).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Engagement bar */}
      <div className="p-margin-mobile">
        <div className="flex items-center justify-between mb-stack-sm">
          <div className="flex items-center gap-4">
            {/* Upvote */}
            <button 
              onClick={handleUpvoteToggle}
              aria-label={`Upvote this report. Current count ${post.upvotes}`}
              className="flex items-center gap-1.5 group/btn outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full pr-2"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center group-active/btn:scale-90 transition-all ${
                isUpvoted 
                  ? 'bg-secondary-container text-secondary' 
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isUpvoted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  keyboard_double_arrow_up
                </span>
              </div>
              <span className={`font-label-bold text-label-bold ${isUpvoted ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {post.upvotes}
              </span>
            </button>

            {/* Comments toggle */}
            <button 
              onClick={() => setShowComments(!showComments)}
              aria-label="Toggle comments section"
              className="flex items-center gap-1.5 group/btn outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full pr-2"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center group-active/btn:scale-90 transition-all ${
                showComments ? 'bg-primary-container text-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">chat_bubble</span>
              </div>
              <span className="font-label-bold text-label-bold text-on-surface-variant">
                {post.commentsCount}
              </span>
            </button>

            {/* Share */}
            <button 
              onClick={handleShare}
              aria-label="Share this report"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform text-on-surface-variant hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>

          <SupportButton 
            isSupported={isSupported} 
            onToggle={handleSupportToggle}
            isLoading={supportMutation.isPending}
          />
        </div>

        {/* Support Goal Progress */}
        {post.supportGoalPercent !== undefined && post.supportGoalPercent > 0 && (
          <div className="mt-4 mb-4">
            <div className="flex justify-between items-center text-[10px] font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              <span>{t('community_support_goal')}</span>
              <span className="text-primary font-bold">{post.supportGoalPercent}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                style={{ width: `${post.supportGoalPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Caption */}
        <p className="text-body-sm text-on-surface-variant leading-relaxed mt-3">
          <span className="font-bold text-white mr-1.5">
            {post.authorName.toLowerCase().replace(/\s+/g, '_')}
          </span>
          {post.description}
        </p>

        {/* Dynamic Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            <h4 className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">{t('comments')}</h4>
            
            {loadingComments ? (
              <p className="text-xs text-on-surface-variant">{t('loading_comments')}</p>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                    <img className="w-6 h-6 rounded-full object-cover" src={comm.avatar} alt={comm.username} loading="lazy" />
                    <div className="flex-1 bg-surface-container-high rounded-2xl p-2.5">
                      <p className="font-bold text-on-surface mb-0.5">{comm.username}</p>
                      <p className="text-on-surface-variant leading-relaxed">{comm.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">{t('no_comments')}</p>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center mt-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('add_comment')}
                className="flex-1 h-10 bg-surface-container-high border-none rounded-xl px-4 text-xs text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button 
                type="submit"
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="h-10 px-4 bg-primary text-on-primary font-label-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t('send')}
              </button>
            </form>
          </div>
        )}
      </div>
      {toastMessage && (
        <div 
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900/90 border border-white/10 text-white backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-2xl transition-all duration-300 animate-fade-in-up"
          role="status"
          aria-live="polite"
        >
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          {toastMessage}
        </div>
      )}
    </article>
  );
};
export default PostCard;
