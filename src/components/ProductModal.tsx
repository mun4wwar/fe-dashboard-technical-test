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

  // setiap modal dibuka, reset form kalo ada data edit
    useEffect(() => {
    if (open) {
        if (type === "edit" && initialValues) {
        form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }
    }, [open, initialValues, type, form]);

    const handleFinish = (values: ProductFormValues) => {
        onSubmit(values);
        if (type === "create") form.resetFields();
    }

    return (
        <Modal
        destroyOnClose
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
            onFinish={handleFinish}
            initialValues={initialValues}
        >
            <Form.Item
            label="Product Title"
            name="product_title"
            rules={[{ required: true, message: "Title is required" }]}
            >
            <Input placeholder="e.g. iPhone 15 Pro" />
            </Form.Item>

            <Form.Item
            label="Price"
            name="product_price"
            rules={[{ required: true, message: "Price is required" }]}
            >
            <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="e.g. 25000000"
            />
            </Form.Item>

            <Form.Item label="Description" name="product_description">
            <Input.TextArea rows={3} placeholder="Describe the product... (optional)" />
            </Form.Item>

            <Form.Item label="Category" name="product_category">
            <Input placeholder="e.g. Category 1 (optional)" />
            </Form.Item>

            <Form.Item label="Image URL" name="product_image">
            <Input placeholder="https://example.com/image.jpg (optional)" />
            </Form.Item>
        </Form>
        </Modal>
    );
}
