import React from "react";
import PropTypes from "prop-types";
const DashboardQuote = ({ quote, author = "NEXUS TEAM", theme = "light", className = "" }) => {
  const isDark = theme === "dark";

  return (
    <div className={`hidden xl:flex ${isDark ? "bg-transparent text-white border-none" : "bg-white text-black border border-gray-300"} py-2 min-h-[50px] font-semibold relative w-full justify-center items-center rounded-xl shadow-sm mt-2 shrink-0 ${className}`}>
      <h4 className={`text-center px-4 italic font-medium ${isDark ? "text-indigo-100/90" : "text-black"}`}>
        "{quote}"
      </h4>
      <p className={`absolute right-8 font-bold tracking-widest uppercase text-[9px] ${isDark ? "text-indigo-500/50" : "text-gray-400"}`}>
        ~ Compiled by {author}
      </p>
    </div>
  );
};

DashboardQuote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string,
  theme: PropTypes.string,
  className: PropTypes.string,
};

export default DashboardQuote;
