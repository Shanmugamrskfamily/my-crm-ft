// src/components/modules/dashboard/MetricCards.jsx
"use client";

import { Row, Col, Card, Statistic, Progress } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export default function MetricCards({ metrics }) {
  const statItems = [
    {
      title: "Total Customers",
      value: metrics.totalCustomers,
      icon: <TeamOutlined className="text-xl text-indigo-600" />,
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      icon: <UserAddOutlined className="text-xl text-blue-600" />,
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Converted Leads",
      value: metrics.convertedLeads,
      suffix: `(${metrics.leadConversionRate}%)`,
      icon: <CheckCircleOutlined className="text-xl text-emerald-600" />,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Pending Tasks",
      value: metrics.pendingTasks,
      icon: <ClockCircleOutlined className="text-xl text-amber-600" />,
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statItems.map((item, idx) => (
        <Col xs={24} sm={12} xl={6} key={idx}>
          <Card bordered={false} className="shadow-xs rounded-xl h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-xs font-medium text-emerald-600">
                      {item.suffix}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor}`}
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