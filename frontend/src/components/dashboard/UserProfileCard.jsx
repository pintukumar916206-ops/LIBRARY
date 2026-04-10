import React from "react";
import PropTypes from "prop-types";
import Avatar from "../../components/Avatar";
const UserProfileCard = ({ user }) => (
  <div className="bg-white p-6 rounded-[1.5rem] border-2 border-black shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),_0_10px_20px_-5px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-5 relative overflow-hidden group h-full">
    <div className="relative">

      <Avatar user={user} size="lg" className="scale-90 ring-4 ring-gray-50 bg-white shadow-xl shadow-black/5" />
      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-black rounded-xl flex items-center justify-center border-2 border-white">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      </div>
    </div>

    <div className="text-center relative z-10 w-full">
      <span className="px-2.5 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-black tracking-[0.2em] rounded-full border border-gray-100 uppercase mb-3 inline-block">
        Verified Account
      </span>
      <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-0.5 uppercase leading-none">
        {user?.name}
      </h2>
      <p className="text-gray-400 text-[10px] font-bold tracking-tight lowercase">
        {user?.email}
      </p>
    </div>
  </div>
);

UserProfileCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
};
export default UserProfileCard;
