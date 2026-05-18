"use client";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { signIn } from "@/lib/auth/client/auth-client";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./landing/logo";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/workspace",
      });
    } catch (e) {
      console.log("errir", e);
      toast.error("failed to sign in. please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full border border-white/8 bg-[#050505]/60 backdrop-blur-sm">
      <div className="flex flex-col gap-6 px-6 pt-8 pb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Logo size={32} />
          <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
            Invitely.gg
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Sign in to start sending invitations
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-8">
        <HoverBorderGradient
          containerClassName={`rounded-none w-full ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
          className="rounded-none font-mono text-sm h-11 w-full px-6 bg-black text-white flex items-center justify-center gap-3 cursor-pointer"
          as="button"
          duration={1.5}
          onClick={handleGoogleSignIn}
          aria-disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin border border-foreground border-t-transparent" />
              Signing in...
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </HoverBorderGradient>

        <Separator className="bg-white/8" />

        <p className="text-center font-mono text-xs text-muted-foreground leading-relaxed">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </p>

        <div className="text-center">
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
