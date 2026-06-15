"use client";

import Link from "next/link";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#060709] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <LoginCard />
      </div>
    </main>
  );
}
