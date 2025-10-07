"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokenStorage from "@/lib/tokenStorage";
import { getInitials } from "@/utils/methods/formatters";

export default function Header({ filters, clientLogo }) {
  const router = useRouter();
  const [userName, setUserName] = useState("John Doe");
  const [role, setRole] = useState("Admin");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const user = tokenStorage.getUserData();
    const name = user?.name || "John Doe";
    const userRole = user?.role?.name || "Admin";

    setUserName(name);
    setRole(userRole);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <img
            src="/advisorLogo.png"
            alt="BG Advisors CPA Logo"
            className="h-12 w-auto mr-3"
          />

          <div className="h-10 border-l border-gray-300 mx-1"></div>
          {clientLogo ? (
            <img
              src={clientLogo}
              alt="Client Logo"
              className="h-12 w-auto mr-3"
            />
          ) : (
            <div className="text-2xl font-bold text-[#1A2341] ml-3">
              CPA Pro
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-6">
          {/*  Filters Component */}
          {filters && <div className="mr-4">{filters}</div>}
        </div>

        {/* User Profile Dropdown */}
        <div
          className="relative flex items-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowProfileDropdown((v) => !v);
            }
          }}
          ref={profileRef}
          onClick={() => setShowProfileDropdown((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-[#222] border border-gray-300 shadow-sm">
              {getInitials(userName)}
            </span>
            <div className="flex flex-col cursor-pointer gap-0.5">
              <span className="font-semibold text-[#222] text-base leading-tight">
                {userName}
              </span>
              <span className="text-sm text-gray-400 leading-tight">
                {role}
              </span>
            </div>
            <svg
              className="w-4 h-4 text-gray-400 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  /* handle profile */ setShowProfileDropdown(false);
                }}
              >
                Profile
              </button>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setShowProfileDropdown(false);
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
