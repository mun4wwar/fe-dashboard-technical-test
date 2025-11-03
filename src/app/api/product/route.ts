import axiosClient from "@/utils/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) return NextResponse.json({error: "PRODUCT_ID_REQUIRED"}, {status:400});

    try {
        const res = await axiosClient.get("/product", { params: { product_id } });
        return NextResponse.json(res.data);
    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status:500 }); 
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const res = await axiosClient.post("/product", body);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    try {
        const res = await axiosClient.put("/product", body);
        return NextResponse.json(res.data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}