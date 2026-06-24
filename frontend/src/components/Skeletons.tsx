import React from 'react';

// Card skeleton mimicking PostCard.tsx
export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-container rounded-3xl overflow-hidden border border-white/5 shadow-xl animate-pulse w-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-margin-mobile">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest"></div>
          <div className="space-y-2">
            <div className="h-3 w-28 bg-surface-container-highest rounded"></div>
            <div className="h-2 w-36 bg-surface-container-highest/60 rounded"></div>
          </div>
        </div>
        <div className="w-6 h-2 bg-surface-container-highest rounded"></div>
      </div>
      
      {/* Media skeleton */}
      <div className="aspect-square w-full bg-surface-container-highest"></div>
      
      {/* Footer skeleton */}
      <div className="p-margin-mobile space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-8 bg-surface-container-highest rounded-full"></div>
            <div className="w-16 h-8 bg-surface-container-highest rounded-full"></div>
            <div className="w-8 h-8 bg-surface-container-highest rounded-full"></div>
          </div>
          <div className="w-32 h-8 bg-surface-container-highest rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-container-highest rounded"></div>
          <div className="h-3 w-4/5 bg-surface-container-highest rounded"></div>
        </div>
      </div>
    </div>
  );
};

// List item skeleton mimicking Notifications.tsx
export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl border border-white/5 bg-surface-container/40 flex gap-4 items-start animate-pulse w-full">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex-shrink-0"></div>
      <div className="flex-1 space-y-2.5">
        <div className="flex justify-between items-baseline">
          <div className="h-3 w-32 bg-surface-container-highest rounded"></div>
          <div className="h-2 w-12 bg-surface-container-highest/60 rounded"></div>
        </div>
        <div className="h-3 w-full bg-surface-container-highest/80 rounded"></div>
        <div className="h-3 w-2/3 bg-surface-container-highest/50 rounded"></div>
      </div>
    </div>
  );
};

// Profile details skeleton mimicking Profile.tsx
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse w-full">
      {/* Header section */}
      <div className="px-margin-mobile pt-4 flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-surface-container-highest"></div>
        <div className="space-y-2 text-center flex flex-col items-center">
          <div className="h-5 w-40 bg-surface-container-highest rounded"></div>
          <div className="h-3 w-56 bg-surface-container-highest/60 rounded"></div>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 w-full mt-8">
          <div className="h-20 bg-surface-container-highest/40 rounded-xl"></div>
          <div className="h-20 bg-surface-container-highest/40 rounded-xl"></div>
          <div className="h-20 bg-surface-container-highest/40 rounded-xl"></div>
        </div>
        
        <div className="h-12 w-full bg-surface-container-highest rounded-full"></div>
      </div>
      
      {/* Tabs */}
      <div className="flex w-full mt-8 border-b border-white/10">
        <div className="flex-1 h-12 bg-surface-container-highest/20"></div>
        <div className="flex-1 h-12 bg-surface-container-highest/20"></div>
        <div className="flex-1 h-12 bg-surface-container-highest/20"></div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-3 gap-[2px] mt-[2px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-surface-container-highest/30"></div>
        ))}
      </div>
    </div>
  );
};

// Map skeleton mimicking NearbyIssues.tsx
export const MapSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[280px] bg-surface-container-highest/30 animate-pulse flex items-center justify-center relative">
      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">map</span>
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest/80"></div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest/80"></div>
      </div>
    </div>
  );
};
