import { GrainBackdrop } from "@/components/landing/grain-backdrop";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/landing/logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Invitely.gg",
};

export const dynamic = "force-static";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly: your name and email address from Google sign-in, workspace names, contact names and email addresses you add, event details you create, and invitation messages you write. We also collect usage data such as pages visited and features used.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your information to: provide and operate the Invitely.gg service, send event invitations on your behalf to the contacts you specify, process RSVP responses from your guests, display your dashboard with invitation status, and improve the service over time.",
  },
  {
    title: "3. Information We Share",
    content:
      "We share your name with email recipients as the event organiser (e.g. 'Invited by [Your Name]'). We use Resend to deliver emails they receive recipient email addresses for delivery purposes only. We use Google AI text optimizing your event details are sent to Google gemini to generate invite copy. We do not sell your data to third parties.",
  },
  {
    title: "4. Your Contacts' Data",
    content:
      "When you add email addresses to your workspaces, you are responsible for ensuring you have the right to contact those people. We store these email addresses solely to enable the invitation sending feature. We do not use them for any other purpose.",
  },
  {
    title: "5. RSVP Data",
    content:
      "When your guests respond to invitations, we record their RSVP status (attending, maybe, or declined) and the timestamp of their response. This data is visible only to you as the event organiser.",
  },
  {
    title: "6. Data Retention",
    content:
      "We retain your account data for as long as your account is active. If you delete a workspace, event, or account, the associated data is permanently deleted from our systems. RSVP data is tied to events and is deleted when an event is deleted.",
  },
  {
    title: "7. Security",
    content:
      "We use industry-standard security practices including HTTPS encryption, secure session tokens, and cryptographically random RSVP tokens. However, no method of internet transmission is 100% secure and we cannot guarantee absolute security.",
  },
  {
    title: "8. Cookies",
    content:
      "We use session cookies to keep you signed in. These are HttpOnly and Secure cookies set by our authentication system. We do not use tracking cookies or advertising cookies.",
  },
  {
    title: "9. Third-Party Services",
    content:
      "We use the following third-party services: Google OAuth for authentication, Resend for email delivery, Google AI for text generation, and Vercel for hosting. Each of these services has their own privacy policies.",
  },
  {
    title: "10. Your Rights",
    content:
      "You can delete your account and all associated data at any time by contacting us. You can remove contacts from your workspaces at any time. You can delete events and their invitation history at any time.",
  },
  {
    title: "11. Children's Privacy",
    content:
      "Invitely.gg is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.",
  },
  {
    title: "12. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Continued use of the service constitutes acceptance of the updated policy.",
  },
  {
    title: "13. Contact Us",
    content:
      "If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@invitely.gg.",
  },
];

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Last updated: March 10, 2026
            </p>
          </div>

          <Separator className="bg-white/8 mb-10" />

          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-10">
            At Invitely.gg, we take your privacy seriously. This policy explains
            what data we collect, how we use it, and your rights regarding your
            information.
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
              href="/terms"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-4"
            >
              Terms of Service →
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
