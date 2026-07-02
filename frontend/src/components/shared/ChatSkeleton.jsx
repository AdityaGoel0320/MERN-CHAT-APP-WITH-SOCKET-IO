import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white">

      {/* Animated Logo */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>

        <div
          className="
          absolute inset-0
          rounded-full
          border-4
          border-transparent
          border-t-black
          animate-spin
          "
        />
      </div>

      {/* Title */}
      <h2 className="mt-8 text-3xl font-bold text-gray-900">
        Connecting...
      </h2>

      {/* Typing Dots */}
      <div className="flex gap-2 mt-5">
        <div className="w-3 h-3 rounded-full bg-black animate-bounce"></div>

        <div
          className="w-3 h-3 rounded-full bg-black animate-bounce"
          style={{ animationDelay: "0.15s" }}
        ></div>

        <div
          className="w-3 h-3 rounded-full bg-black animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></div>
      </div>

      {/* Main Message */}
      <p className="mt-8 text-center text-gray-700 max-w-md px-6">
        Waking up the server and fetching your chats...
      </p>

      {/* Secondary Message */}
      <p className="mt-3 text-center text-sm text-gray-500 max-w-lg px-6">
        This app is hosted on a free server. The first request may take
        <span className="font-semibold"> 30-60 seconds </span>
        due to cold starts.
      </p>

      {/* Progress Bar */}
      <div className="mt-8 w-72 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="
          h-full
          w-1/2
          bg-black
          rounded-full
          animate-[loading_2s_ease-in-out_infinite]
          "
        />
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(250%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatSkeleton;