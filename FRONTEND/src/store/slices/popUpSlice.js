import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,

    readBookPopup: false,
    readBookPopupData: null,

    recordBookPopup: false,
    recordBookPopupData: null,

    returnBookPopup: false,
    addNewAdminPopup: false,
    logoutConfirmPopup: false,
  },

  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },

    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },

    toggleReadBookPopup(state, action) {
      state.readBookPopup = !state.readBookPopup;
      state.readBookPopupData = action.payload ?? null;
    },

    toggleRecordBookPopup(state, action) {
      state.recordBookPopup = !state.recordBookPopup;
      state.recordBookPopupData = action.payload ?? null;
    },

    toggleReturnBookPopup(state) {
      state.returnBookPopup = !state.returnBookPopup;
    },

    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },

    toggleLogoutConfirmPopup(state) {
      state.logoutConfirmPopup = !state.logoutConfirmPopup;
    },

    closeAllPopups(state) {
      state.settingPopup = false;
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.readBookPopupData = null;
      state.recordBookPopup = false;
      state.recordBookPopupData = null;
      state.returnBookPopup = false;
      state.addNewAdminPopup = false;
      state.logoutConfirmPopup = false;
    },
  },
});

export const {
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  toggleLogoutConfirmPopup,
  closeAllPopups,
} = popupSlice.actions;

export default popupSlice.reducer;
