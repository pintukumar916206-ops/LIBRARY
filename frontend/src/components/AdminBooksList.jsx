import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  fetchMyBorrowedBooks,
  resetBorrowSlice,
  recordBorrowedBook,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import PropTypes from "prop-types";

const AdminBooksList = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector(
    (state) => state.book
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(
    (state) => state.borrow
  );

  const [readBook, setReadBook] = useState({});
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const openReadPopup = (id) => {
    const selectedBook = books.find((book) => book._id === id);
    setReadBook(selectedBook);
    dispatch(toggleReadBookPopup());
  };

  const handleBorrowClick = (id) => {
    setSelectedBookId(id);
    setShowDateModal(true);
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 8);
    setSelectedDate(defaultDate.toISOString().split("T")[0]);
  };

  const confirmBorrow = async () => {
    if (!selectedDate) return toast.error("Please select a valid due date");
    try {
      await dispatch(
        recordBorrowedBook({
          email: user.email,
          bookId: selectedBookId,
          dueDate: selectedDate,
        })
      ).unwrap();
      dispatch(fetchAllBooks());
      if (user?.role === "User") dispatch(fetchMyBorrowedBooks());
      setShowDateModal(false);
    } catch (err) { }
  };

  useEffect(() => {
    if (books && books.length === 0) dispatch(fetchAllBooks());
  }, [dispatch, books?.length]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBorrowSlice());
    }
  }, [message, borrowSliceMessage, error, borrowSliceError, dispatch]);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => setSearchedKeyword(e.target.value.toLowerCase());

  const searchedBooks = (books || []).filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="px-4 md:px-0 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-black md:text-3xl text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none mb-1">
              {user?.role === "Admin" ? "Control Panel" : "Library Catalog"}
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
              Hardware & Asset Inventory
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto mt-4 md:mt-0">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-12 w-full sm:w-48 flex gap-3 justify-center items-center py-2.5 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-black text-[10px] tracking-widest shadow-lg active:scale-95"
              >
                <span className="bg-white flex justify-center items-center rounded-lg text-black w-5 h-5 absolute left-3 text-sm font-black">
                  +
                </span>
                ADD NEW BOOK
              </button>
            )}
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full sm:w-56 border-2 border-gray-100 bg-gray-50/50 p-2.5 rounded-xl focus:border-black focus:bg-white outline-none transition-all text-[11px] font-bold"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {}
        <div className="hidden md:block mt-8 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px] text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black">
                <th className="px-5 py-5">Book Details</th>
                <th className="px-5 py-5">Price</th>
                <th className="px-5 py-5 text-center">Status</th>
                <th className="px-5 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {searchedBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        {book.author}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    <span className="font-black text-gray-900 text-base">₹{book.price}</span>
                  </td>
                  <td className="px-5 py-5 text-center whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${book.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                      {book.availability ? "Available" : "Stock Out"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {isAuthenticated && user?.role === "Admin" && (
                        <>
                          <button
                            onClick={() => openReadPopup(book._id)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-black"
                            title="View Details"
                          >
                            <BookA size={18} />
                          </button>
                          <button
                            onClick={() => dispatch(toggleRecordBookPopup(book._id))}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-black"
                            title="Edit Record"
                          >
                            <NotebookPen size={18} />
                          </button>
                        </>
                      )}
                      {isAuthenticated && user?.role === "User" && (
                        <button
                          onClick={() => handleBorrowClick(book._id)}
                          disabled={!book.availability}
                          className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all shadow-sm ${book.availability
                              ? "bg-black text-white hover:bg-gray-800 active:scale-95"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          {book.availability ? "BORROW" : "UNAVAILABLE"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {}
        <div className="md:hidden mt-8 space-y-4 px-4 pb-20">
          {searchedBooks.map((book) => (
            <div key={book._id} className="bg-zinc-900 border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg tracking-tight leading-tight mb-0.5">
                    {book.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {book.author}
                  </p>
                </div>
                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                  book.availability ? "bg-white/5 text-zinc-300 border-white/10" : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}>
                  {book.availability ? "Ready" : "Offline"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center min-w-[80px]">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Price</span>
                  <span className="text-white font-black text-sm tabular-nums">₹{book.price}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                {isAuthenticated && user?.role === "Admin" && (
                  <>
                    <button
                      onClick={() => openReadPopup(book._id)}
                      className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5"
                    >
                      <BookA size={16} className="opacity-60" />
                      <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                    </button>
                    <button
                      onClick={() => dispatch(toggleRecordBookPopup(book._id))}
                      className="flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl transition-all shadow-lg"
                    >
                      <NotebookPen size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                    </button>
                  </>
                )}
                {isAuthenticated && user?.role === "User" && (
                  <button
                    onClick={() => handleBorrowClick(book._id)}
                    disabled={!book.availability}
                    className={`col-span-2 py-3.5 text-[11px] font-black rounded-2xl transition-all shadow-xl tracking-[0.2em] uppercase ${
                      book.availability
                        ? "bg-white text-black active:scale-95"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    {book.availability ? "Initialize Borrow" : "Locked"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchedBooks.length === 0 && (
          <div className="mt-20 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              No matching books found
            </h3>
          </div>
        )}

        {showDateModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
              <h3 className="text-2xl font-black text-gray-800 mb-2">Return Date</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">
                When will you return this book?
              </p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border-2 border-gray-100 rounded-xl p-3 mb-8 focus:border-black outline-none transition-all font-bold"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDateModal(false)}
                  className="flex-1 py-3 border-2 border-gray-100 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmBorrow}
                  disabled={borrowSliceLoading}
                  className={`flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg text-xs ${borrowSliceLoading ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                    }`}
                >
                  {borrowSliceLoading ? "..." : "CONFIRM"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup />}
    </>
  );
};

export default AdminBooksList;

