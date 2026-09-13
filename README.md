# PrintWorks Admin

Panel de administración de PrintWorks, aplicación web para la gestión de un emprendimiento de impresión 3D.

## Descripción

`cn1_front_admin` es el frontend administrativo de PrintWorks, diseñado para gestionar productos, pedidos y configuración del sistema.

La aplicación utiliza **Microsoft Entra ID** mediante **MSAL** para autenticar a los usuarios administrativos y obtener el Access Token utilizado en las solicitudes protegidas hacia los microservicios.

Actualmente se encuentra integrado con:

- `cn1_ms_config`
- `cn1_ms_products`

La integración con `ms-orders` corresponde a una etapa posterior.

Durante el desarrollo, el frontend puede utilizar datos mock mediante configuración, aunque los módulos de Configuración y Productos ya disponen de integración real con sus respectivos microservicios.

---

## Propósito dentro de PrintWorks

Este componente es responsable de:

- Gestión administrativa de productos
- Creación y edición de productos
- Activación y desactivación de productos
- Visualización de precios y costos
- Recálculo de precios
- Gestión de filamentos
- Configuración de costos energéticos
- Gestión futura de imágenes y tags
- Gestión futura de pedidos
- Dashboard con vista general del estado operativo
- Autenticación administrativa mediante Microsoft Entra ID

El frontend obtiene un Access Token mediante MSAL y lo envía en las solicitudes HTTP protegidas.

En producción, las solicitudes utilizan **AWS API Gateway** como punto de entrada hacia los microservicios.

---

## Stack Tecnológico

- **React 19.2.8**
- **JavaScript**
- **Bootstrap 5.3.8**
- **React Bootstrap**
- **React Router 7.18.2**
- **MSAL (`@azure/msal-browser`, `@azure/msal-react`)**
- **Vitest**
- **React Testing Library**
- **Vite 8.2.2**

---

## Requisitos Previos

Antes de ejecutar el proyecto es necesario contar con:

- Node.js 18 o superior
- npm
- Git
- Microsoft Entra ID configurado
- `cn1_ms_config` para utilizar Configuración real
- `cn1_ms_products` para utilizar Productos reales

Para desarrollo integrado localmente se utilizan actualmente:

```text
cn1_front_admin  → localhost:5173
cn1_ms_config    → localhost:8080
cn1_ms_products  → localhost:8081
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repositorio-url>
cd cn1_front_admin
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear el archivo de variables de entorno

El proyecto incluye un archivo `.env.example`.

Crear `.env` utilizando:

```bash
cp .env.example .env
```

Luego editar `.env` con los valores correspondientes al entorno local.

> El archivo `.env` contiene configuración específica del entorno y no debe subirse al repositorio.

---

## Ejecución Local

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible por defecto en:

```text
http://localhost:5173
```

### Backend local

Para utilizar Configuración y Productos sin mocks deben estar ejecutándose:

```text
ms-config    → http://localhost:8080
ms-products  → http://localhost:8081
```

Vite utiliza un proxy de desarrollo para distribuir las solicitudes hacia cada microservicio.

### Build de producción

```bash
npm run build
```

Los archivos generados estarán disponibles en:

```text
dist/
```

### Preview de producción

```bash
npm run preview
```

---

## Comandos npm

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run test` | Ejecuta las pruebas con Vitest |
| `npm run lint` | Ejecuta el linter |

---

## Variables de Entorno

Crear `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Las principales variables utilizadas son:

```env
# Microsoft Entra ID / MSAL Configuration
VITE_ENTRA_CLIENT_ID=REEMPLAZAR
VITE_ENTRA_TENANT_ID=REEMPLAZAR
VITE_ENTRA_REDIRECT_URI=http://localhost:5173/cn1_front_admin/
VITE_ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/cn1_front_admin/

# API Configuration
# Vacío en desarrollo local para utilizar el proxy de Vite
VITE_API_BASE_URL=
VITE_API_SCOPE=api://80bf85e9-a444-4754-b780-c65dfff74876/access_as_user

