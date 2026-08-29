// src/components/providers/AntdThemeProvider.jsx
"use client";

import { ConfigProvider, theme as antdTheme, App } from "antd";
import { useSelector } from "react-redux";

export default function AntdThemeProvider({ children }) {
  const currentTheme = useSelector((state) => state.ui.theme);
  const isDark = currentTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5", // Indigo-600
          borderRadius: 8,
          fontFamily: "inherit",
        },
      }}
    >
      <App>
        <div className={isDark ? "dark" : ""}>
          {children}
        </div>
      </App>
    </ConfigProvider>
  );
}