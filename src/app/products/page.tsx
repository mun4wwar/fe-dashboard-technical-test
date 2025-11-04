"use client";
import { useCallback, useEffect, useState } from "react";
import { Table, Button, Input, Space, Pagination, Image, Spin, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosClient, { setAuthToken } from "@/utils/axiosClient";
import ProductModal, { ProductFormValues } from "@/components/ProductModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

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
                    <Tooltip title="Edit">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button type="text" icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout title="Product Management">
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 32,
                    margin: "32px auto",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    maxWidth: 1500,
                    transition: "all 0.3s ease"
                }}
            >
                <h1 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, marginTop: 12, marginBottom: 20, letterSpacing: 0.3 }}>
                        Product Management
                </h1>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 20,
                    }}
                >
                    <Input
                        placeholder="Search Products..."
                        prefix={<SearchOutlined/>}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                        style={{ width: 300, borderRadius: 8, padding: "6px 12px", transition: "all 0.3s ease" }}
                        onFocus={(e) =>
                        (e.target.style.boxShadow = "0 0 0 2px #1677ff30")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        style={{
                            borderRadius: 8,
                            fontWeight: 500,
                            boxShadow: "0 2px 8px rgba(22, 119, 255, 0.25)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(22,119,255,0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,119,255,0.25)";
                        }}
                    >
                        Add Product
                    </Button>
                </div>
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="product_id"
                    loading={loading}
                    pagination={false}
                    style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        transition: "all 0.3s ease"
                    }}
                    rowClassName={() =>
                        "custom-row"
                    }
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
                    style={{ marginTop: 20, textAlign: "right" }}
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


                {modalLoading && (
                    <Spin 
                        style={{ 
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}
            </div>
            <style jsx global>{`
                .custom-row:hover {
                    background-color: #f7faff
                    transition: background-color 0.3 ease;
                }
            `}</style>
        </DashboardLayout>
    );
}
