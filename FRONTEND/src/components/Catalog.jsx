import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, message, allBorrowedBooks } = useSelector((state) => state.borrow);
  const [filter, setFilter] = useState("borrowed");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const formatDate = (dateString, includeTime = false) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const baseDate = `${day}-${month}-${year}`;
    if (!includeTime) return baseDate;

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${baseDate} ${hours}:${minutes}:${seconds}`;
  };

  const now = new Date();
  const borrowedBooks = allBorrowedBooks?.filter((b) => !b.returnedAt && new Date(b.dueDate) > now);
  const overdueBooks = allBorrowedBooks?.filter((b) => !b.returnedAt && new Date(b.dueDate) <= now);
  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  const openReturnPopup = (bookId, userEmail) => {
    setBorrowedBookId(bookId);
    setEmail(userEmail);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`rounded-lg sm:rounded-r-none border-2 font-bold py-2 w-full sm:w-72 transition-all ${
              filter === "borrowed"
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-500 border-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            ACTIVE LOANS
          </button>
          <button
            className={`rounded-lg sm:rounded-l-none border-2 font-bold py-2 w-full sm:w-72 transition-all ${
              filter === "overdue"
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-500 border-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("overdue")}
          >
            OVERDUE BOOKS
          </button>
        </header>

        {Array.isArray(booksToDisplay) && booksToDisplay.length > 0 ? (
          <div className="mt-8 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest font-bold border-b border-gray-100">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Due Date</th>
                  <th className="px-6 py-4 text-left">Borrowed At</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {booksToDisplay.map((book, index) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{book?.user?.name || "-"}</td>
                    <td className="px-6 py-4 text-gray-500">{book?.user?.email || "-"}</td>
                    <td className="px-6 py-4 font-black">₹{book.price ?? book.book?.price ?? "-"}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{formatDate(book.dueDate)}</td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(book.createdAt, true)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {book.returnedAt ? (
                          <FaSquareCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <button
                            onClick={() => openReturnPopup(book._id, book.user?.email)}
                            className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all"
                            title="Return Book"
                          >
                            <PiKeyReturnBold className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-20 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              No {filter} books recorded
            </h3>
          </div>
        )}
      </main>
      {returnBookPopup && <ReturnBookPopup borrowId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;
