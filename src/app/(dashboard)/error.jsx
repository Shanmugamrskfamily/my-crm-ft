// src/app/(dashboard)/error.jsx
"use client";

import { useEffect } from "react";
import { Result, Button, Space } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function DashboardSegmentError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Dashboard segment error:", error);
  }, [error]);

  return (
    <Result
      status="error"
      title="Something broke in this workspace"
      subTitle={
        <>
          <div>An unexpected error occurred while rendering this page.</div>
          {error?.digest && (
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              ref: {error.digest}
            </div>
          )}
        </>
      }
      extra={
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => reset()}
            className="bg-indigo-600"
          >
            Try again
          </Button>
          <Button icon={<HomeOutlined />} onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </Space>
      }
    />
  );
}
