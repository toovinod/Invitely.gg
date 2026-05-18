import { GrainBackdrop } from "@/components/landing/grain-backdrop";
import { LoginCard } from "@/components/login-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Invitely.gg",
  description: "Sign in to Invitely to start sending event invitations",
};

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12">
      <GrainBackdrop />

      <div className="relative w-full max-w-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 bg-linear-to-b from-white/5 to-transparent blur-2xl opacity-50"
        />
        <div className="relative">
          <LoginCard />
        </div>
      </div>
    </main>
  );
}
