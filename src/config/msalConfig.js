import { PublicClientApplication } from '@azure/msal-browser';

/**
 * Configuración de MSAL para Microsoft Entra ID
 * 
 * Los valores se leen desde variables de entorno para no hardcodear credenciales.
 * 
 * @see https://learn.microsoft.com/en-us/entra/identity-platform/msal-js-initializing-client-applications
 */

/**
 * Entra ID no debe recibir un fragmento de HashRouter (#/dashboard, #/login).
 * MSAL usa el hash de la URL para la respuesta OAuth; incluir una ruta de
 * React ahí hace que el redirect se pierda o que la app vuelva a /login.
 */
const stripHash = (uri) => (uri ? String(uri).split('#')[0] : uri);

const fallbackRedirectUri =
  typeof window !== 'undefined'
    ? `${window.location.origin}${import.meta.env.BASE_URL}`
    : undefined;

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}`,
    redirectUri: stripHash(import.meta.env.VITE_ENTRA_REDIRECT_URI) || fallbackRedirectUri,
    postLogoutRedirectUri:
      stripHash(import.meta.env.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI) || fallbackRedirectUri,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

/**
 * Scopes para Microsoft Graph (ejemplo académico)
 * NOTA: El scope para la API de PrintWorks se configurará cuando exista
 * "Expose an API" en Entra ID. Mientras tanto, se usa User.Read temporalmente.
 */
const loginRequest = {
  scopes: ['User.Read'],
};

/**
 * Scope para la API de PrintWorks
 * Se configurará cuando exista "Expose an API" en Entra ID.
 * Mientras no esté definido, el frontend queda bloqueado para producción.
 */
const apiScope = import.meta.env.VITE_API_SCOPE || null;

/**
 * Instancia de MSAL
 */
const msalInstance = new PublicClientApplication(msalConfig);

export { msalConfig, loginRequest, msalInstance, apiScope };
