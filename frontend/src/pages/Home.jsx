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
import { ROLES } from "../utils/constants";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;

  const renderContent = () => {
    const role = user?.role?.toLowerCase();
    if (selectedComponent === "" || selectedComponent === "Dashboard") {
      return role === ROLES.ADMIN ? (
        <AdminDashboard setSelectedComponent={setSelectedComponent} />
      ) : (
        <UserDashboard setSelectedComponent={setSelectedComponent} />
      );
    }
    switch (selectedComponent) {
      case "Books": return <BookandMangaManagement />;
      case "Catalog": return <Catalog />;
      case "Users": return <Users filterMode="all" />;
      case "Admins": return <Users filterMode="admin" />;
      case "ActiveLoans": return <Users filterMode="active_loans" />;
      case "OverdueLoans": return <Users filterMode="overdue_loans" />;
      case "CompletedLoans": return <Users filterMode="completed_loans" />;
      case "My Borrowed Books": return role === ROLES.USER ? <MyBorrowedBooks /> : null;
      default:
        return role === ROLES.ADMIN ? (
          <AdminDashboard setSelectedComponent={setSelectedComponent} />
        ) : (
          <UserDashboard setSelectedComponent={setSelectedComponent} />
        );
    }
  };

  return (
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
  );
};

export default Home;
