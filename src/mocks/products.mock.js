/**
 * Mock data para Productos
 * 
 * Representa escenarios reales de negocio:
 * - ACTIVE + CURRENT
 * - INACTIVE + CURRENT
 * - INACTIVE + OUTDATED
 * 
 * No utilizar ACTIVE + OUTDATED como estado normal publicable
 */

export const products = [
  {
    id: 1,
    name: 'Miniatura Space Marine',
    description: 'Figura coleccionable Warhammer 40k, escala 28mm',
    tags: ['w40k', '40k', 'Warhammer', 'TCG'],
    filament: 'PLA Verde',
    grams: 120,
    hours: 4,
    margin: 50,
    price: 3900,
    commercialStatus: 'ACTIVE',
    priceStatus: 'CURRENT',
    updatedAt: '2026-09-01T10:00:00Z',
    images: {
      front: '/images/products/1-front.jpg',
      side: '/images/products/1-side.jpg',
      top: '/images/products/1-top.jpg',
    },
  },
  {
    id: 2,
    name: 'Dragón de Ébano',
    description: 'Figura de dragón en escala 1:72, detallada',
    tags: ['fantasía', 'dragón', 'Gaming'],
    filament: 'ABS Negro',
    grams: 200,
    hours: 8,
    margin: 60,
    price: 7900,
    commercialStatus: 'INACTIVE',
    priceStatus: 'OUTDATED',
    updatedAt: '2026-08-15T14:30:00Z',
    images: {
      front: '/images/products/2-front.jpg',
      side: '/images/products/2-side.jpg',
      top: '/images/products/2-top.jpg',
    },
  },
  {
    id: 3,
    name: 'Castillo Medieval',
    description: 'Set de piezas para armar castillo medieval',
    tags: ['medieval', 'castillo', 'w40k'],
    filament: 'PETG Gris',
    grams: 350,
    hours: 12,
    margin: 45,
    price: 12500,
    commercialStatus: 'ACTIVE',
    priceStatus: 'CURRENT',
    updatedAt: '2026-08-20T09:15:00Z',
    images: {
      front: '/images/products/3-front.jpg',
      side: '/images/products/3-side.jpg',
      top: '/images/products/3-top.jpg',
    },
  },
  {
    id: 4,
    name: 'Mecha Gundam',
    description: 'Robot mecha articulado, escala 1:100',
    tags: ['mecha', 'gundam', 'TCG'],
    filament: 'PLA Rojo',
    grams: 180,
    hours: 6,
    margin: 55,
    price: 6900,
    commercialStatus: 'INACTIVE',
    priceStatus: 'CURRENT',
    updatedAt: '2026-08-25T16:45:00Z',
    images: {
      front: '/images/products/4-front.jpg',
      side: '/images/products/4-side.jpg',
      top: '/images/products/4-top.jpg',
    },
  },
  {
    id: 5,
    name: 'Dado D20 Personalizado',
    description: 'Dado de 20 caras con diseño personalizado',
    tags: ['TCG', 'Gaming'],
    filament: 'PLA Azul',
    grams: 15,
    hours: 1,
    margin: 70,
    price: 900,
    commercialStatus: 'ACTIVE',
    priceStatus: 'CURRENT',
    updatedAt: '2026-08-28T11:30:00Z',
    images: {
      front: '/images/products/5-front.jpg',
      side: '/images/products/5-side.jpg',
      top: '/images/products/5-top.jpg',
    },
  },
];
