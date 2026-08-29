// src/components/providers/AntdThemeProvider.jsx
"use client";

import { useEffect } from "react";
import { ConfigProvider, theme as antdTheme, App } from "antd";
import { useSelector } from "react-redux";

export default function AntdThemeProvider({ children }) {
  const currentTheme = useSelector((state) => state.ui?.theme);
  const isDark = currentTheme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 8,
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          colorBgContainer: isDark ? "#111827" : "#ffffff",
          colorBgLayout: isDark ? "#0b0f19" : "#f1f5f9",
          colorText: isDark ? "#f1f5f9" : "#0f172a",
          colorTextHeading: isDark ? "#ffffff" : "#0f172a",
          colorTextSecondary: isDark ? "#94a3b8" : "#475569",
          colorBorder: isDark ? "#1f2937" : "#e2e8f0",
        },
        components: {
          Table: {
            headerBg: isDark ? "#1e293b" : "#f8fafc",
            headerColor: isDark ? "#f8fafc" : "#0f172a",
            colorText: isDark ? "#f1f5f9" : "#0f172a",
            colorTextHeading: isDark ? "#ffffff" : "#0f172a",
            rowHoverBg: isDark ? "#1f2937" : "#f8fafc",
            borderColor: isDark ? "#1f2937" : "#e2e8f0",
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}