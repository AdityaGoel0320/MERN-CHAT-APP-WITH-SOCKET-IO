// import React, { useContext, useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// function Navbar() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const closeDropdown = () => {
//     setDropdownOpen(false);
//   };

//   const handleDropdownItemClick = () => {
//     setDropdownOpen(false);
//     closeDropdown();
//   };


//   const [show, setShow] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state variable for sidebar

//   const handleNavbar = () => {
//     setShow(!show);
//     setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
//   };

//   const isDashboard = useLocation("http://localhost:5174/dashboard");

//   const { mode, setMode, isAuthenticated, user, setIsAuthenticated } = useContext(Context);

//   const navigateTo = useNavigate();
//   const handleLogout = async (e) => {
//     e.preventDefault();
//     try {
//       let url = `${BackendUrl}/api/v1/user/logout`
//       const { data } = await axios.get(
//         url,
//         { withCredentials: true }
//       );
//       setIsAuthenticated(false);
//       toast.success(data.message);
//       navigateTo("/");
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     // <div className={` ${mode === 'dark' ? 'dark' : 'light'} navbar bg-base-100 font-bold`}>
//     <div className={` bg-black text-white navbar  font-bold`}>

//       <div className="navbar-start">
//         <div className="dropdown relative">
//           <div
//             tabIndex={0}
//             role="button"
//             className="btn btn-ghost lg:hidden"
//             onClick={toggleDropdown}
//           >
//             {dropdownOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h8m-8 6h16"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h8m-8 6h16"
//                 />
//               </svg>
//             )}
//           </div>
//           {dropdownOpen && (
//             <ul
//               className=" bg-black text-white shadow menu menu-sm dropdown-content mt-3 z-[1] p-2 rounded-box w-52"
//             >
//               {/* <li><NavLink onClick={handleDropdownItemClick} to="/authors">HOMEdsfdfd
//                 </NavLink></li> */}

//               <li onClick={handleDropdownItemClick}>

//                 <NavLink to="/" >
//                   HOME
//                 </NavLink>
//               </li>

//               <li onClick={handleDropdownItemClick}>

//                 <NavLink to="/blogs" >
//                   ALL BLOGS
//                 </NavLink>
//               </li>
//               <li onClick={handleDropdownItemClick}>

//                 <NavLink to="/authors" >
//                   ALL AUTHORS
//                 </NavLink>
//               </li>


//               <li onClick={handleDropdownItemClick}>

//                 <NavLink to="/about" >
//                   ABOUT US
//                 </NavLink>
//               </li>

//             </ul>
//           )}
//         </div>
//         <a className="btn btn-ghost text-xl" onClick={toggleDropdown}>djsbhfvbgh</a>
//       </div>
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1">
//           <li>
//             <NavLink exact to="/" onClick={handleNavbar} activeClassName="active">
//               HOME
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/blogs" onClick={handleNavbar}  activeClassName="active">
//               ALL BLOGS
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/authors" onClick={handleNavbar}  activeClassName="active">
//               ALL AUTHORS
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/about" onClick={handleNavbar}  activeClassName="active">
//               ABOUT US
//             </NavLink>
//           </li>
//         </ul>

//       </div>
//       <div className="navbar-end">
//         {/* <a className="btn"></a> */}


// {/* toggle button */}

//         {/* <button
//           onClick={() => mode === "light" ? setMode("dark") : setMode("light")}
//           className=" text-md "
//         >
//           {mode === "light" ? (
//             <svg className="swap-on fill-current w-10 h-10 p-1 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//               <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//             </svg>
//           ) : (
//             <svg className="swap-off fill-current w-10 h-10  p-1 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//               <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//             </svg>
//           )}
//         </button> */}


// {/* 
//         {isAuthenticated && user.role === "Author" ? (
//           <NavLink
//             to={"/dashboard"}
//             onClick={handleNavbar}
//             className="bg-yellow-500 p-1 border-4  border-white rounded-xl font-bold text-black"
//           >
//             DASHBOARD
//           </NavLink>
//         ) : (
//           ""
//         )}
//         {!isAuthenticated ? (
//           <NavLink to={"/login"} onClick={handleNavbar} className="bg-teal-500 p-1 border-4  border-white rounded-xl font-bold">
//             LOGIN
//           </NavLink>
//         ) : (
//           <div className="leftBoxAlign">

