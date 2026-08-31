// src/components/modules/leads/LeadModal.jsx
"use client";

import { Modal, App, Form as AntdForm } from "antd";
import { Formik, Form as FormikForm } from "formik";
import { useDispatch } from "react-redux";
import { addLead, updateLead } from "../../../store/slices/leadSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";
import { leadSchema } from "../../../utils/validationSchemas";
import { TextField, SelectField } from "../../common/FormikFields";

const LEAD_STATUS_OPTIONS = [
  { label: "New", value: "New" },
  { label: "Contacted", value: "Contacted" },
  { label: "Follow-up", value: "Follow-up" },
  { label: "Qualified", value: "Qualified" },
  { label: "Converted", value: "Converted" },
  { label: "Lost", value: "Lost" },
];

const LEAD_SOURCE_OPTIONS = [
  { label: "Website Form", value: "Website Form" },
  { label: "LinkedIn Outreach", value: "LinkedIn Outreach" },
  { label: "Referral", value: "Referral" },
  { label: "Cold Call", value: "Cold Call" },
];

const EMPLOYEE_OPTIONS = availableEmployees.map((emp) => ({ label: emp, value: emp }));

export default function LeadModal({ isOpen, onClose, leadToEdit = null }) {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(leadToEdit);

  const initialValues = {
    name: leadToEdit?.name || "",
    company: leadToEdit?.company || "",
    email: leadToEdit?.email || "",
    phone: leadToEdit?.phone || "",
    location: leadToEdit?.location || "",
    status: leadToEdit?.status || "New",
    source: leadToEdit?.source || "Website Form",
    assignedEmployee: leadToEdit?.assignedEmployee || availableEmployees[0],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
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
    } catch {
      message.error("Failed to save lead");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key={leadToEdit?.id || "new"}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={leadSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, resetForm }) => (
        <Modal
          title={isEditing ? "Edit Lead Details" : "Create New Lead"}
          open={isOpen}
          onOk={submitForm}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          okText={isEditing ? "Save Changes" : "Create Lead"}
          cancelText="Cancel"
          confirmLoading={isSubmitting}
          centered
          destroyOnHidden
        >
          <FormikForm noValidate>
            <AntdForm layout="vertical" component="div" className="mt-4">
              <TextField name="name" label="Lead Name" required placeholder="e.g. Rahul Sharma" />
              <TextField name="company" label="Company Name" required placeholder="e.g. Nexus Enterprises" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField name="email" label="Email Address" required placeholder="rahul@nexus.io" />
                <TextField name="phone" label="Phone Number" required placeholder="+91 98410 00112" />
              </div>

              <TextField name="location" label="Location" required placeholder="e.g. Chennai, Tamil Nadu" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SelectField name="status" label="Status" required options={LEAD_STATUS_OPTIONS} />
                <SelectField name="source" label="Lead Source" required options={LEAD_SOURCE_OPTIONS} />
                <SelectField
                  name="assignedEmployee"
                  label="Assigned To"
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
