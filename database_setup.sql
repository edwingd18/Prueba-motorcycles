-- ===================================
-- SCRIPT PARA CREAR BASE DE DATOS Y TABLAS
-- SISTEMA DE VENTAS DE MOTOCICLETAS
-- ===================================

-- 1. CREAR BASE DE DATOS (ejecutar como superusuario)
-- CREATE DATABASE motocicletas;
-- \c motocicletas;

-- ===================================
-- 2. CREAR TABLAS
-- ===================================

-- TABLA: motorcycles
CREATE TABLE motorcycles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    type VARCHAR(50) CHECK (type IN ('SPORT', 'CRUISER', 'TOURING', 'STANDARD', 'DIRT_BIKE', 'SCOOTER', 'ELECTRIC')),
    model VARCHAR(255),
    year INTEGER,
    color VARCHAR(255),
    stock INTEGER DEFAULT 0,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: employees
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    document_number VARCHAR(255) UNIQUE,
    document_type VARCHAR(20) CHECK (document_type IN ('DNI', 'CEDULA', 'PASSPORT', 'DRIVER_LICENSE')),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    country VARCHAR(255),
    job_title VARCHAR(255) NOT NULL,
    salary DECIMAL(19,2),
    hire_date DATE,
    termination_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: customers
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) NOT NULL,
    document_number VARCHAR(255) UNIQUE,
    document_type VARCHAR(20) CHECK (document_type IN ('DNI', 'CEDULA', 'PASSPORT', 'DRIVER_LICENSE')),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    country VARCHAR(255),
    birth_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: sales
CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    sale_number VARCHAR(255) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(19,2) NOT NULL,
    status VARCHAR(255) DEFAULT 'PENDING',
    payment_method VARCHAR(255) CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'FINANCING')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- FOREIGN KEYS
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_sales_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- TABLA: detail_sales
CREATE TABLE detail_sales (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    motorcycle_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(19,2) NOT NULL,
    discount DECIMAL(19,2) DEFAULT 0,
    subtotal DECIMAL(19,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- FOREIGN KEYS
    CONSTRAINT fk_detail_sales_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_detail_sales_motorcycle FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id)
);

-- ===================================
-- 3. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ===================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_motorcycles_code ON motorcycles(code);
CREATE INDEX idx_motorcycles_brand ON motorcycles(brand);
CREATE INDEX idx_motorcycles_type ON motorcycles(type);
CREATE INDEX idx_motorcycles_available ON motorcycles(available);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_document ON employees(document_number);
CREATE INDEX idx_employees_status ON employees(status);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_document ON customers(document_number);
CREATE INDEX idx_customers_status ON customers(status);

CREATE INDEX idx_sales_number ON sales(sale_number);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_employee ON sales(employee_id);

CREATE INDEX idx_detail_sales_sale ON detail_sales(sale_id);
CREATE INDEX idx_detail_sales_motorcycle ON detail_sales(motorcycle_id);

-- ===================================
-- 4. INSERTAR DATOS DE EJEMPLO
-- ===================================

