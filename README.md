# PrintWorks Admin

Panel de administración de PrintWorks, aplicación web que simula un emprendimiento de impresión 3D.

## Descripción

`cn1_front_admin` es el frontend administrativo de PrintWorks, diseñado para gestionar productos, pedidos y configuración del sistema.

La aplicación utiliza **Microsoft Entra ID** mediante **MSAL** para la autenticación de los usuarios administrativos.

Durante el desarrollo, el frontend puede trabajar utilizando datos mock, permitiendo implementar y probar las funcionalidades sin depender de que los servicios backend se encuentren disponibles.

---

## Propósito dentro de PrintWorks

Este componente es responsable de:

- Gestión de productos
- Creación, edición y visualización de productos
- Cálculo de precios
- Gestión de imágenes y tags
- Gestión de pedidos
- Visualización del estado de los pedidos
- Confirmación, cancelación y finalización de pedidos
- Configuración de filamentos
- Configuración de costos energéticos
- Dashboard con vista general del estado operativo
- Autenticación administrativa mediante Microsoft Entra ID

Las solicitudes protegidas se envían directamente a los microservicios o mediante **AWS API Gateway** en producción, incluyendo el token JWT obtenido desde Microsoft Entra ID.

El frontend es responsable de obtener el Access Token y enviarlo en las solicitudes HTTP.

---

## Stack Tecnológico

- **React 19.2.8** - Framework frontend
- **JavaScript** - Sin TypeScript
- **Bootstrap 5.3.8** - Framework CSS para estructura y componentes
- **React Bootstrap** - Componentes React de Bootstrap
- **React Router 7.18.2** - Enrutamiento
- **MSAL (@azure/msal-browser, @azure/msal-react)** - Autenticación con Microsoft Entra ID
- **Vitest** - Framework de pruebas
- **React Testing Library** - Pruebas de componentes
- **Vite 8.2.2** - Build tool y servidor de desarrollo

---

## Requisitos Previos

Antes de ejecutar el proyecto es necesario contar con:

- Node.js 18 o superior
- npm
- Git
- Una cuenta de Microsoft Entra ID configurada para autenticación

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

El proyecto incluye un archivo `.env.example` con las variables necesarias.

Crear el archivo `.env` utilizando:

```bash
cp .env.example .env
```

Luego editar `.env` e ingresar los valores correspondientes al entorno local.

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
| `npm run lint` | Ejecuta el linter con oxlint |

---

## Variables de Entorno

Crear el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

La configuración esperada es:

```env
# Microsoft Entra ID / MSAL Configuration
VITE_ENTRA_CLIENT_ID=REEMPLAZAR
VITE_ENTRA_TENANT_ID=REEMPLAZAR
VITE_ENTRA_REDIRECT_URI=http://localhost:5173/cn1_front_admin/#/dashboard
VITE_ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/cn1_front_admin/#/login

# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_SCOPE=api://80bf85e9-a444-4754-b780-c65dfff74876/access_as_user

# Mock Mode
VITE_USE_MOCKS=true
```

### Modo Mock

Durante el desarrollo se puede utilizar:

```env
VITE_USE_MOCKS=true
```

Esto permite utilizar datos locales sin depender del backend.

Cuando los servicios backend se encuentren disponibles, el frontend podrá utilizar:

```env
VITE_USE_MOCKS=false
```

para realizar llamadas reales mediante la capa de servicios.

### Access Token vs ID Token

La API definitiva utiliza:

```http
Authorization: Bearer <access_token>
```

El frontend debe obtener un **Access Token destinado a la API PrintWorks**. No utilizar `tokenResult.idToken` como solución definitiva ni utilizar un Access Token destinado a Microsoft Graph como token de PrintWorks.

Cuando `Expose an API` esté configurado en Entra ID, debe solicitarse el scope propio y utilizar `tokenResult.accessToken`. Mientras no exista el scope oficial, `VITE_API_SCOPE` permanece preparado pero el frontend queda bloqueado para producción.

---

## Configuración de MSAL / Microsoft Entra ID

La autenticación administrativa utiliza Microsoft Entra ID mediante MSAL.

### Valores requeridos

1. **VITE_ENTRA_CLIENT_ID**  
   Application (client) ID de la aplicación registrada en Entra ID.

2. **VITE_ENTRA_TENANT_ID**  
   Directory (tenant) ID correspondiente al tenant utilizado.

