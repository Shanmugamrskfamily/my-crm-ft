// src/app/(dashboard)/customers/page.jsx
"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Select, Space, Popconfirm, App, Typography } from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import AntdDataTable from "../../../components/common/AntdDataTable";
import CustomerModal from "../../../components/modules/customers/CustomerModal";
import {
  deleteCustomer,
  bulkDeleteCustomers,
  toggleSelectCustomer,
  selectAllCustomers,
  clearCustomerSelection,
} from "../../../store/slices/customerSlice";
import { renderCustomerStatusTag } from "../../../utils/statusTags";

const { Title, Text } = Typography;

export default function CustomersPage() {
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const customers = useSelector((state) => state.customers.items || []);
  const selectedRowKeys = useSelector(
    (state) => state.customers.selectedCustomerIds || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // Filtered & Searched Dataset
  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      message.warning("No customer data available to export");
      return;
    }
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Location",
      "Status",
      "Assigned Employee",
      "Created Date",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredCustomers.map((c) =>
        [
          `"${c.id}"`,
          `"${c.name}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          `"${c.company}"`,
          `"${c.location}"`,
          `"${c.status}"`,
          `"${c.assignedEmployee}"`,
          `"${new Date(c.createdDate).toLocaleDateString()}"`,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    message.success("Customers exported successfully");
  };

  const handleBulkDelete = () => {
    dispatch(bulkDeleteCustomers());
    message.success(`Deleted ${selectedRowKeys.length} customer(s)`);
  };

  const handleOpenAddModal = () => {
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setCustomerToEdit(record);
    setIsModalOpen(true);
  };

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => (
      <Link
        href={`/customers/${record.id}`}
        className="font-bold hover:underline text-sm"
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => a.company.localeCompare(b.company),
    render: (text) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Contact",
    dataIndex: "email",
    key: "email",
    render: (email, record) => (
      <div>
        <div className="text-xs font-semibold">{email}</div>
        <div className="text-[11px] text-secondary-sub">{record.phone}</div>
      </div>
    ),
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (text) => <span>{text}</span>,
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
    sorter: (a, b) => a.assignedEmployee.localeCompare(b.assignedEmployee),
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space size="small">
        <Link href={`/customers/${record.id}`}>
          <Button type="text" size="small" icon={<EyeOutlined />} />
        </Link>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined style={{ color: "#4f46e5" }} />}
          onClick={() => handleOpenEditModal(record)}
        />
        <Popconfirm
          title="Delete customer"
          description="Are you sure you want to delete this customer?"
          onConfirm={() => {
            dispatch(deleteCustomer(record.id));
            message.success("Customer removed");
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  },
];
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <Title level={4} style={{ marginBottom: 2 }}>
            Customer Management
          </Title>
          <Text type="secondary" className="text-xs">
            View, search, filter, and manage all your enterprise customer accounts
          </Text>
        </div>

        <Space wrap>
          <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleOpenAddModal}
            className="bg-indigo-600"
          >
            Add Customer
          </Button>
        </Space>
      </div>

      <AntdDataTable
        columns={columns}
        dataSource={filteredCustomers}
        searchPlaceholder="Search by name, company, email, location..."
        onSearch={(value) => setSearchTerm(value)}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={(keys) => dispatch(selectAllCustomers(keys))}
        extraActions={
          <>
            <Select
              defaultValue="ALL"
              style={{ width: 140 }}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { label: "All Statuses", value: "ALL" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Lead", value: "Lead" },
              ]}
            />

            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Delete ${selectedRowKeys.length} customer(s)?`}
                description="This action cannot be undone."
                onConfirm={handleBulkDelete}
                okText="Delete Selected"
                okButtonProps={{ danger: true }}
              >
                <Button danger type="primary" icon={<DeleteOutlined />}>
                  Bulk Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
          </>
        }
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerToEdit={customerToEdit}
      />
    </div>
  );
}