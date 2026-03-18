import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Thunks using createAsyncThunk
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const otpVerification = createAsyncThunk(
  "auth/otpVerification",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      // 401 Unauthorized is expected when not logged in, just start clean
      if (error.response?.status === 401) {
          return rejectWithValue(null);
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send forgot password email");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/auth/reset-password/${token}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Reset password failed");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/password/update", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update password failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    user: null,
    message: null,
    isAuthenticated: false,
  },
  reducers: {
    resetAuthSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearError(state) {
        state.error = null;
    },
    clearMessage(state) {
        state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OTP VERIFICATION
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(otpVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        // Don't set global error for getUser failure (silent auth check)
        // unless it's critical, but typically we just clear session
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message; // Ensure backend returns { message: "..." }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Depending on flow, auto-login or ask to login
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthSlice, clearError, clearMessage } = authSlice.actions;

export default authSlice.reducer;