import bcrypt from "bcryptjs"

console.log("[v0] Generating fresh bcrypt hash for admin123...")

const password = "admin123"
const saltRounds = 10

const hash = bcrypt.hashSync(password, saltRounds)
console.log("[v0] Generated hash:", hash)

// Test the hash immediately
const testResult = bcrypt.compareSync(password, hash)
console.log("[v0] Hash test result:", testResult ? "Valid" : "Invalid")

console.log("[v0] Use this hash in your SQL update:")
console.log(`UPDATE admins SET password_hash = '${hash}' WHERE username = 'admin';`)
