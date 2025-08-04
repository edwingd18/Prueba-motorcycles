# Sistema de Gestión de Motocicletas

Sistema completo para la gestión de ventas de motocicletas con backend en Spring Boot, frontend en Next.js y base de datos PostgreSQL.

## Arquitectura

- **Backend**: Spring Boot 3.5.4 con Java 17
- **Frontend**: Next.js 15.4.5 con React 19
- **Base de datos**: PostgreSQL 15
- **Contenedores**: Docker y Docker Compose

## Configuración con Docker

### Prerrequisitos

- Docker
- Docker Compose

### Ejecutar la aplicación completa

```bash
# Clonar el repositorio
git clone https://github.com/edwingd18/Prueba-motorcycles

cd motorcycles

# Ejecutar todos los servicios
docker-compose up -d

# Ver logs (opcional)
docker-compose logs -f
```

### Servicios disponibles

| Servicio    | URL                   | Puerto | Descripción            |
| ----------- | --------------------- | ------ | ---------------------- |
| Frontend    | http://localhost:3000 | 3000   | Aplicación web Next.js |
| Backend API | http://localhost:8080 | 8080   | API REST Spring Boot   |
| PostgreSQL  | localhost:5432        | 5432   | Base de datos          |

### Credenciales por defecto

**PostgreSQL:**

- Usuario: `postgres`
- Contraseña: `admin123`
- Base de datos: `motocicletas`

## APIs Disponibles

### Base URL

```
http://localhost:8080/api
```

### 1. Customers API

#### Endpoints

- `GET /api/customers` - Obtener todos los clientes
- `GET /api/customers/{id}` - Obtener cliente por ID
- `POST /api/customers` - Crear nuevo cliente
- `PUT /api/customers/{id}` - Actualizar cliente
- `DELETE /api/customers/{id}` - Eliminar cliente

#### Modelo Customer

