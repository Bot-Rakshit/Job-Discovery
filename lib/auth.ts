import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

export interface Admin {
  id: number
  username: string
  created_at: string
}

export interface Session {
  id: number
  admin_id: number
  session_token: string
  expires_at: string
  created_at: string
}

// Generate a secure session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createOrVerifyAdmin(username: string, password: string): Promise<Admin | null> {
  try {
    console.log("[v0] Checking if admin exists...")

    // Check if any admin exists
    const existingAdmins = await sql`SELECT COUNT(*) as count FROM admins`
    const adminCount = existingAdmins[0].count

    console.log("[v0] Admin count:", adminCount)

    if (adminCount === 0) {
      // No admin exists, create one with the provided credentials
      console.log("[v0] No admin exists, creating first admin with provided credentials")
      const hashedPassword = await bcrypt.hash(password, 10)

      const result = await sql`
        INSERT INTO admins (username, password_hash)
        VALUES (${username}, ${hashedPassword})
        RETURNING id, username, created_at
      `

      console.log("[v0] First admin created successfully")
      return result[0] as Admin
    } else {
      // Admin exists, try to verify credentials
      console.log("[v0] Admin exists, verifying credentials")
      const admin = await verifyAdmin(username, password)

      if (!admin) {
        // If verification fails, it might be due to corrupted data
        // Clear existing admin and create new one with current credentials
        console.log("[v0] Verification failed, clearing corrupted admin data and creating fresh admin")

        // Clear existing admin and sessions
        await sql`DELETE FROM admin_sessions`
        await sql`DELETE FROM admins`

        // Create new admin with current credentials
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await sql`
          INSERT INTO admins (username, password_hash)
          VALUES (${username}, ${hashedPassword})
          RETURNING id, username, created_at
        `

        console.log("[v0] Fresh admin created successfully")
        return result[0] as Admin
      }

      return admin
    }
  } catch (error) {
    console.error("[v0] Error in createOrVerifyAdmin:", error)
    return null
  }
}

// Verify admin credentials
export async function verifyAdmin(username: string, password: string): Promise<Admin | null> {
  try {
    console.log("[v0] Querying database for username:", username)

    const result = await sql`
      SELECT id, username, password_hash, created_at 
      FROM admins 
      WHERE username = ${username}
    `

    console.log("[v0] Database query result:", result.length > 0 ? "User found" : "User not found")

    if (result.length === 0) {
      console.log("[v0] No admin found with username:", username)
      return null
    }

    const admin = result[0]
    console.log("[v0] Comparing password with hash...")

    const isValid = await bcrypt.compare(password, admin.password_hash)
    console.log("[v0] Password comparison result:", isValid ? "Valid" : "Invalid")

    if (!isValid) {
      console.log("[v0] Password verification failed")
      return null
    }

    console.log("[v0] Admin verification successful")
    return {
      id: admin.id,
      username: admin.username,
      created_at: admin.created_at,
    }
  } catch (error) {
    console.error("[v0] Error verifying admin:", error)
    return null
  }
}

// Create a new session
export async function createSession(adminId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  try {
    await sql`
      INSERT INTO admin_sessions (admin_id, session_token, expires_at)
      VALUES (${adminId}, ${sessionToken}, ${expiresAt.toISOString()})
    `

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })

    return sessionToken
  } catch (error) {
    console.error("Error creating session:", error)
    throw new Error("Failed to create session")
  }
}

// Verify session and get admin
export async function getAdminFromSession(): Promise<Admin | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) return null

    const result = await sql`
      SELECT a.id, a.username, a.created_at
      FROM admins a
      JOIN admin_sessions s ON a.id = s.admin_id
      WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (result.length === 0) return null

    return result[0] as Admin
  } catch (error) {
    console.error("Error getting admin from session:", error)
    return null
  }
}

// Logout admin
export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      // Delete session from database
      await sql`
        DELETE FROM admin_sessions 
        WHERE session_token = ${sessionToken}
      `
    }

    // Clear cookie
    cookieStore.delete("admin_session")
  } catch (error) {
    console.error("Error logging out admin:", error)
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await sql`
      DELETE FROM admin_sessions 
      WHERE expires_at < NOW()
    `
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error)
  }
}
