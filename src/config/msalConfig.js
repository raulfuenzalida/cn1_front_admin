import { PublicClientApplication } from '@azure/msal-browser';

/**
 * Configuración de MSAL para Microsoft Entra ID
 * 
 * Los valores se leen desde variables de entorno para no hardcodear credenciales.
 * 
 * @see https://learn.microsoft.com/en-us/entra/identity-platform/msal-js-initializing-client-applications
 */

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI,
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
