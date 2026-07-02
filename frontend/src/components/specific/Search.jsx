import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  // If dialog active status is false, do not render markup into DOM
  if (!isSearch) return null;

  return (
    /* Clickable background overlay screen mask */
    <div 
      onClick={searchCloseHandler}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fadeIn"
    >
      {/* Main Glass Card Modal Window */}
      <div
        onClick={(e) => e.stopPropagation()} // Stop click bubbling up to modal close handler
        className="w-full max-w-md max-h-[75vh] flex flex-col p-6 sm:p-8 rounded-[2.5rem] bg-white/80 border border-white/60 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] text-slate-700 overflow-hidden transform scale-100 transition-all duration-300"
      >
        {/* Header Title Grid Matrix */}
        <div className="text-center relative mb-5">
          <h2 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
            Find People
          </h2>
          <button 
            onClick={searchCloseHandler}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm p-1"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Textured Dynamic Search Input Box */}
        <div className="relative mb-4 flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none text-sm">
            <i className="fas fa-search" />
          </div>
          <input
            type="text"
            value={search.value}
            onChange={search.changeHandler}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200/80 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm"
            placeholder="Search channels or usernames..."
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

          {users.length > 0 ? (
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
                <i className="fas fa-user-astronaut text-lg" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {search.value ? "No connections found" : "Type to scan workspace"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;