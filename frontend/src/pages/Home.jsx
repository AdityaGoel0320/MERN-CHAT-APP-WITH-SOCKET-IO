import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] w-full p-4 text-center select-none animate-fadeIn">
      {/* Central Ambient Icon Frame */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft background glow */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl scale-150 animate-pulse duration-[4000ms]" />
        
        <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-white/60 border border-white/80 backdrop-blur-md shadow-sm text-indigo-500">
          <i className="fas fa-comments-alt text-5xl" />
        </div>
      </div>

      {/* Main Action Callout Text */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
        Select a Friend to Chat
      </h1>
      
      <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
        Choose a conversation from the sidebar to initialize secure mesh channels and start messaging.
      </p>

      {/* Deployment Micro-Notice Badge */}
      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50/60 border border-indigo-100/40 backdrop-blur-sm text-indigo-600 font-semibold text-xs tracking-wide shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        If chats don't load, try refreshing — instances sleep on free tiers
      </div>
    </div>
  );
};

export default AppLayout()(Home);