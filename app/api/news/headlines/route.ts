import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get("symbol") || "AAPL";
    const response = await fetch(BACKEND_URL + "/api/live/news/" + symbol, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Backend returned " + response.status);
    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
