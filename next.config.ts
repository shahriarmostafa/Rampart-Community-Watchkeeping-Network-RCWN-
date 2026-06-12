import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable:
    process.env.NEXT_DISABLE_PWA === "true" ||
    (process.env.NODE_ENV === "development" && process.env.NEXT_ENABLE_PWA_DEV !== "true"),
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
