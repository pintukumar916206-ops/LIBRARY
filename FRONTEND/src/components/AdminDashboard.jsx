import React, { useMemo } from "react";
import adminIcon from "../assets/pointing.png";
import { ExternalLink } from "lucide-react";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import background from "../assets/background.jpg";
import avatarImage from "../assets/PINTU_KUMAR_.jpg";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";

import { useSelector } from "react-redux";
import Header from "../layout/Header";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const AdminDashboard = ({ setSelectedComponent }) => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow);

  const stats = useMemo(() => {
    const safeUsers = users || [];
    const safeBooks = allBorrowedBooks || [];
    const now = new Date();

    const activeBooks = safeBooks.filter((b) => !b.returnedAt);

    return {
      totalUsers: safeUsers.filter((u) => u.role === "User").length,
      totalAdmin: safeUsers.filter((u) => u.role === "Admin").length,
      totalBooks: books?.length || 0,
      totalBorrowedBooks: activeBooks.length,
      totalReturnedBooks: safeBooks.filter((b) => !!b.returnedAt).length,
      activeInsideDueDate: activeBooks.filter((b) => new Date(b.dueDate) >= now)
        .length,
      overdue: activeBooks.filter((b) => new Date(b.dueDate) < now).length,
    };
  }, [users, books, allBorrowedBooks]);

  const chartData = useMemo(
    () => ({
      labels: ["ACTIVE", "OVERDUE"],
      datasets: [
        {
          label: "Loans",
          data: [stats.activeInsideDueDate, stats.overdue],
          backgroundColor: ["#D1D5DB", "#000000"],
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    }),
    [stats.activeInsideDueDate, stats.overdue],
  );

  return (
    <>
      <main
        className="relative w-full p-4 pt-20 bg-[#f8f9fa] 
      transition-all duration-300 font-sans h-screen flex flex-col overflow-hidden"
      >
        <Header />

        {/* Hero Section */}
        <div
          className="relative w-full h-32 shrink-0 rounded-2xl overflow-hidden 
        shadow-xl mb-4 group"
        >
          <img
            src={background}
            alt="Library Hero"
            className="w-full h-full object-cover transition-transform duration-1000 
            group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/90 
          via-black/50 to-transparent flex flex-col justify-center px-8"
          >
            <h1
              className="text-white text-3xl font-bold mb-1 
            drop-shadow-xl tracking-tight bg-transparent border-b border-black inline-block"
            >
              ADMIN DASHBOARD
            </h1>
            <p
              className="text-gray-200 text-sm font-light 
            drop-shadow-md leading-relaxed"
            >
              MANAGE YOUR LIBRARY
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="flex flex-col h-full">
            <div
              className="bg-white p-5 rounded-2xl shadow-lg h-full flex 
                flex-col justify-center items-center w-full border border-gray-300"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">
                BOOK STATISTICS
              </h3>
              <div className="w-full flex justify-center items-center flex-1 min-h-[300px]">
                <Pie
                  data={chartData}
                  options={{
                    cutout: 0,
                    maintainAspectRatio: false,
                  }}
                  className="w-full max-h-[300px]"
                />
              </div>
            </div>
          </div>

          {/* Stats List */}
          <div className="flex flex-col gap-3 h-full overflow-y-auto text-xs">
            {/* TOTAL BOOKS */}
            <div
              onClick={() => setSelectedComponent("Books")}
              className="bg-white p-3 rounded-xl shadow-sm border 
                border-gray-300 hover:shadow-md hover:-translate-y-1 transition-all 
                duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-center"
            >
              <div
                className="absolute top-0 right-0 p-2 opacity-5 
                  group-hover:opacity-10 transition-opacity"
              >
                <img src={bookIcon} alt="bg-icon" className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="p-1.5 bg-orange-50 rounded-lg 
                      group-hover:bg-gray-500 group-hover:text-white 
                      transition-colors duration-300"
                  >
                    <img
                      src={bookIcon}
                      alt="books"
                      className="w-4 h-4 group-hover:invert transition-all"
                    />
                  </div>
                  <span className="text-xl font-black text-gray-800">
                    {stats.totalBooks}
                  </span>
                </div>
                <h3 className="text-gray-500 font-bold text-[9px] tracking-widest uppercase">
                  TOTAL BOOKS
                </h3>
              </div>
            </div>

            {/* TOTAL USERS */}
            <div
              onClick={() => setSelectedComponent("Users")}
              className="bg-white p-3 rounded-xl shadow-sm border 
                border-gray-300 hover:shadow-md hover:-translate-y-1 
                transition-all duration-300 group cursor-pointer relative 
                overflow-hidden h-full flex flex-col justify-center"
            >
              <div
                className="absolute top-0 right-0 p-2 opacity-5 
                  group-hover:opacity-10 transition-opacity"
              >
                <img src={usersIcon} alt="bg-icon" className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="p-1.5 bg-indigo-50 rounded-lg 
                      group-hover:bg-gray-500 group-hover:text-white 
                      transition-colors duration-300"
                  >
                    <img
                      src={usersIcon}
                      alt="users"
                      className="w-4 h-4 group-hover:invert transition-all"
                    />
                  </div>
                  <span className="text-xl font-black text-gray-800">
                    {stats.totalUsers}
                  </span>
                </div>
                <h3 className="text-gray-500 font-bold text-[9px] tracking-widest uppercase">
                  TOTAL USERS
                </h3>
              </div>
            </div>

            {/* TOTAL ADMINS */}
            <div
              onClick={() => setSelectedComponent("Admins")}
              className="bg-white p-3 rounded-xl shadow-sm border 
                border-gray-300 hover:shadow-md hover:-translate-y-1 transition-all 
                duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-center"
            >
              <div
                className="absolute top-0 right-0 p-2 opacity-5 
                  group-hover:opacity-10 transition-opacity"
              >
                <img src={adminIcon} alt="bg-icon" className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="p-1.5 bg-purple-50 rounded-lg 
                      group-hover:bg-gray-500 group-hover:text-white 
                      transition-colors duration-300"
                  >
                    <img
                      src={adminIcon}
                      alt="admin"
                      className="w-4 h-4 group-hover:invert transition-all"
                    />
                  </div>
                  <span className="text-xl font-black text-gray-800">
                    {stats.totalAdmin}
                  </span>
                </div>
                <h3 className="text-gray-500 font-bold text-[9px] tracking-widest uppercase">
                  ADMINS
                </h3>
              </div>
            </div>

            {/* STATS CARD */}
            <div
              className="text-gray-900 bg-white p-3 rounded-xl shadow-sm border border-gray-300
            hover:shadow-md transition-all duration-300 group cursor-pointer flex 
            flex-col justify-center relative overflow-hidden w-full h-full"
            >
              <div className="flex justify-between items-center w-full px-1 mb-1">
                <div
                  className="text-center"
                  onClick={() => setSelectedComponent("ActiveLoans")}
                >
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">
                    ACTIVE{" "}
                    <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                  </p>
                  <p className="text-xl font-black">
                    {stats.activeInsideDueDate}
                  </p>
                </div>
                <div className="w-px bg-gray-200 h-6"></div>
                <div
                  className="text-center"
                  onClick={() => setSelectedComponent("OverdueLoans")}
                >
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1">
                    OVERDUE{" "}
                    <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                  </p>
                  <p className="text-xl font-black">{stats.overdue}</p>
                </div>
              </div>
              <h3 className="text-gray-500 font-bold text-[9px] tracking-widest uppercase text-center w-full">
                STATS CARD
              </h3>
            </div>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col h-full">
            <div
              className="group flex items-center justify-center w-full 
            mx-auto h-full bg-white p-5 rounded-2xl shadow-sm border 
            border-gray-300 relative overflow-hidden hover:shadow-xl 
            transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>

              <div className="flex flex-col justify-center items-center gap-6 w-full relative z-10">
                <div className="relative">
                  <div className="p-1 bg-white rounded-full shadow-lg">
                    <img
                      src={user?.avatar?.url || avatarImage}
                      alt="avatar"
                      className="rounded-full w-40 h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-gray-900 w-5 h-5 border-4 border-white rounded-full"></div>
                </div>

                <div className="text-center w-full">
                  <span className="inline-block px-4 py-1 rounded-full bg-black text-white text-[10px] font-bold tracking-widest uppercase mb-3 shadow-md">
                    {user?.role || "Administrator"}
                  </span>
                  <h2 className="text-2xl 2xl:text-3xl font-black text-gray-800 mb-1">
                    {user && user.name}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mb-6">
                    {user?.email || "admin@example.com"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 w-full border-t border-gray-100 pt-6">
                    <div className="text-center group-hover:bg-gray-50 rounded-lg p-2 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        STATUS
                      </p>
                      <p className="text-black font-bold text-sm">ACTIVE</p>
                    </div>
                    <div className="text-center border-l border-gray-100 group-hover:bg-gray-50 rounded-lg p-2 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        JOINED
                      </p>
                      <p className="text-black font-bold text-sm">
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div
          className="hidden xl:flex bg-white text-base py-3 min-h-[60px] font-semibold relative w-full
            justify-center items-center rounded-xl shadow-sm border 
            border-gray-300 mt-4 shrink-0"
        >
          <h4 className="text-center px-4 text-black italic">
            "A reader lives a thousand lives before he dies."
          </h4>
          <p className="text-gray-400 text-xs absolute right-6 font-bold uppercase">
            ~ Bookworm Team
          </p>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
