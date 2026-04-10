import React from "react";
import PropTypes from "prop-types";
import { ExternalLink } from "lucide-react";
const StatCard = ({
  onClick,
  icon,
  count,
  label,
  colorClass = "bg-white",
  iconBg = "bg-gray-50",
  isMinichart = false,
  miniStats = [],
}) => (
  <div
    onClick={onClick}
    className={`${colorClass} p-3 rounded-2xl border-2 border-black/20 shadow-sm hover:shadow-white/5 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col w-full max-w-[240px] mx-auto`}
  >
    {icon && (
      <div className="absolute -top-1 -right-1 p-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
        <img src={icon} alt="bg" className="w-12 h-12 grayscale" />
      </div>
    )}

    <div className="relative z-10">
      {isMinichart ? (
        <div className="flex justify-between items-center w-full px-1">
          {miniStats.map((s, i) => (
            <React.Fragment key={i}>
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation();
                  s.onClick();
                }}
              >
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5 flex items-center">
                  {s.label}{" "}
                  {s.link && (
                    <ExternalLink className="w-2 h-2 ml-1 opacity-30 group-hover:opacity-100 transition-opacity" />
                  )}
                </p>
                <p className={`text-lg font-black tracking-tighter ${s.color || ""}`}>{s.value}</p>
              </div>
              {i < miniStats.length - 1 && <div className="w-px h-6 bg-white/10 mx-2" />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 flex items-center justify-center ${iconBg} rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 shadow-inner`}
          >
            {icon ? (
              <img src={icon} alt={label} className="w-4 h-4 group-hover:invert transition-all" />
            ) : (
              <div className="w-4 h-4 bg-gray-200/20 rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter tabular-nums leading-none mb-0.5">
              {count}
            </span>
            <h3 className="text-gray-400 font-black text-[7px] tracking-[0.1em] uppercase">
              {label}
            </h3>
          </div>
        </div>
      )}
    </div>
  </div>
);

StatCard.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string.isRequired,
  colorClass: PropTypes.string,
  iconBg: PropTypes.string,
  isMinichart: PropTypes.bool,
  miniStats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      onClick: PropTypes.func,
      link: PropTypes.bool,
      color: PropTypes.string,
    })
  ),
};
export default StatCard;
