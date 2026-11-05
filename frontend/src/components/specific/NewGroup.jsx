import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import toast from "react-hot-toast";

import ChatSkeleton from "../shared/ChatSkeleton";
import { transformImage } from "../../lib/features";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { Avatar, Dialog } from "@mui/material";
import { LoaderCircle, Users, X } from "lucide-react";

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

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isLoadingNewGroup) return;
    if (!groupName.value.trim()) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Please select at least 2 members");

    const result = await newGroup("Creating New Group...", {
      name: groupName.value.trim(),
      members: selectedMembers,
    });

    if (result) dispatch(setIsNewGroup(false));
  };

  const closeHandler = () => {
    if (!isLoadingNewGroup) dispatch(setIsNewGroup(false));
  };

  if (!isNewGroup) return null;

  return (
    <Dialog
      open={isNewGroup}
      onClose={closeHandler}
      fullWidth
      maxWidth="xs"
      aria-labelledby="new-group-title"
      PaperProps={{ className: "dialog-panel new-group-panel" }}
    >
      <form
        onSubmit={submitHandler}
        className="new-group-form"
        aria-busy={isLoadingNewGroup}
      >
        <header className="new-group-header">
          <h2 id="new-group-title">New group</h2>
          <button
            type="button"
            className="icon-button"
            onClick={closeHandler}
            disabled={isLoadingNewGroup}
            aria-label="Close new group"
            title="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="new-group-body">
          <div className="new-group-name">
            <label htmlFor="group-name">Group name</label>
            <input
              id="group-name"
              required
              maxLength={80}
              type="text"
              value={groupName.value}
              onChange={groupName.changeHandler}
              disabled={isLoadingNewGroup}
              placeholder="e.g. Core Developers"
            />
          </div>

          <div className="new-group-members-heading">
            <h3 id="group-members-label">
              Members <span>(minimum 2)</span>
            </h3>
            <output aria-live="polite">
              {selectedMembers.length} selected
            </output>
          </div>

          <fieldset
            className="new-group-member-list"
            aria-labelledby="group-members-label"
          >
            {isLoading && <ChatSkeleton />}
            {!isLoading && isError && (
              <p className="new-group-empty" role="alert">
                Could not load members. Please try again later.
              </p>
            )}
            {!isLoading &&
              !isError &&
              data?.friends?.length > 0 &&
              data.friends.map((friend) => (
                <label
                  key={friend._id}
                  className={`new-group-member${selectedMembers.includes(friend._id) ? " is-selected" : ""}`}
                >
                  <Avatar
                    src={transformImage(
                      typeof friend.avatar === "string"
                        ? friend.avatar
                        : friend.avatar?.url
                    )}
                    alt=""
                    sx={{ width: 36, height: 36 }}
                  >
                    {friend.name?.[0]}
                  </Avatar>
                  <span>{friend.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(friend._id)}
                    onChange={() => selectMemberHandler(friend._id)}
                    disabled={isLoadingNewGroup}
                    aria-label={`Select ${friend.name}`}
                  />
                </label>
              ))}
            {!isLoading && !isError && !data?.friends?.length && (
              <div className="new-group-empty">
                <Users size={24} />
                <p>No friends available</p>
              </div>
            )}
          </fieldset>
        </div>

        <footer className="new-group-footer">
          <button
            type="button"
            onClick={closeHandler}
            disabled={isLoadingNewGroup}
            className="new-group-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isLoadingNewGroup ||
              isLoading ||
              isError ||
              !groupName.value.trim() ||
              selectedMembers.length < 2
            }
            className="new-group-create"
          >
            {isLoadingNewGroup && (
              <LoaderCircle size={18} className="animate-spin" />
            )}
            {isLoadingNewGroup ? "Creating..." : "Create group"}
          </button>
        </footer>
      </form>
    </Dialog>
  );
};

export default NewGroup;
