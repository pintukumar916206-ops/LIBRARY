import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

// Thunks
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/all");
      return response.data.users;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const addNewAdmin = createAsyncThunk(
  "user/addNewAdmin",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post("/user/add/new/admin", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      dispatch(toggleAddNewAdminPopup());
      return response.data.user; // Assuming backend returns the created user
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add admin");
      return rejectWithValue(error.response?.data?.message || "Failed to add admin");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    users: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD NEW ADMIN
      .addCase(addNewAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
             state.users.push(action.payload);
        }
      })
      .addCase(addNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;