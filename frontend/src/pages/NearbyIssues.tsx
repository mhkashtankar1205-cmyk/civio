import React, { useState, useEffect, useRef } from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/PostCard';
import { BottomNavbar } from '../components/BottomNavbar';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PostSkeleton, MapSkeleton } from '../components/Skeletons';
import { t } from '../services/i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pothole': return 'dangerous';
    case 'garbage': return 'delete';
    case 'water': return 'water_drop';
    case 'lighting': return 'lightbulb';
    default: return 'warning';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pothole': return 'bg-amber-500 text-black';
    case 'garbage': return 'bg-rose-500 text-white';
    case 'water': return 'bg-blue-500 text-white';
    case 'lighting': return 'bg-primary text-white';
    default: return 'bg-zinc-500 text-white';
  }
};

export const NearbyIssues: React.FC = () => {
  const { useGetPosts } = usePosts();
  const { data: posts, isLoading } = useGetPosts();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Filter posts based on category
  const nearbyPosts = posts?.filter(post => {
    if (activeCategory !== 'All') {
      return post.category.toLowerCase() === activeCategory.toLowerCase();
    }
    return true;
  });

  const categories = [
    { name: 'All', icon: 'list' },
    { name: 'Pothole', icon: 'dangerous' },
    { name: 'Garbage', icon: 'delete' },
    { name: 'Water', icon: 'water_drop' },
    { name: 'Lighting', icon: 'lightbulb' }
  ];

  const handlePinClick = (postId: string) => {
    setSelectedPostId(postId);
    const element = document.getElementById(postId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const locateUser = () => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        mapInstance.current?.setView([latitude, longitude], 14);
        
        L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstance.current!)
          .bindPopup('<strong>Your Location</strong>')
          .openPopup();
      });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current || isLoading) return;

    let centerLat = 37.7749;
    let centerLon = -122.4194;

    if (nearbyPosts && nearbyPosts.length > 0) {
      centerLat = nearbyPosts[0].location.latitude;
      centerLon = nearbyPosts[0].location.longitude;
    }

    const map = L.map(mapRef.current, {
      center: [centerLat, centerLon],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);

    mapInstance.current = map;
    markerGroupRef.current = markerGroup;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Update Markers
  useEffect(() => {
    if (!mapInstance.current || !markerGroupRef.current || !nearbyPosts) return;

    markerGroupRef.current.clearLayers();

    nearbyPosts.forEach((post) => {
      const lat = post.location.latitude;
      const lon = post.location.longitude;
      if (!lat || !lon) return;

      const iconColor = getCategoryColor(post.category);
      const iconName = getCategoryIcon(post.category);

      const markerHtml = `
        <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-2xl transition-all duration-300 ${iconColor} shadow-lg shadow-black/50 hover:scale-110">
          <span class="material-symbols-outlined text-[16px] font-bold block" style="font-variation-settings: 'FILL' 1">${iconName}</span>
        </div>
      `;

      const divIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lon], { icon: divIcon });

      const popupContent = `
        <div class="p-2 text-white bg-zinc-900 border border-white/10 rounded-xl text-xs font-sans min-w-[160px]">
          <h4 class="font-bold text-sm mb-1 text-white">${post.title}</h4>
          <p class="text-on-surface-variant/75 text-[10px] mb-1">📍 ${post.area}</p>
          <div class="flex justify-between items-center mt-2 border-t border-white/5 pt-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary">${post.category}</span>
            <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white">${post.status}</span>
          </div>
          <p class="text-[10px] text-on-surface-variant/80 mt-1"><strong>Distance:</strong> ${post.distance}</p>
          <p class="text-[10px] text-on-surface-variant/80"><strong>Supports:</strong> ${post.supportedBy?.length ?? 0}</p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup'
      });

      marker.on('click', () => {
        handlePinClick(post.id);
      });

      marker.addTo(markerGroupRef.current!);
    });

    if (nearbyPosts.length > 0) {
      const lats = nearbyPosts.map(p => p.location.latitude);
      const lons = nearbyPosts.map(p => p.location.longitude);
      const latSpan = Math.max(...lats) - Math.min(...lats);
      const lonSpan = Math.max(...lons) - Math.min(...lons);

      if (latSpan < 2 && lonSpan < 2) {
        const bounds = L.latLngBounds(nearbyPosts.map(p => [p.location.latitude, p.location.longitude]));
        mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
      } else {
        mapInstance.current.setView([nearbyPosts[0].location.latitude, nearbyPosts[0].location.longitude], 12);
      }
    }
  }, [nearbyPosts]);

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-[600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display-lg text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
              Civio
            </span>
            <LanguageSwitcher />
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors">
            notifications
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16 max-w-[600px] mx-auto min-h-screen flex flex-col">
        {/* Interactive Map Section */}
        <section className="relative h-[280px] w-full overflow-hidden border-b border-white/5 bg-zinc-950 z-10">
          {isLoading ? (
            <MapSkeleton />
          ) : (
            <div ref={mapRef} className="w-full h-full z-10" />
          )}

          {/* Floating Map Controls */}
          {!isLoading && (
            <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-20">
              <button 
                onClick={locateUser}
                aria-label="Locate me on map"
                className="w-10 h-10 rounded-full bg-surface-container/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg border border-white/10 active:scale-90 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-xl">my_location</span>
              </button>
            </div>
          )}
        </section>

        {/* Filter Chips row */}
        <section className="px-margin-mobile my-4">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1.5 select-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setSelectedPostId(null);
                }}
                className={`px-5 py-2 rounded-full font-label-bold text-label-bold whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.name
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-white/5'
                }`}
              >
                {cat.name !== 'All' && (
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                )}
                {t(cat.name === 'All' ? 'all_categories' : cat.name.toLowerCase())}
              </button>
            ))}
          </div>
        </section>

        {/* Nearby Feed List */}
        <section className="flex flex-col gap-6 px-margin-mobile md:px-0">
          {isLoading ? (
            <div className="space-y-6">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : nearbyPosts && nearbyPosts.length > 0 ? (
            nearbyPosts.map(post => (
              <div 
                key={post.id} 
                id={post.id} 
                className={`transition-all duration-500 rounded-3xl ${
                  selectedPostId === post.id 
                    ? 'ring-2 ring-primary ring-offset-4 ring-offset-black scale-[1.01]' 
                    : ''
                }`}
              >
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-surface-container rounded-3xl p-6 border border-white/5 mx-margin-mobile md:mx-0">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-2">location_off</span>
              <p className="font-body-md text-on-surface-variant">{t('no_nearby_issues')}</p>
            </div>
          )}
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
};
export default NearbyIssues;
