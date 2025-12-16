import { connectDB } from "@/lib/Connection"
import { NextResponse } from "next/server"


export async function GET() {
    await connectDB()
    return NextResponse.json({
        success: true,
        message: "Success"
    })
}
