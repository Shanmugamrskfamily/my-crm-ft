// src/app/(dashboard)/dashboard/page.jsx
"use client";

import { useSelector } from "react-redux";
import { Row, Col, Typography } from "antd";
import {
  selectDashboardMetrics,
  selectRecentCustomers,
  selectRecentActivities,
} from "../../../store/selectors";
import MetricCards from "../../../components/modules/dashboard/MetricCards";
import RecentCustomersTable from "../../../components/modules/dashboard/RecentCustomersTable";
import RecentActivityFeed from "../../../components/modules/dashboard/RecentActivityFeed";
import DashboardCharts from "../../../components/modules/dashboard/DashboardCharts";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const metrics = useSelector(selectDashboardMetrics);
  const recentCustomers = useSelector(selectRecentCustomers);
  const recentActivities = useSelector(selectRecentActivities);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} style={{ marginBottom: 2 }}>
          Welcome back, {user?.name || "Team Member"} 👋
        </Title>
        <Text type="secondary" className="text-xs">
          Here is what is happening across your CRM pipeline today.
        </Text>
      </div>

      {/* KPI Cards */}
      <MetricCards metrics={metrics} />

      {/* Analytics charts */}
      <DashboardCharts />

      {/* Split Grid: Recent Customers & Activity Log */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <RecentCustomersTable customers={recentCustomers} />
        </Col>
        <Col xs={24} lg={9}>
          <RecentActivityFeed activities={recentActivities} />
        </Col>
      </Row>
    </div>
  );
}