# Mock Mode
# false = utiliza los microservicios reales
# true = utiliza datos mock cuando estén disponibles
VITE_USE_MOCKS=false
```

### Desarrollo local

En desarrollo local:

```env
VITE_API_BASE_URL=
VITE_USE_MOCKS=false
```

`VITE_API_BASE_URL` permanece vacío intencionalmente.

Esto provoca que las solicitudes sean relativas:

```text
/api/v1/config/...
/api/v1/products/...
```

y permite que el servidor de desarrollo de Vite las redirija mediante su proxy.

### Producción

En producción, `VITE_API_BASE_URL` contiene la dirección de AWS API Gateway.

Actualmente el despliegue utiliza:

```text
https://1335t86sik.execute-api.us-east-1.amazonaws.com
```

El valor se proporciona durante el build mediante GitHub Secrets:

```text
VITE_API_BASE_URL
```

De esta forma, el mismo código puede trabajar:

```text
LOCAL
Frontend
   ↓
Vite Proxy
   ├── ms-config :8080
   └── ms-products :8081


PRODUCCIÓN
GitHub Pages
   ↓
API Gateway
   ↓
Microservicios AWS
```

### Modo Mock

El proyecto conserva soporte para mocks mediante:

```env
VITE_USE_MOCKS=true
```

Para utilizar las integraciones reales:

```env
VITE_USE_MOCKS=false
```

Los módulos de Configuración y Productos se encuentran preparados para utilizar los servicios backend reales.

---

## Proxy Local de Vite

Para permitir que el frontend consuma múltiples microservicios durante desarrollo local, `vite.config.js` contiene un proxy.

Configuración actual:

```js
server: {
  proxy: {
    '/api/v1/config': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/api/v1/products': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    },
    '/api/v1/tags': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    },
  },
},
```

Esto permite que el frontend realice solicitudes como:

```text
/api/v1/config/filaments
/api/v1/config/printing
/api/v1/products/admin
```

sin conocer directamente el puerto de cada microservicio.

El proxy de Vite se utiliza exclusivamente durante:

```bash
npm run dev
```

y no forma parte del build estático desplegado en GitHub Pages.

---

## GitHub Pages

El proyecto utiliza:

```js
base: '/cn1_front_admin/'
```

para permitir que los assets generados por Vite funcionen correctamente bajo el subdirectorio utilizado por GitHub Pages.

El sitio desplegado se encuentra bajo:

```text
https://raulfuenzalida.github.io/cn1_front_admin/
```

El proxy local de Vite no afecta al despliegue de GitHub Pages.

Durante el build de producción, `VITE_API_BASE_URL` se obtiene desde GitHub Secrets y apunta hacia AWS API Gateway.

---

## GitHub Actions

El despliegue hacia GitHub Pages se realiza mediante GitHub Actions.

Durante:

```bash
npm run build
```

se proporcionan las variables:

```text
VITE_ENTRA_CLIENT_ID
VITE_ENTRA_TENANT_ID
VITE_ENTRA_REDIRECT_URI
VITE_ENTRA_POST_LOGOUT_REDIRECT_URI
VITE_API_BASE_URL
VITE_API_SCOPE
VITE_USE_MOCKS
```

El flujo general es:

```text
Push a develop
      ↓
GitHub Actions
      ↓
npm ci
      ↓
npm run build
      ↓
Variables VITE_* desde GitHub Secrets
      ↓
dist/
      ↓