//             {isAuthenticated && user.role !== "Author" ? (
//               <NavLink
//                 to="/aboutUser"
//                 onClick={handleNavbar}
//                 className="border-4 p-1 bg-yellow-500 border-black rounded-2xl text-black "
//               >
//                 <i class="fa-solid fa-user"></i>
//               </NavLink>
//             ) : (
//               ""
//             )}
//             <button className="bg-white border-4 border-black rounded-xl p-1 ml-1 text-black" onClick={handleLogout}>
//               <i class="fa-solid fa-right-from-bracket"></i>
//             </button>



//           </div>
//         )} */}


//       </div>
//     </div>
//   );
// }

// import React, { useContext, useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";


import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import { AppName } from "../../assets/FrontendUtils";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));





const Navbar2 = () => {


  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleDropdownItemClick = () => {
    setDropdownOpen(false);
    closeDropdown();
  };


  const [show, setShow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state variable for sidebar

  const handleNavbar = () => {
    setShow(!show);
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

  // c/onst isDashboard = useLocation("http://localhost:5174/dashboard");


  // const navigateTo = useNavigate();
  // // const handleLogout = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let url = `${BackendUrl}/api/v1/user/logout`
  //     const { data } = await axios.get(
  //       url,
  //       { withCredentials: true }
  //     );
  //     setIsAuthenticated(false);
  //     toast.success(data.message);
  //     navigateTo("/");
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };



  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };


  return (
    // <div className={` ${mode === 'dark' ? 'dark' : 'light'} navbar bg-base-100 font-bold`}>
    <div className=" bg-black    h-16 text-white navbar  font-bold " >

      <div className="navbar-start">
        <div className="dropdown relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={toggleDropdown}
          >
            {dropdownOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            )}
          </div>
          {dropdownOpen && (
            <ul
              className=" bg-black text-white shadow menu menu-sm dropdown-content mt-3 z-[1] p-2 rounded-box "
            >
              {/* <li><NavLink onClick={handleDropdownItemClick} to="/authors">HOMEdsfdfd
                </NavLink></li> */}

              <li onClick={handleDropdownItemClick}>

                <IconBtn
                  title={"Search"}
                  icon={<SearchIcon />}
                  onClick={openSearch}
                />
              </li>

              <li onClick={handleDropdownItemClick}>

                <IconBtn
                  title={"New Group"}
                  icon={<AddIcon />}
                  onClick={openNewGroup}
                />
              </li>
              <li onClick={handleDropdownItemClick}>

                <IconBtn
                  title={"Manage Groups"}
                  icon={<GroupIcon />}
                  onClick={navigateToGroup}
                />
              </li>


              <li onClick={handleDropdownItemClick}>

                <IconBtn
                  title={"Notifications"}
                  icon={<NotificationsIcon />}
                  onClick={openNotification}
                  value={notificationCount}
                />
              </li>

              <li onClick={handleDropdownItemClick}>


                <IconBtn
                  title={"Logout"}
                  icon={<LogoutIcon />}
                  onClick={logoutHandler}
                />
              </li>


              <li onClick={handleDropdownItemClick}>


                <NavLink className="mt-2 text-xl " to="/user"><i class="fa-solid fa-user"></i></NavLink>
              </li>

            </ul>
          )}
        </div>
        <a className="btn btn-ghost text-xl" onClick={toggleDropdown}>{AppName}</a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal     flex items-center justify-center gap-2 ">
          <li onClick={handleNavbar} activeClassName="active">
            <IconBtn
              title={"Search"}
              icon={<SearchIcon />}
              onClick={openSearch}
            />
          </li>
          <li onClick={handleNavbar} activeClassName="active">
            <IconBtn
              title={"New Group"}
              icon={<AddIcon />}
              onClick={openNewGroup}
            />
          </li>
          <li onClick={handleNavbar} activeClassName="active">
            <IconBtn
              title={"Manage Groups"}
              icon={<GroupIcon />}
              onClick={navigateToGroup}
            />

          </li>
          <li onClick={handleNavbar} activeClassName="active">
            <IconBtn
              title={"Notifications"}
              icon={<NotificationsIcon />}
              onClick={openNotification}
              value={notificationCount}
            />
          </li>

          <li onClick={handleNavbar} activeClassName="active">


            <IconBtn
              title={"Logout"}
              icon={<LogoutIcon />}
              onClick={logoutHandler}
            />
          </li>


          <li onClick={handleNavbar} activeClassName="active">


            <NavLink className="text-xl " to="/user"><i class="fa-solid fa-user"></i></NavLink>
          </li>
        </ul>
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
      </div>

    </div>
  );
}



const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Navbar2