# PrintWorks Admin

Panel de administración de PrintWorks, aplicación web que simula un emprendimiento de impresión 3D.

## Descripción

`cn1_front_admin` es el frontend administrativo de PrintWorks, diseñado para gestionar productos, pedidos y configuración del sistema. Utiliza autenticación con Microsoft Entra ID mediante MSAL.

## Propósito dentro de PrintWorks

Este componente es responsable de:

- Gestión de productos (CRUD, cálculo de precios, imágenes, tags)
- Gestión de pedidos (visualización, confirmación, cancelación, finalización)
- Configuración de filamentos y costos energéticos
- Dashboard con vista general del estado operativo

La autenticación administrativa utiliza **Microsoft Entra ID**. Las solicitudes protegidas pasarán posteriormente por **AWS API Gateway** hacia el BFF y los microservicios correspondientes.

## Stack Tecnológico

- **React 19.2.8** - Framework frontend
- **JavaScript** - Sin TypeScript
- **Bootstrap 5.3.8** - Framework CSS para estructura y componentes
- **React Bootstrap** - Componentes React de Bootstrap
- **React Router 7.18.2** - Enrutamiento
- **MSAL (@azure/msal-browser, @azure/msal-react)** - Autenticación con Microsoft Entra ID
- **Vitest** - Framework de pruebas
- **React Testing Library** - Pruebas de componentes
- **Vite 8.2.2** - Build tool y dev server

## Requisitos Previos

- Node.js (versión recomendada: 18 o superior)
- npm o yarn
- Una cuenta de Microsoft Entra ID configurada para autenticación

## Instalación

1. Clonar el repositorio:
```bash
git clone <repositorio-url>
cd cn1_front_admin
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (ver sección siguiente).

## Ejecución Local

### Modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Build de producción
```bash
npm run build
```
Los archivos generados estarán en la carpeta `dist/`

### Preview de producción
```bash
npm run preview
```

## Comandos npm

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run preview` - Previsualiza build de producción
- `npm run test` - Ejecuta pruebas con Vitest
- `npm run lint` - Ejecuta linter con oxlint

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```env
# Microsoft Entra ID / MSAL Configuration
VITE_ENTRA_CLIENT_ID=your-client-id-here
VITE_ENTRA_TENANT_ID=your-tenant-id-here
VITE_ENTRA_REDIRECT_URI=http://localhost:5173
VITE_ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:5173

# API Configuration (para futura integración con API Gateway)
VITE_API_BASE_URL=https://your-api-gateway-url.com
VITE_API_SCOPE=api://your-api-scope

# Mock Mode (true durante desarrollo sin backend)
VITE_USE_MOCKS=true
```

## Configuración de MSAL / Entra ID

Para habilitar la autenticación con Microsoft Entra ID, necesitas proporcionar los siguientes valores:

### Valores requeridos de Microsoft Entra ID

1. **VITE_ENTRA_CLIENT_ID** - El Application (client) ID de tu app registrada en Entra ID
2. **VITE_ENTRA_TENANT_ID** - El Directory (tenant) ID de tu organización Entra ID
3. **VITE_ENTRA_REDIRECT_URI** - URL de redirección después del login (ej: `http://localhost:5173`)
4. **VITE_ENTRA_POST_LOGOUT_REDIRECT_URI** - URL de redirección después del logout (ej: `http://localhost:5173`)

### Pasos para obtener estos valores

