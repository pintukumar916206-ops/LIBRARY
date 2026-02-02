import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }
    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
    dispatch(toggleAddBookPopup());
  };

  return (
    <>
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
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  BOOK TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="BOOK TITLE"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  BOOK AUTHOR
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="BOOK AUTHOR"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  BOOK PRICE (Price for borrowing)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="BOOK PRICE"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  QUANTITY
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="BOOK QUANTITY"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="BOOK DESCRIPTION"
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  COVER IMAGE
                </label>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end space-x-4 ">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md 
                  hover:bg-gray-400"
                  onClick={() => dispatch(toggleAddBookPopup())}
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white 
                  rounded-md hover:bg-gray-800"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;
