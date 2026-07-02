import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-violet-100 via-indigo-50 to-emerald-50 text-slate-700 flex justify-center items-center p-4 md:p-8 relative overflow-hidden select-none">
      
      {/* --- BACKGROUND PASTEL AMBIENT ORBS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-200/50 blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-emerald-100/60 blur-[120px] pointer-events-none animate-bounce duration-[12000ms] opacity-70" />

      {/* --- RESPONSIVE GLASS CARD CONTAINER --- */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white/70 border border-white/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(79,70,229,0.08)] z-10 text-center space-y-6 transform transition-all duration-300">
        
        {/* Animated Error Emblem */}
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-bounce duration-[3000ms]">
            <i className="fas fa-exclamation-triangle text-4xl" />
          </div>
        </div>

        {/* Big Code Header */}
        <div className="space-y-1">
          <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-violet-600 to-rose-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-600">
            Page Not Found
          </h2>
        </div>

        {/* Contextual Description */}
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          The channel or network link you are looking for has been terminated, moved, or never existed in this workspace.
        </p>

        {/* Action Link Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-indigo-500/20 transition-all duration-150 active:scale-95"
          >
            <i className="fas fa-home text-xs" /> Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;