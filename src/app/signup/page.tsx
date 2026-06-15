"use client";

import SignupCard from "@/components/auth/SignupCard";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#060709] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <SignupCard />
      </div>
    </main>
  );
}
