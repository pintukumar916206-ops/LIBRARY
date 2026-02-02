import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import { fetchMyBorrowedBooks } from "../store/slices/borrowSlice";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const [selectedBook, setSelectedBook] = useState(null);

  const { userBorrowedBooks = [] } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchMyBorrowedBooks());
  }, [dispatch]);

  const { readBookPopup } = useSelector((state) => state.popup);

  const openReadPopup = (borrowedBook) => {
    if (!borrowedBook.book) {
      console.error("Book missing:", borrowedBook);
      return;
    }
    setSelectedBook(borrowedBook.book);
    // open popup AFTER book is set
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

        {/* SUB HEADER */}

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
                  <th className="px-4 py-3 text-left">RETURNED</th>
                  <th className="px-4 py-3 text-left">VIEW</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-200" : ""}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{book.book?.title || "N/A"}</td>
                    <td className="px-4 py-3">{formDate(book.borrowedAt)}</td>
                    <td className="px-4 py-3">{formDate(book.dueDate)}</td>
                    <td className="px-4 py-3">
                      {book.returned ? "YES" : "NO"}
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center items-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book)}
                      />
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
