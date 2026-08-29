// src/app/(auth)/login/page.jsx
import LoginForm from "../../../components/modules/auth/LoginForm";
import AuthGuard from "../../../components/layout/AuthGuard";

export const metadata = {
  title: "Sign In",
  description: "Secure login to access your CRM workspace and customer database.",
};

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginForm />
    </AuthGuard>
  );
}