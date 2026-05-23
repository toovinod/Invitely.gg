import { Sparkles } from "lucide-react";
import Image from "next/image";

export function EmailPreview() {
  return (
    <section className="border-t border-white/8 relative overflow-hidden">
      <div className="mx-auto max-w-3xl relative z-10">
        <div className="flex flex-col gap-12 py-16 px-6">
          <div className="text-center">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-3 tracking-tight text-balance">
              Write casually. Send professionally.
            </h2>
            <p className="font-mono text-sm text-muted-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
              Type your message the way you&apos;d text a friend.
              Invitely&apos;s AI transforms it into a high-end invitation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-b from-white/2 to-transparent blur-2xl opacity-40" />
            <div className="relative border border-white/8  overflow-hidden">
              <Image
                src="/email-prev.jpeg"
                alt="Invitely.gg Email Preview - House Party invitation with RSVP tracking, smart send time suggestions, and batch delivery to 30 guests"
                width={800}
                height={1000}
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
