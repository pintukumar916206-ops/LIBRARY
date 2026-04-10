import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Title, Tooltip, Legend);
const InventoryChart = ({ data, title = "Inventory Status", subtitle = "Distribution", theme = "light" }) => {
  const isDark = theme === "dark";

  const themedData = isDark ? {
    ...data,
    datasets: data.datasets.map(ds => ({
      ...ds,
      backgroundColor: ds.backgroundColor?.map(c => c === "#111111" ? "#ffffff" : c === "#e5e5e5" ? "#27272a" : c),
      borderColor: "#09090b",
      borderWidth: 2,
    }))
  } : data;

  return (
    <div className={`${isDark ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-black text-gray-900"} p-6 rounded-[1.5rem] border-2 shadow-sm h-full min-h-[300px] flex flex-col items-center justify-center group overflow-hidden transition-colors duration-500`}>
      <header className="w-full mb-6">
        <h3 className={`text-[9px] font-black ${isDark ? "text-zinc-500" : "text-gray-400"} tracking-[0.2em] uppercase`}>
          {title}
        </h3>
        <p className="text-[11px] font-bold mt-0.5 uppercase tracking-tight">
          {subtitle}
        </p>
      </header>

      <div className="w-full relative flex-1 flex items-center justify-center min-h-[180px]">
        <div className={`absolute inset-0 ${isDark ? "bg-white/5" : "bg-gray-50/10"} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
        <Doughnut
          data={themedData}
          options={{
            cutout: "75%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  usePointStyle: true,
                  padding: 15,
                  font: { size: 9, weight: "900", family: "Inter" },
                  color: isDark ? "#71717a" : "#9ca3af",
                },
              },
            },
            maintainAspectRatio: false,
            elements: {
              arc: {
                borderWidth: isDark ? 2 : 2,
                borderColor: isDark ? "#18181b" : "#ffffff",
              }
            }
          }}
          className="z-10"
        />
      </div>
    </div>
  );
};

InventoryChart.propTypes = {
  theme: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string),
        borderWidth: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default InventoryChart;
