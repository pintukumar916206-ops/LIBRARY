import React from "react";
import PropTypes from "prop-types";
import Avatar from "../../components/Avatar";
const AdminProfileCard = ({ user, theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-black text-gray-900"} p-6 pt-12 rounded-[1.5rem] border-2 shadow-sm flex flex-col items-center justify-center gap-5 relative h-full transition-colors duration-500`}>
      <div className="relative w-fit h-fit mb-2">
        <Avatar 
          user={user} 
          size="admin" 
          className={`ring-4 ${isDark ? "ring-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40" : "ring-gray-50 bg-white shadow-xl shadow-black/5"}`} 
        />
        <div className={`absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-7 h-7 ${isDark ? "bg-white border-zinc-900" : "bg-black border-white"} rounded-xl flex items-center justify-center border-2 z-20`}>
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
        </div>
      </div>

      <div className="text-center relative z-10 w-full">
        <span className={`px-2.5 py-0.5 ${isDark ? "bg-white/5 text-zinc-300 border border-white/10" : "bg-black text-white"} text-[9px] font-black tracking-[0.2em] rounded-full uppercase mb-3 inline-block shadow-lg`}>
          System {user?.role}
        </span>
        <h2 className={`text-xl font-black tracking-tighter mb-0.5 uppercase leading-none ${isDark ? "text-white" : "text-gray-900"}`}>
          {user?.name}
        </h2>
        <p className={`${isDark ? "text-zinc-500" : "text-gray-400"} text-[10px] font-bold tracking-tight lowercase`}>
          {user?.email}
        </p>
      </div>

      <div className={`grid grid-cols-2 gap-3 w-full pt-4 border-t ${isDark ? "border-white/5" : "border-gray-50"}`}>
        <div className={`text-center p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
          <p className={`${isDark ? "text-zinc-600" : "text-gray-400"} text-[8px] font-black uppercase tracking-widest mb-1`}>
            Authority
          </p>
          <p className={`${isDark ? "text-white" : "text-gray-900"} font-black text-[11px] uppercase leading-none`}>Elevated</p>
        </div>
        <div className={`text-center border-l p-2 rounded-xl transition-colors ${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-50 hover:bg-gray-50"}`}>
          <p className={`${isDark ? "text-zinc-600" : "text-gray-400"} text-[8px] font-black uppercase tracking-widest mb-1`}>
            Registered
          </p>
          <p className={`${isDark ? "text-white" : "text-gray-900"} font-black text-[11px] tabular-nums leading-none`}>
            {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

AdminProfileCard.propTypes = {
  theme: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

export default AdminProfileCard;
