"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Form, Typography, message, Card } from "antd";
import { useAuth } from "@/context/AuthContext";

const { Title, Text } = Typography;

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
        await login(values.email, values.password);
        message.success("Login berhasil!");
        router.push("/products"); // redirect ke products
        } catch (err) {
        console.error(err);
        message.error("Login gagal. Cek email/password");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #001529, #000000)",
            }}
        >
            <Card
                style={{
                    width:480,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    borderRadius: 12
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                    <Title level={3} style={{ marginBottom:0 }}>
                        Login
                    </Title>
                    <Text type= "secondary">Please Enter Your Credentials</Text>
                </div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Email wajib diisi" }]}
                    >
                    <Input type="email" placeholder="youremail@xmaple.com" />
                    </Form.Item>

                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Password wajib diisi" }]}
                    >
                    <Input.Password placeholder="********" />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        Login
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
