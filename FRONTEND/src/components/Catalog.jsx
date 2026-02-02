import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, message, allBorrowedBooks } = useSelector(
    (state) => state.borrow,
  );

  const [filter, setFilter] = useState("borrowed");

  const formDateAndTime = (timeStamp) => {
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

  const formDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  const [email, setEmail] = useState();
  const [borrowedBookId, setBorrowedBookId] = useState();

  const openReadBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
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
  }, [loading, error, dispatch]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* SUB HEADER */}

        <header
          className="flex flex-col gap-3 sm:flex-row 
          md:items-center"
        >
          <button
            className={`relative rounded sm:rounded-tr-none 
            sm:rounded-br-none sm:rounded-bl-lg sm:rounded-tl-lg text-center
            border-2 font-semibold py-2 w-full sm:w-72 ${
              filter === "borrowed"
                ? "bg-black text-white border-black "
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-400 "
            } `}
            onClick={() => setFilter("borrowed")}
          >
            BORROWED BOOKS
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none 
            sm:rounded-bl-none sm:rounded-br-lg sm:rounded-tr-lg text-center
            border-2 font-semibold py-2 w-full sm:w-72 ${
              filter === "overdue"
                ? "bg-black text-white border-black "
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-400 "
            } `}
            onClick={() => setFilter("overdue")}
          >
            OVERDUE BOOKS
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
                  <th className="px-4 py-3 text-left">USERNAME</th>
                  <th className="px-4 py-3 text-left">EMAIL</th>
                  <th className="px-4 py-3 text-left">PRICE</th>
                  <th className="px-4 py-3 text-left">DUE - DATE</th>
                  <th className="px-4 py-3 text-left">DATE & TIME</th>
                  <th className="px-4 py-3 text-left">RETURN</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-200" : ""}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{book?.user?.name || "-"}</td>
                    <td className="px-4 py-3">{book?.user?.email || "-"}</td>
                    <td className="px-4 py-3">
                      {book.price ?? book.book?.price ?? "-"}
                    </td>
                    <td className="px-4 py-3">{formDate(book.dueDate)}</td>
                    <td className="px-4 py-3">
                      {formDateAndTime(book.createdAt)}
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center items-center">
                      {book.returnedAt ? (
                        <FaSquareCheck className="w-6 h-6" />
                      ) : (
                        <PiKeyReturnBold
                          onClick={() =>
                            openReadBookPopup(book._id, book.user?.email)
                          }
                          className="w-6 h-6"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            NO {filter === "borrowed" ? "BORROWED" : "OVERDUE"} BOOKS FOUND.
          </h3>
        )}
      </main>
      {returnBookPopup && <ReturnBookPopup borrowId={borrowedBookId} email={email}/>}
    </>
  );
};

export default Catalog;
