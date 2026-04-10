import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchMyBorrowedBooks, fetchAllBorrowedBooks } from "./store/slices/borrowSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
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
  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    if (isAuthChecked && isAuthenticated && user) {
      const role = user.role?.toLowerCase();
      dispatch(fetchAllBooks());
      if (role === "user") {
        dispatch(fetchMyBorrowedBooks());
      } else if (role === "admin") {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBorrowedBooks());
      }
    }
  }, [isAuthChecked, isAuthenticated, user, dispatch]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="w-8 h-8 border-4 border-t-white border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

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
