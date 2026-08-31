// src/app/(dashboard)/layout.jsx
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Typography,
  Switch,
  theme as antdTheme,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserAddOutlined,
  CheckSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { logout } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/uiSlice";
import AuthGuard from "../../components/layout/AuthGuard";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const currentTheme = useSelector((state) => state.ui.theme);
  const {
    token: { colorBgContainer, colorBgLayout, borderRadiusLG, colorBorderSecondary },
  } = antdTheme.useToken();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: "Customers",
    },
    {
      key: "/leads",
      icon: <UserAddOutlined />,
      label: "Leads",
    },
    {
      key: "/tasks",
      icon: <CheckSquareOutlined />,
      label: "Tasks",
    },
  ];

  const handleMenuClick = ({ key }) => {
    router.push(key);
  };

  const userDropdownItems = [
    {
      key: "profile",
      label: (
        <div>
          <Text strong>{user?.name || "CRM User"}</Text>
          <div className="text-xs text-slate-400">
            {user?.email || "user@crm.io"}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <AuthGuard>
      <Layout style={{ minHeight: "100vh"}}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={(value) => setCollapsed(value)}
          width={240}
          className="shadow-md"
        >
          <div className="h-16 flex items-center justify-center border-b border-slate-700/40 px-4">
            <div className="flex items-center gap-2 font-bold text-white text-lg tracking-wide">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base">
                A
              </span>
              {!collapsed && <span>Apex CRM</span>}
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="mt-2"
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 24px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${colorBorderSecondary}`,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 44, height: 44 }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Switch
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
                checked={currentTheme === "dark"}
                onChange={() => dispatch(toggleTheme())}
              />
              <Dropdown
                menu={{ items: userDropdownItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div
                  className="cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "4px 10px 4px 4px",
                    borderRadius: 999,
                    transition: "background 0.15s",
                  }}
                >
                  <Avatar
                    style={{ backgroundColor: "#4f46e5", flexShrink: 0 }}
                    icon={<UserOutlined />}
                    size={36}
                  />
                  <div
                    className="hidden md:flex"
                    style={{
                      flexDirection: "column",
                      lineHeight: 1.15,
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {user?.name || "CRM User"}
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {user?.role || "Sales Representative"}
                    </span>
                  </div>
                </div>
              </Dropdown>
            </div>
          </Header>

          <Content
            style={{
              margin: 16,
              padding: 24,
              minHeight: 280,
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}