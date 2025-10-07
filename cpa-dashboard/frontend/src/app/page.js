"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader } from "@/components/ui/loading";
import { ROLE_CONSTANTS } from "@/utils/constants";
import { ROUTES } from "@/utils/constants/routes";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        // Redirect based on user role
        if (user?.role?.description === ROLE_CONSTANTS.ROLE_TYPES.SUPER_ADMIN) {
          router.push(ROUTES.LISTING);
        } else {
          router.push(ROUTES.DASHBOARD);
        }
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loader while checking authentication
  if (loading) {
    return <Loader text="Checking authentication..." />;
  }

  // Show loader while redirecting
  return <Loader text="Redirecting..." />;
}