3. **VITE_ENTRA_REDIRECT_URI**
   URL a la cual Microsoft redirige al usuario después del proceso de autenticación.
   Debe apuntar a `/dashboard` para redirigir directamente al panel de administración.

4. **VITE_ENTRA_POST_LOGOUT_REDIRECT_URI**
   URL utilizada después de cerrar sesión.
   Debe apuntar a `/login` para redirigir a la página de inicio de sesión.

5. **VITE_API_SCOPE**  
   Scope utilizado para solicitar el Access Token para la API de PrintWorks.  
   Debe configurarse cuando exista la configuración "Expose an API" en Entra ID.

### Configuración básica en Entra ID

1. Acceder al Azure Portal.
2. Ir a **Microsoft Entra ID**.
3. Entrar a **App registrations**.
4. Crear una aplicación o seleccionar la aplicación correspondiente a PrintWorks Admin.
5. Obtener:
   - Application (client) ID
   - Directory (tenant) ID
6. En **Authentication**, configurar la aplicación como **Single-page application (SPA)**.
7. Registrar las URI de redirección correspondientes:
   - Redirect URI: `http://localhost:5173/cn1_front_admin/#/dashboard` (desarrollo)
   - Post logout redirect URI: `http://localhost:5173/cn1_front_admin/#/login` (desarrollo)
   - Para producción, usar las URLs correspondientes del entorno de despliegue con el formato `https://dominio.github.io/repo/#/ruta`

> **Nota para GitHub Pages:** Esta aplicación usa HashRouter para funcionar correctamente en servidores estáticos como GitHub Pages. Las URLs incluyen `#/` antes de las rutas (ej: `#/dashboard`).
8. Configurar los permisos y scopes requeridos por la aplicación.

> **Nota importante:** Al actualizar las URLs de redirección en Entra ID, también deben actualizarse los secrets en GitHub Actions (VITE_ENTRA_REDIRECT_URI y VITE_ENTRA_POST_LOGOUT_REDIRECT_URI) para el despliegue en producción.
9. Para producción, configurar "Expose an API" para definir el scope propio de PrintWorks.

---

## Flujo de Autenticación

El Front Admin utiliza MSAL para realizar el proceso de autenticación mediante Microsoft Entra ID.

El flujo esperado es:

```text
Usuario
   |
   v
PrintWorks Admin
   |
   v
Microsoft Entra ID
   |
   | Autenticación
   |
   v
Token JWT
   |
   v
PrintWorks Admin
```

El frontend obtiene el token mediante la capa de autenticación y posteriormente lo utiliza para realizar solicitudes protegidas.

---

## Flujo de Comunicación con Backend

La arquitectura para las solicitudes protegidas es:

```text
Frontend Admin
      |
      | MSAL + Microsoft Entra ID
      | Access Token
      v
API Gateway / URL local configurada
      |
      v
cn1_ms_config
      |
      | OAuth2 Resource Server
      | valida Access Token
      v
config_db
```

En desarrollo local el frontend puede apuntar directamente a `cn1_ms_config` mediante `VITE_API_BASE_URL`. En AWS la misma abstracción apuntará a API Gateway.

### Responsabilidades

#### Frontend Admin

El frontend es responsable de:

- Autenticar al usuario mediante Microsoft Entra ID
- Obtener el Access Token mediante MSAL
- Mantener las rutas administrativas protegidas
- Adjuntar el token a las solicitudes HTTP como `Authorization: Bearer <access_token>`
- Consumir las operaciones expuestas por los microservicios

#### API Gateway (AWS)

API Gateway será el punto de entrada hacia los servicios backend desplegados en AWS.

#### Microservicios

Los microservicios implementarán la lógica de negocio correspondiente a cada dominio y actúan como OAuth2 Resource Servers, validando el Access Token.

Actualmente se consideran:

```text
ms-config (cn1_ms_config)
ms-products
ms-orders
```

---

## Sistema Visual

PrintWorks utiliza variables CSS semánticas para evitar acoplar directamente los componentes a colores específicos.

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

Esto permite que los componentes utilicen colores según su función dentro de la interfaz.

### Paleta oficial PrintWorks

La paleta base definida para PrintWorks es:

- `#606c38` - Primary
- `#283618` - Primary Dark
- `#fefae0` - Surface Soft
- `#dda15e` - Accent
- `#bc6c25` - Accent Strong

