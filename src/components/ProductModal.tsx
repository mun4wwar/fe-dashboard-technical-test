"use client";
import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

export interface ProductFormValues {
    product_title: string;
    product_price: number;
    product_description?: string;
    product_category?: string;
    product_image?: string;
}

interface ProductModalProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: ProductFormValues) => void;
    initialValues?: ProductFormValues;
    type: "create" | "edit";
}

export default function ProductModal({
    open,
    onCancel,
    onSubmit,
    initialValues,
    type,
    }: ProductModalProps) {
    const [form] = Form.useForm();

  // 🧠 setiap kali modal dibuka, isi ulang form kalau ada data edit
    useEffect(() => {
    if (open) {
        if (initialValues) {
        form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }
    }, [open, initialValues, form]);

    return (
        <Modal
        title={type === "create" ? "Create Product" : "Edit Product"}
        open={open}
        onCancel={() => {
            form.resetFields();
            onCancel();
        }}
        onOk={() => form.submit()}
        okText={type === "create" ? "Create" : "Update"}
        >
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
            onSubmit(values);
            form.resetFields(); // 🧹 biar form bersih setelah submit
            }}
            initialValues={initialValues}
        >
            <Form.Item
            label="Product Title"
            name="product_title"
            rules={[{ required: true, message: "Title required" }]}
            >
            <Input placeholder="e.g. iPhone 15 Pro" />
            </Form.Item>

            <Form.Item
            label="Price"
            name="product_price"
            rules={[{ required: true, message: "Price required" }]}
            >
            <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="e.g. 25000000"
            />
            </Form.Item>

            <Form.Item label="Description" name="product_description">
            <Input.TextArea rows={3} placeholder="Describe the product..." />
            </Form.Item>

            <Form.Item label="Category" name="product_category">
            <Input placeholder="e.g. Category 1" />
            </Form.Item>

            <Form.Item label="Image URL" name="product_image">
            <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
        </Form>
        </Modal>
    );
}
