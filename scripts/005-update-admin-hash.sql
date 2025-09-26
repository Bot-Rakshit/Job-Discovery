-- Update admin password with freshly generated hash
UPDATE admins SET password_hash = '$2b$10$K8QJ5Z5Z5Z5Z5Z5Z5Z5Z5uGJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5' WHERE username = 'admin';

-- Verify the update
SELECT username, password_hash FROM admins WHERE username = 'admin';
