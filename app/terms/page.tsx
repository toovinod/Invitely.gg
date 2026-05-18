import { GrainBackdrop } from "@/components/landing/grain-backdrop";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/landing/logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Invitely.gg",
};

export const dynamic = "force-static";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using Invitely.gg, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.",
  },
  {
    title: "2. Description of Service",
    content:
      "Invitely.gg is an event invitation platform that allows users to create event invitations and send them to contacts via email on their behalf. We use third-party email delivery services to deliver these messages.",
  },
  {
    title: "3. User Accounts",
    content:
      "You must sign in with a valid Google account to use Invitely.gg. You are responsible for all activity that occurs under your account. You must not share your account credentials with others.",
  },
  {
    title: "4. Acceptable Use",
    content:
      "You agree not to use Invitely.gg to send spam, unsolicited emails, or any content that is illegal, harmful, threatening, abusive, or otherwise objectionable. You may only send invitations to people who have given you permission to contact them.",
  },
  {
    title: "5. Email Sending Limits",
    content:
      "The service is limited to 5 workspaces per account, 25 members per workspace, and a maximum of 125 email recipients per event. These limits exist to ensure fair use and service quality.",
  },
  {
    title: "6. AI-Generated Content",
    content:
      "Invitely.gg uses Google AI to help optimize invitation text. You are responsible for reviewing and approving all AI-generated content before sending. We do not guarantee the accuracy or appropriateness of AI-generated content.",
  },
  {
    title: "7. Privacy",
    content:
      "Your use of Invitely.gg is also governed by our Privacy Policy. By using the service, you consent to the collection and use of information as described in our Privacy Policy.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "Invitely.gg and its original content, features, and functionality are owned by Invitely.gg and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    title: "9. Termination",
    content:
      "We reserve the right to suspend or terminate your account at any time if you violate these terms or if we believe your use of the service is harmful to others or to the service itself.",
  },
  {
    title: "10. Limitation of Liability",
    content:
      "Invitely.gg is provided on an 'as is' basis. We make no warranties about the reliability, availability, or accuracy of the service. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    title: "11. Changes to Terms",
    content:
      "We may update these terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the new terms. We will make reasonable efforts to notify users of significant changes.",
  },
  {
    title: "12. Contact",
    content:
      "If you have any questions about these Terms of Service, please contact us at legal@invitely.gg.",
  },
];

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GrainBackdrop />

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit mb-10"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>

        <div className="relative border border-white/8 bg-[#050505]/40 backdrop-blur-sm px-6 sm:px-10 py-10 sm:py-12">
          <div className="flex flex-col gap-3 mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Logo size={24} />
              <span className="font-mono text-sm font-semibold text-foreground">
                Invitely.gg
              </span>
            </div>
            <h1 className="font-mono text-2xl font-bold text-foreground">
              Terms of Service
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Last updated: March 10, 2026
            </p>
          </div>

          <Separator className="bg-white/8 mb-10" />

          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-10">
            Please read these Terms of Service carefully before using
            Invitely.gg. These terms govern your access to and use of our
            invitation platform.
          </p>

          <div className="flex flex-col gap-8">
            {sections.map(
              ({ title, content }: { title: string; content: string }) => (
                <div key={title} className="flex flex-col gap-2">
                  <h2 className="font-mono text-sm font-semibold text-foreground">
                    {title}
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {content}
                  </p>
                </div>
              ),
            )}
          </div>

          <Separator className="bg-white/8 mt-12 mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/privacy"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-4"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/login"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Sign in to Invitely.gg
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
