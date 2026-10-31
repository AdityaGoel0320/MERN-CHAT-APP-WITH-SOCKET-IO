import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useInfiniteScrollTop } from "6pp";
import { Paperclip, Send, Users, MessageCircle } from "lucide-react";
import { Avatar, Tooltip } from "@mui/material";
import toast from "react-hot-toast";

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
  const [isSending, setIsSending] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page }, { skip: !chatId });

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

    if (!IamTyping && members && connected) {
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
    if (!message.trim() || !members || !connected || isSending) return;

    setIsSending(true);
    socket.timeout(10000).emit(NEW_MESSAGE, { chatId, message: message.trim() }, (error, result) => {
      setIsSending(false);
      if (error || !result?.success) toast.error(error ? "Delivery not confirmed. Check the conversation before retrying." : result?.message || "Could not send message");
      else setMessage("");
    });
    clearTimeout(typingTimeout.current);
    socket.emit(STOP_TYPING, { members, chatId });
    setIamTyping(false);
  };

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      setUserTyping(false);
      setIamTyping(false);
      clearTimeout(typingTimeout.current);
    };
  }, [chatId, dispatch, setOldMessages]);

  useEffect(() => {
    if (!members) return;
    socket.emit(CHAT_JOINED, { chatId });
    const joinOnReconnect = () => socket.emit(CHAT_JOINED, { chatId });
    socket.on("connect", joinOnReconnect);
    return () => {
      socket.off("connect", joinOnReconnect);
      socket.emit(STOP_TYPING, { chatId, members });
      socket.emit(CHAT_LEAVED, { chatId });
    };
  }, [chatId, members, socket, user._id]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (page === 1 && oldMessages.length) bottomRef.current?.scrollIntoView();
  }, [oldMessages, page]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => { socket.off("connect", onConnect); socket.off("disconnect", onDisconnect); };
  }, [socket]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError, navigate]);

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
        _id: `alert-${Date.now()}-${Math.random()}`,
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
    <div className="chat-pane">
      <header className="conversation-header">
        <Avatar src={chatDetails.data?.chat?.groupChat ? undefined : members?.find((member) => member._id !== user._id)?.avatar} sx={{ bgcolor: "var(--accent-soft)", color: "var(--accent)", width: 40, height: 40 }}>{chatDetails.data?.chat?.groupChat ? <Users size={20} /> : <MessageCircle size={20} />}</Avatar>
        <div className="min-w-0"><h1>{chatDetails.data?.chat?.groupChat ? chatDetails.data.chat.name : members?.find((member) => member._id !== user._id)?.name || chatDetails.data?.chat?.name}</h1><p>{userTyping ? "Typing..." : chatDetails.data?.chat?.groupChat ? `${members?.length || 0} members` : "Direct conversation"}</p></div>
      </header>
      {!connected && <div className="connection-notice" role="status">Reconnecting... Your draft is saved here.</div>}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- ADDED 'flex flex-col' HERE TO ALLOW LEFT/RIGHT ALIGNMENT --- */}
      <div
        ref={containerRef}
        className="message-feed"
      >
        {oldMessagesChunk.isLoading && <ChatSkeleton />}
        {!oldMessagesChunk.isLoading && !allMessages.length && <p className="feed-empty">No messages yet</p>}
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {/* Constrained typing loader to stay on the left */}
        {userTyping && (
          <div className="typing-indicator" aria-label="Someone is typing">
            <TypingLoader />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* --- MODERN FLOATING GLASS INPUT BOX --- */}
      <form
        onSubmit={submitHandler}
        className="message-composer"
      >
        <div className="composer-inner">
          
          {/* File Attachment Point */}
          <Tooltip title="Attach files"><span className="inline-flex"><button
            type="button"
            aria-label="Attach files"
            disabled={!members || !connected || isSending}
            onClick={handleFileOpen}
            className="icon-button"
          >
            <Paperclip size={20} />
          </button></span></Tooltip>

          {/* Secure Messaging Input Field */}
          <input
            type="text"
            aria-label="Message"
            maxLength={4000}
            disabled={isSending}
            placeholder="Write your message..."
            value={message}
            onChange={messageOnChange}
            className="composer-input"
          />

          {/* Send Trigger Button */}
          <Tooltip title="Send message"><span className="inline-flex"><button
            type="submit"
            aria-label="Send message"
            disabled={!message.trim() || !members || !connected || isSending}
            className="send-button"
          >
            <Send size={19} />
          </button></span></Tooltip>
        </div>
      </form>

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </div>
  );
};

export default AppLayout()(Chat);