```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "phone": "+1234567890",
  "documentNumber": "12345678",
  "documentType": "DNI",
  "address": "Calle 123",
  "city": "Ciudad",
  "state": "Estado",
  "zipCode": "12345",
  "country": "País",
  "birthDate": "1990-01-01",
  "status": "ACTIVE",
  "notes": "Notas adicionales",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### Tipos de documento

- `DNI`
- `CEDULA`
- `PASSPORT`
- `DRIVER_LICENSE`

#### Estados del cliente

- `ACTIVE`
- `INACTIVE`
- `BLOCKED`

### 2. Employees API

#### Endpoints

- `GET /api/employees` - Obtener todos los empleados
- `GET /api/employees/{id}` - Obtener empleado por ID
- `POST /api/employees` - Crear nuevo empleado
- `PUT /api/employees/{id}` - Actualizar empleado
- `DELETE /api/employees/{id}` - Eliminar empleado

#### Modelo Employee

```json
{
  "id": 1,
  "firstName": "María",
  "lastName": "García",
  "email": "maria.garcia@company.com",
  "phone": "+1234567890",
  "address": "Calle 456",
  "city": "Ciudad",
  "state": "Estado",
  "zipCode": "12345",
  "country": "País",
  "jobTitle": "Vendedor",
  "salary": 50000.0,
  "hireDate": "2023-01-01",
  "terminationDate": null,
  "status": "ACTIVE",
  "notes": "Notas del empleado",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### Estados del empleado

- `ACTIVE`
- `INACTIVE`
- `TERMINATED`

### 3. Motorcycles API

#### Endpoints

- `GET /api/motorcycles` - Obtener todas las motocicletas
- `GET /api/motorcycles/{id}` - Obtener motocicleta por ID
- `POST /api/motorcycles` - Crear nueva motocicleta
- `PUT /api/motorcycles/{id}` - Actualizar motocicleta
- `DELETE /api/motorcycles/{id}` - Eliminar motocicleta

#### Modelo Motorcycle

```json
{
  "id": 1,
  "name": "CBR 600RR",
  "brand": "Honda",
  "model": "2024",
  "year": 2024,
  "engineSize": 600,
  "color": "Rojo",
  "price": 15000.0,
  "stock": 5,
  "description": "Motocicleta deportiva",
  "status": "AVAILABLE"
}
```

### 4. Sales API

#### Endpoints

- `GET /api/sales` - Obtener todas las ventas
- `GET /api/sales/{id}` - Obtener venta por ID
- `GET /api/sales/{id}/details` - Obtener venta con detalles
- `POST /api/sales` - Crear nueva venta
- `PUT /api/sales/{id}` - Actualizar venta
- `DELETE /api/sales/{id}` - Eliminar venta

#### Modelo Sale

```json
{
  "id": 1,
  "customerId": 1,
  "employeeId": 1,
  "saleDate": "2024-01-01T10:00:00",
  "totalAmount": 15000.0,
  "status": "COMPLETED",
  "notes": "Venta al contado",
  "detailSales": []
}
```

### 5. Detail Sales API

#### Endpoints

- `GET /api/detail-sales` - Obtener todos los detalles de venta
- `GET /api/detail-sales/{id}` - Obtener detalle por ID
- `POST /api/detail-sales` - Crear nuevo detalle
- `PUT /api/detail-sales/{id}` - Actualizar detalle
- `DELETE /api/detail-sales/{id}` - Eliminar detalle

#### Modelo DetailSale

```json
{
  "id": 1,
  "saleId": 1,
  "motorcycleId": 1,
  "quantity": 1,
  "unitPrice": 15000.0,
  "subtotal": 15000.0,
  "discount": 0.0
}
```

## MER

![Imagen del MER](https://i.ibb.co/h1sd70wT/image.png)

## Consultas SQL de Análisis

### Acceso a la base de datos via Docker

Para ejecutar las consultas SQL directamente en la base de datos PostgreSQL, sigue estos pasos:

#### 1. Acceder al contenedor PostgreSQL

```bash
# Conectar al contenedor de PostgreSQL
docker exec -it motorcycles-postgres psql -U postgres -d motocicletas
```

#### 2. Comandos básicos de PostgreSQL

```sql
-- Ver todas las tablas
\dt

-- Describir estructura de una tabla
\d motorcycles
\d employees
\d customers
\d sales
\d detail_sales

-- Salir de PostgreSQL
\q
```

#### 3. Método alternativo (ejecutar consulta directamente)

```bash
# Ejecutar consulta sin entrar al shell interactivo
docker exec -it motorcycles-postgres psql -U postgres -d motocicletas -c "SELECT * FROM motorcycles LIMIT 5;"
```

### Consultas de análisis disponibles

### 1. Top 5 motocicletas más vendidas

Esta consulta muestra las 5 motocicletas más vendidas por cantidad de productos y dinero total generado:

```sql
SELECT
    m.name,
    m.brand,
    SUM(ds.quantity) as cantidad_productos,
    SUM(ds.subtotal) as dinero_total
FROM motorcycles m
JOIN detail_sales ds ON ds.motorcycle_id = m.id
GROUP BY m.id, m.name
ORDER BY cantidad_productos DESC
LIMIT 5;
```

### 2. Rendimiento de empleados por marca Suzuki

Esta consulta analiza el desempeño de ventas de cada empleado específicamente para motocicletas Suzuki:

```sql
SELECT
    e.first_name,
    e.last_name,
    SUM(ds.quantity) as cantidad_productos,
    SUM(ds.subtotal) as dinero_total
FROM employees e
JOIN sales s ON s.employee_id = e.id
JOIN detail_sales ds ON ds.sale_id = s.id
JOIN motorcycles m ON m.id = ds.motorcycle_id
WHERE m.brand = 'Suzuki'
GROUP BY e.first_name, e.last_name;
```

## Desarrollo

### Ejecutar en modo desarrollo

#### Backend (Spring Boot)

```bash
cd motorcycles
./mvnw spring-boot:run
```

#### Frontend (Next.js)

```bash
cd motorcycles-frontend
npm install
npm run dev
```

#### Base de datos

```bash
# Ejecutar solo PostgreSQL
docker-compose up postgres -d
```

### Estructura del proyecto

```
motorcycles/
├── docker-compose.yml          # Configuración de servicios
├── database_setup.sql          # Script de inicialización de BD
├── postgresql.conf             # Configuración PostgreSQL
├── motorcycles/                # Backend Spring Boot
│   ├── src/main/java/
│   ├── pom.xml
│   └── Dockerfile
├── motorcycles-frontend/       # Frontend Next.js
│   ├── src/
│   ├── package.json
│   └── Dockerfile
└── README.md
```

## Puertos utilizados

- **3000**: Frontend (Next.js)
- **8080**: Backend API (Spring Boot)
- **5432**: PostgreSQL
- **5050**: PgAdmin
