import React, { memo } from "react";
import { LoaderCircle, Minus, Plus } from "lucide-react";
import { Avatar } from "@mui/material";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  requestStatus = null,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <div
      style={styling}
      className="user-item"
    >
      {/* Avatar & Info Cluster */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar
          src={typeof avatar === "string" ? transformImage(avatar) : avatar?.url}
          alt={`${name}'s avatar`}
          sx={{ width: 40, height: 40 }}
        >{name?.[0]}</Avatar>
        
        {/* Username Typography Wrapper */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">
            {name}
          </p>
        </div>
      </div>

      {/* --- PREMIUM TOGGLE ACTION NODE BUTTON --- */}
      {requestStatus ? (
        <output className="text-xs font-medium text-slate-500 shrink-0">
          {requestStatus === "sent" ? "Request sent" : "Request received"}
        </output>
      ) : <button
        type="button"
        disabled={handlerIsLoading}
        onClick={() => handler(_id)}
        className="icon-button"
        title={isAdded ? "Remove member" : "Add person"}
        aria-label={`${isAdded ? "Remove" : "Add"} ${name}`}
        aria-pressed={isAdded}
      >
        {handlerIsLoading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : isAdded ? (
          <Minus size={18} />
        ) : (
          <Plus size={18} />
        )}
      </button>}
    </div>
  );
};

export default memo(UserItem);