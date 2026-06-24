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
import { Post } from '../types';
import { t } from '../services/i18n';

export const HindiFeed: React.FC = () => {
  const navigate = useNavigate();
  const { useGetPosts } = usePosts();
  const { data: posts, isLoading } = useGetPosts();
  const { useGetCurrentUser } = useUser();
  const { data: currentUser } = useGetCurrentUser();
  const { useGetNotifications } = useNotifications();
  const { data: notifications } = useGetNotifications();

  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const unreadNotifications = notifications?.some(n => !n.read) ?? false;

  const lang = localStorage.getItem('civio_lang') || 'hi';
  const isMarathiMode = lang === 'mr';

  // Filter and localize posts to Hindi/Marathi
  const filteredPosts = posts
    ?.filter(post => {
      if (selectedArea) {
        return post.area.toLowerCase().includes(selectedArea.toLowerCase());
      }
      return true;
    })
    .map(post => {
      const localized: Post = { ...post };
      if (post.id === 'post_feed_1') {
        if (isMarathiMode) {
          localized.title = "गल्ली नंबर ५ मध्ये कचऱ्याची समस्या";
          localized.description = "३ दिवसांपासून स्वच्छता झाली नाही, संसर्ग पसरण्याचा धोका वाढत आहे.";
          localized.area = "कोरेगाव पार्क";
          localized.distance = "२.४ किमी दूर";
        } else {
          localized.title = "गली नंबर ५ में कचरे की समस्या";
          localized.description = "३ दिन से सफाई नहीं हुई है, संक्रमण का खतरा बढ़ रहा है।";
          localized.area = "कोरेगांव पार्क";
          localized.distance = "२.४ किमी दूर";
        }
      } else if (post.id === 'post_feed_2') {
        if (isMarathiMode) {
          localized.title = "कचरा पेटी ओव्हरफ्लो";
          localized.description = "तीन दिवसांपासून कचरा रिकामा केला गेला नाही. दुर्गंधी सुटली आहे आणि भटके प्राणी आकर्षित होत आहेत. #क्लीनसिवियो";
          localized.area = "कल्याणी नगर";
          localized.distance = "५०० मीटर दूर";
        } else {
          localized.title = "कचरा डिब्बा ओवरफ्लो";
          localized.description = "कचरा तीन दिनों से खाली नहीं किया गया है। दुर्गंध आने लगी है और आवारा जानवर आकर्षित हो रहे हैं। #क्लीनसिवियो";
          localized.area = "कल्याणी नगर";
          localized.distance = "५०० मीटर दूर";
        }
      } else if (post.id.startsWith('user_post_')) {
        // Mock user posts translation
        localized.area = "ब्रोकलीन, न्यूयॉर्क";
        if (isMarathiMode) {
          localized.distance = post.distance.replace('km away', 'किमी दूर').replace('m away', 'मीटर दूर');
        } else {
          localized.distance = post.distance.replace('km away', 'किमी दूर').replace('m away', 'मीटर दूर');
        }
      }
      return localized;
    });

  // Story categories in Hindi/Marathi representing Image 5
  const stories = [
    { id: 'all', label: isMarathiMode ? 'सर्व अलर्ट' : 'सभी अलर्ट', avatar: currentUser?.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner', areaKey: null },
    { id: 'koregaon', label: 'राहुल', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDno3CwGoDf12Zm0srTvasCo-2saJqkhU4J7Zalnm6ecLn7a6Q-gwjjsFEDgE6KiDuy-yqhBtLPnpz0ipUkcNB8CMye56-5tyzbo6fTL-srK7-1p1epJHjp-rroQsSCpMMbJD6atH0uk2qe2j-8XpM4ncxwAuExybKh0RiMwbclmmGyijuo6qXDgKZlKLOqOU8dbUFGUirw3utXKWl9OVwnsVSz3YcHUdGltQOW7wIRzgDOVRcVK67bl2vDF3ab7GbLRg5g9GM9LQE', areaKey: 'Koregaon' },
    { id: 'viman', label: 'प्रिया', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtT2rB9gm1gFfUshb9_Vfpt5Bze4F5m14dsM9SIaCA-22Uk9svtx2KXijJu6NA1AnRxoyVxUSjMk06BlpS0u7WQ88GC2-GOHcKnEHGPijKxExnc2Fw_hYKIsZueOaTZ45RmauwLf-3yOtep3Vbr4Os6eeSQmtaJ7jUtKF0GSESLIz6Aw_y5FBlXdMQ-wPhV0AEjtee4n8Ng_4pvs_-Yy-DU2FehiZGH8cgRRXidGP_QerG6p9cBtO3v7AKHaKzhUs6W0uib8s9fKc', areaKey: 'Viman' },
    { id: 'kalyani', label: 'अमित', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO_RmGucupRyvGKvIJnPA1U9tZdajmxj7GbhbtiOTafZ44BwJL8ML9MXJCr_BHVLsKz-fzr0YyUucxGkfNbitYPSC7iBMglXh_y6q2QW1G8wrFjRAnWgb2d7m7f0pOebcbj1bjVufglGWuh_aoccz0NZ-q9cj9TYRxjQ0wFz_YlOymFo_mQ2yiqCwtpMCeKTwgvZvw2s-Xk81OS81KhkzkV3PzOryGFOtOodEl6U6bJcxuiineVWRVHLISc_Nl7ICrKCapbrk68Io', areaKey: 'Kalyani' },
    { id: 'hadapsar', label: 'कपूर सर', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXM-Th-DWwO2Pg4gykfErUNERm4KCrLHQPG7xWPXBbNOs_UCP9kyDIlJ4lefEt-zrpDdYOtpmiQ8gD_p2QVpfhtCJXvP0RHCRJFptsZSMjbFTuxBDRDTC7BaOGzDFONH7WAfFXfapxBf3wus676fuKAt8pC_sRrdscMSLGStaYtNCFSFVFTpdSYLeM4sRKLYO0339MfVkWLADzIEklyybb2p8E6348mbpeW5qGYpvgu9E9RdN95N4ZcSIE8mhnKzOFankxMjiG6yE', areaKey: 'Hadapsar' }
  ];

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-[600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display-lg text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold cursor-pointer" onClick={() => navigate('/hindi')}>
              सिवियो
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
      <main className="pt-16 max-w-[600px] mx-auto min-h-screen flex flex-col">
        {/* Post cards list */}
        <section className="flex-grow flex flex-col gap-6 px-margin-mobile">
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
              <p className="font-body-md text-on-surface-variant text-xs mt-1.5 leading-relaxed">
                {isMarathiMode 
                  ? 'अद्याप कोणतीही समस्या नोंदवली गेली नाही. नोंदवणारे पहिले रहिवासी व्हा.' 
                  : 'अभी तक कोई समस्या रिपोर्ट नहीं की गई है। रिपोर्ट करने वाले पहले निवासी बनें।'}
              </p>
              {selectedArea && (
                <button 
                  onClick={() => setSelectedArea(null)}
                  className="mt-3 text-xs text-primary font-bold hover:underline"
                >
                  {isMarathiMode ? 'फिल्टर काढा' : 'फिल्टर हटाएं'}
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
};
export default HindiFeed;
