import React from "react";
import { MessageCircle, Server } from "lucide-react";

const ChatSkeleton = () => {
  return (
    <output className="server-loader" aria-label="Connecting to ChatBuddy">
      <div className="server-loader-content">
        <div className="server-loader-art" aria-hidden="true">
          <div className="server-loader-mark"><MessageCircle size={26} /></div>
          <div className="server-loader-messages">
            <div className="server-loader-message"><span /><span /></div>
            <div className="server-loader-message is-reply"><span /><span /></div>
            <div className="server-loader-message"><span /><span /></div>
          </div>
        </div>
        <div className="server-loader-title"><span className="server-loader-dots" aria-hidden="true"><span /><span /><span /></span><h2>Getting connected</h2></div>
        <p className="server-loader-description">Just a moment while ChatBuddy wakes up.</p>
        <div className="server-loader-track" aria-hidden="true"><span /></div>
        <div className="server-loader-notice"><Server size={15} aria-hidden="true" /><p>Our free server sleeps between visits. The first connection may take <strong>30&ndash;60 seconds.</strong></p></div>
      </div>
    </output>
  );
};

export default ChatSkeleton;