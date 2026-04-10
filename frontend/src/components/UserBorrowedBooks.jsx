import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import {
  fetchMyBorrowedBooks,
  returnBorrowedBook,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReadBookPopup from "../popups/ReadBookPopup";
import { toast } from "react-toastify";
import { formatDate, formatDateTime } from "../utils/dateHelpers";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [selectedBook, setSelectedBook] = useState(null);
  const { userBorrowedBooks = [], message, error } = useSelector((s) => s.borrow);
  const { readBookPopup } = useSelector((s) => s.popup);
  const [filter, setFilter] = useState("nonReturned");

  useEffect(() => {
    dispatch(fetchMyBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetBorrowSlice());
      dispatch(fetchMyBorrowedBooks());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  const handleReturn = (id) => {
    if (!user?.email) return;
    dispatch(returnBorrowedBook({ email: user.email, bookId: id }));
  };

  const openReadPopup = (b) => {
    if (!b.book) return;
    setSelectedBook(b.book);
    setTimeout(() => dispatch(toggleReadBookPopup()), 0);
  };

  const booksToDisplay = userBorrowedBooks?.filter((b) =>
    filter === "returned" ? b.returned : !b.returned
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-bold md:text-2xl tracking-tight">MY BORROWED BOOKS</h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row mb-8">
          <button
            className={`px-6 py-2 rounded-lg border-2 font-bold transition-all ${
              filter === "returned"
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-500 border-gray-100"
            }`}
            onClick={() => setFilter("returned")}
          >
            RETURNED
          </button>
          <button
            className={`px-6 py-2 rounded-lg border-2 font-bold transition-all ${
              filter === "nonReturned"
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-500 border-gray-100"
            }`}
            onClick={() => setFilter("nonReturned")}
          >
            ACTIVE
          </button>
        </header>

        {booksToDisplay?.length > 0 ? (
          <div className="overflow-hidden bg-white rounded-xl border-2 border-black shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),_0_10px_20px_-5px_rgba(0,0,0,0.04)]">

            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Borrowed</th>
                  <th className="px-6 py-4 text-left">Due Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {booksToDisplay.map((b, i) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{b.book?.title || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDateTime(b.borrowedAt)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(b.dueDate)}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                          b.returned
                            ? "bg-green-100 text-green-700"
                            : new Date() > new Date(b.dueDate)
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.returned
                          ? "Returned"
                          : new Date() > new Date(b.dueDate)
                            ? "Overdue"
                            : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => openReadPopup(b)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                        title="Read Online"
                      >
                        <BookA size={18} />
                      </button>
                      {!b.returned && (
                        <button
                          onClick={() => handleReturn(b._id)}
                          className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-md hover:bg-gray-800 transition-all uppercase tracking-widest"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              No books found
            </h3>
          </div>
        )}
      </main>
      {readBookPopup && selectedBook && <ReadBookPopup book={selectedBook} />}
    </>
  );
};

export default MyBorrowedBooks;
