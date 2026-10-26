import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: fileURLToPath(new URL("../", import.meta.url)),
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
