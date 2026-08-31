// src/components/modules/auth/LoginForm.jsx
"use client";

import { useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Button, Card, Typography, Divider, App, Alert } from "antd";
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginSuccess } from "../../../store/slices/authSlice";
import { authenticateUser, MOCK_USERS } from "../../../services/authService";
import { loginSchema } from "../../../utils/validationSchemas";
import { TextField, PasswordField } from "../../common/FormikFields";

const { Title, Text } = Typography;

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { message } = App.useApp();

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage(null);
    try {
      const authResult = await authenticateUser(values);
      dispatch(loginSuccess(authResult));
      message.success(`Welcome back, ${authResult.user.name}!`);
      router.replace("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Failed to authenticate. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <Card
        className="w-full max-w-md shadow-xl rounded-2xl border-slate-200 dark:border-slate-800"
        styles={{ body: { padding: "32px 28px" } }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl mb-3 shadow-md">
            A
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Sign In to Apex CRM
          </Title>
          <Text type="secondary" className="text-xs">
            Enter your workplace credentials to access the CRM portal
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage(null)}
            className="mb-4 text-xs"
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setValues }) => (
            <FormikForm noValidate>
              <TextField
                name="email"
                label={<span className="text-xs font-semibold uppercase text-slate-600">Email Address</span>}
                prefix={<UserOutlined className="text-slate-400 mr-1" />}
                placeholder="e.g. admin@crm.io"
                autoComplete="email"
                required
              />

              <PasswordField
                name="password"
                label={<span className="text-xs font-semibold uppercase text-slate-600">Password</span>}
                prefix={<LockOutlined className="text-slate-400 mr-1" />}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
                className="font-medium h-11 bg-indigo-600 hover:bg-indigo-500 mt-2"
              >
                Sign In
              </Button>

              <Divider className="my-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Quick Demo Logins</span>
              </Divider>

              <div className="space-y-2">
                {MOCK_USERS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => {
                      setValues({ email: demo.email, password: demo.password });
                      setErrorMessage(null);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/60 dark:bg-slate-900/60 transition flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                        {demo.user.name} ({demo.user.role})
                      </p>
                      <p className="text-[11px] text-slate-400">{demo.email} &bull; Password@123</p>
                    </div>
                    <SafetyCertificateOutlined className="text-slate-400 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
}
