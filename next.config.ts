import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

const hasSentryConfig =
  Boolean(process.env.SENTRY_ORG) &&
  Boolean(process.env.SENTRY_PROJECT) &&
  Boolean(process.env.SENTRY_AUTH_TOKEN);

export default hasSentryConfig
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      // Hide build telemetry but keep source-map upload working in CI.
      disableLogger: true,
      // Tunnel browser SDK requests through your domain to avoid ad-blockers.
      tunnelRoute: "/monitoring",
    })
  : nextConfig;
