// src/components/modules/dashboard/RecentActivityFeed.jsx
"use client";

import { Card, Timeline, Typography, Empty } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export default function RecentActivityFeed({ activities }) {
  const getDotColor = (type) => {
    switch (type) {
      case "Created":
        return "blue";
      case "Converted":
        return "green";
      case "Updated":
        return "orange";
      default:
        return "gray";
    }
  };

  const timelineItems = activities.map((act) => ({
    color: getDotColor(act.type),
    children: (
      <div className="text-xs">
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {act.description}
        </div>
        <div className="mt-0.5 text-slate-400">
          <Link
            href={`/customers/${act.customerId}`}
            className="text-indigo-600 hover:underline mr-2"
          >
            {act.customerName}
          </Link>
          <span>&bull; {new Date(act.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    ),
  }));

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-indigo-600" />
          <span className="text-sm font-semibold">Recent Activities</span>
        </div>
      }
      bordered={false}
      className="shadow-xs rounded-xl h-full"
    >
      {activities.length === 0 ? (
        <Empty description="No recent activity logged" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Timeline items={timelineItems} className="mt-2" />
      )}
    </Card>
  );
}