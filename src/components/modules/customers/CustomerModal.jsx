// src/components/modules/customers/CustomerModal.jsx
"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../../store/slices/customerSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";

export default function CustomerModal({ isOpen, onClose, customerToEdit = null }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(customerToEdit);

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        form.setFieldsValue(customerToEdit);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "Active",
          assignedEmployee: availableEmployees[0],
        });
      }
    }
  }, [isOpen, customerToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Simulate encrypted API submission
      await mockSecureApiCall(
        isEditing ? `/api/customers/${customerToEdit.id}` : "/api/customers",
        values
      );

      if (isEditing) {
        dispatch(updateCustomer({ ...values, id: customerToEdit.id }));
        message.success("Customer updated successfully");
      } else {
        dispatch(addCustomer(values));
        message.success("Customer added successfully");
      }
      onClose();
    } catch (error) {
      if (error?.errorFields) return; // AntD Form validation error
      message.error("Failed to save customer");
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Customer Details" : "Add New Customer"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEditing ? "Save Changes" : "Create Customer"}
      cancelText="Cancel"
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input placeholder="e.g. Anand Mahindra" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="e.g. anand@company.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="e.g. +91 98450 12345" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company Name"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="e.g. TechCorp Solutions" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g. Hyderabad, Telangana" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Lead", value: "Lead" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="assignedEmployee"
            label="Assigned Employee"
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