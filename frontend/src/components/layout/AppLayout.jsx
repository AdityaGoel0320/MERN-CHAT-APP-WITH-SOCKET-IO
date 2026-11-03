import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Drawer, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./Navbar2";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import ChatSkeleton from "../shared/ChatSkeleton";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import api, { useMyChatsQuery } from "../../redux/api/api";
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
  return function AppLayoutComponent(props) {
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
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));
    useEffect(() => { dispatch(setIsMobile(false)); }, [chatId, dispatch]);

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
      dispatch(api.util.invalidateTags(["Notification"]));
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      void refetch();
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
      <div className="app-shell">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none !important; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Dynamic Page Metadata */}
        <Title title="ChatBuddy | Messages" />

        {/* Premium Core Glass Navigation */}
        <Navbar2 />

        {/* Context Menu Dialog Portal */}
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {/* --- DYNAMIC RESPONSIVE MOBILE SIDEBAR DRAWER OVERLAY --- */}
        <Drawer open={isMobile} onClose={handleMobileClose} sx={{ display: { xs: "block", md: "none" } }} PaperProps={{ sx: { width: "min(340px, 88vw)" } }}>
              <div className="flex justify-end p-2"><IconButton aria-label="Close conversations" onClick={handleMobileClose}><X size={20} /></IconButton></div>
              <div className="overflow-y-auto p-3">
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
                    onSelect={handleMobileClose}
                  />
                )}
              </div>
        </Drawer>

        {/* --- CORE RESPONSIVE FLEXBOX/GRID WORKSPACE MATRIX --- */}
        <div className="workspace">
          
          {/* DESKTOP SIDEBAR COLUMN: Chat Session Nodes */}
          <aside className="chat-sidebar" aria-label="Conversations">
            <div className="h-full overflow-y-auto py-2 px-1">
              {isError && <Alert severity="error" sx={{ m: 2 }} action={<Button color="inherit" onClick={refetch}>Retry</Button>}>Could not load conversations.</Alert>}
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
          <main className="workspace-main">
            <div className="h-full w-full">
              <WrappedComponent {...props} chatId={chatId} user={user} />
            </div>
          </main>

        </div>
      </div>
    );
  };
};

export default AppLayout;