import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFilaments,
  getFilament,
  createFilament,
  updateFilament,
  updateFilamentStatus,
  getPrintingConfig,
  updatePrintingConfig,
} from '../configService';
import { apiClient } from '../apiClient';

// Mock de apiClient
vi.mock('../apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('configService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFilaments', () => {
    it('debería llamar a apiClient.get con el endpoint correcto', async () => {
      const mockFilaments = [
        { id: 1, name: 'PLA', color: '#fff', pricePerKg: 25000, status: 'ACTIVE' },
      ];
      apiClient.get.mockResolvedValue(mockFilaments);

      const result = await getFilaments();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/config/filaments');
      expect(result).toEqual(mockFilaments);
    });
  });

  describe('getFilament', () => {
    it('debería llamar a apiClient.get con el endpoint correcto', async () => {
      const mockFilament = { id: 1, name: 'PLA', color: '#fff', pricePerKg: 25000 };
      apiClient.get.mockResolvedValue(mockFilament);

      const result = await getFilament(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/config/filaments/1');
      expect(result).toEqual(mockFilament);
    });
  });

  describe('createFilament', () => {
    it('debería llamar a apiClient.post con el endpoint correcto y datos', async () => {
      const mockFilamentData = { name: 'PLA', color: '#fff', pricePerKg: 25000 };
      const mockCreated = { id: 1, ...mockFilamentData };
      apiClient.post.mockResolvedValue(mockCreated);

      const result = await createFilament(mockFilamentData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/config/filaments', mockFilamentData);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateFilament', () => {
    it('debería llamar a apiClient.put con el endpoint correcto y datos', async () => {
      const mockFilamentData = { name: 'PLA Updated', color: '#000', pricePerKg: 26000 };
      const mockUpdated = { id: 1, ...mockFilamentData };
      apiClient.put.mockResolvedValue(mockUpdated);

      const result = await updateFilament(1, mockFilamentData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/v1/config/filaments/1', mockFilamentData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('updateFilamentStatus', () => {
    it('debería llamar a apiClient.patch con el endpoint correcto y status', async () => {
      const mockStatus = 'INACTIVE';
      const mockUpdated = { id: 1, status: mockStatus };
      apiClient.patch.mockResolvedValue(mockUpdated);

      const result = await updateFilamentStatus(1, mockStatus);

      expect(apiClient.patch).toHaveBeenCalledWith('/api/v1/config/filaments/1/status', { status: mockStatus });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('getPrintingConfig', () => {
    it('debería llamar a apiClient.get con el endpoint correcto', async () => {
      const mockConfig = { kwhPrice: 150, printerConsumption: 0.11 };
      apiClient.get.mockResolvedValue(mockConfig);

      const result = await getPrintingConfig();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/config/printing');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('updatePrintingConfig', () => {
    it('debería llamar a apiClient.put con el endpoint correcto y datos', async () => {
      const mockConfigData = { kwhPrice: 200, printerConsumption: 0.15 };
      const mockUpdated = { ...mockConfigData };
      apiClient.put.mockResolvedValue(mockUpdated);

      const result = await updatePrintingConfig(mockConfigData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/v1/config/printing', mockConfigData);
      expect(result).toEqual(mockUpdated);
    });
  });
});
