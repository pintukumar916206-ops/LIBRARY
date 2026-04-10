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
      ).unwrap();

      dispatch(fetchAllBooks());
      if (user?.role === "User") {
        dispatch(fetchMyBorrowedBooks());
      }
      setShowDateModal(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (books && books.length === 0) {
      dispatch(fetchAllBooks());
    }
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
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-bold md:text-2xl text-gray-800 uppercase tracking-tight">
            {user?.role === "Admin" ? "Book Management" : "Library Catalog"}
          </h2>
          <div className="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-all font-bold text-xs"
              >
                <span className="bg-white flex justify-center items-center rounded-full text-black w-6 h-6 absolute left-5 text-lg">
                  +
                </span>
                ADD NEW BOOK
              </button>
            )}
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
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

                  <td className="px-6 py-4">
                    <span className="font-black text-gray-900 text-lg">₹{book.price}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${
                        book.availability
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
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
                          className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all shadow-sm ${
                            book.availability
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
                  className={`flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg text-xs ${
                    borrowSliceLoading ? "opacity-50 cursor-not-allowed" : "active:scale-95"
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

export default BookandMangaManagement;
