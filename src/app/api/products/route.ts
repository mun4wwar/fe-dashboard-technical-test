import { BASE_API_URL } from "@/utils/config";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/web/v1/products`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}