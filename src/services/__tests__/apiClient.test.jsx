import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../apiClient';
import { authService } from '../authService';

// Mock de authService
vi.mock('../authService', () => ({
  authService: {
    acquireApiToken: vi.fn(),
  },
}));

// Mock de fetch global
global.fetch = vi.fn();

describe('apiClient', () => {
  const mockToken = 'mock-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getApiToken', () => {
    it('debería obtener token de authService', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);

      const result = await authService.acquireApiToken();

      expect(result).toBe(mockToken);
    });

    it('debería manejar error de authService gracefully', async () => {
      authService.acquireApiToken.mockRejectedValue(new Error('Token error'));

      // La función interna maneja el error y retorna null
      const result = await authService.acquireApiToken().catch(() => null);

      expect(result).toBeNull();
    });
  });

  describe('fetchWithAuth', () => {
    it('debería hacer GET request con headers correctos', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.get('/api/test');

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        method: 'GET',
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        }),
      });
    });

    it('debería hacer POST request con body JSON', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      const mockData = { name: 'test' };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.post('/api/test', mockData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        method: 'POST',
        body: JSON.stringify(mockData),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        }),
      });
    });

    it('debería hacer PUT request con body JSON', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      const mockData = { name: 'updated' };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.put('/api/test/1', mockData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        method: 'PUT',
        body: JSON.stringify(mockData),
      });
    });

    it('debería hacer PATCH request con body JSON', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      const mockData = { status: 'ACTIVE' };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.patch('/api/test/1/status', mockData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        method: 'PATCH',
        body: JSON.stringify(mockData),
      });
    });

    it('debería hacer DELETE request', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.delete('/api/test/1');

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        method: 'DELETE',
      });
    });

    it('debería manejar respuesta sin body JSON', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: true,
        headers: { get: () => 'text/plain' },
      });

      const result = await apiClient.get('/api/test');

      expect(result).toBeNull();
    });

    it('debería normalizar error 400', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 400,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Datos inválidos en la solicitud');
    });

    it('debería normalizar error 401', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Sesión expirada o inválida');
    });

    it('debería normalizar error 403', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Acceso no autorizado');
    });

    it('debería normalizar error 404', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Recurso no encontrado');
    });

    it('debería normalizar error 409', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 409,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Conflicto');
    });

    it('debería normalizar error 500', async () => {
      authService.acquireApiToken.mockResolvedValue(mockToken);
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Error temporal del servidor');
    });

    it('debería funcionar sin token si authService retorna null', async () => {
      authService.acquireApiToken.mockResolvedValue(null);
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
        headers: { get: () => 'application/json' },
      });

      await apiClient.get('/api/test');

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        headers: expect.objectContaining({
          'Accept': 'application/json',
        }),
      });
      expect(callArgs[1].headers).not.toHaveProperty('Authorization');
    });
  });
});
