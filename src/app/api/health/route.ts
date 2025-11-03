import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check - just check if server is responding
    return NextResponse.json({ 
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ 
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 503 });
  }
}