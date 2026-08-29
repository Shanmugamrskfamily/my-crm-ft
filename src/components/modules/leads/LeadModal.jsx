// src/components/modules/leads/LeadModal.jsx
"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { useDispatch } from "react-redux";
import { addLead, updateLead } from "../../../store/slices/leadSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";

export default function LeadModal({ isOpen, onClose, leadToEdit = null }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(leadToEdit);

  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        form.setFieldsValue(leadToEdit);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "New",
          source: "Website Form",
          assignedEmployee: availableEmployees[0],
        });
      }
    }
  }, [isOpen, leadToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await mockSecureApiCall(
        isEditing ? `/api/leads/${leadToEdit.id}` : "/api/leads",
        values
      );

      if (isEditing) {
        dispatch(updateLead({ ...values, id: leadToEdit.id }));
        message.success("Lead updated successfully");
      } else {
        dispatch(addLead(values));
        message.success("Lead created successfully");
      }
      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      message.error("Failed to save lead");
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Lead Details" : "Create New Lead"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEditing ? "Save Changes" : "Create Lead"}
      cancelText="Cancel"
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Lead Name"
          rules={[{ required: true, message: "Please enter lead contact name" }]}
        >
          <Input placeholder="e.g. Rahul Sharma" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company Name"
          rules={[{ required: true, message: "Please enter company" }]}
        >
          <Input placeholder="e.g. Nexus Enterprises" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email format" },
            ]}
          >
            <Input placeholder="rahul@nexus.io" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+91 98410 00112" />
          </Form.Item>
        </div>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g. Chennai, Tamil Nadu" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "New", value: "New" },
                { label: "Contacted", value: "Contacted" },
                { label: "Follow-up", value: "Follow-up" },
                { label: "Qualified", value: "Qualified" },
                { label: "Converted", value: "Converted" },
                { label: "Lost", value: "Lost" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="source"
            label="Lead Source"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Website Form", value: "Website Form" },
                { label: "LinkedIn Outreach", value: "LinkedIn Outreach" },
                { label: "Referral", value: "Referral" },
                { label: "Cold Call", value: "Cold Call" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="assignedEmployee"
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
        </div>
      </Form>
    </Modal>
  );
}