GitHub Pages
```

Las variables `VITE_*` utilizadas por una aplicación frontend forman parte del bundle generado y no deben contener secretos privados.

---

## Configuración de MSAL / Microsoft Entra ID

La autenticación administrativa utiliza Microsoft Entra ID mediante MSAL.

### Valores requeridos

1. **VITE_ENTRA_CLIENT_ID**

   Application (client) ID de la aplicación registrada en Entra ID.

2. **VITE_ENTRA_TENANT_ID**

   Directory (tenant) ID correspondiente al tenant utilizado.

3. **VITE_ENTRA_REDIRECT_URI**

   URL utilizada después del proceso de autenticación.

4. **VITE_ENTRA_POST_LOGOUT_REDIRECT_URI**

   URL utilizada después de cerrar sesión.

5. **VITE_API_SCOPE**

   Scope utilizado para solicitar el Access Token destinado a la API de PrintWorks.

### Access Token vs ID Token

Las APIs protegidas utilizan:

```http
Authorization: Bearer <access_token>
```

El frontend obtiene el Access Token mediante MSAL y utiliza:

```text
tokenResult.accessToken
```

El ID Token no se utiliza como sustituto del Access Token.

Tampoco debe utilizarse un Access Token destinado a Microsoft Graph como token para las APIs de PrintWorks.

---

## Configuración básica en Entra ID

1. Acceder a Microsoft Entra ID.
2. Entrar a **App registrations**.
3. Seleccionar la aplicación de PrintWorks Admin.
4. Obtener:
   - Application (client) ID
   - Directory (tenant) ID
5. Configurar la aplicación como **Single-page application (SPA)**.
6. Registrar las URI de redirección necesarias.
7. Configurar el scope utilizado por la API de PrintWorks.
8. Mantener sincronizadas las URLs de producción con las variables utilizadas por GitHub Actions.

La aplicación utiliza `HashRouter` para mantener compatibilidad con GitHub Pages.

Ejemplo:

```text
https://raulfuenzalida.github.io/cn1_front_admin/#/dashboard
```

---

## Flujo de Autenticación

```text
Usuario
   ↓
PrintWorks Admin
   ↓
Microsoft Entra ID
   ↓
Autenticación
   ↓
Access Token
   ↓
PrintWorks Admin
   ↓
Solicitud HTTP
Authorization: Bearer <access_token>
```

`authService` es responsable de obtener el token utilizado posteriormente por `apiClient`.

---

## Flujo de Comunicación con Backend

### Desarrollo local

```text
                     ┌──────────────────┐
                     │   Front Admin    │
                     │ localhost:5173   │
                     └────────┬─────────┘
                              │
                         Vite Proxy
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌─────────────┐     ┌─────────────┐
             │  ms-config  │     │ ms-products │
             │    :8080    │     │    :8081    │
             └─────────────┘     └─────────────┘
