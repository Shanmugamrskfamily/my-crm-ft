// src/components/providers/AntdThemeProvider.jsx
"use client";

import { useEffect } from "react";
import { ConfigProvider, theme as antdTheme, App } from "antd";
import { useSelector } from "react-redux";
import ToastHost from "../common/ToastHost";

export default function AntdThemeProvider({ children }) {
  const currentTheme = useSelector((state) => state.ui?.theme);
  const isDark = currentTheme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorError: "#ef4444",
          colorInfo: "#3b82f6",
          borderRadius: 8,
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          fontSize: 13,
          colorBgContainer: isDark ? "#111827" : "#ffffff",
          colorBgElevated: isDark ? "#1e293b" : "#ffffff",
          colorBgLayout: isDark ? "#0b0f19" : "#f1f5f9",
          colorText: isDark ? "#f1f5f9" : "#0f172a",
          colorTextHeading: isDark ? "#ffffff" : "#0f172a",
          colorTextSecondary: isDark ? "#94a3b8" : "#475569",
          colorBorder: isDark ? "#1f2937" : "#e2e8f0",
          colorBorderSecondary: isDark ? "#1f2937" : "#f1f5f9",
        },
        components: {
          Layout: {
            siderBg: isDark ? "#0f172a" : "#0f172a", // deep navy sidebar in both themes for brand consistency
            headerBg: isDark ? "#111827" : "#ffffff",
            bodyBg: isDark ? "#0b0f19" : "#f1f5f9",
          },
          Menu: {
            darkItemBg: "#0f172a",
            darkItemSelectedBg: "#4f46e5",
            darkItemHoverBg: "#1e293b",
            darkSubMenuItemBg: "#0f172a",
          },
          Table: {
            headerBg: isDark ? "#1e293b" : "#f8fafc",
            headerColor: isDark ? "#f8fafc" : "#334155",
            rowHoverBg: isDark ? "#1f2937" : "#f8fafc",
            borderColor: isDark ? "#1f2937" : "#e2e8f0",
          },
          Card: {
            colorBgContainer: isDark ? "#111827" : "#ffffff",
            headerBg: "transparent",
          },
          Modal: {
            contentBg: isDark ? "#111827" : "#ffffff",
            headerBg: isDark ? "#111827" : "#ffffff",
          },
          Tabs: {
            itemActiveColor: "#4f46e5",
            itemSelectedColor: "#4f46e5",
            inkBarColor: "#4f46e5",
          },
        },
      }}
    >
      <App>
        <ToastHost />
        {children}
      </App>
    </ConfigProvider>
  );
}
