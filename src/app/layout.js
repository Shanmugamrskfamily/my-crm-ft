// src/app/layout.jsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Nunito } from "next/font/google";
import ReduxProvider from "../components/providers/ReduxProvider";
import AntdThemeProvider from "../components/providers/AntdThemeProvider";
import "../app/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const APP_NAME = "Apex CRM";
const APP_DEFAULT_TITLE = "Apex CRM – Enterprise Customer & Lead Management Platform";
const APP_TITLE_TEMPLATE = "%s | Apex CRM";
const APP_DESCRIPTION =
  "A high-performance Enterprise CRM web application built with Next.js App Router, Redux Toolkit, and Ant Design. Manage customers, leads, tasks, and analytics with state persistence and client-side encryption.";

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "CRM",
    "Customer Relationship Management",
    "Lead Management",
    "Task Management",
    "Enterprise Dashboard",
    "Next.js CRM",
    "Redux Toolkit",
  ],
  authors: [{ name: "CRM Development Team" }],
  creator: "Apex CRM Solutions",
  publisher: "Apex CRM Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://crm.local"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  robots: {
    index: false, // CRM portals are private systems and typically disallowed from public indexing
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={`${nunito.className} antialiased`}>
        <AntdRegistry>
          <ReduxProvider>
            <AntdThemeProvider>{children}</AntdThemeProvider>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}