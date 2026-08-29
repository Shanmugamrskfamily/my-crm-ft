// src/app/sitemap.js
export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://crm.local";
  const currentDate = new Date().toISOString();

  return [
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}