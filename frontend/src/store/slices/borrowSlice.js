import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchMyBorrowedBooks = createAsyncThunk(
  "borrow/fetchMyBorrowedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/borrow/my-borrowed-books");
      return response.data.borrowedBooks;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch borrowed books.";
      console.error("fetchMyBorrowedBooks Error:", error);
      return rejectWithValue(message);
    }
  }
);

export const fetchAllBorrowedBooks = createAsyncThunk(
  "borrow/fetchAllBorrowedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/borrow/borrowed-books-by-users");
      return response.data.borrowedBooks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all borrowed books.");
    }
  }
);

export const recordBorrowedBook = createAsyncThunk(
  "borrow/recordBorrowedBook",
  async ({ email, bookId, dueDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/borrow/record-borrow-book/${bookId}`,
        { email, dueDate }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to record borrow.");
    }
  }
);

export const returnBorrowedBook = createAsyncThunk(
  "borrow/returnBorrowedBook",
  async ({ email, bookId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/borrow/return/${bookId}`, { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to return book.");
    }
  }
);

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchMyBorrowedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.userBorrowedBooks = action.payload;
      })
      .addCase(fetchMyBorrowedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBorrowedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBorrowedBooks = action.payload;
      })
      .addCase(fetchAllBorrowedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(recordBorrowedBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(recordBorrowedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(recordBorrowedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(returnBorrowedBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBorrowedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(returnBorrowedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBorrowSlice } = borrowSlice.actions;

export default borrowSlice.reducer;
