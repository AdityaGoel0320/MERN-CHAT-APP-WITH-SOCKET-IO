import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import toast from "react-hot-toast";

import UserItem from "../shared/UserItem";
import ChatSkeleton from "../shared/ChatSkeleton";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { Dialog } from "@mui/material";
import { LoaderCircle, Users } from "lucide-react";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = async () => {
    if (!groupName.value.trim()) return toast.error("Group name is required");
    if (selectedMembers.length < 2) return toast.error("Please select at least 2 members");

    const result = await newGroup("Creating New Group...", {
      name: groupName.value.trim(),
      members: selectedMembers,
    });

    if (result) closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  if (!isNewGroup) return null;

  return (
    /* Modal Layer Blur Backdrop Mask */
    <Dialog open={isNewGroup} onClose={closeHandler} fullWidth maxWidth="xs" aria-labelledby="new-group-title" PaperProps={{ className: "dialog-panel" }}>
      {/* --- MAIN GLASS CARD CONTROLLER --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-content"
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none !important; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header Title Section */}
        <div className="text-center mb-5">
          <h2 id="new-group-title">
            New group
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {selectedMembers.length} members selected
          </p>
        </div>

        {/* Input Text Form Deck */}
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col gap-1 shrink-0">
            <label htmlFor="group-name">Group name</label>
            <input
              id="group-name"
              autoFocus
              maxLength={80}
              type="text"
              value={groupName.value}
              onChange={groupName.changeHandler}
              className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-none font-semibold"
              placeholder="e.g., Core Developers Team"
            />
          </div>

          {/* Members Subsection Header Label */}
          <div className="flex items-center justify-between shrink-0 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Members
            </span>
            <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100/40">
              {selectedMembers.length} Selected
            </span>
          </div>

          {/* --- SCROLL-LOCKED FRIENDS CONTAINER --- */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 no-scrollbar">
            {isLoading ? (
              <ChatSkeleton />
            ) : data?.friends && data.friends.length > 0 ? (
              data.friends.map((i) => (
                <div 
                  key={i._id}
                  className={`p-0.5 rounded-xl border transition-all duration-200 ${
                    selectedMembers.includes(i._id)
                      ? "bg-indigo-50/40 border-indigo-200/60 shadow-none"
                      : "bg-white/40 border-white/60 hover:bg-white/80"
                  }`}
                >
                  <UserItem
                    user={i}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(i._id)}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                <Users size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  No friends available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- ACTIONS TRIGGER FOOTER LAYOUT --- */}
        <div className="flex gap-3 mt-6 pt-2 shrink-0 border-t border-slate-100">
          <button
            type="button"
            onClick={closeHandler}
            className="w-1/3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-black text-xs uppercase tracking-widest shadow-md hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
          >
            {isLoadingNewGroup && <LoaderCircle size={18} className="animate-spin" />}
            Create group
          </button>
        </div>

      </div>
    </Dialog>
  );
};

export default NewGroup;