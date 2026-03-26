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
  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "User" ? (
          <UserDashboard setSelectedComponent={setSelectedComponent} />
        ) : (
          <AdminDashboard setSelectedComponent={setSelectedComponent} />
        );
      case "Books":
        return <BookandMangaManagement />;
      case "Catalog":
        return user.role === "Admin" ? <Catalog /> : null;
      case "Users":
        return user.role === "Admin" ? <Users filterMode="all" /> : null;
      case "Admins":
        return user.role === "Admin" ? <Users filterMode="admin" /> : null;
      case "ActiveLoans":
        return user.role === "Admin" ? <Users filterMode="active_loans" /> : null;
      case "OverdueLoans":
        return user.role === "Admin" ? <Users filterMode="overdue_loans" /> : null;
      case "CompletedLoans":
        return user.role === "Admin" ? <Users filterMode="completed_loans" /> : null;
      case "My Borrowed Books":
        return <MyBorrowedBooks />;
      default:
        return user?.role === "User" ? (
          <UserDashboard setSelectedComponent={setSelectedComponent} />
        ) : (
          <AdminDashboard setSelectedComponent={setSelectedComponent} />
        );
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <div className="md:hidden z-[60] absolute top-[28px] right-[20px] flex items-center justify-center bg-black rounded-full h-[55px] w-[55px] text-white">
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
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </>
  );
};

export default Home;
