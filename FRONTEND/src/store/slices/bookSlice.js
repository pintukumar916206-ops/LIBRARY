import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

// Thunks
export const fetchAllBooks = createAsyncThunk(
  "book/fetchAllBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/bookandmanga/all");
      return response.data.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const addBook = createAsyncThunk(
  "book/addBook",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/bookandmanga/admin/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type for files if needed, or application/json for raw data. Original used application/json but param name formData suggests multipart? Let's check original. Original used application/json.
          // Correcting to application/json based on original code, unless formData implies actual FormData object.
          // If the input is standard JSON object, use application/json.
        }
      );
      toast.success(response.data.message);
      return response.data.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add book"
      );
    }
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    resetBookSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL BOOKS
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD BOOK
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookSlice } = bookSlice.actions;

export default bookSlice.reducer;
