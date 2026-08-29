// src/components/modules/dashboard/MetricCards.jsx
"use client";

import { Row, Col, Card } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

export default function MetricCards({ metrics }) {
  const currentTheme = useSelector((state) => state.ui?.theme);
  const isDark = currentTheme === "dark";

  // Unified color palette for both modes
  const cards = [
    {
      title: "Total Customers",
      value: metrics.totalCustomers,
      icon: <TeamOutlined style={{ fontSize: "22px", color: isDark ? "#a5b4fc" : "#4338ca" }} />,
      iconBg: isDark ? "#1e1b4b" : "#e0e7ff",
      iconBorder: isDark ? "#3730a3" : "#c7d2fe",
      borderTop: "#4f46e5",
      changeText: "+12% this month",
      changeColor: isDark ? "#34d399" : "#047857",
    },
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      icon: <UserAddOutlined style={{ fontSize: "22px", color: isDark ? "#93c5fd" : "#1d4ed8" }} />,
      iconBg: isDark ? "#172554" : "#dbeafe",
      iconBorder: isDark ? "#1e40af" : "#bfdbfe",
      borderTop: "#2563eb",
      changeText: "+4 new today",
      changeColor: isDark ? "#60a5fa" : "#2563eb",
    },
    {
      title: "Converted Leads",
      value: metrics.convertedLeads,
      suffix: `(${metrics.leadConversionRate}%)`,
      icon: <CheckCircleOutlined style={{ fontSize: "22px", color: isDark ? "#6ee7b7" : "#047857" }} />,
      iconBg: isDark ? "#064e3b" : "#d1fae5",
      iconBorder: isDark ? "#065f46" : "#a7f3d0",
      borderTop: "#059669",
      changeText: `${metrics.leadConversionRate}% win rate`,
      changeColor: isDark ? "#34d399" : "#047857",
    },
    {
      title: "Pending Tasks",
      value: metrics.pendingTasks,
      icon: <ClockCircleOutlined style={{ fontSize: "22px", color: isDark ? "#fde047" : "#b45309" }} />,
      iconBg: isDark ? "#451a03" : "#fef3c7",
      iconBorder: isDark ? "#78350f" : "#fde68a",
      borderTop: "#d97706",
      changeText: `${metrics.completedTasks} completed`,
      changeColor: isDark ? "#94a3b8" : "#475569",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((item, idx) => (
        <Col xs={24} sm={12} xl={6} key={idx}>
          <Card
            variant="borderless"
            style={{
              borderRadius: "14px",
              backgroundColor: isDark ? "#111827" : "#ffffff",
              borderTop: `4px solid ${item.borderTop}`,
              borderLeft: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
              borderRight: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
              borderBottom: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
              boxShadow: isDark
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
            styles={{ body: { padding: "20px 22px" } }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <span
                  style={{
                    color: isDark ? "#94a3b8" : "#475569",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </span>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      color: isDark ? "#f8fafc" : "#0f172a",
                      lineHeight: 1.1,
                    }}
                  >
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: isDark ? "#34d399" : "#047857",
                      }}
                    >
                      {item.suffix}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: item.changeColor,
                  }}
                >
                  {item.changeText}
                </div>
              </div>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: item.iconBg,
                  border: `1px solid ${item.iconBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}