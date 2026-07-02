import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { LayoutLoader } from "../components/layout/Loaders";
import { setIsAddMember } from "../redux/reducers/misc";
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

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue });
  };

  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => dispatch(setIsAddMember(true));

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      {/* Mobile Toggle Trigger */}
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handleMobile}
          className="p-3 rounded-2xl bg-white/80 border border-slate-200 text-slate-700 backdrop-blur-md shadow-md hover:bg-white transition-all"
        >
          <i className="fas fa-bars text-lg" />
        </button>
      </div>

      {/* Global Navigation Back Button */}
      <button
        onClick={navigateBack}
        className="absolute top-6 left-6 z-40 p-3 rounded-2xl bg-white/80 border border-slate-200/60 text-indigo-600 backdrop-blur-md hover:bg-white shadow-sm hover:scale-105 transition-all"
        title="Back"
      >
        <i className="fas fa-arrow-left text-lg" />
      </button>
    </>
  );

  const GroupNameHeader = (
    <div className="flex items-center justify-center gap-3 p-4 mt-8 w-full max-w-xl">
      {isEdit ? (
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-800 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          <button
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
            className="flex items-center justify-center h-11 w-11 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {isLoadingGroupName ? (
              <i className="fas fa-spinner animate-spin" />
            ) : (
              <i className="fas fa-check" />
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-950 bg-clip-text text-transparent">
            {groupName}
          </h1>
          <button
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/80 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-white shadow-sm transition-all"
          >
            <i className="fas fa-pen text-xs" />
          </button>
        </div>
      )}
    </div>
  );

  const ButtonGroup = (
    <div className="flex w-full max-w-xl flex-col-reverse sm:flex-row gap-3 mt-6">
      <button
        onClick={openConfirmDeleteHandler}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200/40 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-100/60 transition-all"
      >
        <i className="fas fa-trash-alt" /> Delete Group
      </button>
      <button
        onClick={openAddMemberHandler}
        className="flex-[2] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-md transition-all"
      >
        <i className="fas fa-user-plus" /> Add Member
      </button>
    </div>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <div className="grid grid-cols-12 h-screen w-screen bg-gradient-to-tr from-violet-50 via-indigo-50/30 to-emerald-50 text-slate-700 overflow-hidden select-none relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-200/30 blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar Column */}
      <div className="hidden sm:block sm:col-span-4 border-r border-slate-200/60 h-full overflow-hidden bg-white/40 backdrop-blur-md">
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </div>

      {/* Primary Context Arena Grid */}
      <div className="col-span-12 sm:col-span-8 flex flex-col items-center p-6 relative h-full justify-between overflow-hidden">
        {IconBtns}

        {chatId ? (
          <div className="w-full flex-1 flex flex-col items-center justify-between overflow-hidden">
            {GroupNameHeader}

            {/* Inner Workspace Glass Area */}
            <div className="w-full max-w-xl flex-1 flex flex-col my-4 p-5 sm:p-6 rounded-[2rem] bg-white/60 border border-white/80 backdrop-blur-xl shadow-sm overflow-hidden">
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Active Network Nodes ({members.length})
                </h2>
              </div>

              {/* Secure Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {isLoadingRemoveMember ? (
                  <div className="flex justify-center items-center h-full py-10">
                    <i className="fas fa-spinner animate-spin text-2xl text-indigo-600" />
                  </div>
                ) : (
                  members.map((i) => (
                    <div key={i._id} className="p-0.5 rounded-xl bg-white/40 border border-white/60 shadow-none hover:bg-white/80 transition-all">
                      <UserItem user={i} isAdded handler={removeMemberHandler} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {ButtonGroup}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center opacity-60 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white/60 flex items-center justify-center text-indigo-500 shadow-sm mb-3">
              <i className="fas fa-users-cog text-xl" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Select a group cluster to map nodes
            </p>
          </div>
        )}
      </div>

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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={handleMobileClose} />
          <div className="absolute left-0 top-0 h-full w-[75vw] max-w-xs bg-white/95 border-r border-slate-200/50 backdrop-blur-2xl shadow-2xl overflow-hidden animate-slideRight">
            <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SUB-COMPONENT: GROUP SELECTION LIST TRACK --- */
const GroupsList = ({ myGroups = [], chatId }) => (
  <div className="h-full overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
    <div className="px-3 mb-4 mt-14 sm:mt-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        My Clusters
      </h3>
    </div>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <div className="text-center py-8 text-xs font-semibold text-slate-400">
        No channels established
      </div>
    )}
  </div>
);

/* --- SUB-COMPONENT: LIST INDIVIDUAL SELECTION ROW --- */
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => isActive && e.preventDefault()}
      className="block w-full transition-transform duration-150 active:scale-[0.99]"
    >
      <div
        className={`flex items-center gap-4 rounded-2xl p-3.5 border transition-all ${
          isActive
            ? "bg-white border-indigo-200/60 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.06)]"
            : "bg-transparent border-transparent hover:bg-white/50"
        }`}
      >
        <AvatarCard avatar={avatar} />
        <div className={`font-bold text-sm truncate tracking-wide ${isActive ? "text-indigo-950" : "text-slate-700"}`}>
          {name}
        </div>
      </div>
    </Link>
  );
});

export default Groups;