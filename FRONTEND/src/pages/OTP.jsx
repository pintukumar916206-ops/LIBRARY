import React from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { isAuthenticated, user, error, message, loading } = useSelector(
    (state) => state.auth,
  );
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, loading, isAuthenticated]);
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div
        className="h-screen flex flex-col items-center justify-center
        md:flex-row "
      >
        {/* LEFT SIDE */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center 
        p-8 relative overflow-hidden"
        >
          <Link
            to={"/register"}
            className="border-2 border-black
          rounded-3xl font-bold w-55 py-2 px-10 fixed top-10 -left-5
          hover:bg-black hover:text-white transition 
          duration-300 text-end"
          >
            BACK
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div
                className="rounded-full flex items-center 
              justify-center  "
              >
                <img src={logo} alt="Logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1
              className="text-4xl font-medium text-center 
            mb-12 overflow-hidden"
            >
              Check Your Email
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter the OTP sent to your email
            </p>
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full px-4 py-4 border border-black rounded-md
                  focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="border mt-5 border-black w-full
              font-semibold bg-black text-white py-4 
              rounded-lg hover:bg-white hover:text-black transition"
              >
                VERIFY
              </button>
            </form>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-black text-white
        md:flex flex-col items-center justify-center h-full p-8
        rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[375px]">
            <div className="flex justify-center mb-11">
              <img src={logo_with_title} alt="Logo" className="mb-12 h-44
              w-auto" />
            </div>
            <p className="text-gray-300 mb-11" >New to our platform? Sign Up.</p>
            <Link
              to={"/register"}
              className="border mt-5 border-white px-8 w-full
              font-semibold bg-black text-white py-4 
              rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
