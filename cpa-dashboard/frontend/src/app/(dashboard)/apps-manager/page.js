"use client";

import Header from "@/components/common/Header";
import AppsManager from "@/components/apps-manager/AppsManager";

export default function AppsManagerPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header clientLogo="/clientLogo.png" />
      <main className="p-6">
        <AppsManager />
      </main>
    </div>
  );
} 