import { type NextRequest, NextResponse } from "next/server"
import { createOrVerifyAdmin, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Login attempt for username:", username)

    if (!username || !password) {
      console.log("[v0] Missing username or password")
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    console.log("[v0] Attempting to create or verify admin...")
    const admin = await createOrVerifyAdmin(username, password)

    if (!admin) {
      console.log("[v0] Admin verification failed - invalid credentials")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Admin verified successfully, creating session...")
    const sessionToken = await createSession(admin.id)
    console.log("[v0] Session created successfully")

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
