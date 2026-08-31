// src/components/common/FormikFields.jsx
"use client";

import { useField } from "formik";
import { Input, Select, DatePicker, Form as AntdForm } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

/**
 * Wraps any child input with AntD Form.Item, injecting label, error text,
 * and validate status from Formik meta.
 */
function FieldWrapper({ label, name, required, children }) {
  const [, meta] = useField(name);
  const showError = meta.touched && !!meta.error;
  return (
    <AntdForm.Item
      label={label}
      required={required}
      validateStatus={showError ? "error" : ""}
      help={showError ? meta.error : undefined}
    >
      {children}
    </AntdForm.Item>
  );
}

export function TextField({ name, label, required, prefix, placeholder, autoComplete, type = "text" }) {
  const [field, , helpers] = useField(name);
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <Input
        {...field}
        type={type}
        prefix={prefix}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => helpers.setValue(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function PasswordField({ name, label, required, prefix, placeholder, autoComplete }) {
  const [field, , helpers] = useField(name);
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <Input.Password
        {...field}
        prefix={prefix}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => helpers.setValue(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({ name, label, required, placeholder, rows = 3 }) {
  const [field, , helpers] = useField(name);
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <TextArea
        {...field}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => helpers.setValue(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function SelectField({ name, label, required, options, placeholder, allowClear }) {
  const [field, , helpers] = useField(name);
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <Select
        value={field.value ?? undefined}
        options={options}
        placeholder={placeholder}
        allowClear={allowClear}
        onChange={(value) => helpers.setValue(value ?? null)}
        onBlur={() => helpers.setTouched(true)}
      />
    </FieldWrapper>
  );
}

export function DateField({ name, label, required, format = "YYYY-MM-DD" }) {
  const [field, , helpers] = useField(name);
  const value = field.value ? (dayjs.isDayjs(field.value) ? field.value : dayjs(field.value)) : null;
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <DatePicker
        className="w-full"
        format={format}
        value={value}
        onChange={(date) => helpers.setValue(date)}
        onBlur={() => helpers.setTouched(true)}
      />
    </FieldWrapper>
  );
}
