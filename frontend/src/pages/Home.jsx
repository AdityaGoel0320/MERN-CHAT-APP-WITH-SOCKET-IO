import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { MessageCircle, Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsSearch } from "../redux/reducers/misc";

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div className="inbox-empty">
      <div className="empty-illustration">
        <MessageCircle size={56} strokeWidth={1.3} />
        <span className="empty-message-line" />
        <span className="empty-message-line short" />
      </div>
      <p className="eyebrow">YOUR WORKSPACE</p>
      <h1>Good conversations start here.</h1>
      <button
        className="primary-button"
        onClick={() => dispatch(setIsSearch(true))}
      >
        <Search size={18} />
        Find people
      </button>
    </div>
  );
};

export default AppLayout()(Home);
