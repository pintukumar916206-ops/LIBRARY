import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, updateProfile } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { resetAuthSlice } from "../store/slices/authSlice";

const SettingPopup = () => {
  const dispatch = useDispatch();
  const { loading, error, message, user } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      dispatch(toggleSettingPopup());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch]);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    dispatch(updatePassword({ currentPassword, newPassword, confirmNewPassword }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center z-[100]">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-xl">
                <img src={settingIcon} alt="Settings" className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">ACCOUNT SETTINGS</h3>
            </div>
            <button 
              onClick={() => dispatch(toggleSettingPopup())}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={closeIcon} alt="Close" className="w-6 h-6" />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* PROFILE UPDATE SECTION */}
            <section>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">
                Public Profile
              </h4>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative group">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:opacity-75 transition-all"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      CHANGE
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white font-black text-xs rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? "SAVING..." : "UPDATE PROFILE"}
                </button>
              </form>
            </section>

            {/* PASSWORD UPDATE SECTION */}
            <section className="md:border-l md:pl-12 border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">
                Security
              </h4>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-lg outline-none transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="6-15 characters"
                    minLength={6}
                    maxLength={15}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-lg outline-none transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-type password"
                    minLength={6}
                    maxLength={15}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-lg outline-none transition-all font-bold text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 border-2 border-black text-black font-black text-xs rounded-xl hover:bg-gray-50 transition-all mt-4"
                >
                  CHANGE PASSWORD
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
