/**
 * Mock data para Configuración
 * 
 * Representa configuración realista:
 * - Varios filamentos ACTIVE/INACTIVE
 * - Precio kWh
 * - Consumo 0,11 kWh/h como referencia inicial
 */

export const filaments = [
  {
    id: 1,
    name: 'PLA Verde',
    color: '#22C55E',
    pricePerKg: 25000,
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z',
  },
  {
    id: 2,
    name: 'ABS Negro',
    color: '#1C1917',
    pricePerKg: 28000,
    status: 'ACTIVE',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-08-10T09:15:00Z',
  },
  {
    id: 3,
    name: 'PETG Azul',
    color: '#3B82F6',
    pricePerKg: 30000,
    status: 'INACTIVE',
    createdAt: '2026-02-01T13:00:00Z',
    updatedAt: '2026-07-20T16:45:00Z',
  },
  {
    id: 4,
    name: 'PLA Rojo',
    color: '#EF4444',
    pricePerKg: 26000,
    status: 'ACTIVE',
    createdAt: '2026-02-15T14:00:00Z',
    updatedAt: '2026-08-25T10:30:00Z',
  },
  {
    id: 5,
    name: 'PLA Gris',
    color: '#78716C',
    pricePerKg: 24000,
    status: 'ACTIVE',
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-08-28T11:45:00Z',
  },
];

export const printConfig = {
  kwhPrice: 150,
  printerConsumption: 0.11,
  printerModel: 'Ender 3 Pro',
  updatedAt: '2026-08-15T09:00:00Z',
};
