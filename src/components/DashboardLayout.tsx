import { useAuth } from "@/context/AuthContext";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const { Header, Content } = Layout;
const { Title } = Typography;

interface DashboardLayoutProps {
    title?: string;
    children: ReactNode
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const menu = (
        <Menu
            items={[
                {
                    key: "profile",
                    label: "Profile",
                    icon: <UserOutlined />,
                },
                {
                    type: "divider"
                },
                {
                    key: "logout",
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    danger: true,
                    onClick: handleLogout
                }
            ]}
        />
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
        {/* Navbar/Header */}
            <Header
                style={{
                background: "#001529",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingInline: 24,
                }}
            >
                <Title level={4} style={{ color: "#fff", margin: 0 }}>
                    {title || "Dashboard"}
                </Title>

                <Dropdown overlay={menu} placement="bottomRight" arrow>
                    <Space style={{ cursor: "pointer", color: "#fff" }}>
                        <Avatar size="small" style={{ backgroundColor: "#1677ff" }}>
                            {user?.email?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <span>{user?.email}</span>
                    </Space>
                </Dropdown>
            </Header>

        {/* Page Content */}
            <Content style={{ padding: 24, background: "#fff" }}>{children}</Content>
        </Layout>
    );
}