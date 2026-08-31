// src/components/modules/tasks/TaskModal.jsx
"use client";

import { Modal, App, Form as AntdForm } from "antd";
import { Formik, Form as FormikForm } from "formik";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { addTask, updateTask } from "../../../store/slices/taskSlice";
import { availableEmployees } from "../../../mock/initialData";
import { mockSecureApiCall } from "../../../utils/security";
import { taskSchema } from "../../../utils/validationSchemas";
import { TextField, TextAreaField, SelectField, DateField } from "../../common/FormikFields";

const PRIORITY_OPTIONS = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const STATUS_OPTIONS = [
  { label: "Todo", value: "Todo" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

const EMPLOYEE_OPTIONS = availableEmployees.map((emp) => ({ label: emp, value: emp }));

export default function TaskModal({ isOpen, onClose, taskToEdit = null }) {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isEditing = Boolean(taskToEdit);

  const customers = useSelector((state) => state.customers.items || []);
  const leads = useSelector((state) => state.leads.items || []);

  const initialValues = {
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    assignedTo: taskToEdit?.assignedTo || availableEmployees[0],
    dueDate: taskToEdit?.dueDate ? dayjs(taskToEdit.dueDate) : dayjs().add(3, "day"),
    priority: taskToEdit?.priority || "Medium",
    status: taskToEdit?.status || "Todo",
    customerId: taskToEdit?.customerId || null,
    leadId: taskToEdit?.leadId || null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : null,
    };
    try {
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
    } catch {
      message.error("Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key={taskToEdit?.id || "new"}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={taskSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, resetForm }) => (
        <Modal
          title={isEditing ? "Edit Task" : "Create New Task"}
          open={isOpen}
          onOk={submitForm}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          okText={isEditing ? "Save Changes" : "Create Task"}
          cancelText="Cancel"
          confirmLoading={isSubmitting}
          centered
          destroyOnHidden
        >
          <FormikForm noValidate>
            <AntdForm layout="vertical" component="div" className="mt-4">
              <TextField name="title" label="Task Title" required placeholder="e.g. Schedule product demo call" />
              <TextAreaField name="description" label="Description" placeholder="Add task context or notes..." />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField name="assignedTo" label="Assigned To" required options={EMPLOYEE_OPTIONS} />
                <DateField name="dueDate" label="Due Date" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField name="priority" label="Priority" required options={PRIORITY_OPTIONS} />
                <SelectField name="status" label="Status" required options={STATUS_OPTIONS} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  name="customerId"
                  label="Link to Customer (Optional)"
                  allowClear
                  placeholder="Select customer"
                  options={customers.map((c) => ({
                    label: `${c.name} (${c.company})`,
                    value: c.id,
                  }))}
                />
                <SelectField
                  name="leadId"
                  label="Link to Lead (Optional)"
                  allowClear
                  placeholder="Select lead"
                  options={leads.map((l) => ({
                    label: `${l.name} (${l.company})`,
                    value: l.id,
                  }))}
                />
              </div>
            </AntdForm>
          </FormikForm>
        </Modal>
      )}
    </Formik>
  );
}
