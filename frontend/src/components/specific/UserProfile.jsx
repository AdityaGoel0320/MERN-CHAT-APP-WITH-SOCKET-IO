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

import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { transformImage } from "../../lib/features";
import { NavLink } from "react-router-dom";
import { Avatar } from "@mui/material";
import { AtSign, CalendarDays, Shield, UserRound } from "lucide-react";
import AppLayout from "../layout/AppLayout";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="profile-page">
      <p className="eyebrow">ACCOUNT</p>
      <h1>My profile</h1>
      <div className="profile-identity">
        <Avatar
          src={user.avatar?.url ? transformImage(user.avatar.url) : undefined}
          alt={user.name}
          sx={{ width: 88, height: 88 }}
        >
          {user.name?.[0]}
        </Avatar>
        <div>
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
        </div>
      </div>
      <dl className="profile-details">
        <div>
          <dt>
            <UserRound size={18} />
            Full name
          </dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>
            <AtSign size={18} />
            Username
          </dt>
          <dd>{user.username}</dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={18} />
            Joined
          </dt>
          <dd>{moment(user.createdAt).format("MMMM D, YYYY")}</dd>
        </div>
        <div>
          <dt>Bio</dt>
          <dd>{user.bio || "No bio yet"}</dd>
        </div>
      </dl>
      {/* <NavLink to="/admin" className="admin-link"><Shield size={17} />Admin workspace</NavLink> */}
    </section>
  );
};

export default AppLayout()(UserProfile);
