import React, { memo } from "react";
import { FiPlus, FiMinus, FiLoader } from "react-icons/fi";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <div
      style={styling}
      className="w-full flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 hover:shadow-[0_15px_35px_-10px_rgba(79,70,229,0.05)] transition-all duration-200 group select-none"
    >
      {/* Avatar & Info Cluster */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={transformImage(avatar)}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200/60 shrink-0 shadow-sm group-hover:scale-[1.02] transition-transform duration-200"
          onError={(e) => {
            // High-res soft avatar fallback anchor
            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop";
          }}
        />
        
        {/* Username Typography Wrapper */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800 tracking-wide truncate group-hover:text-indigo-950 transition-colors">
            {name}
          </p>
        </div>
      </div>

      {/* --- PREMIUM TOGGLE ACTION NODE BUTTON --- */}
      <button
        type="button"
        disabled={handlerIsLoading}
        onClick={() => handler(_id)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold shadow-sm active:scale-95 disabled:scale-100 disabled:opacity-40 transition-all duration-200 shrink-0 ${
          isAdded
            ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/10"
            : "bg-indigo-50 border-indigo-100/30 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-500/10"
        }`}
        title={isAdded ? "Remove associate" : "Add associate"}
      >
        {handlerIsLoading ? (
          <FiLoader className="animate-spin text-sm" />
        ) : isAdded ? (
          <FiMinus className="stroke-[3]" />
        ) : (
          <FiPlus className="stroke-[3]" />
        )}
      </button>
    </div>
  );
};

export default memo(UserItem);