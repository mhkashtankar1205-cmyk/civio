import React from 'react';

interface StoryCategoryProps {
  avatar: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const StoryCategory: React.FC<StoryCategoryProps> = ({
  avatar,
  label,
  isActive = true,
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      aria-label={`Filter feed by category ${label}`}
      className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl p-1 bg-transparent border-none text-center"
    >
      <div className={`rounded-full p-[2px] transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-tr from-primary via-secondary to-tertiary' 
          : 'bg-white/10'
      }`}>
        <div className="w-16 h-16 rounded-full border-4 border-surface overflow-hidden">
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            src={avatar} 
            alt={label} 
            loading="lazy"
          />
        </div>
      </div>
      <span className="font-label-bold text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
        {label}
      </span>
    </button>
  );
};
export default StoryCategory;
