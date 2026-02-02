import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookandMangaManagement from "../components/BookandMangaManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(" ");

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <div
          className="md:hidden z-10 absolute top-4 right-6 
        sm:top-6 flex items-center justify-center bg-black 
        rounded-md h-9 w-9 text-white"
        >
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setSelectedComponent={setSelectedComponent}
        />

        <div className="flex-1 p-6 ">
          {(() => {
            switch (selectedComponent) {
              case "Dashboard":
                return user?.role === "User" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard setSelectedComponent={setSelectedComponent} />
                );
              case "Books":
                return <BookandMangaManagement />;
              case "Catalog":
                if (user.role === "Admin") {
                  return <Catalog />;
                }
                break;
              case "Users":
                if (user.role === "Admin") {
                  return <Users filterMode="all" />;
                }
                break;
              case "Admins":
                if (user.role === "Admin") {
                  return <Users filterMode="admin" />;
                }
                break;
              case "ActiveLoans":
                if (user.role === "Admin") {
                  return <Users filterMode="active_loans" />;
                }
                break;
              case "OverdueLoans":
                if (user.role === "Admin") {
                  return <Users filterMode="overdue_loans" />;
                }
                break;
              case "CompletedLoans":
                if (user.role === "Admin") {
                  return <Users filterMode="completed_loans" />;
                }
                break;
              case "My Borrowed Books":
                return <MyBorrowedBooks />;
              default:
                return user?.role === "User" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard setSelectedComponent={setSelectedComponent} />
                );
            }
          })()}
        </div>
      </div>
    </>
  );
};

export default Home;
