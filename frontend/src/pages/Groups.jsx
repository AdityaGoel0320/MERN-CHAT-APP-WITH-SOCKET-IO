import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { LayoutLoader } from "../components/layout/Loaders";
import { setIsAddMember } from "../redux/reducers/misc";
import { ArrowLeft, Check, LoaderCircle, Menu, Pencil, Trash2, UserPlus, Users, X } from "lucide-react";
import { Drawer, IconButton } from "@mui/material";
import Navbar2 from "../components/layout/Navbar2";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => navigate("/");
  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = async () => {
    if (!groupNameUpdatedValue.trim()) return;
    const result = await updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue.trim() });
    if (result) setIsEdit(false);
  };

  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => dispatch(setIsAddMember(true));

  const deleteHandler = async () => {
    const result = await deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    if (result) navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setConfirmDeleteDialog(false);
    dispatch(setIsAddMember(false));
  }, [chatId, dispatch]);

  const IconBtns = (
    <>
      {/* Mobile Toggle Trigger */}
      <div className="mobile-only">
        <button
          aria-label="Open groups"
          onClick={handleMobile}
          className="icon-button"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Global Navigation Back Button */}
      <button
        onClick={navigateBack}
        className="icon-button"
        aria-label="Back to messages"
        title="Back"
      >
        <ArrowLeft size={20} />
      </button>
    </>
  );

  const GroupNameHeader = (
    <div className="group-name-header">
      {isEdit ? (
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            aria-label="Group name"
            maxLength={80}
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-800 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          <button
            onClick={updateGroupName}
            disabled={isLoadingGroupName || !groupNameUpdatedValue.trim()}
            aria-label="Save group name"
            className="flex items-center justify-center h-11 w-11 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {isLoadingGroupName ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <h1>
            {groupName}
          </h1>
          <button
            disabled={isLoadingGroupName}
            aria-label="Rename group"
            onClick={() => setIsEdit(true)}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/80 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-white shadow-sm transition-all"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const ButtonGroup = (
    <div className="flex w-full max-w-xl flex-col-reverse sm:flex-row gap-3 mt-6">
      <button
        onClick={openConfirmDeleteHandler}
        disabled={isLoadingDeleteGroup}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200/40 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-100/60 transition-all"
      >
        <Trash2 size={17} /> Delete group
      </button>
      <button
        onClick={openAddMemberHandler}
        className="flex-[2] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-md transition-all"
      >
        <UserPlus size={17} /> Add members
      </button>
    </div>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <div className="app-shell">
      <Navbar2 onOpenConversations={handleMobile} />
      <div className="group-workspace">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient background decoration */}

      {/* Desktop Sidebar Column */}
      <aside className="chat-sidebar">
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </aside>

      {/* Primary Context Arena Grid */}
      <main className="group-main group-panel">
        <div className="flex items-center justify-between w-full">{IconBtns}<span className="eyebrow">GROUP SETTINGS</span></div>

        {chatId ? (
          <div className="w-full flex flex-col items-center">
            {groupDetails.isLoading ? <LoaderCircle className="animate-spin" size={24} /> : <>
            {GroupNameHeader}

            {/* Inner Workspace Glass Area */}
            <section className="group-members">
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Members ({members.length})
                </h2>
              </div>

              {/* Secure Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {isLoadingRemoveMember ? (
                  <div className="flex justify-center items-center h-full py-10">
                    <LoaderCircle size={24} className="animate-spin" />
                  </div>
                ) : (
                  members.map((i) => (
                    <div key={i._id} className="member-row">
                      <UserItem user={i} isAdded handler={removeMemberHandler} />
                    </div>
                  ))
                )}
              </div>
            </section>

            {ButtonGroup}
            </>}
          </div>
        ) : (
          <div className="sidebar-empty my-auto">
            <Users size={40} />
            <h1>Groups</h1>
            <p>No group selected</p>
          </div>
        )}
      </main>

      {/* Dialog Suspense Portals */}
      {isAddMember && (
        <Suspense fallback={<div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50" />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50" />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      {/* Responsive Mobile Drawer Navigation Overlay */}
      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose} PaperProps={{ sx: { width: "min(340px, 88vw)" } }}><div className="flex justify-end p-2"><IconButton aria-label="Close groups" onClick={handleMobileClose}><X size={20} /></IconButton></div><GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} /></Drawer>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: GROUP SELECTION LIST TRACK --- */
const GroupsList = ({ myGroups = [], chatId }) => (
  <div className="h-full overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
    <div className="px-3 mb-4 mt-14 sm:mt-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        My groups
      </h3>
    </div>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <div className="text-center py-8 text-xs font-semibold text-slate-400">
        No groups yet
      </div>
    )}
  </div>
);

/* --- SUB-COMPONENT: LIST INDIVIDUAL SELECTION ROW --- */
const GroupListItem = memo(function GroupListItem({ group, chatId }) {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => isActive && e.preventDefault()}
      className={`group-list-link ${isActive ? "is-active" : ""}`}
    >
      <div
        className="flex items-center gap-3 p-3"
      >
        <AvatarCard avatar={avatar} />
        <div className="font-semibold text-sm truncate">
          {name}
        </div>
      </div>
    </Link>
  );
});

export default Groups;