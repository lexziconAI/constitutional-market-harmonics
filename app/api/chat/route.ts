import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(BACKEND_URL + "/api/chat", {
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(BACKEND_URL + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Backend returned " + response.status);
    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
