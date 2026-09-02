/**
 * Mock data para Pedidos
 * 
 * Representa escenarios reales de negocio:
 * - CREATED
 * - CONFIRMED
 * - COMPLETED
 * - CANCELLED
 */

export const orders = [
  {
    id: 'PW-000124',
    customer: 'Juan Pérez',
    email: 'juan.perez@email.com',
    date: '2026-09-01T10:30:00Z',
    status: 'CREATED',
    total: 7900,
    items: [
      {
        productId: 1,
        productName: 'Miniatura Space Marine',
        quantity: 2,
        unitPrice: 3900,
        subtotal: 7800,
      },
    ],
    createdAt: '2026-09-01T10:30:00Z',
    updatedAt: '2026-09-01T10:30:00Z',
  },
  {
    id: 'PW-000123',
    customer: 'María González',
    email: 'maria.gonzalez@email.com',
    date: '2026-08-31T15:45:00Z',
    status: 'CREATED',
    total: 15800,
    items: [
      {
        productId: 1,
        productName: 'Miniatura Space Marine',
        quantity: 4,
        unitPrice: 3900,
        subtotal: 15600,
      },
    ],
    createdAt: '2026-08-31T15:45:00Z',
    updatedAt: '2026-08-31T15:45:00Z',
  },
  {
    id: 'PW-000122',
    customer: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    date: '2026-08-30T09:15:00Z',
    status: 'CONFIRMED',
    total: 12500,
    items: [
      {
        productId: 3,
        productName: 'Castillo Medieval',
        quantity: 1,
        unitPrice: 12500,
        subtotal: 12500,
      },
    ],
    createdAt: '2026-08-30T09:15:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'PW-000121',
    customer: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    date: '2026-08-29T14:20:00Z',
    status: 'CONFIRMED',
    total: 6900,
    items: [
      {
        productId: 4,
        productName: 'Mecha Gundam',
        quantity: 1,
        unitPrice: 6900,
        subtotal: 6900,
      },
    ],
    createdAt: '2026-08-29T14:20:00Z',
    updatedAt: '2026-08-29T15:00:00Z',
  },
  {
    id: 'PW-000120',
    customer: 'Pedro Sánchez',
    email: 'pedro.sanchez@email.com',
    date: '2026-08-28T11:10:00Z',
    status: 'COMPLETED',
    total: 3900,
    items: [
      {
        productId: 1,
        productName: 'Miniatura Space Marine',
        quantity: 1,
        unitPrice: 3900,
        subtotal: 3900,
      },
    ],
    createdAt: '2026-08-28T11:10:00Z',
    updatedAt: '2026-08-28T16:30:00Z',
  },
  {
    id: 'PW-000119',
    customer: 'Laura Díaz',
    email: 'lara.diaz@email.com',
    date: '2026-08-27T13:45:00Z',
    status: 'COMPLETED',
    total: 900,
    items: [
      {
        productId: 5,
        productName: 'Dado D20 Personalizado',
        quantity: 1,
        unitPrice: 900,
        subtotal: 900,
      },
    ],
    createdAt: '2026-08-27T13:45:00Z',
    updatedAt: '2026-08-27T18:00:00Z',
  },
  {
    id: 'PW-000118',
    customer: 'Roberto Fernández',
    email: 'roberto.fernandez@email.com',
    date: '2026-08-26T10:00:00Z',
    status: 'CANCELLED',
    total: 7900,
    items: [
      {
        productId: 1,
        productName: 'Miniatura Space Marine',
        quantity: 2,
        unitPrice: 3900,
        subtotal: 7800,
      },
    ],
    createdAt: '2026-08-26T10:00:00Z',
    updatedAt: '2026-08-26T11:00:00Z',
  },
];
