import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupState {
  settingPopup: boolean;
  addBookPopup: boolean;
  readBookPopup: boolean;
  readBookPopupData: any;
  recordBookPopup: boolean;
  recordBookPopupData: any;
  returnBookPopup: boolean;
  addNewAdminPopup: boolean;
  logoutConfirmPopup: boolean;
}

const initialState: PopupState = {
  settingPopup: false,
  addBookPopup: false,
  readBookPopup: false,
  readBookPopupData: null,
  recordBookPopup: false,
  recordBookPopupData: null,
  returnBookPopup: false,
  addNewAdminPopup: false,
  logoutConfirmPopup: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state, action: PayloadAction<any>) {
      state.readBookPopup = !state.readBookPopup;
      state.readBookPopupData = action.payload ?? null;
    },
    toggleRecordBookPopup(state, action: PayloadAction<any>) {
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
