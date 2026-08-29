// src/components/modules/tasks/TaskModal.jsx
"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, App } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { addTask, updateTask } from "../../../store/slices/taskSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";

const { TextArea } = Input;

export default function TaskModal({ isOpen, onClose, taskToEdit = null }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(taskToEdit);

  const customers = useSelector((state) => state.customers.items || []);
  const leads = useSelector((state) => state.leads.items || []);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        form.setFieldsValue({
          ...taskToEdit,
          dueDate: taskToEdit.dueDate ? dayjs(taskToEdit.dueDate) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "Todo",
          priority: "Medium",
          assignedTo: availableEmployees[0],
          dueDate: dayjs().add(3, "day"),
        });
      }
    }
  }, [isOpen, taskToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
      };

      await mockSecureApiCall(
        isEditing ? `/api/tasks/${taskToEdit.id}` : "/api/tasks",
        payload
      );

      if (isEditing) {
        dispatch(updateTask({ ...payload, id: taskToEdit.id }));
        message.success("Task updated successfully");
      } else {
        dispatch(addTask(payload));
        message.success("Task created successfully");
      }
      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      message.error("Failed to save task");
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Task" : "Create New Task"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEditing ? "Save Changes" : "Create Task"}
      cancelText="Cancel"
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: "Please enter task title" }]}
        >
          <Input placeholder="e.g. Schedule product demo call" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Add task context or notes..." />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true }]}
          >
            <Select
              options={availableEmployees.map((emp) => ({
                label: emp,
                value: emp,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select due date" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Todo", value: "Todo" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item name="customerId" label="Link to Customer (Optional)">
            <Select
              allowClear
              placeholder="Select customer"
              options={customers.map((c) => ({
                label: `${c.name} (${c.company})`,
                value: c.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="leadId" label="Link to Lead (Optional)">
            <Select
              allowClear
              placeholder="Select lead"
              options={leads.map((l) => ({
                label: `${l.name} (${l.company})`,
                value: l.id,
              }))}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}