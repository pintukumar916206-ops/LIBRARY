import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordBorrowedBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";

const RecordBookPopup = () => {
  const dispatch = useDispatch();
  const { recordBookPopupData } = useSelector((state) => state.popup);
  const bookId = recordBookPopupData;

  const [email, setEmail] = useState("");

  const handleRecordBook = async (e) => {
    e.preventDefault();
    if (!bookId) {
      return;
    }
    const resultAction = await dispatch(recordBorrowedBook({ email, bookId }));
    if (recordBorrowedBook.fulfilled.match(resultAction)) {
      dispatch(toggleRecordBookPopup());
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50
      p-5 flex items-center justify-center z-50"
    >
      <div
        className="w-full bg-white rounded-lg shadow-lg
        md:w-1/3 "
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">RECORD BOOK</h3>
          <form onSubmit={handleRecordBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                USER EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER'S EMAIL"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-4 ">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-md 
                hover:bg-gray-400"
                onClick={() => dispatch(toggleRecordBookPopup())}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white 
                rounded-md hover:bg-gray-800"
              >
                RECORD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordBookPopup;
