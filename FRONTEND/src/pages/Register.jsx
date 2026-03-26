import React, { useEffect, useState } from "react";
import logo from "../assets/LOGO_1.png";
import logo_with_title from "../assets/LOGO_2.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { isAuthenticated, error, message, loading } = useSelector(
    (state) => state.auth
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (message) {
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verify/${email}`);
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
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[375px]">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto" />
            </div>
            <p className="text-gray-300 mb-12">Already have an account? Sign in.</p>
            <Link
              to="/login"
              className="border-2 rounded-lg py-2 font-semibold border-white px-8 hover:bg-white hover:text-black transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 overflow-hidden">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-2">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
                <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
                <img src={logo} alt="logo" className="h-44 w-auto object-cover" />
              </div>
            </div>
            <p className="text-gray-800 text-center mb-12">
              Fill in your details to create an account.
            </p>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-4 border border-black rounded-md focus:outline-none"
                />
              </div>
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
              <div className="block md:hidden font-semibold mt-5">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-sm text-gray-500 underline">
                    Sign In
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border mt-5 border-black w-full font-semibold bg-black text-white py-4 rounded-lg hover:bg-white hover:text-black transition"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
