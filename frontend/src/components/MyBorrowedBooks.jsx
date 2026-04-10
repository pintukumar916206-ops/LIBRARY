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

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const [selectedBook, setSelectedBook] = useState(null);

  const {
    userBorrowedBooks = [],
    message,
    error,
  } = useSelector((state) => state.borrow);

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

  const { readBookPopup } = useSelector((state) => state.popup);

  const handleReturn = (borrowId) => {
    if (!user?.email) return;
    dispatch(returnBorrowedBook({ email: user.email, bookId: borrowId }));
  };

  const openReadPopup = (borrowedBook) => {
    if (!borrowedBook.book) {
      console.error("Book missing:", borrowedBook);
      return;
    }
    setSelectedBook(borrowedBook.book);
    setTimeout(() => {
      dispatch(toggleReadBookPopup());
    }, 0);
  };

  const formDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate}  ${formattedTime}`;
    return result;
  };

  const [filter, setFilter] = useState("nonReturned");
  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === true;
  });
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === false;
  });
  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header
          className="flex flex-col gap-3 md:flex-row 
          md:justify-between md:items-center"
        >
          <h2
            className="text-xl font-medium 
          md:text-2xl md:font-semibold"
          >
            BORROWED BOOKS
          </h2>
        </header>

        <header
          className="flex flex-col gap-3 sm:flex-row 
          md:items-center"
        >
          <button
            className={`relative rounded sm:rounded-tr-none 
            sm:rounded-br-none sm:rounded-bl-lg sm:rounded-tl-lg text-center
            border-2 font-semibold py-2 w-full sm:w-72 ${
              filter === "returned"
                ? "bg-black text-white border-black "
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-400 "
            } `}
            onClick={() => setFilter("returned")}
          >
            RETURNED BOOKS
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none 
            sm:rounded-bl-none sm:rounded-br-lg sm:rounded-tr-lg text-center
            border-2 font-semibold py-2 w-full sm:w-72 ${
              filter === "nonReturned"
                ? "bg-black text-white border-black "
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-400 "
            } `}
            onClick={() => setFilter("nonReturned")}
          >
            NON-RETURNED BOOKS
          </button>
        </header>

        {Array.isArray(booksToDisplay) && booksToDisplay.length > 0 ? (
          <div
            className="mt-6 overflow-auto bg-white rounded-md
                shadow:lg"
          >
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">BOOK TITLE</th>
                  <th className="px-4 py-3 text-left">DATE & TIME</th>
                  <th className="px-4 py-3 text-left">DUE DATE</th>
                  <th className="px-4 py-3 text-left text-center">STATUS</th>
                  <th className="px-4 py-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-200" : ""}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold">
                      {book.book?.title || "N/A"}
                    </td>
                    <td className="px-4 py-3">{formDate(book.borrowedAt)}</td>
                    <td className="px-4 py-3">{formDate(book.dueDate)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          book.returned
                            ? "bg-green-100 text-green-800"
                            : new Date() > new Date(book.dueDate)
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {book.returned
                          ? "Returned"
                          : new Date() > new Date(book.dueDate)
                            ? "Overdue"
                            : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center items-center">
                      <button
                        title="Read Online"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => openReadPopup(book)}
                      >
                        <BookA className="w-5 h-5 text-gray-600" />
                      </button>
                      {!book.returned && (
                        <button
                          onClick={() => handleReturn(book._id)}
                          className="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded shadow-md hover:bg-gray-800 transition-all active:scale-95"
                        >
                          RETURN
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filter === "returned" ? (
          <h3 className="text-3xl mt-5 font-medium">NO RETURNED BOOKS FOUND</h3>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            NO NON-RETURNED BOOKS FOUND
          </h3>
        )}
      </main>
      {readBookPopup && selectedBook && <ReadBookPopup book={selectedBook} />}
    </>
  );
};

export default MyBorrowedBooks;
