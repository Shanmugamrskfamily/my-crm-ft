/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

const cspDirectives = [
  // Fallback for directives not explicitly defined
  "default-src 'self'",

  // Next.js requires 'unsafe-inline' and 'unsafe-eval' (primarily in development/fast refresh)
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""}`.trim(),

  // Styles: 'self' + 'unsafe-inline' (needed for CSS-in-JS, Tailwind, and style tags)
  "style-src 'self' 'unsafe-inline'",

  // Images: allow self, local data/blobs, and remote HTTPS assets
  "img-src 'self' blob: data: https:",

  // Fonts: allow self, data URIs, and external font CDNs if needed
  "font-src 'self' data: https:",

  // Data fetching: allow local APIs, HTTPS endpoints, and WebSocket connections
  "connect-src 'self' https: wss:",

  // Disable Flash, Java, and other legacy plugins
  "object-src 'none'",

  // Restrict the URLs that can appear in the document's <base> element
  "base-uri 'self'",

  // Restrict form submissions to same-origin
  "form-action 'self'",

  // Prevent clickjacking by disallowing this site to be embedded in frames
  "frame-ancestors 'none'",

  // Automatically upgrade insecure HTTP requests to HTTPS
  "upgrade-insecure-requests",
];

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives.join("; ").replace(/\s{2,}/g, " ").trim(),
  },
  {
    // Prevents MIME-type sniffing (MIME confusion attacks)
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Legacy clickjacking defense for older browsers (superseded by frame-ancestors)
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Restricts referrer data leakage across origins
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Enforces HTTPS strictly for 2 years, including subdomains and preload eligibility
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Controls browser device and API access
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false, // Strips 'x-powered-by: Next.js' to prevent technology fingerprinting
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;