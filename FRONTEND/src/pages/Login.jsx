import React, { useEffect } from "react";
import logo from "../assets/LOGO_1.png";
import logo_with_title from "../assets/LOGO_2.png";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { isAuthenticated, error, message, loading } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
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
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <img src={logo} alt="Logo" className="h-44 w-auto" />
            </div>
            <h1 className="text-4xl font-medium text-center mb-2 overflow-hidden">
              WELCOME BACK!
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Enter your email and password to continue.
            </p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-4 border border-black rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  minLength={6}
                  maxLength={15}
                  className="w-full px-4 py-4 border border-black rounded-md focus:outline-none"
                />
              </div>
              <Link to="/password/forgot" className="font-semibold text-black mb-12">
                Forgot Password?
              </Link>
              <div className="block md:hidden font-semibold mt-5">
                <p>
                  New here?{" "}
                  <Link to="/register" className="text-sm text-gray-500 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border mt-5 border-black w-full font-semibold bg-black text-white py-4 rounded-lg hover:bg-white hover:text-black transition"
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center h-full p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[375px]">
            <div className="flex justify-center mb-11">
              <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto" />
            </div>
            <p className="text-gray-300 mb-11">New to our platform? Sign Up.</p>
            <Link
              to="/register"
              className="border mt-5 border-white px-8 w-full font-semibold bg-black text-white py-4 rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
