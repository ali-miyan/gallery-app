import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../pages/Toast";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../pages/validation";
import { useRegisterPostMutation } from "../../store/reducers/userSlice";

const SignupForm = () => {
  const navigate = useNavigate();
  const [userRegister] = useRegisterPostMutation();

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    serverError: "",
  });

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(
      !errors.name &&
        !errors.email &&
        !errors.password &&
        state.name !== "" &&
        state.email !== "" &&
        state.password !== ""
    );
  }, [state, errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      setErrors((prev) => ({
        ...prev,
        name: validateName(value),
      }));
    }

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userRegister({
        name: state.name,
        email: state.email,
        password: state.password,
      });

      if (!response.data.status) {
        setErrors((prev) => ({
          ...prev,
          serverError: response.data.message,
        }));
        return;
      }

      notifySuccess(response.data.message);
      navigate("/");
    } catch (error) {
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e0026] via-[#5d1670] to-[#1e0026]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#2a0036] rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#e6c0ff]">Create Account</h2>
          <p className="mt-2 text-sm text-[#b388cc]">
            Please sign up for a new account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.serverError && (
            <div className="text-center text-[#ff9999] bg-[#4d0000] p-3 rounded-md">
              {errors.serverError}
            </div>
          )}
          <div className="rounded-md shadow-sm">
            <div className="mb-1">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#7b2690] placeholder-[#9a6baf] text-[#e6c0ff] rounded-md focus:outline-none focus:ring-[#8f35a5] focus:border-[#8f35a5] focus:z-10 sm:text-sm bg-[#3b004d]"
                placeholder="Full Name"
                value={state.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-xs text-[#ff9999]">{errors.name}</p>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#7b2690] placeholder-[#9a6baf] text-[#e6c0ff] rounded-md focus:outline-none focus:ring-[#8f35a5] focus:border-[#8f35a5] focus:z-10 sm:text-sm bg-[#3b004d]"
                placeholder="Email address"
                value={state.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-xs text-[#ff9999]">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none  relative block w-full px-3 py-2 border border-[#7b2690] placeholder-[#9a6baf] text-[#e6c0ff] rounded-md focus:outline-none focus:ring-[#8f35a5] focus:border-[#8f35a5] focus:z-10 sm:text-sm bg-[#3b004d]"
                placeholder="Password"
                value={state.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-xs text-[#ff9999]">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!formValid}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8f35a5] hover:bg-[#a13dbd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b84dd2] ${
                !formValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-[#b388cc]">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-medium text-[#d9a6ff] hover:text-[#e6c0ff]"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
