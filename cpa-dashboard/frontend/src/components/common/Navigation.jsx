"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/methods/cn";
import { LayoutDashboard, Users, FileText, Settings, Zap } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      href: "/listing",
      icon: Users,
    },
    {
      name: "Book Closure",
      href: "/book-closure",
      icon: FileText,
    },
    {
      name: "Integrations",
      href: "/apps-manager",
      icon: Zap,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex space-x-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 mr-2",
                  isActive ? "text-white" : "text-gray-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