-- Insertar empleados de ejemplo
INSERT INTO employees (first_name, last_name, email, phone, document_number, document_type, address, city, state, country, job_title, salary, hire_date, status, notes) VALUES
('Juan', 'Pérez', 'juan.perez@motorcycles.com', '555-0001', '1234567890', 'CEDULA', 'Calle 123 #45-67', 'Bogotá', 'Cundinamarca', 'Colombia', 'Vendedor Senior', 2500000.00, '2023-01-15', 'ACTIVE', 'Excelente vendedor con 5 años de experiencia'),
('María', 'González', 'maria.gonzalez@motorcycles.com', '555-0002', '0987654321', 'CEDULA', 'Carrera 78 #12-34', 'Medellín', 'Antioquia', 'Colombia', 'Gerente de Ventas', 3500000.00, '2022-06-10', 'ACTIVE', 'Líder del equipo de ventas'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@motorcycles.com', '555-0003', '1122334455', 'CEDULA', 'Avenida 45 #23-56', 'Cali', 'Valle del Cauca', 'Colombia', 'Vendedor Junior', 2000000.00, '2023-03-20', 'ACTIVE', 'Nuevo en el equipo, muy prometedor'),
('Ana', 'Morales', 'ana.morales@motorcycles.com', '555-0004', '5544332211', 'CEDULA', 'Calle 67 #89-12', 'Barranquilla', 'Atlántico', 'Colombia', 'Asesora Comercial', 2200000.00, '2023-05-10', 'ACTIVE', 'Especialista en motocicletas deportivas');

-- Insertar motocicletas de ejemplo
INSERT INTO motorcycles (code, name, description, brand, price, type, model, year, color, stock, available) VALUES
('KAW001', 'Ninja 300', 'Motocicleta deportiva ideal para principiantes', 'Kawasaki', 18500000.00, 'SPORT', 'Ninja 300', 2024, 'Verde', 5, true),
('HON001', 'CB 190R', 'Naked bike urbana y versátil', 'Honda', 12500000.00, 'STANDARD', 'CB 190R', 2024, 'Rojo', 8, true),
('YAM001', 'MT-03', 'Naked deportiva de entrada', 'Yamaha', 16800000.00, 'STANDARD', 'MT-03', 2024, 'Azul', 3, true),
('SUZ001', 'V-Strom 250', 'Adventure touring compacta', 'Suzuki', 19200000.00, 'TOURING', 'V-Strom 250', 2024, 'Amarillo', 2, true),
('KTM001', 'Duke 200', 'Naked agresiva y divertida', 'KTM', 15900000.00, 'STANDARD', 'Duke 200', 2024, 'Naranja', 4, true),
('HON002', 'PCX 150', 'Scooter premium con tecnología avanzada', 'Honda', 9800000.00, 'SCOOTER', 'PCX 150', 2024, 'Blanco', 6, true),
('YAM002', 'XTZ 250', 'Enduro versátil para ciudad y campo', 'Yamaha', 14500000.00, 'DIRT_BIKE', 'XTZ 250', 2024, 'Azul', 3, true),
('KAW002', 'Versys-X 300', 'Adventure media cilindrada muy capaz', 'Kawasaki', 22800000.00, 'TOURING', 'Versys-X 300', 2024, 'Verde', 2, true);

-- Insertar customers de ejemplo
INSERT INTO customers (first_name, last_name, email, phone, document_number, document_type, city, state, country, birth_date, status, notes) VALUES
('Ana', 'Martínez', 'ana.martinez@email.com', '300-555-0001', '12345678', 'CEDULA', 'Bogotá', 'Cundinamarca', 'Colombia', '1990-05-15', 'ACTIVE', 'Cliente frecuente, interesada en motos deportivas'),
('Luis', 'García', 'luis.garcia@email.com', '300-555-0002', '87654321', 'CEDULA', 'Medellín', 'Antioquia', 'Colombia', '1985-08-22', 'ACTIVE', 'Prefiere motocicletas de touring'),
('Sofia', 'López', 'sofia.lopez@email.com', '300-555-0003', '11223344', 'CEDULA', 'Cali', 'Valle del Cauca', 'Colombia', '1992-12-03', 'ACTIVE', 'Primera moto, busca algo urbano'),
('Diego', 'Hernández', 'diego.hernandez@email.com', '300-555-0004', '44332211', 'CEDULA', 'Barranquilla', 'Atlántico', 'Colombia', '1988-03-18', 'ACTIVE', 'Motociclista experimentado'),
('Carmen', 'Ruiz', 'carmen.ruiz@email.com', '300-555-0005', '55667788', 'CEDULA', 'Bucaramanga', 'Santander', 'Colombia', '1995-07-10', 'ACTIVE', 'Interesada en scooters'),
('Roberto', 'Silva', 'roberto.silva@email.com', '300-555-0006', '99887766', 'CEDULA', 'Pereira', 'Risaralda', 'Colombia', '1987-11-25', 'ACTIVE', 'Busca moto para trabajo');

-- Insertar ventas de ejemplo
INSERT INTO sales (sale_number, customer_id, employee_id, sale_date, total, status, payment_method) VALUES
('SALE-2024-001', 1, 1, '2024-01-15 10:30:00', 18500000.00, 'CONFIRMED', 'FINANCING'),
('SALE-2024-002', 2, 2, '2024-01-20 14:45:00', 19200000.00, 'DELIVERED', 'CASH'),
('SALE-2024-003', 3, 1, '2024-01-25 16:20:00', 12500000.00, 'DELIVERED', 'CREDIT_CARD'),
('SALE-2024-004', 4, 3, '2024-02-01 11:15:00', 15900000.00, 'CONFIRMED', 'BANK_TRANSFER'),
('SALE-2024-005', 5, 4, '2024-02-05 09:30:00', 9800000.00, 'DELIVERED', 'CASH'),
('SALE-2024-006', 6, 2, '2024-02-10 13:45:00', 31300000.00, 'CONFIRMED', 'FINANCING'),
('SALE-2024-007', 1, 3, '2024-02-15 15:20:00', 14500000.00, 'PENDING', 'CREDIT_CARD');

-- Insertar detalles de ventas de ejemplo
INSERT INTO detail_sales (sale_id, motorcycle_id, quantity, unit_price, discount, subtotal, notes) VALUES
-- Venta 1: Ana compra Ninja 300
(1, 1, 1, 18500000.00, 0.00, 18500000.00, 'Primera moto deportiva del cliente'),

-- Venta 2: Luis compra V-Strom 250
(2, 4, 1, 19200000.00, 0.00, 19200000.00, 'Perfecta para sus viajes de aventura'),

-- Venta 3: Sofia compra CB 190R
(3, 2, 1, 12500000.00, 0.00, 12500000.00, 'Ideal para uso urbano'),

-- Venta 4: Diego compra Duke 200
(4, 5, 1, 15900000.00, 0.00, 15900000.00, 'Upgrade de su moto anterior'),

-- Venta 5: Carmen compra PCX 150
(5, 6, 1, 9800000.00, 0.00, 9800000.00, 'Scooter para uso diario'),

-- Venta 6: Roberto compra MT-03 + XTZ 250 (venta múltiple)
(6, 3, 1, 16800000.00, 300000.00, 16500000.00, 'Moto principal para trabajo'),
(6, 7, 1, 14500000.00, 200000.00, 14300000.00, 'Moto secundaria para campo'),

-- Venta 7: Ana compra segunda moto - XTZ 250
(7, 7, 1, 14500000.00, 0.00, 14500000.00, 'Segunda moto para aventuras');

-- ===================================
-- 5. VERIFICAR CREACIÓN DE TABLAS
-- ===================================

-- Comando para verificar que las tablas se crearon correctamente
-- \dt

-- Comando para ver la estructura de una tabla específica
-- \d motorcycles
-- \d employees
-- \d customers
-- \d sales
-- \d detail_sales