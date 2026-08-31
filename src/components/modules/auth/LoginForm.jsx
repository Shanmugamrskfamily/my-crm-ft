// src/components/modules/auth/LoginForm.jsx
"use client";

import { useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Button, Card, Typography, Divider, App, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
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

              <Divider className="my-5">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.14em] font-semibold">
                  Quick Demo Logins
                </span>
              </Divider>

              <div className="grid grid-cols-1 gap-2.5">
                {MOCK_USERS.map((demo) => {
                  const isAdmin = demo.user.role === "Admin";
                  const initial = demo.user.name.charAt(0).toUpperCase();
                  const RoleIcon = isAdmin ? CrownOutlined : TeamOutlined;
                  return (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => {
                        setValues({ email: demo.email, password: demo.password });
                        setErrorMessage(null);
                      }}
                      className="group w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md dark:hover:bg-slate-800/70 transition-all duration-200 px-3 py-2.5 flex items-center gap-3"
                    >
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-sm flex-shrink-0 shadow-sm ${
                          isAdmin
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-700"
                            : "bg-gradient-to-br from-emerald-500 to-emerald-700"
                        }`}
                      >
                        {initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {demo.user.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                              isAdmin
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            }`}
                          >
                            <RoleIcon style={{ fontSize: 9 }} />
                            {isAdmin ? "Admin" : "Sales"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                          {demo.email}
                        </div>
                      </div>

                      <SafetyCertificateOutlined
                        className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0"
                        style={{ fontSize: 16 }}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500">
                Click a card to auto-fill credentials &middot; password{" "}
                <span className="font-mono font-semibold text-slate-500 dark:text-slate-300">
                  Password@123
                </span>
              </p>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
}
