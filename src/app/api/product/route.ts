import { BASE_API_URL } from "@/utils/config";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const response = await axios.post(`${BASE_API_URL}/api/web/v1/product`, data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}