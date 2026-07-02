import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import ChatSkeleton from "../shared/ChatSkeleton";
import { transformImage } from "../../lib/features";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest(accept ? "Accepting request..." : "Declining request...", { 
      requestId: _id, 
      accept 
    });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  if (!isNotification) return null;

  return (
    /* Modal Layer Overlay Blur Mask */
    <div 
      onClick={closeHandler}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fadeIn"
    >
      {/* --- MAIN GLASS CONTAINER CARD --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] flex flex-col p-6 sm:p-8 rounded-[2.5rem] bg-white/80 border border-white/60 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] text-slate-700 overflow-hidden transform scale-100 transition-all duration-300"
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none !important; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header Section */}
        <div className="text-center relative mb-5 shrink-0">
          <h2 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
            Notifications
          </h2>
          <button 
            onClick={closeHandler}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm p-1"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* --- SCROLLABLE REQUEST LIST FEEDS TRACK --- */}
        <div 
          className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 no-scrollbar"
        >
          {isLoading ? (
            <ChatSkeleton />
          ) : data?.allRequests && data.allRequests.length > 0 ? (
            data.allRequests.map(({ sender, _id }) => (
              <NotificationItem
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
                key={_id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2 border border-indigo-100/30">
                <i className="fas fa-bell-slash text-base" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inbox is empty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: INDIVIDUAL REQUEST LINE ROW ROWCELL --- */
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  
  return (
    <div className="w-full flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all duration-150 shadow-sm group">
      
      {/* Sender Profile Stack Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={transformImage(avatar?.url)}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200/60 shrink-0 shadow-sm"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop";
          }}
        />
        <div className="flex flex-col min-w-0">
          <p className="text-xs text-slate-700 font-medium leading-normal line-clamp-2">
            <span className="font-bold text-slate-900">{name}</span> sent you a friend request.
          </p>
        </div>
      </div>

      {/* Action Button Controls Deck */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => handler({ _id, accept: false })}
          className="w-8 h-8 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-500 hover:text-white text-rose-500 text-xs flex items-center justify-center active:scale-95 transition-all shadow-none"
          title="Decline"
        >
          <i className="fas fa-times" />
        </button>
        <button
          onClick={() => handler({ _id, accept: true })}
          className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center justify-center active:scale-95 transition-all shadow-sm"
          title="Accept"
        >
          <i className="fas fa-check" />
        </button>
      </div>

    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

export default Notifications;