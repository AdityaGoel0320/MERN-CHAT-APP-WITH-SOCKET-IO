import React from "react";

/**
 * --- DYNAMIC CONTENT GRID LAYOUT LOADER ---
 * Fits perfectly in the page workspace layout framework.
 */
const LayoutLoader = () => {
  return (
    <div className="w-full h-[calc(100vh-4.5rem)] max-w-[90rem] mx-auto grid grid-cols-12 gap-4 p-4 overflow-hidden select-none">
      
      {/* Left Column Sidebar Skeleton (Desktop only) */}
      <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-full space-y-3 p-3 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40">
        <LocalCircleSkeletonItem />
        <div className="border-t border-slate-200/50 my-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <LocalCircleSkeletonItem key={i} />
        ))}
      </div>

      {/* Main Feed Activity Column Skeleton */}
      <div className="col-span-12 sm:col-span-8 md:col-span-6 h-full flex flex-col gap-4 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 overflow-y-auto no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex gap-3 w-full max-w-md ${i % 2 === 0 ? 'self-start' : 'self-end flex-row-reverse'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className={`h-12 w-64 rounded-2xl bg-slate-200/80 animate-pulse ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
          </div>
        ))}
      </div>

      {/* Right Sidebar Details Skeleton (Wide viewports only) */}
      <div className="hidden md:block md:col-span-3 h-full flex flex-col items-center p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 space-y-4">
        <div className="w-28 h-28 rounded-full bg-slate-200 animate-pulse border-4 border-white shadow-sm" />
        <div className="h-4 w-1/2 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-slate-200 animate-pulse" />
        <div className="w-full space-y-2 pt-4">
          <div className="h-10 w-full rounded-xl bg-slate-200/60 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-slate-200/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * --- COMPACT CHAT TYPING SKELETON LOADER ---
 * Fluid bouncing custom dots pattern with clean delayed wave transitions.
 */
const TypingLoader = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/80 border border-white shadow-sm max-w-max select-none">
      {/* Inject custom animation keyframes for fluid pastel bouncing behavior */}
      <style>{`
        @keyframes customBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-dot {
          animation: customBounce 0.8s ease-in-out infinite;
        }
      `}</style>
      
      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-dot" style={{ animationDelay: "0.1s" }} />
      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-dot" style={{ animationDelay: "0.25s" }} />
      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-dot" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};

/* --- INTERNAL SUB-COMPONENT: CIRCULAR LIST ROW ENTRY --- */
const LocalCircleSkeletonItem = () => (
  <div className="flex items-center gap-3 w-full p-2 rounded-xl bg-white/40">
    <div className="w-11 h-11 rounded-full bg-slate-200 animate-pulse shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-2/3 rounded-full bg-slate-200 animate-pulse" />
      <div className="h-2.5 w-1/2 rounded-full bg-slate-200/60 animate-pulse" />
    </div>
  </div>
);

export { TypingLoader, LayoutLoader };