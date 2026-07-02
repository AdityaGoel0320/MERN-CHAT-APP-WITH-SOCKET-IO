import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { transformImage } from "../../lib/features";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div 
      className="w-full max-w-md mx-auto flex flex-col items-center p-6 sm:p-8 rounded-[2.5rem] bg-white/60 border border-white/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(79,70,229,0.06)] overflow-y-auto"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }}
    >
      {/* Hide scrollbar handle visibility natively inside sub-layouts */}
      <style>{`
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* --- PROFILE AVATAR CANVAS WITH PASTEL BORDER --- */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl group-hover:scale-110 transition-transform duration-300" />
        <img
          src={transformImage(user?.avatar?.url)}
          alt={user?.name || "User Avatar"}
          className="relative w-44 h-44 rounded-full object-cover border-[6px] border-white bg-slate-50 shadow-md transform transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* --- PROFILE METRICS STACK --- */}
      <div className="w-full space-y-3.5">
        <ProfileCard 
          heading="Bio" 
          text={user?.bio || "No bio added yet."} 
          iconClass="fas fa-quote-left" 
        />
        
        <ProfileCard
          heading="Username"
          text={`@${user?.username}`}
          iconClass="fas fa-at"
        />
        
        <ProfileCard 
          heading="Name" 
          text={user?.name} 
          iconClass="fas fa-user-shield" 
        />
        
        <ProfileCard
          heading="Joined Network"
          text={user?.createdAt ? moment(user.createdAt).fromNow() : "N/A"}
          iconClass="fas fa-calendar-alt"
        />
      </div>
    </div>
  );
};

/* --- INNER SUB-COMPONENT CARD LAYOUT --- */
const ProfileCard = ({ text, iconClass, heading }) => (
  <div className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-white/50 border border-white/40 hover:bg-white/80 transition-all duration-150 group shadow-sm">
    {/* Icon Wrapper Frame */}
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/10 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white text-sm shrink-0">
      <i className={iconClass} />
    </div>

    {/* Text Context Area */}
    <div className="flex flex-col text-left overflow-hidden">
      <span className="text-sm font-semibold text-slate-800 tracking-wide truncate">
        {text}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
        {heading}
      </span>
    </div>
  </div>
);

export default Profile;