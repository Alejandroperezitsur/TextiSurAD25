-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS textisur_db;
USE textisur_db;

select * from users;
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('comprador', 'vendedor') NOT NULL,
  avatarUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de tiendas
CREATE TABLE IF NOT EXISTS stores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  logo VARCHAR(255),
  userId INT UNSIGNED NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  imageUrl VARCHAR(255),
  storeId INT UNSIGNED NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
);

-- Insertar usuarios de prueba
INSERT INTO users (name, email, password, role, avatarUrl) VALUES
('Juan Vendedor', 'vendedor@example.com', '$2b$10$X/XQvjlGQKrE.YhkP1bOT.LbPzh5DS3SHUfMS5wTIadAqFCNkrIjm', 'vendedor', 'https://picsum.photos/seed/juanvendedor/100/100'),
('Ana Compradora', 'comprador@example.com', '$2b$10$X/XQvjlGQKrE.YhkP1bOT.LbPzh5DS3SHUfMS5wTIadAqFCNkrIjm', 'comprador', 'https://picsum.photos/seed/anacompradora/100/100');
-- Nota: Las contraseñas son 'password123' hasheadas con bcrypt