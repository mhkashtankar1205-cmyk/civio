import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { usePosts } from '../hooks/usePosts';
import { ProfileHeader } from '../components/ProfileHeader';
import { BottomNavbar } from '../components/BottomNavbar';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PostCard } from '../components/PostCard';
import { ProfileSkeleton } from '../components/Skeletons';
import { Post } from '../types';
import { t } from '../services/i18n';
import { authService } from '../services/authService';

type ProfileTab = 'posts' | 'supported' | 'resolved';

export const Profile: React.FC = () => {
  const { useGetCurrentUser, useUpdateProfileMutation } = useUser();
  const { data: currentUser, isLoading: loadingUser } = useGetCurrentUser();
  const updateProfileMutation = useUpdateProfileMutation();

  const { useGetPosts } = usePosts();
  const { data: posts, isLoading: loadingPosts } = useGetPosts();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setShowDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/onboarding';
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 max-w-[600px] mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-4">No active resident session found.</p>
        <button 
          onClick={() => window.location.href = '/join'}
          className="px-6 py-2.5 bg-primary text-on-primary font-label-bold rounded-xl"
        >
          Join Community
        </button>
      </div>
    );
  }

  // Live Stats calculations from actual database issues
  const userIssues = posts ? posts.filter(post => post.userId === currentUser.id) : [];
  const supportedIssues = posts ? posts.filter(post => post.supportedBy.includes(currentUser.id)) : [];
  
  // Calculate impact score dynamically: +10 per report, +2 per support, +25 per resolved issue associated with the user
  const resolvedCount = posts ? posts.filter(post => post.status === 'Resolved' && (post.userId === currentUser.id || post.supportedBy.includes(currentUser.id))).length : 0;
  const liveImpactScore = (userIssues.length * 10) + (supportedIssues.length * 2) + (resolvedCount * 25);

  const liveStatsUser = {
    ...currentUser,
    issuesReported: userIssues.length,
    issuesSupported: supportedIssues.length,
    impactScore: liveImpactScore
  };

  // Filter posts based on active tab
  const getTabPosts = () => {
    if (!posts) return [];

    switch (activeTab) {
      case 'posts':
        // User's reported posts
        return userIssues;
      case 'supported':
        // Posts the user has supported
        return supportedIssues;
      case 'resolved':
        // Resolved issues associated with the user
        return posts.filter(post => post.status === 'Resolved' && (post.userId === currentUser.id || post.supportedBy.includes(currentUser.id)));
      default:
        return [];
    }
  };

  const visiblePosts = getTabPosts();

  const handleEditProfileMock = () => {
    const newName = prompt("Enter your full name:", currentUser.name);
    const newArea = prompt("Enter your neighborhood / area:", currentUser.area);
    if (newName !== null || newArea !== null) {
      updateProfileMutation.mutate({
        name: newName || currentUser.name,
        area: newArea || currentUser.area
      });
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-[600px] mx-auto">
          <span className="font-display-lg text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
            Civio
          </span>
          <div className="flex items-center gap-4 relative">
            <LanguageSwitcher />
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                menu
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-surface-container-highest border border-white/10 p-1.5 z-50 shadow-2xl glass-panel">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs font-label-bold text-error hover:bg-error/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-error"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 max-w-[600px] mx-auto min-h-screen">
        
        {/* Profile Header */}
        <ProfileHeader user={liveStatsUser} onEditProfile={handleEditProfileMock} />

        {/* Tab Buttons */}
        <section className="mt-8">
          <div className="sticky top-16 z-40 bg-black border-b border-white/10">
            <div className="flex w-full select-none">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200 ${
                  activeTab === 'posts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'posts' ? "'FILL' 1" : "'FILL' 0" }}>
                  grid_view
                </span>
                <span>{t('my_reports')}</span>
              </button>
              
              <button
                onClick={() => setActiveTab('supported')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200 ${
                  activeTab === 'supported'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'supported' ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
                <span>{t('supported_tab')}</span>
              </button>
              
              <button
                onClick={() => setActiveTab('resolved')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 font-label-bold text-[10px] uppercase transition-all duration-200 ${
                  activeTab === 'resolved'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'resolved' ? "'FILL' 1" : "'FILL' 0" }}>
                  task_alt
                </span>
                <span>{t('resolved_tab')}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout of photos */}
          {loadingPosts ? (
            <div className="flex justify-center py-20 text-on-surface-variant">
              <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : visiblePosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-[2px] mt-[2px] bg-black">
              {visiblePosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square relative group cursor-pointer overflow-hidden bg-zinc-900 border border-white/5"
                >
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={post.imageUrl} 
                    alt={post.title} 
                    loading="lazy"
                  />
                  {/* Status Overlay indicator */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-label-bold text-white uppercase tracking-wider bg-black/60 px-2 py-1 rounded">
                      {t(post.status.toLowerCase().replace(/\s+/g, '_')).toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">grid_off</span>
              <p className="text-sm font-label-bold">
                {activeTab === 'posts' ? t('no_posts_yet') : activeTab === 'supported' ? t('no_supported_yet') : t('no_resolved_yet')}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Expanded Modal view for clicking grid item */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-[500px] bg-surface-container border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full border border-white/10 hover:bg-black transition-colors z-40"
            >
              <span className="material-symbols-outlined text-sm block">close</span>
            </button>
            <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
              <PostCard post={selectedPost} />
            </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};
export default Profile;
