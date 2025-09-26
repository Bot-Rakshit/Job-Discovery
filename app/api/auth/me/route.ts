import { NextResponse } from "next/server"
import { getAdminFromSession } from "@/lib/auth"

export async function GET() {
  try {
    const admin = await getAdminFromSession()

    if (!admin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
