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
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Record Book</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Book Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter Author"
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Price (Borrowing)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter Price"
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter Quantity"
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-bold text-[10px] uppercase mb-1">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full px-4 py-2 border-2 border-black rounded-md font-bold"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-100 font-bold text-xs uppercase rounded-md hover:bg-gray-200"
                  onClick={() => dispatch(toggleAddBookPopup())}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white font-bold text-xs uppercase rounded-md hover:bg-gray-800 shadow-md transition-all active:scale-95"
                >
                  Add Book
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
