// src/app/layout.jsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReduxProvider from "../components/providers/ReduxProvider";
import AntdThemeProvider from "../components/providers/AntdThemeProvider";
import "../app/globals.css";

export const metadata = {
  title: "Enterprise CRM Platform",
  description: "Next.js + Redux Toolkit + Ant Design CRM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased text-slate-800">
        <AntdRegistry>
          <ReduxProvider>
            <AntdThemeProvider>
              {children}
            </AntdThemeProvider>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}