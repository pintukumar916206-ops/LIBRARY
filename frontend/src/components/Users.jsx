import React from "react";
import { useSelector } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllUsers } from "../store/slices/userSlice";
import Header from "../layout/Header";

const Users = ({ filterMode = "all" }) => {
  const { users } = useSelector((state) => state.user);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  let title = "Registered Users";
  let filteredUsers = users ? [...users] : [];

  const getUserLoans = (userId) => {
    return (allBorrowedBooks || []).filter(
      (borrow) => borrow.user?.id?.toString() === userId?.toString()
    );
  };

  if (filterMode === "admin") {
    title = "Administrators";
    filteredUsers = filteredUsers.filter((u) => u.role === "Admin");
  } else if (filterMode === "active_loans") {
    title = "Users with Active Loans";
    filteredUsers = filteredUsers.filter((u) => {
      const activeLoans = getUserLoans(u._id).filter((b) => !b.returned);
      return activeLoans.length > 0;
    });
  } else if (filterMode === "overdue_loans") {
    title = "Users with Overdue Loans";
    filteredUsers = filteredUsers.filter((u) => {
      const overdueLoans = getUserLoans(u._id).filter(
        (b) => !b.returned && new Date(b.dueDate) < new Date()
      );
      return overdueLoans.length > 0;
    });
  } else if (filterMode === "completed_loans") {
    title = "Users with Completed Loans";
    filteredUsers = filteredUsers.filter((u) => {
      return getUserLoans(u._id).some((b) => b.returned);
    });
  } else {
    filteredUsers = filteredUsers.filter((u) => u.role === "User");
  }

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-bold md:text-2xl text-gray-800 uppercase tracking-tight">
            {title}
          </h2>
        </header>

        {filteredUsers.length > 0 ? (
          <div className="mt-8 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest font-bold border-b border-gray-100">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-center">Active Loans</th>
                  <th className="px-6 py-4 text-center">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                        user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-black">
                      {getUserLoans(user._id).filter((b) => !b.returned).length}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-20 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              No users found in this category
            </h3>
          </div>
        )}
      </main>
    </>
  );
};

export default Users;
