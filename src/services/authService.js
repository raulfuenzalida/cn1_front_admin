import { msalInstance, loginRequest, apiScope } from '../config/msalConfig';

/**
 * Servicio de autenticación centralizado
 * 
 * Responsabilidades:
 * - Iniciar sesión con MSAL
 * - Cerrar sesión
 * - Obtener cuenta activa
 * - Adquirir token para API (futuro)
 * 
 * @see https://learn.microsoft.com/en-us/entra/identity-platform/msal-js-initializing-client-applications
 */

export const authService = {
  /**
   * Inicia el flujo de login con Microsoft Entra ID
   * 
   * Utiliza loginRedirect() para autenticación en la misma pestaña.
   * Después del redirect, MSAL procesa la respuesta y establece la cuenta.
   */
  login: async () => {
    try {
      await msalInstance.loginRedirect(loginRequest);
      // loginRedirect() redirige a Microsoft Entra ID, no retorna aquí
      // El flujo continúa cuando MSAL procesa el redirect de vuelta
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión actual
   * 
   * Utiliza logoutRedirect() para coherencia con el flujo de login.
   */
  logout: async () => {
    try {
      await msalInstance.logoutRedirect();
      // logoutRedirect() redirige a la URL post-logout configurada
    } catch (error) {
      console.error('Error durante logout:', error);
      throw error;
    }
  },

  /**
   * Obtiene la cuenta autenticada actual
   */
  getAccount: () => {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  },

  /**
   * Obtiene el nombre para mostrar de la cuenta actual
   */
  getDisplayName: () => {
    const account = authService.getAccount();
    return account?.name || account?.username || 'Administrador';
  },

  /**
   * Verifica si hay una sesión activa
   */
  isAuthenticated: () => {
    return authService.getAccount() !== null;
  },

  /**
   * Adquiere un token de acceso para la API de PrintWorks
   * 
   * Esta función obtiene el Access Token destinado a la API PrintWorks.
   * Cuando VITE_API_SCOPE esté configurado (Expose an API en Entra ID),
   * se solicitará el scope propio. Mientras tanto, se usa User.Read temporalmente.
   * 
   * @returns {Promise<string>} Access Token
   * @throws {Error} Si no hay cuenta autenticada o falla la adquisición
   */
  acquireApiToken: async () => {
    try {
      const account = authService.getAccount();
      if (!account) {
        throw new Error('No hay cuenta autenticada');
      }

      // Usar VITE_API_SCOPE si está configurado, sino usar User.Read temporalmente
      const scopes = apiScope ? [apiScope] : loginRequest.scopes;

      // Intentar adquisición silenciosa
      const silentRequest = {
        scopes: scopes,
        account: account,
      };

      const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error adquiriendo token:', error);
      
      // Si el error es InteractionRequiredAuthError, intentar interacción
      if (error.name === 'InteractionRequiredAuthError') {
        try {
          const interactiveRequest = {
            scopes: apiScope ? [apiScope] : loginRequest.scopes,
          };
          const tokenResponse = await msalInstance.acquireTokenPopup(interactiveRequest);
          return tokenResponse.accessToken;
        } catch (interactiveError) {
          console.error('Error en adquisición interactiva:', interactiveError);
          throw interactiveError;
        }
      }
      
      throw error;
    }
  },
};
