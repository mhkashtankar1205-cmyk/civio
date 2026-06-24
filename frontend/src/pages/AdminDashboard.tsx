import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { uploadService } from '../services/uploadService';
import { Post } from '../types';
import safeStorage from '../services/storage';
import { useTranslation } from '../services/i18n';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'supports'>('date');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<{ [id: string]: string }>({});

  const currentUser = JSON.parse(safeStorage.getItem('civio_current_user') || '{}');

  useEffect(() => {
    // Role protection
    if (currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts();
      setPosts(data);
      // Populate local notes states
      const initialNotes: { [id: string]: string } = {};
      data.forEach(p => {
        initialNotes[p.id] = p.adminNotes || '';
      });
      setNotesState(initialNotes);
      setError('');
    } catch {
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTransition = async (post: Post, nextStatus: Post['status'], afterImage?: string) => {
    try {
      setUpdatingId(post.id);
      await postService.updatePostStatus(post.id, nextStatus, afterImage);
      await fetchPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (postId: string) => {
    try {
      setUpdatingId(postId);
      const noteText = notesState[postId] || '';
      await postService.updatePostStatus(postId, undefined, undefined, noteText);
      await fetchPosts();
    } catch {
      setError('Failed to update internal admin note.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResolveUpload = async (e: React.ChangeEvent<HTMLInputElement>, post: Post) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdatingId(post.id);
      setError('');
      const afterImageUrl = await uploadService.uploadImage(file);
      await handleStatusTransition(post, 'Resolved', afterImageUrl);
    } catch {
      setError('Image upload failed.');
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    safeStorage.removeItem('civio_current_user');
    safeStorage.removeItem('civio_token');
    navigate('/onboarding');
  };

  // Filter & Sort logic
  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'All') return true;
    return post.status === filterStatus;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'supports') {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const resolvedToday = posts.filter(p => {
    if (p.status !== 'Resolved') return false;
    const resolvedHistory = p.statusHistory?.filter(h => h.status === 'Resolved') || [];
    const resolveDate = resolvedHistory.length > 0 ? new Date(resolvedHistory[resolvedHistory.length - 1].timestamp) : new Date(p.createdAt);
    return resolveDate.toDateString() === today;
  }).length;

  const resolvedThisMonth = posts.filter(p => {
    if (p.status !== 'Resolved') return false;
    const resolvedHistory = p.statusHistory?.filter(h => h.status === 'Resolved') || [];
    const resolveDate = resolvedHistory.length > 0 ? new Date(resolvedHistory[resolvedHistory.length - 1].timestamp) : new Date(p.createdAt);
    return resolveDate.getMonth() === currentMonth && resolveDate.getFullYear() === currentYear;
  }).length;

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center" role="banner">
        <div className="w-full max-w-[600px] mx-auto px-margin-mobile flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
            <h1 className="font-display-lg text-lg font-bold">{t('admin_panel')}</h1>
          </div>
          <button 
            onClick={handleLogout} 
            aria-label="Logout"
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
          >
            logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-margin-mobile max-w-[600px] mx-auto min-h-screen flex flex-col" role="main">
        {/* Statistics Banner */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          <div className="p-2 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md text-center">
            <div className="text-[7.5px] text-on-surface-variant font-label-bold uppercase tracking-wider">{t('pending')}</div>
            <div className="text-sm font-bold text-white mt-1">{posts.filter(p => p.status === 'Reported').length}</div>
          </div>
          <div className="p-2 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md text-center">
            <div className="text-[7.5px] text-on-surface-variant font-label-bold uppercase tracking-wider">{t('under_review')}</div>
            <div className="text-sm font-bold text-white mt-1">{posts.filter(p => p.status === 'Under Review').length}</div>
          </div>
          <div className="p-2 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md text-center">
            <div className="text-[7.5px] text-on-surface-variant font-label-bold uppercase tracking-wider">{t('in_progress_admin')}</div>
            <div className="text-sm font-bold text-white mt-1">{posts.filter(p => p.status === 'In Progress').length}</div>
          </div>
          <div className="p-2 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md text-center">
            <div className="text-[7.5px] text-on-surface-variant font-label-bold uppercase tracking-wider">{t('resolved_today')}</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">{resolvedToday}</div>
          </div>
          <div className="p-2 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md text-center">
            <div className="text-[7.5px] text-on-surface-variant font-label-bold uppercase tracking-wider">{t('resolved_month')}</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">{resolvedThisMonth}</div>
          </div>
        </div>

        {/* Most Supported Issues Section */}
        {!loading && posts.length > 0 && (
          <div className="mb-6 p-5 rounded-3xl bg-surface-container/60 border border-white/5 backdrop-blur-md">
            <h2 className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider mb-3">🔥 {t('most_supported_issues')}</h2>
            <div className="space-y-3">
              {[...posts]
                .sort((a, b) => b.upvotes - a.upvotes)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedImage(item.imageUrl)}>
                    <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-headline-sm text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{item.upvotes} {t('support')}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-label-bold uppercase tracking-wider ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-950/80 text-emerald-400'
                        : item.status === 'In Progress'
                        ? 'bg-amber-950/80 text-amber-400'
                        : item.status === 'Under Review'
                        ? 'bg-blue-950/80 text-blue-400'
                        : 'bg-zinc-800/80 text-zinc-400'
                    }`}>
                      {item.status === 'Reported' ? t('pending') : t(item.status.toLowerCase().replace(/\s+/g, '_'))}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-label-bold" role="alert">
            {error}
          </div>
        )}

        {/* Filters and Sorting controls */}
        <div className="mb-6 space-y-4">
          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Reported', 'Under Review', 'In Progress', 'Resolved'].map((status) => {
              const label = status === 'All' ? t('all_categories').replace('Categories', 'Issues').replace('श्रेणियाँ', 'मुद्दे').replace('वर्गवारी', 'समस्या') : (status === 'Reported' ? t('pending') : t(status.toLowerCase().replace(/\s+/g, '_')));
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all border outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    filterStatus === status
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-white/10 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sorting */}
          <div className="flex justify-between items-center">
            <span className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase">{t('sort_by_priority')}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1.5 rounded-xl font-label-bold text-xs transition-all border outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  sortBy === 'date'
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-transparent border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                {t('most_recent')}
              </button>
              <button
                onClick={() => setSortBy('supports')}
                className={`px-3 py-1.5 rounded-xl font-label-bold text-xs transition-all border outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  sortBy === 'supports'
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-transparent border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                🔥 {t('supported_tab')}
              </button>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container rounded-3xl p-6 border border-white/5 mt-4">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-3">check_circle</span>
            <h2 className="font-headline-sm text-base font-bold text-white mb-2">{t('all_clear')}</h2>
            <p className="font-body-md text-on-surface-variant text-xs mt-1.5 leading-relaxed">
              {t('no_reports_filter')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-5 rounded-3xl bg-surface-container/60 border border-white/5 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors"
              >
                <div className="flex gap-4 items-start">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      onClick={() => setSelectedImage(post.imageUrl)}
                      className="w-32 h-28 rounded-2xl object-cover border border-white/10 flex-shrink-0 cursor-zoom-in hover:opacity-90 transition-opacity" 
                    />
                  )}
                  <div className="flex-grow min-w-0 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-headline-md text-base font-bold text-white leading-tight truncate">{post.title}</h3>
                      <div className="flex gap-1.5 flex-shrink-0 items-center">
                        {/* Priority Badge */}
                        {(() => {
                          const votes = post.upvotes || 0;
                          const priorityKey = votes > 20 ? 'priority_high' : votes >= 5 ? 'priority_medium' : 'priority_low';
                          const colorClass = votes > 20 
                            ? 'bg-red-950/80 border border-red-500/20 text-red-400' 
                            : votes >= 5 
                            ? 'bg-amber-950/80 border border-amber-500/20 text-amber-400' 
                            : 'bg-zinc-800/80 border border-zinc-700/20 text-zinc-400';
                          return (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-label-bold uppercase tracking-wider ${colorClass}`}>
                              {t(priorityKey)}
                            </span>
                          );
                        })()}

                        {/* Status badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-label-bold uppercase tracking-wider ${
                          post.status === 'Resolved'
                            ? 'bg-emerald-950/80 border border-emerald-500/20 text-emerald-400'
                            : post.status === 'In Progress'
                            ? 'bg-amber-950/80 border border-amber-500/20 text-amber-400'
                            : post.status === 'Under Review'
                            ? 'bg-blue-950/80 border border-blue-500/20 text-blue-400'
                            : 'bg-zinc-800/80 border border-zinc-700/20 text-zinc-400'
                        }`}>
                          {post.status === 'Reported' ? t('pending') : t(post.status.toLowerCase().replace(/\s+/g, '_'))}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {post.area}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant/70 border-t border-white/5 pt-2">
                      <p>
                        {t('reported_label')}: <span className="text-white font-medium">{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </p>
                      {post.status !== 'Resolved' && (
                        <p>
                          {t('days_pending')}: <span className="text-amber-400 font-bold">{Math.max(1, Math.ceil(Math.abs(new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} {t('days')}</span>
                        </p>
                      )}
                    </div>

                    {/* Reporter Contact Block */}
                    <div className="text-[10px] p-2.5 rounded-xl bg-black/30 border border-white/5 text-on-surface-variant/90 space-y-0.5">
                      <p className="font-label-bold text-[8px] text-on-surface-variant/60 uppercase tracking-wider mb-1">{t('reporter_info')}</p>
                      <p>{t('reporter_name')}: <span className="text-white font-medium">{post.authorName}</span></p>
                      <p>{t('reporter_area')}: <span className="text-white font-medium">{post.reporter?.area || 'Not specified'}</span></p>
                      <p>{t('reporter_email')}: <span className="text-white font-medium">{post.reporter?.email || 'N/A'}</span></p>
                    </div>

                    {/* Resolution Timeline */}
                    <div className="text-[10px] p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-2">
                      <p className="font-label-bold text-[8px] text-on-surface-variant/60 uppercase tracking-wider">{t('timeline')}</p>
                      <div className="flex flex-col gap-2 pl-2 border-l border-white/10 ml-1.5 mt-1">
                        {['Pending', 'Under Review', 'In Progress', 'Resolved'].map((step) => {
                          const historyItem = post.statusHistory?.find(h => h.status === step);

                          const time = historyItem 
                            ? new Date(historyItem.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
                            : (step === 'Pending' ? new Date(post.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : null);
                          const isDone = !!time;
                          const isCurrent = post.status === (step === 'Pending' ? 'Reported' : step);
                          return (
                            <div key={step} className="relative flex items-start gap-3">
                              <div className={`absolute -left-[13px] top-1 w-2 h-2 rounded-full border ${
                                isCurrent 
                                  ? 'bg-primary border-primary shadow-glow shadow-primary/40' 
                                  : isDone 
                                  ? 'bg-emerald-500 border-emerald-500' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`} />
                              <div className="flex-grow min-w-0">
                                <p className={`text-[9px] font-semibold leading-tight ${isCurrent ? 'text-primary' : isDone ? 'text-white' : 'text-on-surface-variant/30'}`}>
                                  {step === 'Pending' ? t('timeline_created') : t(step.toLowerCase().replace(/\s+/g, '_'))}
                                </p>
                                {time && <p className="text-[8px] text-on-surface-variant/50 mt-0.5">{time}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Internal Notes area */}
                    <div className="text-[10px] p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                      <p className="font-label-bold text-[8px] text-on-surface-variant/60 uppercase tracking-wider">{t('notes')}</p>
                      <textarea
                        className="w-full h-12 bg-surface-container/70 border border-white/5 rounded-lg p-1.5 text-white text-[10px] placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary resize-none"
                        placeholder={t('notes_placeholder')}
                        value={notesState[post.id] || ''}
                        onChange={(e) => setNotesState({ ...notesState, [post.id]: e.target.value })}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-on-surface-variant font-label-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-primary">favorite</span>
                          {post.upvotes} {t('support')}
                        </span>
                        <button
                          onClick={() => handleSaveNotes(post.id)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[9px] font-label-bold transition-all"
                        >
                          {t('save_note')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Before / After Images Preview if status Resolved */}
                {post.afterImage && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 rounded-2xl border border-white/5">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img src={post.beforeImage || post.imageUrl} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[8px] font-bold text-white uppercase">{t('before')}</div>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img src={post.afterImage} alt="After" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-[8px] font-bold text-emerald-400 uppercase">{t('fixed')}</div>
                    </div>
                  </div>
                )}

                {/* Workflow Actions */}
                <div className="flex gap-2 pt-2 justify-end">
                  {post.status === 'Reported' && (
                    <button
                      disabled={updatingId === post.id}
                      onClick={() => handleStatusTransition(post, 'Under Review')}
                      className="px-4 py-2 bg-blue-600 text-white font-label-bold text-xs rounded-xl hover:bg-blue-500 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-1.5"
                    >
                      {updatingId === post.id ? (
                        <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <span className="material-symbols-outlined text-[14px]">search</span>
                      )}
                      {t('mark_review')}
                    </button>
                  )}

                  {post.status === 'Under Review' && (
                    <button
                      disabled={updatingId === post.id}
                      onClick={() => handleStatusTransition(post, 'In Progress')}
                      className="px-4 py-2 bg-amber-600 text-white font-label-bold text-xs rounded-xl hover:bg-amber-500 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-1.5"
                    >
                      {updatingId === post.id ? (
                        <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <span className="material-symbols-outlined text-[14px]">trending_flat</span>
                      )}
                      {t('start_progress')}
                    </button>
                  )}

                  {post.status === 'In Progress' && (
                    <label className={`px-4 py-2 bg-emerald-600 text-white font-label-bold text-xs rounded-xl hover:bg-emerald-500 active:scale-95 transition-all outline-none focus-within:ring-2 focus-within:ring-primary flex items-center gap-1.5 cursor-pointer select-none ${
                      updatingId === post.id ? 'opacity-50 pointer-events-none' : ''
                    }`}>
                      {updatingId === post.id ? (
                        <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                      )}
                      {t('resolve_upload')}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleResolveUpload(e, post)} 
                      />
                    </label>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full border border-white/10 hover:bg-black transition-colors z-40"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
              <img src={selectedImage} alt="Expanded preview" className="w-full h-auto rounded-3xl object-contain max-h-[85vh] border border-white/10" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
