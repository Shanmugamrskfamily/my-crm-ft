// src/app/(dashboard)/leads/page.jsx
"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Select,
  Space,
  Popconfirm,
  App,
  Typography,
  Tooltip,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import AntdDataTable from "../../../components/common/AntdDataTable";
import LeadModal from "../../../components/modules/leads/LeadModal";
import {
  deleteLead,
  changeLeadStatus,
} from "../../../store/slices/leadSlice";
import { addCustomer } from "../../../store/slices/customerSlice";
import { renderLeadStatusTag } from "../../../utils/statusTags";
import { availableEmployees } from "../../../mock/initialData";

const { Title, Text } = Typography;

const LEAD_STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Follow-up",
  "Qualified",
  "Converted",
  "Lost",
];

export default function LeadsPage() {
  const dispatch = useDispatch();
  const { message, modal } = App.useApp();

  const leads = useSelector((state) => state.leads.items || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  // Filtered dataset
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Lead-to-Customer conversion handler
  const executeLeadConversion = (lead) => {
    // 1. Mark status as Converted in leadSlice
    dispatch(changeLeadStatus({ id: lead.id, status: "Converted" }));

    // 2. Add as new active account in customerSlice
    dispatch(
      addCustomer({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        location: lead.location,
        status: "Active",
        assignedEmployee: lead.assignedEmployee,
      })
    );

    message.success(
      `Lead "${lead.name}" converted and added to Customers directory!`
    );
  };

  const handleStatusChange = (lead, newStatus) => {
    if (newStatus === "Converted") {
      modal.confirm({
        title: "Convert Lead to Customer?",
        icon: <CheckCircleOutlined className="text-emerald-500" />,
        content: `Converting "${lead.name}" will automatically generate a new Customer account and record an initial audit event.`,
        okText: "Convert & Create Customer",
        okButtonProps: { className: "bg-emerald-600" },
        centered: true,
        onOk: () => executeLeadConversion(lead),
      });
    } else {
      dispatch(changeLeadStatus({ id: lead.id, status: newStatus }));
      message.info(`Lead status updated to ${newStatus}`);
    }
  };

  const handleOpenAddModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setLeadToEdit(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Lead Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold text-slate-800 dark:text-slate-200">{text}</span>,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "Contact",
      dataIndex: "email",
      key: "email",
      render: (email, record) => (
        <div>
          <div className="text-xs text-slate-700 dark:text-slate-300">{email}</div>
          <div className="text-[11px] text-slate-400">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Lead Stage",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          size="small"
          value={status}
          onChange={(newVal) => handleStatusChange(record, newVal)}
          style={{ width: 125 }}
          options={LEAD_STATUS_OPTIONS.map((st) => ({
            value: st,
            label: renderLeadStatusTag(st),
          }))}
        />
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (src) => <span className="text-xs text-slate-500">{src || "Direct"}</span>,
    },
    {
      title: "Assigned To",
      dataIndex: "assignedEmployee",
      key: "assignedEmployee",
      sorter: (a, b) => a.assignedEmployee.localeCompare(b.assignedEmployee),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {record.status !== "Converted" && (
            <Tooltip title="Convert to Customer">
              <Button
                type="text"
                size="small"
                icon={<SwapOutlined className="text-emerald-600" />}
                onClick={() => handleStatusChange(record, "Converted")}
              />
            </Tooltip>
          )}
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-indigo-600" />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Popconfirm
            title="Delete Lead"
            description="Are you sure you want to remove this lead?"
            onConfirm={() => {
              dispatch(deleteLead(record.id));
              message.success("Lead removed");
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
            Lead Pipeline Management
          </Title>
          <Text type="secondary" className="text-xs">
            Manage stages from New to Converted and automatically provision customer accounts
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleOpenAddModal}
          className="bg-indigo-600"
        >
          Add New Lead
        </Button>
      </div>

      <AntdDataTable
        columns={columns}
        dataSource={filteredLeads}
        searchPlaceholder="Search leads by name, company, email, location..."
        onSearch={(value) => setSearchTerm(value)}
        extraActions={
          <Select
            defaultValue="ALL"
            style={{ width: 140 }}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { label: "All Stages", value: "ALL" },
              ...LEAD_STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
            ]}
          />
        }
      />

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
}