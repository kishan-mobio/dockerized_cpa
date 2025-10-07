"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Don't show sidebar on login and dashboard pages
  const shouldShowSidebar = pathname !== "/login" && pathname !== "/dashboard";

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowSidebar ? (
        <div className="flex h-screen">
          <div className="h-full">
            <Sidebar />
          </div>
          <div className="flex-1 h-full overflow-auto bg-gray-100">
            <main className="p-8">{children}</main>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
