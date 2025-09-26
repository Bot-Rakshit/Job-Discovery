// Script to generate a proper bcrypt hash for admin password
import bcrypt from "bcryptjs"

async function generateHash() {
  const password = "admin123"
  const saltRounds = 10

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('Generated bcrypt hash for "admin123":')
    console.log(hash)

    // Test the hash
    const isValid = await bcrypt.compare(password, hash)
    console.log("Hash verification test:", isValid ? "PASSED" : "FAILED")

    // Generate SQL statement
    console.log("\nSQL statement to insert admin:")
    console.log(
      `INSERT INTO admins (username, password_hash) VALUES ('admin', '${hash}') ON CONFLICT (username) DO UPDATE SET password_hash = '${hash}';`,
    )
  } catch (error) {
    console.error("Error generating hash:", error)
  }
}

generateHash()
