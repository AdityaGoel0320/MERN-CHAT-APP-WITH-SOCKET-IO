import React, { useState } from "react";
import { Search, MessageSquarePlus, MessagesSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
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
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const filteredChats = chats.filter((chat) => chat.name?.toLowerCase().includes(query.toLowerCase()));
  return (
    <div
      style={{ width: w }}
      className="conversation-list"
    >
      <div className="sidebar-heading"><h2>Messages <span>{chats.length}</span></h2><button className="icon-button" aria-label="Start a conversation" title="Start a conversation" onClick={() => dispatch(setIsSearch(true))}><MessageSquarePlus size={19} /></button></div>
      <label className="conversation-search"><Search size={17} /><input aria-label="Search conversations" placeholder="Search conversations" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <p className="sidebar-label">ALL CONVERSATIONS</p>
      {filteredChats.length > 0 ? (
        filteredChats.map((data) => {
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
              className="w-full"
            >
              <ChatItem
                onSelect={onSelect}
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
        <div className="sidebar-empty">
          <MessagesSquare size={28} />
          <p>{query ? "No matching conversations" : "No conversations yet"}</p>
          {!query && <button className="text-action" onClick={() => dispatch(setIsSearch(true))}>Find people</button>}
        </div>
      )}
    </div>
  );
};

export default ChatList;