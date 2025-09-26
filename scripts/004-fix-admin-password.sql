-- Fix admin password with properly generated bcrypt hash
-- Delete existing admin to avoid conflicts
DELETE FROM admins WHERE username = 'admin';

-- Insert admin with correct bcrypt hash for 'admin123'
-- This hash was generated using bcryptjs with 10 salt rounds
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2b$10$rOvHITktkuuipdzLjKz0O.WkW8gNn8nh8GJWBQRqrwWbxQzYvjXJi');

-- Verify the admin was inserted
SELECT username, created_at FROM admins WHERE username = 'admin';
