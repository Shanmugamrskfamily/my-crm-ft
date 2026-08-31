// src/app/(dashboard)/not-found.jsx
"use client";

import { Result, Button, Space } from "antd";
import { HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function DashboardNotFound() {
  const router = useRouter();
  return (
    <Result
      status="404"
      title="Record not found"
      subTitle="The item you followed doesn't exist in this workspace, or was removed."
      extra={
        <Space>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600"
          >
            Dashboard
          </Button>
          <Button
            icon={<TeamOutlined />}
            onClick={() => router.push("/customers")}
          >
            Customers
          </Button>
        </Space>
      }
    />
  );
}
