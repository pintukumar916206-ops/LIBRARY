import { useState, useEffect } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      setCurrentDate(now.toLocaleDateString("en-IN", options));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute top-0 
    bg-white/70 backdrop-blur-md w-[calc(100%-85px)] md:w-full py-3 px-6 left-0 shadow-sm 
    md:rounded-none border-b border-white/50 flex justify-between items-center z-50"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <motion.img
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          src={userIcon}
          alt="user icon"
          className="w-9 h-9 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        />
        <div className="flex flex-col">
          <span
            className="text-sm font-bold text-gray-800
          sm:text-lg lg:text-xl tracking-tight"
          >
            {user?.name}
          </span>
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
            {user?.role}
          </span>
        </div>
      </motion.div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden md:flex items-center gap-4"
      >
        <div
          className="flex flex-col text-xs 
        lg:text-sm items-end font-semibold text-gray-600"
        >
          <span className="tracking-widest">{currentTime}</span>
          <span className="text-gray-400">{currentDate}</span>
        </div>
        <span className="bg-gray-300 h-8 w-[1px] mx-2 rounded-full" />
        <motion.img
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={settingIcon}
          alt="setting icon"
          className="w-7 h-7 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => dispatch(toggleSettingPopup())}
        />
      </motion.div>
    </motion.header>
  );
};

export default Header;
