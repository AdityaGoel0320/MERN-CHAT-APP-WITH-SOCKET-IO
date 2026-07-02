import React, { Suspense, lazy, useState } from "react";
import { Backdrop } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { server } from "../../constants/config";
import { AppName } from "../../assets/FrontendUtils";

import { userNotExists } from "../../redux/reducers/auth";

import {
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";

import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Navbar2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

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

      dispatch(userNotExists());

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      {/* Navbar */}

      <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">

        {/* Logo */}

        <div className="text-2xl font-bold">
          {AppName}
        </div>

        {/* Desktop Menu */}

        <ul className="hidden md:flex items-center gap-8 font-medium">

          <li>
            <button
              className="hover:text-gray-300 transition"
              onClick={openSearch}
            >
              Search
            </button>
          </li>

          <li>
            <button
              className="hover:text-gray-300 transition"
              onClick={openNewGroup}
            >
              New Group
            </button>
          </li>

          <li>
            <button
              className="hover:text-gray-300 transition"
              onClick={navigateToGroup}
            >
              Manage Groups
            </button>
          </li>

          <li>
            <button
              className="hover:text-gray-300 transition"
              onClick={openNotification}
            >
              Notifications

              {notificationCount > 0 && (
                <span className="ml-1 text-red-500">
                  ({notificationCount})
                </span>
              )}
            </button>
          </li>

          <li>
            <button
              className="hover:text-gray-300 transition"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </li>

          <li>
            <NavLink
              to="/user"
              className="hover:text-gray-300 transition"
            >
              Profile
            </NavLink>
          </li>

        </ul>

        {/* Mobile Hamburger */}

        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </nav>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="md:hidden bg-black text-white px-6 py-5">

          <ul className="flex flex-col gap-5 text-lg">

            <li>
              <button
                onClick={() => {
                  openSearch();
                  setMenuOpen(false);
                }}
              >
                Search
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  openNewGroup();
                  setMenuOpen(false);
                }}
              >
                New Group
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  navigateToGroup();
                  setMenuOpen(false);
                }}
              >
                Manage Groups
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  openNotification();
                  setMenuOpen(false);
                }}
              >
                Notifications

                {notificationCount > 0 && (
                  <span className="ml-1 text-red-500">
                    ({notificationCount})
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  logoutHandler();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </li>

            <li>
              <NavLink
                to="/user"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
            </li>

          </ul>

        </div>

      )}

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