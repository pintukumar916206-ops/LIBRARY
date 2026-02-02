import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
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

const BookandMangaManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup,
  );
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

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
    // Default to 8 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 8);
    setSelectedDate(defaultDate.toISOString().split("T")[0]);
  };

  const confirmBorrow = async () => {
    if (!selectedDate) {
      return toast.error("Please select a valid due date");
    }

    try {
      await dispatch(
        recordBorrowedBook({
          email: user.email,
          bookId: selectedBookId,
          dueDate: selectedDate,
        }),
      ).unwrap(); // unwrap to throw error if rejected

      dispatch(fetchAllBooks());
      if (user?.role === "User") {
        dispatch(fetchMyBorrowedBooks());
      }
      setShowDateModal(false);
    } catch (err) {
      console.error("Borrow failed:", err);
      // Toast is already handled by useEffect monitoring borrowSliceError
    }
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    if (isAuthenticated && user?.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }
    if (isAuthenticated && user?.role === "User") {
      dispatch(fetchMyBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBorrowSlice());
    }
  }, [message, borrowSliceMessage, error, borrowSliceError, loading, dispatch]);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };
  const searchedBooks = (books || []).filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword),
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* SUB HEADER */}
        <header
          className="flex flex-col gap-3 
        md:flex-row md:justify-between md:items-center"
        >
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && user.role === "Admin"
              ? "BOOK AND MANGA MANAGEMENT"
              : "BOOKS"}
          </h2>
          <div
            className="flex flex-col lg:flex-row lg:space-y-0
          lg:space-x-4"
          >
            {isAuthenticated && user && user.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center
              items-center py-2 px-4 bg-black text-white rounded-md 
              hover:bg-slate-700"
              >
                <span
                  className="bg-white flex justify-center items-center
                overflow-hidden rounded-full text-black w-[25px] h-[25px]
                text-[27px] absolute left-5"
                >
                  +
                </span>
                ADD NEW BOOK
              </button>
            )}
            <input
              type="text"
              placeholder="SEARCH BOOKS.."
              className="w-full
            sm:w-52 border p-2 border-gray-300 rounded-md"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>
        {/* BOOKS LIST */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="p-4 font-bold">Book Details</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {searchedBooks.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Book Details */}
                  <td className="p-4">
                    <div>
                      <h3
                        className="font-bold text-gray-800 text-base group-hover:text-black transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {book.author}
                      </p>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4">
                    <span className="font-black text-gray-900 text-lg">
                      ₹{book.price}
                    </span>
                  </td>

                  {/* Availability */}
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        book.availability
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.availability ? "Available" : "Out of Stock"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {isAuthenticated && user && user.role === "Admin" && (
                        <>
                          <button
                            onClick={() => openReadPopup(book._id)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600 hover:text-black"
                            title="Read Details"
                          >
                            <BookA size={18} />
                          </button>
                          <button
                            onClick={() =>
                              dispatch(toggleRecordBookPopup(book._id))
                            }
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600 hover:text-black"
                            title="Edit Record"
                          >
                            <NotebookPen size={18} />
                          </button>
                        </>
                      )}

                      {isAuthenticated && user && user.role === "User" && (
                        <button
                          onClick={() => handleBorrowClick(book._id)}
                          disabled={!book.availability}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm ${
                            book.availability
                              ? "bg-black text-white hover:bg-gray-800 active:scale-95"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
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

        {searchedBooks.length === 0 && (
          <h3 className="text-3xl mt-5 font-medium">
            NO BOOKS FOUND IN THE DATABASE
          </h3>
        )}

        {/* DATE SELECTION MODAL */}
        {showDateModal && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4">Select Due Date</h3>
              <p className="text-sm text-gray-500 mb-4">
                When will you return this book?
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded p-2 mb-6"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDateModal(false)}
                  className="px-4 py-2 border border-black text-black font-bold rounded hover:bg-gray-100 transition"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmBorrow}
                  disabled={borrowSliceLoading}
                  className={`px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition shadow-md ${
                    borrowSliceLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {borrowSliceLoading ? "PROCESSING..." : "CONFIRM BORROW"}
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

export default BookandMangaManagement;
