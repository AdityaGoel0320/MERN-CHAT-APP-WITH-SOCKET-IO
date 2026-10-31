import React, { memo } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  onSelect,
  handleDeleteChat,
}) => {
  return (
    <div className={`conversation-row ${sameSender ? "is-active" : ""}`}>
      <Link to={`/chat/${_id}`} onClick={onSelect} aria-current={sameSender ? "page" : undefined} onContextMenu={(event) => handleDeleteChat(event, _id, groupChat)} className="conversation-link">
        <div className="relative shrink-0"><AvatarCard avatar={avatar} />{isOnline && <span className="online-indicator" aria-label="Online" />}</div>
        <div className="conversation-copy"><strong>{name}</strong><span>{groupChat ? "Group conversation" : isOnline ? "Online now" : "Direct message"}</span></div>
        {newMessageAlert?.count > 0 && <span className="unread-count">{newMessageAlert.count}</span>}
      </Link>
      <button className="conversation-menu" aria-label={`Actions for ${name}`} title="Conversation actions" onClick={(event) => handleDeleteChat(event, _id, groupChat)}><MoreHorizontal size={17} /></button>
    </div>
  );
};

export default memo(ChatItem);
