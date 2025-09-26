// Test script to verify bcrypt hash generation and comparison
const bcrypt = require("bcryptjs")

async function testHash() {
  const password = "admin123"
  const storedHash = "$2b$10$rOvHITktkuuipdzLjKz0O.WkW8gNn8nh8GJWBQRqrwWbxQzYvjXJi"

  console.log("Testing password:", password)
  console.log("Against hash:", storedHash)

  // Test the stored hash
  const isValid = await bcrypt.compare(password, storedHash)
  console.log("Stored hash valid:", isValid)

  // Generate a new hash for comparison
  const newHash = await bcrypt.hash(password, 10)
  console.log("New hash:", newHash)

  // Test the new hash
  const newHashValid = await bcrypt.compare(password, newHash)
  console.log("New hash valid:", newHashValid)

  // Test with different passwords
  const testPasswords = ["admin123", "Admin123", "admin 123", "admin123 "]

  for (const testPwd of testPasswords) {
    const result = await bcrypt.compare(testPwd, storedHash)
    console.log(`Password "${testPwd}" (length: ${testPwd.length}):`, result)
  }
}

testHash().catch(console.error)
