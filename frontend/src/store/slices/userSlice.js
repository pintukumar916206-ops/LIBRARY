import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/all");
      return response.data.users;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/user/delete/${id}`);
      toast.success(response.data.message);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/update-role/${id}`, { role });
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user role.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addNewAdmin = createAsyncThunk(
  "user/addNewAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/add/new/admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      return response.data.admin;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add new admin.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    users: [],
  },
  reducers: {
    resetUserSlice(state) {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addNewAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserSlice } = userSlice.actions;

export default userSlice.reducer;