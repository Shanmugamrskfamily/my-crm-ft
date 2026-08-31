// src/components/modules/customers/CustomerModal.jsx
"use client";

import { Modal, App, Form as AntdForm } from "antd";
import { Formik, Form as FormikForm } from "formik";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../../store/slices/customerSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";
import { customerSchema } from "../../../utils/validationSchemas";
import { TextField, SelectField } from "../../common/FormikFields";

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Lead", value: "Lead" },
];

const EMPLOYEE_OPTIONS = availableEmployees.map((emp) => ({ label: emp, value: emp }));

export default function CustomerModal({ isOpen, onClose, customerToEdit = null }) {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(customerToEdit);

  const initialValues = {
    name: customerToEdit?.name || "",
    email: customerToEdit?.email || "",
    phone: customerToEdit?.phone || "",
    company: customerToEdit?.company || "",
    location: customerToEdit?.location || "",
    status: customerToEdit?.status || "Active",
    assignedEmployee: customerToEdit?.assignedEmployee || availableEmployees[0],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
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
    } catch {
      message.error("Failed to save customer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key={customerToEdit?.id || "new"}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={customerSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, resetForm }) => (
        <Modal
          title={isEditing ? "Edit Customer Details" : "Add New Customer"}
          open={isOpen}
          onOk={submitForm}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          okText={isEditing ? "Save Changes" : "Create Customer"}
          cancelText="Cancel"
          confirmLoading={isSubmitting}
          centered
          destroyOnHidden
        >
          <FormikForm noValidate>
            <AntdForm layout="vertical" component="div" className="mt-4">
              <TextField name="name" label="Full Name" required placeholder="e.g. Anand Mahindra" />
              <TextField name="email" label="Email Address" required placeholder="e.g. anand@company.com" />
              <TextField name="phone" label="Phone Number" required placeholder="e.g. +91 98450 12345" />
              <TextField name="company" label="Company Name" required placeholder="e.g. TechCorp Solutions" />
              <TextField name="location" label="Location" required placeholder="e.g. Hyderabad, Telangana" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField name="status" label="Status" required options={STATUS_OPTIONS} />
                <SelectField
                  name="assignedEmployee"
                  label="Assigned Employee"
                  required
                  options={EMPLOYEE_OPTIONS}
                />
              </div>
            </AntdForm>
          </FormikForm>
        </Modal>
      )}
    </Formik>
  );
}
