import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <div
      style={{ width: w }}
      className="h-full flex flex-col overflow-y-auto no-scrollbar space-y-1 py-2 px-2 select-none"
    >
      {/* Dynamic inline styles to hide layout scroll tracks natively inside sub-layout side panels */}
      <style>{`
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {chats && chats.length > 0 ? (
        chats.map((data, index) => {
          const { avatar, _id, name, groupChat, members } = data;

          const newMessageAlert = newMessagesAlert.find(
            (alert) => alert.chatId === _id
          );

          const isOnline = members?.some((member) =>
            onlineUsers.includes(member)
          );

          return (
            <div 
              key={_id} 
              className="w-full transition-transform duration-150 active:scale-[0.99]"
            >
              <ChatItem
                index={index}
                newMessageAlert={newMessageAlert}
                isOnline={isOnline}
                avatar={avatar}
                name={name}
                _id={_id}
                groupChat={groupChat}
                sameSender={chatId === _id}
                handleDeleteChat={handleDeleteChat}
              />
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-slate-100 flex items-center justify-center text-slate-400 mb-2 shadow-sm">
            <i className="fas fa-folder-open text-base" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            No active conversations
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatList;