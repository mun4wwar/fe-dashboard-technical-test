"use client";
import { useCallback, useEffect, useState } from "react";
import { Table, Button, Input, Space, Typography, Pagination, Image, Spin } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axiosClient, { setAuthToken } from "@/utils/axiosClient";
import ProductModal, { ProductFormValues } from "@/components/ProductModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Product {
    product_id: string;
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
    created_timestamp?: string;
    updated_timestamp?: string;
}

export default function ProductsPage() {
    const { user, getToken } = useAuth()
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"create" | "edit">("create");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        if (user === null) router.push("/login");
    }, [user, router]);

    const fetchProducts = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const token = await getToken();
            setAuthToken(token || null);

            const res = await axiosClient.get("/products", {
                params: { page, limit, search },
            });

            const data = res.data?.data || [];
            const pagination = res.data?.pagination || {};

            setProducts(data);
            setTotal(pagination.total || 0);
        } catch (error) {
            console.error("Fetch products error:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [user, page, limit, search, getToken]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchSingleProduct = async (productId: string) => {
        setModalLoading(true);
        try {
            const res = await axiosClient.get("/product", {params: { product_id: productId } });
            return res.data?.data || null;
        } catch (error) {
            console.error("Failed fetching Product: ", error);
            return null;
        } finally {
            setModalLoading(false);
        }
    };

    const handleEdit = async (product: Product) => {
        const fullProduct = await fetchSingleProduct(product.product_id);
        setSelectedProduct(fullProduct);
        setModalType("edit");
        setOpenModal(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setModalType("create");
        setOpenModal(true);
    };

    const handleSubmit = async (values: ProductFormValues) => {
        try {
        if (modalType === "create") {
            await axiosClient.post("/product", values);
        } else if (modalType === "edit" && selectedProduct) {
            await axiosClient.put("/product", {
                product_id: selectedProduct.product_id,
                ...values,
            });
        }

        await fetchProducts();
        setOpenModal(false);
        } catch (error) {
        console.error("Failed saving product:", error);
        }
    };

    const columns = [
        {
        title: "Image",
        dataIndex: "product_image",
        key: "image",
        render: (url: string) =>
            url ? (
            <Image
                src={url}
                alt="product"
                style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
                boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                }}
            />
            ) : (
            <span style={{ color: "#999" }}>No Image</span>
            ),
        },
        { title: "Title", dataIndex: "product_title", key: "title" },
        {
            title: "Price",
            dataIndex: "product_price",
            key: "price",
            render: (v: number) => (v ? `Rp. ${v.toLocaleString()}` : "-"),
        },
        { title: "Category", dataIndex: "product_category", key: "category" },
        {
            title: "Description",
            dataIndex: "product_description",
            key: "description",
            render: (text: string) =>
                text?.length > 50 ? text.slice(0, 50) + "..." : text,
        },
        {
            title: "Action",
            key: "actions",
            render: (_: unknown, record: Product) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h1>Welcome, {user?.email}</h1>
        <Title level={3}>Product Management</Title>

        <Space style={{ marginBottom: 16 }}>
            <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
            }}
            allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Product
            </Button>
        </Space>

        <Table
            dataSource={products}
            columns={columns}
            rowKey="product_id"
            loading={loading}
            pagination={false}
        />

        <Pagination
            current={page}
            total={total}
            pageSize={limit}
            showSizeChanger
            onChange={(p, size) => {
            setPage(p);
            setLimit(size);
            }}
            style={{ marginTop: 16, textAlign: "right" }}
        />

        {openModal && (
            <ProductModal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onSubmit={handleSubmit}
            initialValues={selectedProduct ?? undefined}
            type={modalType}
            />
        )}


        {modalLoading && <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />}
        </div>
    );
}
