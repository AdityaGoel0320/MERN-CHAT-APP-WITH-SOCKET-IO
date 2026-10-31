import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { Dialog } from "@mui/material";
import { Search as SearchIcon, Users, X } from "lucide-react";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    let active = true;
    let request;
    setIsSearching(true);
    setSearchError("");
    const timeOutId = setTimeout(() => {
      request = searchUser(search.value.trim());
      request.unwrap()
        .then((data) => { if (active) setUsers(data.users || []); })
        .catch(() => { if (active) { setUsers([]); setSearchError("Could not find people. Please try again."); } })
        .finally(() => { if (active) setIsSearching(false); });
    }, 350);

    return () => {
      active = false;
      clearTimeout(timeOutId);
      request?.abort();
    };
  }, [search.value, searchUser]);

  // If dialog active status is false, do not render markup into DOM
  if (!isSearch) return null;

  return (
    /* Clickable background overlay screen mask */
    <Dialog open={isSearch} onClose={searchCloseHandler} fullWidth maxWidth="xs" aria-labelledby="search-title" PaperProps={{ className: "dialog-panel" }}>
      {/* Main Glass Card Modal Window */}
      <div
        onClick={(e) => e.stopPropagation()} // Stop click bubbling up to modal close handler
        className="dialog-content"
      >
        {/* Header Title Grid Matrix */}
        <div className="text-center relative mb-5">
          <h2 id="search-title">
            Find People
          </h2>
          <button 
            onClick={searchCloseHandler}
            aria-label="Close people search"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Textured Dynamic Search Input Box */}
        <div className="relative mb-4 flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none text-sm">
            <SearchIcon size={17} />
          </div>
          <input
            type="text"
            autoFocus
            aria-label="Search people"
            value={search.value}
            onChange={search.changeHandler}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200/80 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm"
            placeholder="Search people..."
          />
        </div>

        {/* --- DYNAMIC USER DISCOVERY LIST --- */}
        {/* The styles object handles structural zero scrollbar visibility seamlessly */}
        <div 
          className="flex-1 overflow-y-auto space-y-2 pr-1"
          style={{
            msOverflowStyle: "none",  /* IE and Edge */
            scrollbarWidth: "none",   /* Firefox */
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Custom element injection script targeting standard Webkit runtimes */}
          <style>{`
            div::-webkit-scrollbar {
              display: none !important;
            }
          `}</style>

          {isSearching ? <p className="sidebar-empty" role="status">Searching...</p> : searchError ? <p role="alert" className="sidebar-empty">{searchError}</p> : users.length > 0 ? (
            users.map((i) => (
              <div 
                key={i._id} 
                className="p-1 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/90 shadow-sm transition-all duration-150"
              >
                <UserItem
                  user={i}
                  handler={addFriendHandler}
                  handlerIsLoading={isLoadingSendFriendRequest}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <Users size={24} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                No people found
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default Search;