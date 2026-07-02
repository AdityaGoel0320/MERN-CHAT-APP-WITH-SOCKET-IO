import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./Navbar2";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import ChatSkeleton from "../shared/ChatSkeleton";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <div className="h-screen w-screen bg-gradient-to-tr from-violet-50 via-indigo-50/20 to-emerald-50 text-slate-700 flex flex-col overflow-hidden select-none relative">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none !important; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Dynamic Page Metadata */}
        <Title />

        {/* Premium Core Glass Navigation */}
        <Navbar2 />

        {/* Context Menu Dialog Portal */}
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {/* --- DYNAMIC RESPONSIVE MOBILE SIDEBAR DRAWER OVERLAY --- */}
        {isMobile && (
          <div className="fixed inset-0 z-50 sm:hidden animate-fadeIn">
            {/* Backdrop Blur Mask */}
            <div 
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs" 
              onClick={handleMobileClose} 
            />
            {/* Drawer Sliding Body */}
            <div className="absolute left-0 top-0 h-full w-[75vw] max-w-xs bg-white/95 border-r border-slate-200/60 backdrop-blur-2xl shadow-2xl overflow-hidden animate-slideRight">
              <div className="h-full overflow-y-auto no-scrollbar p-3">
                {isLoading ? (
                  <ChatSkeleton />
                ) : (
                  <ChatList
                    w="100%"
                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CORE RESPONSIVE FLEXBOX/GRID WORKSPACE MATRIX --- */}
        <div className="flex-1 flex w-full max-w-[90rem] mx-auto overflow-hidden h-[calc(100vh-4.5rem)]">
          
          {/* DESKTOP SIDEBAR COLUMN: Chat Session Nodes */}
          <aside className="hidden sm:block sm:w-[30%] md:w-[25%] h-full border-r border-slate-200/50 bg-white/30 backdrop-blur-md overflow-hidden transition-all">
            <div className="h-full overflow-y-auto no-scrollbar py-2 px-1">
              {isLoading ? (
                <div className="p-4"><ChatSkeleton /></div>
              ) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>
          </aside>

          {/* PRIMARY CONTENT CONTEXT ARENA */}
          <main className="flex-1 w-full h-full bg-transparent overflow-hidden relative">
            <div className="h-full w-full overflow-y-auto no-scrollbar">
              <WrappedComponent {...props} chatId={chatId} user={user} />
            </div>
          </main>

        </div>
      </div>
    );
  };
};

export default AppLayout;