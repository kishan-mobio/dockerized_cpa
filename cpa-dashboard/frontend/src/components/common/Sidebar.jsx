"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart3, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { MdPieChart } from "react-icons/md";
import LogoutButton from "../ui/logout-button";
import { NAVIGATION_CONSTANTS } from "@/utils/constants/navigation";
import "../../styles/sidebar.css";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [mastersOpen, setMastersOpen] = useState(false);

  const mastersSubmenu = NAVIGATION_CONSTANTS.MAIN_MENU.MASTERS.SUBMENU;

  // Keep Masters menu open if current pathname matches any of its children
  useEffect(() => {
    const isOnMastersPage = mastersSubmenu.some(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
    );
    setMastersOpen(isOnMastersPage);
  }, [pathname]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div
      className="h-screen shadow-lg w-64 flex flex-col"
      style={{ backgroundColor: NAVIGATION_CONSTANTS.SIDEBAR.COLORS.PRIMARY }}
    >
      {/* Logo Section */}
      <div className="p-6 flex flex-col items-center gap-4 bg-transparent">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="BG Advisors CPA Logo"
            className="h-16 w-auto mr-2"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <nav className="p-4 flex flex-col gap-2 min-h-0">
          {/* ...existing code... */}
          {/* Dashboard */}
          <button
            onClick={() =>
              handleNavigation(NAVIGATION_CONSTANTS.MAIN_MENU.DASHBOARD.PATH)
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-lg mb-2 focus:outline-none focus:ring-2 focus:ring-white/40 ${
              pathname === NAVIGATION_CONSTANTS.MAIN_MENU.DASHBOARD.PATH
                ? `bg-[${NAVIGATION_CONSTANTS.SIDEBAR.COLORS.ACTIVE}] text-white shadow-lg font-bold`
                : `text-white bg-transparent hover:bg-[${NAVIGATION_CONSTANTS.SIDEBAR.COLORS.HOVER}]/80`
            }`}
          >
            <MdPieChart size={22} className="mr-2 text-white" />
            {NAVIGATION_CONSTANTS.MAIN_MENU.DASHBOARD.LABEL}
          </button>

          {/* Masters menu with submenu */}
          <div>
            <button
              onClick={() => setMastersOpen((v) => !v)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-base text-white focus:outline-none focus:ring-2 focus:ring-white/40 ${
                mastersOpen
                  ? "bg-[#4953B8] text-white font-bold"
                  : "hover:bg-[#6C63FF]/80"
              }`}
            >
              <BarChart3 size={20} className="text-white" />
              <span className="font-semibold">
                {NAVIGATION_CONSTANTS.MAIN_MENU.MASTERS.LABEL}
              </span>
              <span className="ml-auto">
                {mastersOpen ? (
                  <ChevronUp size={18} className="text-white" />
                ) : (
                  <ChevronDown size={18} className="text-white" />
                )}
              </span>
            </button>

            {mastersOpen && (
              <div className="ml-2 mt-2 bg-[#4953B8] rounded-xl shadow p-3 flex flex-col gap-2 border border-[#6C63FF]">
                {mastersSubmenu.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    pathname.startsWith(`${item.path}/`);
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      className={`text-white text-base text-left py-2 px-3 rounded transition font-medium hover:bg-[#5F6DF7] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 ${
                        isActive ? "bg-[#5F6DF7] font-bold" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() =>
              handleNavigation(NAVIGATION_CONSTANTS.MAIN_MENU.SETTINGS.PATH)
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-base mt-auto focus:outline-none focus:ring-2 focus:ring-white/40 ${
              pathname === NAVIGATION_CONSTANTS.MAIN_MENU.SETTINGS.PATH
                ? `bg-[${NAVIGATION_CONSTANTS.SIDEBAR.COLORS.SECONDARY}] text-white shadow-lg font-bold`
                : `text-white bg-transparent hover:bg-[${NAVIGATION_CONSTANTS.SIDEBAR.COLORS.HOVER}]/80`
            }`}
          >
            <Settings size={20} className="text-white" />
            {NAVIGATION_CONSTANTS.MAIN_MENU.SETTINGS.LABEL}
          </button>
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-white/20 mt-auto">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
