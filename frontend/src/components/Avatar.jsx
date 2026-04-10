import React from "react";
import { motion } from "framer-motion";

const Avatar = ({ user, size = "md", className = "" }) => {
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const colors = [
    "bg-gray-900",
    "bg-slate-800",
    "bg-zinc-800",
    "bg-neutral-800",
  ];

  const colorIndex = user?.name ? user.name.length % colors.length : 0;
  const bgColor = colors[colorIndex];

  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-32 h-32 text-4xl 2xl:w-40 2xl:h-40 2xl:text-5xl",
    admin: "w-32 h-32 text-4xl",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (user?.avatar?.url) {
    return (
      <motion.img
        src={user.avatar.url}
        alt={user.name}
        className={`${selectedSize} rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${selectedSize} rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-white tracking-widest ${bgColor} ${className}`}
    >
      {getInitial(user?.name)}
    </motion.div>
  );
};

export default Avatar;
