import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50
      p-5 flex items-center justify-center z-50"
    >
      <div
        className="w-11/12 bg-white rounded-lg shadow-lg
        sm:w-1/2 ig:w-1/3 2xl:w-1/3"
      >
        <div
          className="flex justify-between items-center px-6 py-4 
        bg-black text-white rounded-t-lg"
        >
          <h2 className="text-lg font-bold">VIEW BOOK INFO</h2>
          <button
            className="text-white text-lg font-bold"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-800 font-semibold">
              BOOK TITLE
            </label>
            <p
              className="border border-gray-300 rounded-lg px-4 py-2
            bg-gray-100"
            >
              {book?.title}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-semibold">AUTHOR</label>
            <p
              className="border border-gray-300 rounded-lg px-4 py-2
            bg-gray-100"
            >
              {book?.author}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-semibold">
              DESCRIPTION
            </label>
            <p
              className="border border-gray-300 rounded-lg px-4 py-2
            bg-gray-100"
            >
              {book?.description}
            </p>
          </div>
        </div>
        <div
          className=" flex justify-end px-6 py-4 
        bg-gray-100 rounded-b-lg"
        >
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-slate-400"
            type="button" 
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
