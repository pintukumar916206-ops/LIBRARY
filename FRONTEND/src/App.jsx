import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchAllBorrowedBooks, fetchMyBorrowedBooks } from "./store/slices/borrowSlice";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OTP = lazy(() => import("./pages/OTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks, allBorrowedBooks } = useSelector((state) => state.borrow);
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    if (isAuthChecked && isAuthenticated) {
      if (books.length === 0) {
        dispatch(fetchAllBooks());
      }
      if (user) {
        if (user.role === "User" && userBorrowedBooks.length === 0) {
          dispatch(fetchMyBorrowedBooks());
        }
        if (user.role === "Admin") {
          if (users.length === 0) dispatch(fetchAllUsers());
          if (allBorrowedBooks.length === 0) dispatch(fetchAllBorrowedBooks());
        }
      }
    }
  }, [isAuthChecked, isAuthenticated, user, books.length, userBorrowedBooks.length, users.length, allBorrowedBooks.length, dispatch]);



  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-white">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/otp-verify/:email" element={<OTP />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
        </Routes>
      </Suspense>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
