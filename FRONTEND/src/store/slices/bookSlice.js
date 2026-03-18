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
          headers: { "Content-Type": "multipart/form-data" }, 
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