```

Las rutas determinan automáticamente el microservicio correspondiente:

```text
/api/v1/config/*    → ms-config
/api/v1/products/*  → ms-products
/api/v1/tags/*      → ms-products
```

### Producción

```text
PrintWorks Admin
GitHub Pages
      ↓
Microsoft Entra ID
      ↓
Access Token
      ↓
API Gateway
      ↓
Microservicios en AWS
```

El frontend no necesita conocer directamente la dirección individual de cada microservicio en producción.

---

## Integración con cn1_ms_config

El módulo de Configuración consume los siguientes endpoints:

```text
GET    /api/v1/config/filaments
GET    /api/v1/config/filaments/{id}
POST   /api/v1/config/filaments
PUT    /api/v1/config/filaments/{id}
PATCH  /api/v1/config/filaments/{id}/status

GET    /api/v1/config/printing
PUT    /api/v1/config/printing
```

Actualmente permite:

- Listar filamentos
- Crear filamentos
- Editar filamentos
- Activar/desactivar filamentos
- Consultar configuración energética
- Modificar precio de electricidad
- Modificar consumo energético de impresora
- Mostrar estados de carga
- Mostrar errores de API

Los cambios de costos son procesados posteriormente por los microservicios backend para invalidar los precios correspondientes.

---

## Integración con cn1_ms_products

El módulo de Productos se encuentra integrado con `cn1_ms_products`.

### Endpoints utilizados

```text
GET    /api/v1/products/admin
GET    /api/v1/products/admin/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
PATCH  /api/v1/products/{id}/status
POST   /api/v1/products/{id}/recalculate
POST   /api/v1/products/recalculate-outdated
```

### Funcionalidades implementadas

- Listado real de productos
- Creación de productos
- Edición de productos
- Selección de filamentos obtenidos desde `ms-config`
- Edición de filamento
- Edición de gramos de filamento
- Edición de horas de impresión
- Edición de porcentaje de ganancia
- Activación y desactivación
- Visualización del precio calculado
- Visualización de estado comercial
- Visualización de vigencia del precio
- Recálculo individual de precios

### Estados de precio

La interfaz reconoce:

```text
CURRENT
OUTDATED
```

Un producto desactualizado puede requerir recálculo antes de volver a publicarse.

El flujo administrativo es:

```text
ACTIVE + CURRENT
        ↓
cambio de costos
        ↓
INACTIVE + OUTDATED
        ↓
Recalcular
        ↓
INACTIVE + CURRENT
        ↓
revisión administrativa
        ↓
Activar
        ↓
ACTIVE + CURRENT
```

El frontend no calcula el precio directamente.

Toda la lógica de cálculo permanece en:

```text
cn1_ms_products
```

---

## Arquitectura de Acceso a Datos

Las páginas y componentes no realizan directamente las solicitudes HTTP.

```text
Pages / Components
        ↓
     Services
        ↓
    apiClient
        ↓
 Backend API
```

Los principales servicios son:

```text
authService.js
apiClient.js
dashboardService.js
productService.js
orderService.js
configService.js
```

### apiClient

`apiClient` centraliza:

- URL base
- Access Token
- Header `Authorization`
- Solicitudes HTTP
- Manejo y normalización de errores

### configService

Gestiona la comunicación con:

```text
/api/v1/config/*
```

### productService

Gestiona operaciones como:

```text
GET    /api/v1/products/admin
GET    /api/v1/products/admin/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
PATCH  /api/v1/products/{id}/status
POST   /api/v1/products/{id}/recalculate
POST   /api/v1/products/recalculate-outdated
```

---

## Manejo de Errores HTTP

El frontend contempla respuestas como:

- **400** - Datos inválidos
- **401** - Token expirado o inválido
- **403** - Acceso no autorizado
- **404** - Recurso inexistente
- **409** - Conflicto
- **5xx** - Error del servidor o servicio no disponible

Los errores son normalizados mediante `apiClient` antes de ser utilizados por las páginas.

---

## Sistema Visual

PrintWorks utiliza variables CSS semánticas para evitar acoplar los componentes directamente a colores específicos.

Ejemplos:

```css
--pw-primary
--pw-primary-dark
--pw-surface
--pw-surface-soft
--pw-text-primary
--pw-text-secondary
--pw-border
--pw-accent
```

### Paleta oficial PrintWorks

- `#606c38` - Primary
- `#283618` - Primary Dark
- `#fefae0` - Surface Soft
- `#dda15e` - Accent
- `#bc6c25` - Accent Strong

---

## Temas Light y Dark

PrintWorks Admin soporta temas claro y oscuro.

Características:

- Persistencia mediante `localStorage`
- Clave `printworks-theme`
- Detección de `prefers-color-scheme`
- Selector visual Light/Dark
- Aplicación inmediata sin recarga

La lógica se encuentra centralizada en:

```text
src/context/ThemeContext.jsx
```

---

## Diseño Responsive

### Desktop

- Sidebar permanente
- Navbar superior
- Área principal de contenido
- Cards distribuidas horizontalmente

### Tablet

- Redistribución de componentes
- Cards adaptadas al ancho disponible
- Navegación optimizada

### Mobile

- Sidebar ocultable
- Menú mediante botón
- Cards apiladas verticalmente
- Contenido adaptado al ancho disponible
- Prevención de scroll horizontal innecesario

---

## Testing

Las pruebas utilizan:

- Vitest
- React Testing Library
- jsdom

El setup se encuentra en:

```text
src/test/setup.js
```

Ejecutar:

```bash
npm run test
```

Las pruebas existentes incluyen áreas relacionadas con:

- ThemeContext
- Preferencias de tema
- Persistencia
- Cambio de tema
- authService
- Login
- Logout
- Cuenta autenticada
- Obtención del usuario
- Access Token
- apiClient
- configService

Las dependencias externas como MSAL utilizan mocks durante las pruebas cuando corresponde.

---

## Estructura del Proyecto

```text
src/
├── assets/
│   └── Recursos estáticos
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   └── config/
│
├── config/
│   └── msalConfig.js
│
├── context/
│   └── ThemeContext.jsx
│
├── hooks/
│
├── layouts/
│   └── AdminLayout.jsx
│
├── mocks/
│   ├── dashboard.mock.js
│   ├── products.mock.js
│   ├── orders.mock.js
│   └── config.mock.js
│
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Products/
│   ├── Orders/
│   ├── Configuration/
│   ├── Unauthorized/
│   └── NotFound/
│
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── services/
│   ├── authService.js
│   ├── apiClient.js
│   ├── dashboardService.js
│   ├── productService.js
│   ├── orderService.js
│   └── configService.js
│
├── styles/
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   └── bootstrap-overrides.css
│
├── test/
│   ├── setup.js
│   └── test-utils.jsx
│
├── utils/
│   ├── currency.js
│   ├── dates.js
│   └── status.js
│
├── App.jsx
└── main.jsx
```

---

## Optimización del Bundle

El proyecto utiliza:

- `React.lazy()`
- `Suspense`
- Code splitting
- Separación de dependencias vendor
- Chunks independientes

Entre las dependencias separadas se encuentran:

- React
- Bootstrap
- React Router
- MSAL

Esto permite reducir el bundle inicial y mejorar el aprovechamiento de caché.

---

## Estado Actual de Implementación

### Base técnica

- ✅ React
- ✅ Bootstrap
- ✅ React Router
- ✅ Vitest
- ✅ Vite
- ✅ Estructura modular
- ✅ Responsive
- ✅ Light/Dark Mode
- ✅ Lazy loading
- ✅ Code splitting

### Autenticación

- ✅ Microsoft Entra ID
- ✅ MSAL
- ✅ Login
- ✅ Logout
- ✅ Rutas protegidas
- ✅ Access Token
- ✅ Scope propio de API
- ✅ Integración de Access Token con `apiClient`

### Configuración

- ✅ Integración real con `cn1_ms_config`
- ✅ Listado de filamentos
- ✅ Creación de filamentos
- ✅ Edición de filamentos
- ✅ Activación/desactivación
- ✅ Configuración energética
- ✅ Manejo de errores

### Productos

- ✅ Integración real con `cn1_ms_products`
- ✅ Listado
- ✅ Creación
- ✅ Edición
- ✅ Filamentos provenientes de `ms-config`
- ✅ Cambio de filamento
- ✅ Gramos de filamento
- ✅ Horas de impresión
- ✅ Porcentaje de ganancia
- ✅ Activar/desactivar
- ✅ Precio calculado
- ✅ CURRENT/OUTDATED
- ✅ Recálculo individual
- ✅ Flujo de revisión antes de activación

### Pedidos

- ⏳ Integración con `ms-orders` pendiente

### Dashboard

- ✅ Infraestructura disponible
- ⚠️ Actualmente puede continuar utilizando información mock mientras se completan las integraciones necesarias

---

## Próximos Pasos

Los principales pasos pendientes son:

- Integración con `ms-orders`
- Gestión real de pedidos
- Integración de información real de pedidos en Dashboard
- Completar funcionalidades administrativas restantes según el avance de los microservicios
- Ampliar pruebas automatizadas para las integraciones de Productos

---

## Flujo Git

El proyecto utiliza:

```text
main
  ↑
develop
  ↑
feature/*
```

### `main`

Contiene versiones estables destinadas a entregas.

No se desarrolla directamente sobre esta rama.

### `develop`

Contiene la integración de funcionalidades terminadas y verificadas.

### `feature/*`

Las nuevas funcionalidades se desarrollan en ramas independientes creadas desde `develop`.

Ejemplo:

```bash
git checkout develop
git pull
git checkout -b feature/products-integration
```

Después:

```bash
git add .
git commit -m "feat: integrar gestión de productos y configuración con microservicios"
git push -u origin feature/products-integration
```

Posteriormente:

```text
feature/* → develop
```

Para una entrega estable:

```text
feature/* → develop → main
```

---

## Validación antes de Pull Request

Antes de crear un Pull Request hacia `develop` ejecutar:

```bash
npm run test
npm run build
```

El Pull Request debe realizarse cuando:

- Las pruebas finalizan correctamente
- El build finaliza correctamente
- No existen errores conocidos de ejecución
- La integración local ha sido validada
- Los cambios corresponden al objetivo de la rama feature
