import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllUsers } from "../store/slices/userSlice";
import Header from "../layout/Header";
import PropTypes from "prop-types";

const AdminUsersList = ({ filterMode = "all" }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  let title = "Registered Users";
  let filteredUsers = users ? [...users] : [];

  const getUserLoans = (userId) =>
    (allBorrowedBooks || []).filter((borrow) => borrow.user?.id?.toString() === userId?.toString());

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
    filteredUsers = filteredUsers.filter((u) => getUserLoans(u._id).some((b) => b.returned));
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
        <header className="px-4 md:px-0 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-black md:text-3xl text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none mb-1">
              {title}
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
              Directory & Access Control
            </p>
          </div>
        </header>

        {filteredUsers.length > 0 ? (
          <>
            {}
            <div className="hidden md:block mt-8 overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
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

            {}
            <div className="md:hidden mt-8 space-y-4 px-4 pb-20">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-zinc-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="font-black text-white text-lg tracking-tight leading-none mb-1">
                        {user.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                    <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                      user.role === "Admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-white/5 text-zinc-400 border-white/10"
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Loans</span>
                      <span className="text-white font-black text-xl tabular-nums">
                        {getUserLoans(user._id).filter((b) => !b.returned).length}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Member Since</span>
                      <span className="text-zinc-300 font-bold text-[10px] uppercase">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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

AdminUsersList.propTypes = {
  filterMode: PropTypes.oneOf([
    "all",
    "admin",
    "active_loans",
    "overdue_loans",
    "completed_loans",
    "user",
  ]),
};

export default AdminUsersList;
