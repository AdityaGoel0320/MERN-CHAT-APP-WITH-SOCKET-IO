import React, { memo } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ alignSelf: sameSender ? "flex-end" : "flex-start" }}
      className={`flex flex-col max-w-[85%] md:max-w-[70%] p-3.5 relative shadow-sm transition-all ${
        sameSender
          ? "ml-auto bg-indigo-600 text-white rounded-[1.25rem] rounded-br-sm border border-indigo-500 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)]"
          : "mr-auto bg-white/80 text-slate-800 rounded-[1.25rem] rounded-bl-sm border border-white/60 backdrop-blur-xl"
      }`}
    >
      {/* Sender Header Label */}
      {!sameSender && (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 mb-1.5 block">
          {sender?.name || "Unknown"}
        </span>
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
                className={`block overflow-hidden rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  sameSender 
                    ? "border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-900/20" 
                    : "border-slate-200/60 hover:shadow-md"
                }`}
              >
                {RenderAttachment(file, url)}
              </a>
            );
          })}
        </div>
      )}

      {/* Timestamp */}
      <span
        className={`text-[9px] font-bold tracking-wider mt-2 flex items-center justify-end ${
          sameSender ? "text-indigo-200" : "text-slate-400"
        }`}
      >
        {timeAgo}
      </span>
    </motion.div>
  );
};

export default memo(MessageComponent);