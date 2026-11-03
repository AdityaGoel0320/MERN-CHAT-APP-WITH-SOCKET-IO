import React, { Suspense, lazy, useState } from "react";
import { Avatar, Backdrop, Menu, MenuItem, Tooltip } from "@mui/material";
import { Bell, ChevronDown, LogOut, MessageCircle, MessageSquarePlus, Search, Users, UserRound, Menu as MenuIcon } from "lucide-react";
import ThemeToggle from "../shared/ThemeToggle";
import api from "../../redux/api/api";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { server } from "../../constants/frontendConstant.js";

import { userNotExists } from "../../redux/reducers/auth";

import {
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
  setIsMobile,
} from "../../redux/reducers/misc";

import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Navbar2 = ({ onOpenConversations }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchor, setAnchor] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );

  const { notificationCount } = useSelector(
    (state) => state.chat
  );

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );

      dispatch(api.util.resetApiState());
      dispatch(userNotExists());

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const actions = [
    { label: "Find people", icon: Search, run: openSearch },
    { label: "New group", icon: MessageSquarePlus, run: openNewGroup },
    { label: "Manage groups", icon: Users, run: navigateToGroup },
  ];
  return (
    <>
      <header className="app-header">
        <div className="flex items-center gap-2 min-w-0">
          <Tooltip title="Conversations"><button className="icon-button mobile-only" aria-label="Open conversations" onClick={onOpenConversations || (() => dispatch(setIsMobile(true)))}><MenuIcon size={20} /></button></Tooltip>
          <NavLink to="/" className="brand"><span className="brand-mark"><MessageCircle size={22} /></span>ChatBuddy</NavLink>
        </div>
        <nav aria-label="Workspace actions" className="header-actions">
          <ThemeToggle />
          <Tooltip title="Notifications"><button className="icon-button relative" aria-label="Notifications" onClick={openNotification}><Bell size={19} />{notificationCount > 0 && <span className="notification-dot">{notificationCount > 9 ? "9+" : notificationCount}</span>}</button></Tooltip>
          <Tooltip title="Account menu"><button className="icon-button" style={{ width: "auto", gap: 6, padding: "0 6px" }} aria-label="Account menu" aria-haspopup="menu" aria-expanded={Boolean(anchor)} onClick={(event) => setAnchor(event.currentTarget)}><Avatar src={user?.avatar?.url} alt={user?.name} sx={{ width: 30, height: 30, fontSize: 13 }}>{user?.name?.[0]}</Avatar><ChevronDown size={15} /></button></Tooltip>
        </nav>
      </header>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {actions.map(({ label, icon: Icon, run }) => <MenuItem key={label} onClick={() => { setAnchor(null); run(); }} sx={{ gap: 1.5 }}><Icon size={17} />{label}</MenuItem>)}
        <MenuItem onClick={() => { setAnchor(null); navigate("/user"); }} sx={{ gap: 1.5 }}><UserRound size={17} />My profile</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); void logoutHandler(); }} sx={{ gap: 1.5, color: "error.main" }}><LogOut size={17} />Sign out</MenuItem>
      </Menu>

      {/* Dialogs */}

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Navbar2;