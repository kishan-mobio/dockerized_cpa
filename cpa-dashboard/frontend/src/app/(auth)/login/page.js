"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { login } from "@/redux/Thunks/Authentication";
import { clearError } from "@/redux/Slice/Authentication";

import { useToast } from "@/components/ui/toast";
import { AUTH_CONSTANTS } from "@/utils/constants/auth";
import "../auth.css";

import { COMMON_CONSTANTS as CONST, ROLE_CONSTANTS } from "@/utils/constants";
import { ROUTES } from "@/utils/constants/routes";
import Loader from "@/components/ui/loading";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { addToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const user = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap(); // 🔹 gives you the actual `user` object
      if (user.role?.description === ROLE_CONSTANTS.ROLE_TYPES.SUPER_ADMIN) {
        router.push(ROUTES.LISTING);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
      addToast(AUTH_CONSTANTS.SUCCESS.LOGIN, CONST.TOAST_TYPE.SUCCESS);
    } catch (errorMessage) {
      // failure

      addToast(errorMessage, CONST.TOAST_TYPE.ERROR);
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setIsLoggingIn(true);

    // Basic form validation
    if (!formData.email || !formData.password) {
      addToast(
        AUTH_CONSTANTS.VALIDATION.EMAIL_REQUIRED,
        CONST.TOAST_TYPE.ERROR
      );
      addToast(
        AUTH_CONSTANTS.VALIDATION.EMAIL_REQUIRED,
        CONST.TOAST_TYPE.ERROR
      );

      setIsLoggingIn(false);
      return;
    }

    // Email validation
    if (!AUTH_CONSTANTS.PATTERNS.EMAIL.test(formData.email)) {
      addToast(AUTH_CONSTANTS.VALIDATION.INVALID_EMAIL, CONST.TOAST_TYPE.ERROR);
      setIsLoggingIn(false);
      return;
    }

    await handleLogin();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Show loader while logging in
  if (loading || isLoggingIn) {
    return <Loader text={AUTH_CONSTANTS.LOADING.SIGNING_IN} />;
  }

  return (
    <div className="min-h-screen flex auth-layout">
      {/* Left Column */}
      <div
        className="left-column flex flex-col justify-start items-start px-10 py-8 relative"
        style={{
          background: "linear-gradient(135deg, #5B4DF7 0%, #6A5BFF 100%)",
          minWidth: 380,
        }}
      >
        {/* Logo */}
        <Image
          src={AUTH_CONSTANTS.IMAGES.LOGO}
          alt={AUTH_CONSTANTS.BRANDING.COMPANY_NAME}
          width={120}
          height={90}
          className="mb-2"
          priority
        />
        {/* Centered Login Illustration */}
        <div
          className="flex-1 w-full flex items-start justify-center z-10"
          style={{ minHeight: 400 }}
        >
          <Image
            src={AUTH_CONSTANTS.IMAGES.LOGIN_ILLUSTRATION}
            alt="Login Illustration"
            width={540}
            height={540}
            className="object-contain"
            priority={false}
          />
        </div>
        {/* Subtle Frame background */}
        <Image
          src={AUTH_CONSTANTS.IMAGES.BACKGROUND}
          alt="Frame Background"
          fill
          style={{
            objectFit: "cover",
            opacity: 0.12,
            zIndex: 0,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          className="pointer-events-none select-none"
        />
      </div>

      {/* Right Column */}
      <div className="right-column bg-white">
        {/* Header outside form container */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {AUTH_CONSTANTS.LOGIN.PAGE_TITLE}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {AUTH_CONSTANTS.LOGIN.PAGE_SUBTITLE}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-xl form-container w-full max-w-md">
          <div className="login-form">
            {/* Email / Username Field */}
            <div className="mb-6 w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                {AUTH_CONSTANTS.LABELS.EMAIL}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={AUTH_CONSTANTS.PLACEHOLDERS.EMAIL}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                {AUTH_CONSTANTS.LABELS.PASSWORD}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={AUTH_CONSTANTS.PLACEHOLDERS.PASSWORD}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6 w-full">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  {AUTH_CONSTANTS.LABELS.REMEMBER_ME}
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || isLoggingIn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-6"
            >
              {loading || isLoggingIn
                ? AUTH_CONSTANTS.BUTTONS.SIGNING_IN
                : AUTH_CONSTANTS.BUTTONS.LOGIN}
            </button>

            {/* Support Contact */}
            <div className="text-center mb-2 w-full">
              <p className="text-sm text-gray-600">
                {AUTH_CONSTANTS.SUPPORT.NEED_HELP}{" "}
                <a
                  href={`mailto:${AUTH_CONSTANTS.SUPPORT.EMAIL}`}
                  className="text-blue-600 hover:text-blue-500"
                >
                  {AUTH_CONSTANTS.SUPPORT.EMAIL}
                </a>
              </p>
            </div>

            {/* SSL Encryption */}
            <div className="flex items-center justify-center text-sm mb-4 w-full text-gray-500">
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {AUTH_CONSTANTS.SUPPORT.SSL_MESSAGE}
            </div>

            {/* Attribution */}
            <div className="w-full flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Image
                  src={AUTH_CONSTANTS.IMAGES.PROVIDER_LOGO}
                  alt={AUTH_CONSTANTS.BRANDING.PROVIDER_LOGO_ALT}
                  width={64}
                  height={64}
                  className="h-8 w-auto mr-2"
                />
                <span
                  className="text-[#8A94A6] text-xl font-normal"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {AUTH_CONSTANTS.BRANDING.POWERED_BY}{" "}
                  <span className="font-medium">
                    {AUTH_CONSTANTS.BRANDING.PROVIDER}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
