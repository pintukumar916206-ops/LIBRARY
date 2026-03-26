import React, { useState } from "react";
import placeHolder from "../assets/PROFILE-PICTURE.png";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <header className="flex items-center justify-between mb-7 pb-5 border-b border-black">
              <div className="flex items-center gap-3">
                <img src={keyIcon} alt="Key Icon" className="bg-gray-300 p-5 rounded-lg" />
                <h3 className="text-xl font-bold">ADD NEW ADMIN</h3>
              </div>
              <img
                src={closeIcon}
                alt="Close"
                className="cursor-pointer"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              />
            </header>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="avatarInput" className="cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center">
                    <img
                      src={avatarPreview || placeHolder}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (6–15 characters)"
                  minLength={6}
                  maxLength={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
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

export default AddNewAdmin;
