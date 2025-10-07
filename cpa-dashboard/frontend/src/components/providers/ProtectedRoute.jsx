"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader } from "@/components/ui/loading";
import tokenStorage from "@/lib/tokenStorage.js";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const getUserRole = () => user?.role || null;
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated using token storage
      const isUserAuthenticated =
        tokenStorage.isAuthenticated() && !tokenStorage.isAccessTokenExpired();

      if (!isUserAuthenticated) {
        router.push("/login");
        return;
      }

      // Check role if required
      if (requiredRole) {
        const userRole = getUserRole();
        if (userRole !== requiredRole) {
          if (userRole === "admin") {
            router.push("/listing");
          } else {
            router.push("/dashboard");
          }
          return;
        }
      }
    }
  }, [user, loading, isAuthenticated, requiredRole, router, getUserRole]);

  if (loading) {
    return <Loader text="Checking authentication..." />;
  }

  // Check authentication using token storage
  const isUserAuthenticated =
    tokenStorage.isAuthenticated() && !tokenStorage.isAccessTokenExpired();

  if (!isUserAuthenticated) {
    return <Loader text="Redirecting to login..." />; // Will redirect to login
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    return <Loader text="Redirecting..." />; // Will redirect based on role
  }

  return children;
}
