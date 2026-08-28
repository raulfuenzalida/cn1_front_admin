import { msalInstance, loginRequest } from '../config/msalConfig';

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
   * NOTA: Esta función se completará cuando exista la configuración
   * del scope específico de API Gateway. Por ahora usa el scope de Graph.
   */
  acquireApiToken: async () => {
    try {
      const account = authService.getAccount();
      if (!account) {
        throw new Error('No hay cuenta autenticada');
      }

      // Intentar adquisición silenciosa
      const silentRequest = {
        scopes: loginRequest.scopes,
        account: account,
      };

      const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error adquiriendo token:', error);
      // Si falla el modo silencioso, se podría intentar interacción
      throw error;
    }
  },
};
