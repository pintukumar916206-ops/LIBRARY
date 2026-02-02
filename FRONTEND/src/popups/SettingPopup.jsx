import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { resetAuthSlice } from "../store/slices/authSlice";

const SettingPopup = () => {
  console.log("SETTING POPUP RENDERED");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

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

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    );
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-50
      p-5 flex items-center justify-center z-50"
      >
        <div
          className="w-full bg-white rounded-lg shadow-lg
        sm:w-auto ig:w-1/2 2xl:w-1/3"
        >
          <div className="p-6">
            <header
              className="flex items-center justify-between mb-7 pb-5
                border-b-[1px] border-black "
            >
              <div className=" flex items-center gap-3">
                <img
                  src={settingIcon}
                  alt="SETTING-ICON"
                  className="bg-gray-300
                    p-5 rounded-lg"
                />
                <h3 className="text-xl font-bold">CHANGE CREDENTIAL</h3>
              </div>
              <img
                src={closeIcon}
                alt="CLOSE-ICON"
                onClick={() => dispatch(toggleSettingPopup())}
              />
            </header>
            <form onSubmit={handleUpdatePassword}>
              {/* CURRENT_PASSWORD */}
              <div className="mb-4 sm:flex gap-4 items-center">
                <label className="block text-gray-900 font-medium w-full">
                  ENTER CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="CURRENT PASSWORD"
                  className="w-full
                      px-4 py-2 border border-gray-300 rounded-md "
                />
              </div>

              {/* ENTER_NEW_PASSWORD */}
              <div className="mb-4 sm:flex gap-4 items-center">
                <label className="block text-gray-900 font-medium w-full">
                  ENTER NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="ENTER NEW PASSWORD"
                  className="w-full
                      px-4 py-2 border border-gray-300 rounded-md "
                />
              </div>

              {/*CONFIRM_NEW_PASSWORD_INPUT */}
              <div className="mb-4 sm:flex gap-4 items-center">
                <label className="block text-gray-900 font-medium w-full">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="CONFIRM NEW PASSWORD"
                  className="w-full
                      px-4 py-2 border border-gray-300 rounded-md "
                />
              </div>

              {/* SUBMIT_BUTTON */}
              {/* <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  className="px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  CLOSE
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  ADD
                </button>
              </div> */}

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => dispatch(toggleSettingPopup())}
                  className="px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  CONFIRM
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
