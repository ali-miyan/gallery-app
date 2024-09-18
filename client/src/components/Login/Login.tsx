import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../pages/validation";
import { notifyError, notifySuccess } from "../../pages/Toast";
import { useLoginUserMutation } from "../../store/reducers/userSlice";

const Login = () => {
  const [userLogin, { isLoading }] = useLoginUserMutation();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    serverError: "",
  });

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(
      !errors.email &&
        !errors.password &&
        state.email !== "" &&
        state.password !== ""
    );
  }, [state, errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));

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
      const response = await userLogin({
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

      localStorage.setItem("token", response.data.token);

      location.href = "/home";
      notifySuccess(response.data.message);
    } catch (error) {
      notifyError("something went Wrong");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e0026] via-[#5d1670] to-[#1e0026]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#2a0036] rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className=" text-3xl font-bold text-[#e6c0ff]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#b388cc]">
            Please sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.serverError && (
            <div className="text-center text-[#ff9999] bg-[#4d0000] p-3 rounded-md">
              {errors.serverError}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-2">
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
              disabled={isLoading || !formValid}
              className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5d1670] hover:bg-[#32123b] focus:outline-none  transition-colors duration-200" ${
                !formValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? "loading..." : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-[#b388cc]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#d9a6ff] hover:text-[#e6c0ff]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
