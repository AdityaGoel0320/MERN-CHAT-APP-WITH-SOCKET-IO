import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  // Take up to the configured limit for visual rendering
  const visibleAvatars = avatar.slice(0, max);
  // Calculate if there are extra members hidden beyond the visual stack
  const extraCount = avatar.length - max;

  return (
    <div className="flex items-center space-x-2">
      {/* Relational layout track with standard dimensions */}
      <div className="relative h-12 flex items-center select-none" style={{ width: `${visibleAvatars.length * 1.5 + (extraCount > 0 ? 2 : 1.5)}rem` }}>
        
        {visibleAvatars.map((src, index) => (
          <img
            key={index}
            src={transformImage(src)}
            alt={`Avatar ${index}`}
            className="absolute w-12 h-12 rounded-full border-2 border-white/90 bg-slate-100 object-cover shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:z-30 cursor-pointer"
            style={{
              left: `${index * 1.25}rem`,
              zIndex: index + 1,
            }}
          />
        ))}

        {/* Soft Indigo Extra Counter Frame */}
        {extraCount > 0 && (
          <div
            className="absolute w-12 h-12 rounded-full border-2 border-white/95 bg-indigo-50 backdrop-blur-sm text-indigo-600 font-extrabold text-xs flex items-center justify-center shadow-sm tracking-tighter"
            style={{
              left: `${visibleAvatars.length * 1.25}rem`,
              zIndex: max + 1,
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarCard;