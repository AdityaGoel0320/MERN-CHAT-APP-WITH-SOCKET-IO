// import React from "react";
// import { Avatar, Stack, Typography } from "@mui/material";
// import { useSelector } from "react-redux";
// import {
//   Face as FaceIcon,
//   AlternateEmail as UserNameIcon,
//   CalendarMonth as CalendarIcon,
// } from "@mui/icons-material";
// import moment from "moment";
// import { transformImage } from "../../lib/features";

// const UserProfile = () => {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} className="animate-fade-in">
//       <Avatar
//         src={transformImage(user.avatar?.url)}
//         sx={{
//           width: 200,
//           height: 200,
//           objectFit: "contain",
//           marginBottom: "1rem",
//           border: "5px solid white",
//         }}
//         className="rounded-full border border-white"
//       />
//       <ProfileCard heading={"Bio"} text={user.bio} />
//       <ProfileCard
//         heading={"Username"}
//         text={user.username}
//         Icon={<UserNameIcon />}
//       />
//       <ProfileCard heading={"Name"} text={user.name} Icon={<FaceIcon />} />
//       <ProfileCard
//         heading={"Joined"}
//         text={moment(user.createdAt).fromNow()}
//         Icon={<CalendarIcon />}
//       />
//     </Stack>
//   );
// };

// const ProfileCard = ({ text, Icon, heading }) => (
//   <Stack
//     direction={"row"}
//     alignItems={"center"}
//     spacing={"1rem"}
//     color={"white"}
//     textAlign={"center"}
//     className="animate-slide-in"
//   >
//     {Icon && Icon}

//     <Stack>
//       <Typography variant="body1">{text}</Typography>
//       <Typography color={"gray"} variant="caption">
//         {heading}
//       </Typography>
//     </Stack>
//   </Stack>
// );

// export default UserProfile;


import React from 'react';
import { useSelector } from "react-redux";
import moment from "moment";
import { transformImage } from "../../lib/features";
import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";


const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div className='bg-black border-4 w-fit rounded-3xl text-white  p-2   '>
        <NavLink to="/">

          Back
        </NavLink>
      </div>
      <div className='flex justify-center items-center h-[80vh]'>
        <div className=" p-6">
          <div className="flex items-center justify-center">
            <img
              src={transformImage(user.avatar?.url)}
              alt="User Avatar"
              className="w-32 h-32 object-cover rounded-full border-4 border-white"
            />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-gray-200">Name: <span className="font-bold">{user.name}</span></p>
            <p className="text-gray-200">Username: <span className="font-bold">@{user.username}</span></p>
            <p className="text-gray-200">Joined <span className="font-bold">{moment(user.createdAt).fromNow()}</span></p>
            <p className="text-gray-200 font-bold mt-4">{user.bio}</p>
          </div>
        </div>
      </div>

      <div>
        <h1 className='flex justify-center items-center m-4 font-bold'>
          If you have admin key than click on
          <br />
          <NavLink to="/admin">

          <button className= 'ml-2 bg-yellow-500 border-black border-4 font-bold  p-2 rounded-2xl '> Admin Page</button>
          </NavLink>
        </h1>
      </div>
    </>

  );
};

export default UserProfile;
