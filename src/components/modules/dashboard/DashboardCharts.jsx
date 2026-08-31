// src/components/modules/dashboard/DashboardCharts.jsx
"use client";

import { Card, Row, Col, Empty } from "antd";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  selectLeadsByStage,
  selectTasksByPriority,
  selectCustomerGrowth,
} from "../../../store/selectors";

const LEAD_STAGE_COLORS = {
  New: "#3b82f6",
  Contacted: "#06b6d4",
  "Follow-up": "#f59e0b",
  Qualified: "#a855f7",
  Converted: "#10b981",
  Lost: "#ef4444",
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#3b82f6",
};

function ChartCard({ title, children, isEmpty }) {
  return (
    <Card
      title={<span className="text-sm font-semibold">{title}</span>}
      variant="borderless"
      className="shadow-xs rounded-xl h-full"
      styles={{ body: { padding: 16, height: 280 } }}
    >
      {isEmpty ? (
        <Empty
          description="No data yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="pt-12"
        />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export default function DashboardCharts() {
  const isDark = useSelector((state) => state.ui?.theme === "dark");
  const leadsByStage = useSelector(selectLeadsByStage);
  const tasksByPriority = useSelector(selectTasksByPriority);
  const customerGrowth = useSelector(selectCustomerGrowth);

  const axisColor = isDark ? "#94a3b8" : "#475569";
  const gridColor = isDark ? "#1f2937" : "#e2e8f0";
  const tooltipStyle = {
    backgroundColor: isDark ? "#111827" : "#ffffff",
    border: `1px solid ${gridColor}`,
    borderRadius: 8,
    fontSize: 12,
    color: isDark ? "#f1f5f9" : "#0f172a",
  };

  const totalLeads = leadsByStage.reduce((s, x) => s + x.count, 0);
  const totalTasks = tasksByPriority.reduce((s, x) => s + x.count, 0);
  const totalGrowth = customerGrowth.reduce((s, x) => s + x.count, 0);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={10}>
        <ChartCard title="Lead Pipeline by Stage" isEmpty={totalLeads === 0}>
          <BarChart data={leadsByStage} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: gridColor, opacity: 0.3 }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {leadsByStage.map((entry) => (
                <Cell key={entry.stage} fill={LEAD_STAGE_COLORS[entry.stage] || "#4f46e5"} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </Col>

      <Col xs={24} sm={12} lg={7}>
        <ChartCard title="Tasks by Priority" isEmpty={totalTasks === 0}>
          <PieChart>
            <Pie
              data={tasksByPriority}
              dataKey="count"
              nameKey="priority"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {tasksByPriority.map((entry) => (
                <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || "#4f46e5"} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
          </PieChart>
        </ChartCard>
      </Col>

      <Col xs={24} sm={12} lg={7}>
        <ChartCard title="Customer Growth (6 mo)" isEmpty={totalGrowth === 0}>
          <LineChart data={customerGrowth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#4f46e5" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartCard>
      </Col>
    </Row>
  );
}
