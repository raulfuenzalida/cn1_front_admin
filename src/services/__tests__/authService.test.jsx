import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../authService';
import { msalInstance } from '../../config/msalConfig';

// Mock de MSAL
vi.mock('../../config/msalConfig', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    getAllAccounts: vi.fn(),
    acquireTokenSilent: vi.fn(),
  },
  loginRequest: {
    scopes: ['User.Read'],
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('debería llamar a msalInstance.loginRedirect', async () => {
      msalInstance.loginRedirect.mockResolvedValue(undefined);

      await authService.login();

      expect(msalInstance.loginRedirect).toHaveBeenCalled();
    });

    it('debería lanzar error si loginRedirect falla', async () => {
      const mockError = new Error('Login failed');
      msalInstance.loginRedirect.mockRejectedValue(mockError);

      await expect(authService.login()).rejects.toThrow('Login failed');
    });
  });

  describe('logout', () => {
    it('debería llamar a msalInstance.logoutRedirect', async () => {
      msalInstance.logoutRedirect.mockResolvedValue(undefined);

      await authService.logout();

      expect(msalInstance.logoutRedirect).toHaveBeenCalled();
    });

    it('debería lanzar error si logoutRedirect falla', async () => {
      const mockError = new Error('Logout failed');
      msalInstance.logoutRedirect.mockRejectedValue(mockError);

      await expect(authService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getAccount', () => {
    it('debería retornar la cuenta si existe', () => {
      const mockAccount = { name: 'Test User', username: 'test@example.com' };
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);

      const result = authService.getAccount();

      expect(result).toEqual(mockAccount);
    });

    it('debería retornar null si no hay cuentas', () => {
      msalInstance.getAllAccounts.mockReturnValue([]);

      const result = authService.getAccount();

      expect(result).toBeNull();
    });
  });

  describe('getDisplayName', () => {
    it('debería retornar el nombre de la cuenta', () => {
      const mockAccount = { name: 'Test User', username: 'test@example.com' };
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);

      const result = authService.getDisplayName();

      expect(result).toBe('Test User');
    });

    it('debería retornar username si no hay nombre', () => {
      const mockAccount = { username: 'test@example.com' };
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);

      const result = authService.getDisplayName();

      expect(result).toBe('test@example.com');
    });

    it('debería retornar "Administrador" si no hay cuenta', () => {
      msalInstance.getAllAccounts.mockReturnValue([]);

      const result = authService.getDisplayName();

      expect(result).toBe('Administrador');
    });
  });

  describe('isAuthenticated', () => {
    it('debería retornar true si hay cuenta', () => {
      const mockAccount = { name: 'Test User' };
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('debería retornar false si no hay cuenta', () => {
      msalInstance.getAllAccounts.mockReturnValue([]);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('acquireApiToken', () => {
    it('debería adquirir token silenciosamente si hay cuenta', async () => {
      const mockAccount = { name: 'Test User' };
      const mockToken = 'mock-access-token';
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);
      msalInstance.acquireTokenSilent.mockResolvedValue({ accessToken: mockToken });

      const result = await authService.acquireApiToken();

      expect(msalInstance.acquireTokenSilent).toHaveBeenCalled();
      expect(result).toBe(mockToken);
    });

    it('debería lanzar error si no hay cuenta', async () => {
      msalInstance.getAllAccounts.mockReturnValue([]);

      await expect(authService.acquireApiToken()).rejects.toThrow('No hay cuenta autenticada');
    });

    it('debería lanzar error si acquireTokenSilent falla', async () => {
      const mockAccount = { name: 'Test User' };
      const mockError = new Error('Token acquisition failed');
      msalInstance.getAllAccounts.mockReturnValue([mockAccount]);
      msalInstance.acquireTokenSilent.mockRejectedValue(mockError);

      await expect(authService.acquireApiToken()).rejects.toThrow('Token acquisition failed');
    });
  });
});
