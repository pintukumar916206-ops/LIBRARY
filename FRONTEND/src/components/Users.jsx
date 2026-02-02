import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import { use } from "react";

const Users = ({ filterMode = "all" }) => {
  const { users } = useSelector((state) => state.user);

  let title = "REGISTERED USERS";
  let filteredUsers = users ? [...users] : [];

  if (filterMode === "admin") {
    title = "ADMINISTRATORS";
    filteredUsers = filteredUsers.filter((u) => u.role === "Admin");
  } else if (filterMode === "active_loans") {
    title = "USERS WITH ACTIVE LOANS";
    filteredUsers = filteredUsers.filter((u) => {
      // Check if user has any borrowed book that is NOT returned and INSIDE due date
      return (
        Array.isArray(u?.borrowedBook) &&
        u.borrowedBook.some(
          (b) => !b.returned && new Date(b.dueDate) >= new Date(),
        )
      );
    });
  } else if (filterMode === "overdue_loans") {
    title = "USERS WITH OVERDUE LOANS";
    filteredUsers = filteredUsers.filter((u) => {
      // Check if user has any borrowed book that is NOT returned and PASSED due date
      return (
        Array.isArray(u?.borrowedBook) &&
        u.borrowedBook.some(
          (b) => !b.returned && new Date(b.dueDate) < new Date(),
        )
      );
    });
  } else if (filterMode === "completed_loans") {
    title = "USERS WITH COMPLETED LOANS";
    filteredUsers = filteredUsers.filter((u) => {
      // Check if user has any borrowed book that IS returned
      return (
        Array.isArray(u?.borrowedBook) && u.borrowedBook.some((b) => b.returned)
      );
    });
  } else {
    filteredUsers = filteredUsers.filter((u) => u.role === "User");
  }

  const formDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate}  ${formattedTime}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* SUB HEADER */}
        <header
          className="flex flex-col gap-3 md:flex-row md:justify-between
        md:items-center "
        >
          <h2
            className="text-xl font-medium md:text-2xl
            md:font-semibold uppercase"
          >
            {title}
          </h2>
        </header>
        {/* TABLE */}
        {filteredUsers.length > 0 ? (
          <div
            className="mt-6 bg-white overflow-auto rounded-md 
          shadow-lg"
          >
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ROLE</th>
                  <th className="px-4 py-2 text-center">
                    NO. OF BOOKS BORROWED
                  </th>
                  <th className="px-4 py-2 text-center">REGISTER DATE</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-200" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 text-center ">
                      {Array.isArray(user?.borrowedBook)
                        ? user.borrowedBook.filter((b) => !b.returned).length
                        : 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">NO RECORDS FOUND</h3>
        )}
      </main>
    </>
  );
};

export default Users;