El sistema visual utiliza estos colores mediante tokens semánticos, evitando utilizar valores hexadecimales directamente en los componentes.

---

## Temas Light y Dark

PrintWorks Admin soporta temas claro y oscuro.

El sistema utiliza los mismos tokens semánticos y modifica sus valores dependiendo del tema seleccionado.

Características:

- Persistencia de la preferencia del usuario
- Almacenamiento mediante `localStorage`
- Clave utilizada: `printworks-theme`
- Detección de `prefers-color-scheme`
- Selector visual para cambiar entre Light y Dark
- Aplicación inmediata sin recargar la página
- Contraste adecuado entre fondos y tipografía

La lógica se encuentra centralizada en:

```text
src/context/ThemeContext.jsx
```

Esto permite evitar lógica de temas distribuida por los componentes.

---

## Diseño Responsive

La interfaz administrativa está diseñada para adaptarse a distintos tamaños de pantalla.

El layout contempla:

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
- Menú de navegación mediante botón
- Cards apiladas verticalmente
- Contenido adaptado al ancho disponible
- Evita scroll horizontal innecesario

El objetivo es mantener las funcionalidades administrativas utilizables tanto desde escritorio como desde dispositivos móviles.

---

## Testing

Las pruebas utilizan:

- **Vitest**
- **React Testing Library**
- **jsdom**

El setup se encuentra en:

```text
src/test/setup.js
```

### Ejecutar pruebas

```bash
npm run test
```

Las pruebas se ejecutan en modo watch.

Para salir:

```text
q
```

### Áreas cubiertas

Actualmente existen pruebas relacionadas con:

- ThemeContext
- Preferencia de tema
- Persistencia
- Cambio de tema
- authService
- Login
- Logout
- Obtención de cuenta
- Obtención del nombre del usuario
- Verificación de autenticación
- Obtención del token para API

Las dependencias externas como MSAL utilizan mocks durante las pruebas para validar el comportamiento del código del proyecto sin depender directamente de servicios externos.

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

## Arquitectura de Acceso a Datos

Las páginas y componentes no deben acceder directamente a los datos.

La arquitectura utilizada es:

```text
Pages / Components
        |
        v
     Services
        |
        v
    apiClient
        |
        +----------------+
        |                |
        v                v
      Mocks          Backend API
```

Esto permite desarrollar utilizando mocks y posteriormente reemplazarlos por llamadas reales sin modificar significativamente los componentes visuales.

### Ejemplo

```text
Products Page
      |
      v
productService
      |
      +--> products.mock.js
      |
      `--> apiClient --> API Gateway
