// src/components/common/AntdDataTable.jsx
"use client";

import { Table, Input, Space, Button, Card } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function AntdDataTable({
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  onSearch,
  searchPlaceholder = "Search records...",
  extraActions,
  selectedRowKeys = [],
  onSelectionChange,
  pagination = { pageSize: 10 },
  onChange,
}) {
  const rowSelection = onSelectionChange
    ? {
        selectedRowKeys,
        onChange: onSelectionChange,
      }
    : undefined;

  return (
    <Card variant='borderless' className="shadow-xs rounded-xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <Space wrap>
          {onSearch && (
            <Search
              placeholder={searchPlaceholder}
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={onSearch}
              className="w-full sm:w-72"
            />
          )}
        </Space>

        <Space wrap>{extraActions}</Space>
      </div>

      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}