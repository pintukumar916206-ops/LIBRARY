import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { useEffect } from "react";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  fetchMyBorrowedBooks,
} from "./store/slices/borrowSlice";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const REGISTER = React.lazy(() => import("./pages/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const OTP = React.lazy(() => import("./pages/OTP"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only fetch user if not already authenticated to avoid loops
    if (!isAuthenticated) {
      dispatch(getUser());
    }
    dispatch(fetchAllBooks());
  }, [dispatch]); // Initial check on mount

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "User") {
        dispatch(fetchMyBorrowedBooks());
      }
      if (user?.role === "Admin") {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBorrowedBooks());
      }
    }
  }, [isAuthenticated, user?.role, dispatch]);

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
          <Route path="/register" element={<REGISTER />} />
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
