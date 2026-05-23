"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 px-6 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center gap-8">
          {/*<span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase px-3 py-1.5 border border-white/8 bg-white/2">
            AI powered invitation platform
          </span>*/}

          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight text-balance max-w-3xl">
            Send <span className="text-muted-foreground">Invitations</span> At
            Scale
            <br />
            On Your <span className="text-muted-foreground">Behalf.</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
            Stop manual emailing. Give us your list, and we&apos;ll handle the
            rest. Professional, automated, and sent on your behalf.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <HoverBorderGradient
                containerClassName="rounded-none"
                className="rounded-none font-mono text-sm px-7 h-11 gap-2 bg-black text-white flex items-center cursor-pointer"
                as="button"
                duration={1.5}
              >
                Get Started
              </HoverBorderGradient>
            </Link>
            <Link
              href="https://github.com/Vinodbiradar09/Invitely.gg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="font-mono text-sm px-6 h-11 gap-2 rounded-none text-muted-foreground hover:text-foreground border-white/8 hover:border-white/15 hover:bg-white/3 transition-all duration-300 cursor-pointer"
              >
                <GitHubIcon />
                Open Source
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-4xl mt-16 relative group">
            <div className="absolute -inset-4 bg-linear-to-b from-white/5 to-transparent blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="relative border border-white/8">
              <Image
                src="/workspace-prev.jpeg"
                alt="Invitely.gg Dashboard"
                width={1600}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