```

La selección dependerá del valor de:

```env
VITE_USE_MOCKS=true
```

---

## Optimización del Bundle

El proyecto utiliza estrategias de optimización proporcionadas por Vite.

Entre ellas:

- Lazy loading mediante `React.lazy()`
- `Suspense` para carga de páginas
- Code splitting
- Separación de dependencias vendor
- Chunks independientes para dependencias principales

Actualmente se separan dependencias como:

- React
- Bootstrap
- React Router
- MSAL

Esto permite:

- Reducir el tamaño del bundle inicial
- Mejorar el cacheo del navegador
- Cargar determinadas páginas solamente cuando son necesarias
- Evitar bundles monolíticos excesivamente grandes

---

## Estado Actual de Implementación

El Front Admin cuenta actualmente con la base técnica, visual, de autenticación y de acceso a datos necesaria para continuar con la implementación de las funcionalidades administrativas.

### Fases completadas

- ✅ **Fase A:** Bootstrap técnico
  - React
  - Bootstrap
  - React Router
  - Vitest
  - Estructura base

- ✅ **Fase B:** Sistema visual
  - Variables CSS semánticas
  - Light/Dark Mode
  - Layout administrativo
  - Diseño responsive

- ✅ **Fase C:** MSAL + Microsoft Entra ID
  - Configuración de MSAL
  - Login mediante redirect
  - Logout
  - Rutas protegidas
  - Obtención de información del usuario
  - Implementación de `acquireApiToken()` con `VITE_API_SCOPE`

- ✅ **Fase D:** Dashboard mock
  - Datos obtenidos mediante capa de servicios
  - Cards de productos
  - Información de pedidos
  - Estados operativos
  - Sección de atención/revisión

- ✅ **Fase E:** Integración cn1_ms_config (Configuration)
  - Implementación de `configService` con endpoints reales
  - Página `/configuration` con UI completa
  - Gestión de filamentos (CRUD sin DELETE físico)
  - Configuración energética
  - Validaciones UX y manejo de errores
  - Estados de UI (loading, empty, error, success)

- ✅ **Fase F:** Testing
  - Pruebas de `authService` (incluyendo acquireApiToken)
  - Pruebas de `apiClient` (incluyendo normalización de errores HTTP)
  - Pruebas de `configService` (endpoints contratados)
  - 59 tests pasando

- ✅ **Fase H:** Cierre
  - Tests pasando (59/59)
  - Build de producción exitoso
  - README actualizado
  - .env.example sin secretos
  - Sin referencias arquitectónicas activas al BFF

### Infraestructura preparada

También se encuentra implementada la infraestructura necesaria para continuar con Productos, Pedidos y Configuración:

- ✅ `apiClient.js` (integración real con cn1_ms_config)
- ✅ `authService.js` (acquireApiToken implementado)
- ✅ `dashboardService.js`
- ✅ `productService.js`
- ✅ `orderService.js`
- ✅ `configService.js` (endpoints reales implementados)
- ✅ Mocks de Dashboard
- ✅ Mocks de Productos
- ✅ Mocks de Pedidos
- ✅ Mocks de Configuración
- ✅ Utilidades de moneda
- ✅ Utilidades de fechas
- ✅ Utilidades de estados
- ✅ Variables de entorno actualizadas
- ✅ Modo mock configurable
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Build de producción funcional

### Próximos pasos según PLAN_FRONTEND_ADMIN_v1.2.md

El módulo de Configuración está completamente integrado con `cn1_ms_config`. Los siguientes pasos dependen de la disponibilidad de los microservicios restantes:

- ✅ Fase G: Integración local con `cn1_ms_config` (validada con éxito)
- [ ] Implementación de Productos (cuando `ms-products` esté disponible)
- [ ] Implementación de Pedidos (cuando `ms-orders` esté disponible)
- ✅ Configuración de `Expose an API` en Entra ID para usar Access Token definitivo

### Endpoints de Configuración

El módulo de Configuración consume los siguientes endpoints de `cn1_ms_config`:

```text
GET    /api/v1/config/filaments
GET    /api/v1/config/filaments/{id}
POST   /api/v1/config/filaments
PUT    /api/v1/config/filaments/{id}
PATCH  /api/v1/config/filaments/{id}/status
GET    /api/v1/config/printing
PUT    /api/v1/config/printing
```

### Manejo de Errores HTTP

El frontend maneja los siguientes códigos de estado:

- **400** - Datos inválidos en la solicitud
- **401** - Token expirado o inválido, requiere atención de sesión
- **403** - Acceso no autorizado
- **404** - Recurso inexistente
- **409** - Conflicto (ej: filamento duplicado)
- **5xx** - Error temporal del servidor

---

## Flujo Git

El proyecto utiliza un flujo de trabajo basado en tres niveles de ramas:

```text
main
  ^
  |
develop
  ^
  |
feature/*
```

### `main`

Contiene únicamente versiones estables destinadas a entregas.

Para la Evaluación 1, `main` recibirá la versión validada proveniente de `develop`.

No se desarrolla directamente sobre esta rama.

### `develop`

Contiene la integración de los avances del proyecto.

Las funcionalidades terminadas y verificadas mediante Pull Request se incorporan a esta rama.

### `feature/*`

Las nuevas funcionalidades se desarrollan en ramas independientes creadas desde `develop`.

Ejemplo:

```bash
git checkout develop
git pull
git checkout -b feature/frontend-admin
```

Una vez terminado el trabajo:

```bash
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/frontend-admin
```

Posteriormente se crea un **Pull Request**:

```text
feature/* → develop
```

Una vez revisado y validado el cambio, se realiza el merge hacia `develop`.

El ciclo de desarrollo continúa creando nuevas ramas `feature/*` desde la versión actualizada de `develop`.

Para una entrega estable:

```text
feature/* → develop → main
```

---

## Validación antes de Pull Request

Antes de crear un Pull Request hacia `develop` se recomienda ejecutar:

```bash
npm run test
npm run build
```

El Pull Request debe realizarse únicamente cuando:

- Las pruebas finalizan correctamente
- El build finaliza correctamente
- No existen errores conocidos de ejecución
- Los cambios corresponden al objetivo de la rama feature