1. Accede al [Azure Portal](https://portal.azure.com/)
2. Ve a **Microsoft Entra ID** > **App registrations**
3. Crea una nueva aplicación o selecciona una existente
4. Copia el **Application (client) ID** y el **Directory (tenant) ID**
5. En **Authentication**, agrega `http://localhost:5173` como plataforma **Single-page application**
6. Configura los permisos necesarios (ej: `User.Read` para Microsoft Graph)

### Configuración futura de API Gateway

Cuando exista el backend, también necesitarás:

- **VITE_API_BASE_URL** - URL del API Gateway de AWS
- **VITE_API_SCOPE** - Scope configurado en API Gateway para validar tokens

## Light Mode y Dark Mode

PrintWorks Admin soporta temas claro y oscuro con las siguientes características:

- **Persistencia**: La preferencia se guarda en `localStorage` con clave `printworks-theme`
- **Fallback**: Si no hay preferencia guardada, usa `prefers-color-scheme` del sistema
- **Cambio manual**: Botón en la topbar para alternar entre temas
- **Aplicación inmediata**: El cambio no requiere recarga de página

### Paleta oficial PrintWorks

- `#606c38` - Primary
- `#283618` - Primary Dark
- `#fefae0` - Surface Soft
- `#dda15e` - Accent
- `#bc6c25` - Accent Strong

Los componentes usan variables CSS semánticas para adaptarse automáticamente al tema seleccionado.

## Testing

### Configuración

Las pruebas usan **Vitest** con **React Testing Library** en entorno jsdom. El setup se encuentra en `src/test/setup.js`.

### Ejecución de pruebas

```bash
npm run test
```

Las pruebas se ejecutan en modo watch. Presiona `q` para salir.

### Pruebas implementadas

Actualmente se cubren:

- **ThemeContext**: Preferencia guardada, fallback a sistema, toggle, persistencia
- **authService**: Login, logout, getAccount, getDisplayName, isAuthenticated, acquireApiToken

Las pruebas de MSAL usan mocks para probar el comportamiento de nuestro código React sin depender de la librería real.

## Estructura del Proyecto

```
src/
├── assets/              # Imágenes y recursos estáticos
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── dashboard/      # Componentes de dashboard
│   ├── products/       # Componentes de productos
│   ├── orders/         # Componentes de pedidos
│   └── config/         # Componentes de configuración
├── config/             # Configuraciones
│   └── msalConfig.js   # Configuración de MSAL
├── context/            # Contextos React
│   └── ThemeContext.jsx # Contexto de tema
├── hooks/              # Custom hooks
├── layouts/            # Layouts
│   └── AdminLayout.jsx # Layout administrativo principal
├── pages/              # Páginas
│   ├── Login/          # Página de login
│   ├── Dashboard/      # Página dashboard
│   ├── Products/       # Páginas de productos
│   ├── Orders/         # Páginas de pedidos
│   ├── Configuration/  # Páginas de configuración
│   ├── Unauthorized/   # Página de acceso no autorizado
│   └── NotFound/       # Página 404
├── routes/             # Rutas
│   ├── AppRoutes.jsx   # Configuración de rutas
│   └── ProtectedRoute.jsx # Ruta protegida
├── services/           # Servicios
│   ├── authService.js  # Servicio de autenticación
│   ├── apiClient.js    # Cliente HTTP (futuro)
│   ├── dashboardService.js # Servicio de dashboard
│   ├── productService.js  # Servicio de productos
│   ├── orderService.js   # Servicio de pedidos
│   └── configService.js  # Servicio de configuración
├── styles/             # Estilos
│   ├── variables.css   # Variables CSS
│   ├── global.css      # Estilos globales
│   ├── components.css  # Estilos de componentes
│   └── bootstrap-overrides.css # Overrides de Bootstrap
├── test/               # Configuración de pruebas
│   ├── setup.js        # Setup de Vitest
│   └── test-utils.jsx  # Helpers de pruebas
├── utils/              # Utilidades
│   ├── currency.js     # Formateo de moneda
│   ├── dates.js        # Formateo de fechas
│   └── status.js       # Utilidades de estado
├── App.jsx             # Componente principal (reemplazado por AppRoutes)
└── main.jsx            # Punto de entrada
```

## Preparación para futura integración con API Gateway / BFF

La arquitectura está preparada para integración con el backend:

1. **Capa de servicios**: Toda la lógica de datos pasa por `services/`
2. **Modo mock**: `VITE_USE_MOCKS=true` usa datos locales durante desarrollo
3. **API Client**: `apiClient.js` centralizará llamadas HTTP
4. **Token MSAL**: `authService.acquireApiToken()` obtendrá tokens para API Gateway
5. **Transición**: Cambiar de mock a API solo requiere modificar los services, no las páginas

### Flujo futuro

```
Frontend Admin
      |
      v
authService.acquireApiToken()
      |
      v
apiClient (con Bearer token)
      |
      v
AWS API Gateway (valida token)
      |
      v
BFF
      |
      +--> ms-config
      +--> ms-products
      `--> ms-orders
```

## Estado Actual de Implementación

Esta versión implementa las **Fases A, B y C** del plan:

- ✅ Fase A: Bootstrap técnico (React, Bootstrap, Router, Vitest, estructura)
- ✅ Fase B: Sistema visual (variables CSS, Light/Dark Mode, layout)
- ✅ Fase C: MSAL + Entra ID (configuración, login, rutas protegidas, logout)

## Próximos pasos (Fases D en adelante)

Las siguientes fases del plan incluyen:

- Fase D: Dashboard mock con datos de servicio
- Fase E: Productos mock (CRUD, filtros, cálculo visual)
- Fase F: Pedidos mock (listado, detalle, acciones por estado)
- Fase G: Configuración mock (filamentos, costos energéticos)
- Fase H: Cobertura completa de pruebas
- Fase I: Preparación para integración con API

## Licencia

Proyecto académico para la asignatura Cloud Native I - Duoc UC 2026
