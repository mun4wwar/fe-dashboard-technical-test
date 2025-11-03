"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Form, Typography, message } from "antd";
import { useAuth } from "@/context/AuthContext";

const { Title } = Typography;

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
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
        <Title level={3}>Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email wajib diisi" }]}
            >
            <Input type="email" />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
            >
            <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
                Login
            </Button>
            </Form.Item>
        </Form>
        </div>
    );
}
