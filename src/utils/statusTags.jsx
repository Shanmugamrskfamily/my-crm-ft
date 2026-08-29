// src/utils/statusTags.jsx
import { Tag } from "antd";

export const renderCustomerStatusTag = (status) => {
  const colorMap = {
    Active: "success",
    Inactive: "default",
    Lead: "processing",
  };
  return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
};

export const renderLeadStatusTag = (status) => {
  const colorMap = {
    New: "blue",
    Contacted: "cyan",
    "Follow-up": "orange",
    Qualified: "purple",
    Converted: "green",
    Lost: "red",
  };
  return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
};

export const renderTaskPriorityTag = (priority) => {
  const colorMap = {
    High: "volcano",
    Medium: "gold",
    Low: "geekblue",
  };
  return <Tag color={colorMap[priority] || "default"}>{priority}</Tag>;
};

export const renderTaskStatusTag = (status) => {
  const colorMap = {
    Todo: "default",
    "In Progress": "processing",
    Completed: "success",
  };
  return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
};