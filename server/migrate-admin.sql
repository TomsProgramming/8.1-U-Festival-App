-- Admin CMS migratie — voer dit uit op een bestaande ufestival database
-- Gebruik: mysql -u root -p ufestival < server/migrate-admin.sql

USE ufestival;

CREATE TABLE IF NOT EXISTS admin_users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(64)  NOT NULL UNIQUE,
  pw_hash    VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
