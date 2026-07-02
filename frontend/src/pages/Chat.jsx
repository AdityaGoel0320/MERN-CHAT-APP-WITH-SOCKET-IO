import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useInfiniteScrollTop } from "6pp";
import { FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

import AppLayout from "../components/layout/AppLayout";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import ChatSkeleton from "../components/shared/ChatSkeleton";
import { TypingLoader } from "../components/layout/Loaders";

import { getSocket } from "../socket";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "admin-alert-node-id-00x",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <ChatSkeleton />
  ) : (
    <div className="flex flex-col h-[88vh] w-full relative overflow-hidden select-none px-2 sm:px-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- ADDED 'flex flex-col' HERE TO ALLOW LEFT/RIGHT ALIGNMENT --- */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto no-scrollbar w-full max-w-5xl mx-auto rounded-t-[2rem] bg-white/30 backdrop-blur-md border-x border-t border-white/40 shadow-inner"
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {/* Constrained typing loader to stay on the left */}
        {userTyping && (
          <div className="flex items-center gap-2 p-2 max-w-fit rounded-2xl bg-white/60 border border-white text-indigo-600 shadow-sm animate-pulse self-start">
            <TypingLoader />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* --- MODERN FLOATING GLASS INPUT BOX --- */}
      <form
        onSubmit={submitHandler}
        className="h-20 w-full max-w-5xl mx-auto pb-4 pt-2 z-10"
      >
        <div className="w-full h-full flex items-center px-4 gap-3 rounded-2xl bg-white/70 border border-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(79,70,229,0.04)]">
          
          {/* File Attachment Point */}
          <button
            type="button"
            onClick={handleFileOpen}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100/80 hover:bg-indigo-50 border border-slate-200/40 text-slate-500 hover:text-indigo-600 active:scale-95 transition-all shrink-0"
          >
            <FiPaperclip className="text-lg" />
          </button>

          {/* Secure Messaging Input Field */}
          <input
            type="text"
            placeholder="Write your message..."
            value={message}
            onChange={messageOnChange}
            className="flex-1 h-11 px-4 rounded-xl bg-white/90 border border-slate-200/60 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-none"
          />

          {/* Send Trigger Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex items-center justify-center h-11 px-5 rounded-xl bg-indigo-600 disabled:bg-indigo-300 text-white font-black hover:bg-indigo-500 active:scale-95 shadow-md hover:shadow-indigo-500/10 transition-all shrink-0 gap-2 text-xs uppercase tracking-wider"
          >
            <span>Send</span>
            <IoSend className="text-xs transform rotate-[-15deg]" />
          </button>
        </div>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </div>
  );
};

export default AppLayout()(Chat);