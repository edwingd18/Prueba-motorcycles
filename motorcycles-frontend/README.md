# Motorcycle Store Frontend

Frontend desarrollado con Next.js, TypeScript y Tailwind CSS para el sistema de gestión de motocicletas.

## Características

- **Dashboard**: Resumen general con estadísticas
- **Gestión de Motocicletas**: CRUD completo para el inventario
- **Gestión de Clientes**: Administración de información de clientes
- **Gestión de Ventas**: Registro y consulta de ventas
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop
- **Componentes ZenUI**: Interfaz moderna y limpia

## Tecnologías

- Next.js 15
- TypeScript
- Tailwind CSS
- Axios (para consumir APIs)
- Lucide React (iconos)

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js (App Router)
│   ├── customers/         # Página de clientes
│   ├── motorcycles/       # Página de motocicletas
│   ├── sales/            # Página de ventas
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Dashboard
├── components/           # Componentes reutilizables
│   ├── Button.tsx       # Componente de botón
│   ├── Sidebar.tsx      # Barra lateral de navegación
│   └── Table.tsx        # Componente de tabla
├── services/            # Servicios para APIs
│   └── api.ts          # Configuración de Axios y endpoints
├── types/              # Tipos TypeScript
│   └── index.ts       # Interfaces y tipos
└── lib/               # Utilidades
    └── utils.ts      # Funciones auxiliares
```

## Configuración de API

El frontend está configurado para consumir las APIs del backend en `http://localhost:3001/api`.

Para cambiar la URL base, edita el archivo `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:3001/api";
```

## Componentes Principales

### Sidebar

Barra lateral de navegación con menú responsive y diseño ZenUI.

### Table

Componente de tabla reutilizable con:

- Estado de carga
- Mensaje de datos vacíos
- Columnas personalizables
- Renderizado condicional

### Button

Botón con múltiples variantes y tamaños siguiendo el diseño ZenUI.

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run lint` - Ejecutar linter

## Uso

1. Asegúrate de que el backend esté ejecutándose en el puerto 3001
2. Ejecuta el frontend con `npm run dev`
3. Navega por las diferentes secciones usando el sidebar
4. Las tablas muestran los datos consumidos de las APIs del backend

## Próximas Funcionalidades

- Formularios para crear/editar registros
- Paginación en las tablas
- Filtros y búsqueda
- Validación de formularios
- Notificaciones toast
- Confirmaciones de acciones
