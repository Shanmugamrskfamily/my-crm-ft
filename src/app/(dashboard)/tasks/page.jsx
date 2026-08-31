// src/app/(dashboard)/tasks/page.jsx
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
  Card,
  Row,
  Col,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import TaskKanbanBoard from "../../../components/modules/tasks/TaskKanbanBoard";
import Link from "next/link";
import AntdDataTable from "../../../components/common/AntdDataTable";
import TaskModal from "../../../components/modules/tasks/TaskModal";
import {
  deleteTask,
  changeTaskStatus,
} from "../../../store/slices/taskSlice";
import {
  renderTaskStatusTag,
  renderTaskPriorityTag,
} from "../../../utils/statusTags";
import Can from "../../../components/common/Can";
import { usePermissions } from "../../../hooks/usePermissions";

const { Title, Text } = Typography;

const TASK_STATUS_OPTIONS = ["Todo", "In Progress", "Completed"];

export default function TasksPage() {
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const tasks = useSelector((state) => state.tasks.items || []);
  const customers = useSelector((state) => state.customers.items || []);
  const leads = useSelector((state) => state.leads.items || []);
  const { can } = usePermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'board'

  // Quick Metrics
  const todoCount = tasks.filter((t) => t.status === "Todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  // Filtered dataset
  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;
      const matchesPriority =
        priorityFilter === "ALL" ? true : item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(changeTaskStatus({ id, status: newStatus }));
    message.info(`Task status updated to ${newStatus}`);
  };

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setTaskToEdit(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </div>
          {record.description && (
            <div className="text-[11px] text-slate-400 line-clamp-1">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          size="small"
          value={status}
          onChange={(newVal) => handleStatusChange(record.id, newVal)}
          style={{ width: 130 }}
          options={TASK_STATUS_OPTIONS.map((st) => ({
            value: st,
            label: renderTaskStatusTag(st),
          }))}
        />
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      sorter: (a, b) => a.priority.localeCompare(b.priority),
      render: (priority) => renderTaskPriorityTag(priority),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      sorter: (a, b) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {date ? new Date(date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "Associated With",
      key: "association",
      render: (_, record) => {
        if (record.customerId) {
          const cust = customers.find((c) => c.id === record.customerId);
          return cust ? (
            <Link
              href={`/customers/${cust.id}`}
              className="text-xs text-indigo-600 hover:underline"
            >
              {cust.name} (Customer)
            </Link>
          ) : (
            <span className="text-xs text-slate-400">Customer</span>
          );
        }
        if (record.leadId) {
          const lead = leads.find((l) => l.id === record.leadId);
          return lead ? (
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {lead.name} (Lead)
            </span>
          ) : (
            <span className="text-xs text-slate-400">Lead</span>
          );
        }
        return <span className="text-xs text-slate-400">General</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Can action="task.edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-indigo-600" />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Can>
          <Can action="task.delete">
            <Popconfirm
              title="Delete Task"
              description="Are you sure you want to remove this task?"
              onConfirm={() => {
                dispatch(deleteTask(record.id));
                message.success("Task deleted");
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <Title level={4} style={{ marginBottom: 2 }}>
            Task Management
          </Title>
          <Text type="secondary" className="text-xs">
            Organize, prioritize, and track tasks for your team and accounts
          </Text>
        </div>

        <Space wrap>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { label: "List", value: "list", icon: <UnorderedListOutlined /> },
              { label: "Board", value: "board", icon: <AppstoreOutlined /> },
            ]}
          />
          <Can action="task.create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddModal}
              className="bg-indigo-600"
            >
              Create Task
            </Button>
          </Can>
        </Space>
      </div>

      {/* Metric Highlights */}
      <Row gutter={[16, 16]}>
        {[
          {
            label: "To Do",
            value: todoCount,
            icon: <ScheduleOutlined style={{ fontSize: 22 }} />,
            iconColor: "#4338ca",
            iconBg: "bg-indigo-100 dark:bg-indigo-500/15",
            iconBorder: "border-indigo-200 dark:border-indigo-500/30",
            border: "#4f46e5",
            hint: `${tasks.length ? Math.round((todoCount / tasks.length) * 100) : 0}% of pipeline`,
          },
          {
            label: "In Progress",
            value: inProgressCount,
            icon: <ClockCircleOutlined style={{ fontSize: 22 }} />,
            iconColor: "#b45309",
            iconBg: "bg-amber-100 dark:bg-amber-500/15",
            iconBorder: "border-amber-200 dark:border-amber-500/30",
            border: "#d97706",
            hint: "Actively worked on",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: <CheckCircleOutlined style={{ fontSize: 22 }} />,
            iconColor: "#047857",
            iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
            iconBorder: "border-emerald-200 dark:border-emerald-500/30",
            border: "#059669",
            hint: `${tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}% completion rate`,
          },
        ].map((c) => (
          <Col xs={24} sm={8} key={c.label}>
            <Card
              variant="borderless"
              className="shadow-xs rounded-xl"
              style={{ borderTop: `4px solid ${c.border}` }}
              styles={{ body: { padding: "18px 22px" } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {c.label}
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mt-1">
                    {c.value}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {c.hint}
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.iconBg} ${c.iconBorder}`}
                  style={{ color: c.iconColor }}
                >
                  {c.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {viewMode === "list" ? (
        <AntdDataTable
          columns={columns}
          dataSource={filteredTasks}
          searchPlaceholder="Search tasks by title, description, assignee..."
          onSearch={(value) => setSearchTerm(value)}
          extraActions={
            <Space wrap>
              <Select
                defaultValue="ALL"
                style={{ width: 130 }}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { label: "All Statuses", value: "ALL" },
                  ...TASK_STATUS_OPTIONS.map((st) => ({ label: st, value: st })),
                ]}
              />
              <Select
                defaultValue="ALL"
                style={{ width: 130 }}
                onChange={(value) => setPriorityFilter(value)}
                options={[
                  { label: "All Priorities", value: "ALL" },
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ]}
              />
            </Space>
          }
        />
      ) : (
        <TaskKanbanBoard tasks={filteredTasks} />
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}