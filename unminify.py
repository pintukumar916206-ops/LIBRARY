import os
import json

# AdminDashboard.jsx
admin_dashboard = '''import React, { useMemo } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import background from "../assets/background.jpg";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import StatCard from "./dashboard/StatCard";
import InventoryChart from "./dashboard/InventoryChart";
import AdminProfileCard from "./dashboard/AdminProfileCard";
import DashboardQuote from "./dashboard/DashboardQuote";
import PropTypes from "prop-types";

const AdminDashboard = ({ setSelectedComponent }) => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow);

  const stats = useMemo(() => {
    const safeUsers = users || [];
    const safeBorrows = allBorrowedBooks || [];
    const now = new Date();
    const activeBorrows = safeBorrows.filter((b) => !b.returnedAt);

    return {
      totalUsers: safeUsers.filter((u) => u.role === "User").length,
      totalAdmin: safeUsers.filter((u) => u.role === "Admin").length,
      totalBooks: books?.length || 0,
      totalBorrowedBooks: activeBorrows.length,
      activeInsideDueDate: activeBorrows.filter(
        (b) => new Date(b.dueDate) >= now
      ).length,
      overdue: activeBorrows.filter((b) => new Date(b.dueDate) < now).length,
    };
  }, [users, books, allBorrowedBooks]);

  const chartData = useMemo(() => {
    const totalCount = stats.totalBooks || 0;
    const borrowedCount = stats.totalBorrowedBooks || 0;
    const available = Math.max(0, totalCount - borrowedCount);
    const hasData = totalCount > 0;

    return {
      labels: hasData ? ["Available", "Issued"] : ["No Data"],
      datasets: [
        {
          label: "Books",
          data: hasData ? [available, borrowedCount] : [1],
          backgroundColor: hasData ? ["#3D3E3E", "#151619"] : ["#f3f4f6"],
          borderWidth: hasData ? 1 : 0,
        },
      ],
    };
  }, [stats.totalBooks, stats.totalBorrowedBooks]);

  return (
    <>
      <main className="relative w-full p-4 pt-24 bg-[#f8f9fa] transition-all duration-300 font-sans h-auto min-h-screen xl:h-screen flex flex-col xl:overflow-hidden">
        <Header />
        <div className="relative w-full h-24 shrink-0 rounded-2xl overflow-hidden shadow-xl mb-4 group">
          <img
            src={background}
            alt="Library Hero"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center px-10">
            <h1 className="text-white text-3xl font-bold mb-1 tracking-tight">
              ADMIN DASHBOARD
            </h1>
            <p className="text-gray-200 text-xs font-medium tracking-widest uppercase">
              Manage Library Systems
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-auto xl:h-[calc(100vh-200px)] min-h-0">
          <InventoryChart data={chartData} />
          <div className="flex flex-col gap-3 h-full overflow-y-auto">
            <StatCard
              onClick={() => setSelectedComponent("Books")}
              icon={bookIcon}
              count={stats.totalBooks}
              label="Total Collection"
              iconBg="bg-orange-50"
            />
            <StatCard
              onClick={() => setSelectedComponent("Users")}
              icon={usersIcon}
              count={stats.totalUsers}
              label="Registered Users"
              iconBg="bg-indigo-50"
            />
            <StatCard
              onClick={() => setSelectedComponent("Admins")}
              icon={adminIcon}
              count={stats.totalAdmin}
              label="Staff Members"
              iconBg="bg-purple-50"
            />
            <StatCard
              isMinichart
              miniStats={[
                {
                  label: "ACTIVE",
                  value: stats.activeInsideDueDate,
                  onClick: () => setSelectedComponent("ActiveLoans"),
                  link: true,
                },
                {
                  label: "OVERDUE",
                  value: stats.overdue,
                  onClick: () => setSelectedComponent("OverdueLoans"),
                  link: true,
                  color: "text-red-600",
                },
              ]}
              label="Loan Overview"
            />
          </div>
          <AdminProfileCard user={user} />
        </div>
        <DashboardQuote quote="A reader lives a thousand lives before he dies." />
      </main>
    </>
  );
};

AdminDashboard.propTypes = {
  setSelectedComponent: PropTypes.func.isRequired,
};

export default AdminDashboard;
'''

# Write the files
files = {
    'frontend/src/components/AdminDashboard.jsx': admin_dashboard,
}

for filepath, content in files.items():
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Fixed {filepath}")

print("\nAll critical components fixed!")
