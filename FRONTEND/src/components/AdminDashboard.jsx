import React, { useMemo } from "react";
import adminIcon from "../assets/pointing.png";
import { ExternalLink } from "lucide-react";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import background from "../assets/background.jpg";
import avatarImage from "../assets/PROFILE-PICTURE.png";
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

  const chartData = useMemo(() => {
    const totalBooks = stats.totalBooks || 0;
    const borrowedBooks = stats.totalBorrowedBooks || 0;

    // Calculate derived categories
    const available = Math.max(0, totalBooks - borrowedBooks);
    const issued = borrowedBooks;

    const hasData = totalBooks > 0 || borrowedBooks > 0;

    return {
      labels: hasData ? ["Available Books", "Issued Books"] : ["NO DATA"],
      datasets: [
        {
          label: "Books",
          data: hasData ? [available, issued] : [1],
          backgroundColor: hasData ? ["#3D3E3E", "#151619"] : ["#f3f4f6"],
          borderWidth: hasData ? 1 : 0,
        },
      ],
    };
  }, [stats.totalBooks, stats.totalBorrowedBooks]);

  return (
    <>
      <main
        className="relative w-full p-4 pt-24 bg-[#f8f9fa] 
      transition-all duration-300 font-sans h-auto min-h-screen xl:h-screen 
      flex flex-col xl:overflow-hidden"
      >
        <Header />

        <div
          className="relative w-full h-24 shrink-0 rounded-2xl overflow-hidden 
        shadow-xl mb-4 group"
        >
          <img
            src={background}
            alt="Library Hero"
            className="w-full h-full object-cover transition-transform 
            duration-1000 
            group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/90 
          via-black/50 to-transparent flex flex-col justify-center px-10"
          >
            <h1
              className="text-white text-3xl font-bold mb-1 
            drop-shadow-xl tracking-tight bg-transparent border-b border-black 
            inline-block"
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

        <div
          className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-auto 
        xl:h-[calc(100vh-200px)] min-h-0"
        >
          <div className="flex flex-col h-full">
            <div
              className="bg-white p-3 rounded-2xl shadow-lg h-full flex 
                flex-col justify-center items-center w-full border 
                border-gray-300"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">
                BOOK STATISTICS
              </h3>
              <div
                className="w-full flex justify-center items-center flex-1 
              min-h-[200px] relative h-[250px]"
              >
                <Pie
                  data={chartData}
                  options={{
                    cutout: 0,
                    maintainAspectRatio: false,
                  }}
                  className="w-full max-h-[250px]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full overflow-y-auto text-xs">
            {/* TOTAL BOOKS */}
            <div
              onClick={() => setSelectedComponent("Books")}
              className="bg-white p-3 rounded-xl shadow-sm border 
                border-gray-300 hover:shadow-md hover:-translate-y-1 
                transition-all 
                duration-300 group cursor-pointer relative overflow-hidden 
                h-full flex flex-col justify-center"
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
                <h3
                  className="text-gray-500 font-bold text-[9px] 
                tracking-widest uppercase"
                >
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
                <h3
                  className="text-gray-500 font-bold text-[9px] 
                tracking-widest uppercase"
                >
                  TOTAL USERS
                </h3>
              </div>
            </div>

            {/* TOTAL ADMINS */}
            <div
              onClick={() => setSelectedComponent("Admins")}
              className="bg-white p-3 rounded-xl shadow-sm border 
                border-gray-300 hover:shadow-md hover:-translate-y-1 
                transition-all 
                duration-300 group cursor-pointer relative overflow-hidden 
                h-full flex flex-col justify-center"
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
                <h3
                  className="text-gray-500 font-bold text-[9px] 
                tracking-widest uppercase"
                >
                  ADMINS
                </h3>
              </div>
            </div>

            {/* STATS CARD */}
            <div
              className="text-gray-900 bg-white p-3 rounded-xl shadow-sm 
              border border-gray-300
            hover:shadow-md transition-all duration-300 group cursor-pointer 
            flex 
            flex-col justify-center relative overflow-hidden w-full h-full"
            >
              <div className="flex justify-between items-center w-full px-1 mb-1">
                <div
                  className="text-center"
                  onClick={() => setSelectedComponent("ActiveLoans")}
                >
                  <p
                    className="text-gray-600 text-[9px] uppercase 
                  tracking-widest mb-1"
                  >
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
                  <p
                    className="text-gray-400 text-[9px] uppercase 
                  tracking-widest mb-1"
                  >
                    OVERDUE{" "}
                    <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                  </p>
                  <p className="text-xl font-black">{stats.overdue}</p>
                </div>
              </div>
              <h3
                className="text-gray-500 font-bold text-[9px] 
              tracking-widest uppercase text-center w-full"
              >
                STATS CARD
              </h3>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div
              className="group flex items-center justify-center w-full 
            mx-auto h-full bg-white p-5 rounded-2xl shadow-sm border 
            border-gray-300 relative overflow-hidden hover:shadow-xl 
            transition-all duration-300"
            >
              <div
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b 
              from-gray-50 to-transparent"
              ></div>

              <div
                className="flex flex-col justify-center items-center gap-6 
              w-full relative z-10"
              >
                <div className="relative">
                  <div
                    className="p-1 bg-white rounded-full shadow-lg 
                  border-[3px] border-gray-200"
                  >
                    <img
                      src={avatarImage}
                      alt="avatar"
                      className="rounded-full w-32 h-32 object-cover 
                      transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className="absolute bottom-2 right-2 bg-gray-900 
                  w-4 h-4 border-2 border-white rounded-full"
                  ></div>
                </div>

                <div className="text-center w-full">
                  <span
                    className="inline-block px-3 py-0.5 rounded-full 
                  bg-black text-white text-[9px] font-bold tracking-widest 
                  uppercase mb-2 shadow-md"
                  >
                    {user?.role || "Administrator"}
                  </span>
                  <h2
                    className="text-xl 2xl:text-2xl font-black text-gray-800 
                  mb-0.5"
                  >
                    {user && user.name}
                  </h2>
                  <p className="text-gray-500 text-xs font-medium mb-4">
                    {user?.email || "admin@example.com"}
                  </p>

                  <div
                    className="grid grid-cols-2 gap-3 w-full border-t 
                  border-gray-100 pt-4"
                  >
                    <div
                      className="text-center group-hover:bg-gray-50 
                    rounded-lg p-1.5 transition-colors"
                    >
                      <p
                        className="text-[9px] text-gray-400 font-bold 
                      uppercase tracking-wider"
                      >
                        STATUS
                      </p>
                      <p className="text-black font-bold text-xs">ACTIVE</p>
                    </div>
                    <div
                      className="text-center border-l border-gray-100 
                    group-hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                    >
                      <p
                        className="text-[9px] text-gray-400 font-bold 
                      uppercase tracking-wider"
                      >
                        JOINED
                      </p>
                      <p className="text-black font-bold text-xs">
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
          className="hidden xl:flex bg-white text-base py-2 min-h-[50px] 
          font-semibold relative w-full
            justify-center items-center rounded-xl shadow-sm border 
            border-gray-300 mt-2 shrink-0"
        >
          <h4 className="text-center px-4 text-black italic">
            "A reader lives a thousand lives before he dies."
          </h4>
          <p
            className="text-gray-400 text-xs absolute right-6 font-bold 
          uppercase"
          >
            ~ NEXUS TEAM
          </p>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
