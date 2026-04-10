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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-2xl shadow-2xl max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-8">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <img src={keyIcon} alt="Key Icon" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">ADD NEW ADMIN</h3>
              </div>
              <button 
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={closeIcon} alt="Close" className="w-6 h-6" />
              </button>
            </header>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="avatarInput" className="cursor-pointer group relative">
                  <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center border-4 border-gray-100 overflow-hidden shadow-inner group-hover:opacity-75 transition-all">
                    <img
                      src={avatarPreview || placeHolder}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      BROWSE
                    </div>
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

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@library.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  maxLength={15}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  className="flex-1 py-3 bg-gray-100 text-gray-500 font-black text-[10px] uppercase rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 py-3 bg-black text-white font-black text-[10px] uppercase rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 px-8"
                >
                  {loading ? "SAVING..." : "CREATE ADMIN"}
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
