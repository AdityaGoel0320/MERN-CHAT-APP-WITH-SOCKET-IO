import React, { memo } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).format("h:mm A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ alignSelf: sameSender ? "flex-end" : "flex-start" }}
      className={`message-bubble ${sameSender ? "sent" : "received"}`}
    >
      {/* Sender Header Label */}
      {!sameSender && (
        <span className="message-sender">{sender?.name || "Unknown"}</span>
      )}

      {/* Message Text Context */}
      {content && (
        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      )}

      {/* Attachments Media */}
      {attachments.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-2.5">
          {attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="message-attachment"
              >
                {RenderAttachment(file, url)}
              </a>
            );
          })}
        </div>
      )}

      {/* Timestamp */}
      <span className="message-time" title={moment(createdAt).format("LLL")}>
        {timeAgo}
      </span>
    </motion.div>
  );
};

export default memo(MessageComponent);
