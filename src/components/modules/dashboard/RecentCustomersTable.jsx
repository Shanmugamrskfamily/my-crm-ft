// src/components/modules/dashboard/RecentCustomersTable.jsx
"use client";

import { Card, Table, Button, Space } from "antd";
import { TeamOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { renderCustomerStatusTag } from "../../../utils/statusTags";

export default function RecentCustomersTable({ customers }) {
  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Link
          href={`/customers/${record.id}`}
          className="font-medium text-indigo-600 hover:underline"
        >
          {name}
        </Link>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderCustomerStatusTag(status),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedEmployee",
      key: "assignedEmployee",
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-indigo-600" />
          <span className="text-sm font-semibold">Recent Customers</span>
        </div>
      }
      extra={
        <Link href="/customers">
          <Button type="link" size="small" icon={<ArrowRightOutlined />} iconPosition="end">
            View All
          </Button>
        </Link>
      }
      bordered={false}
      className="shadow-xs rounded-xl h-full"
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={customers}
        pagination={false}
        size="small"
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}