export const APP_URL = {
  TABLES: {
    BASE: '/tables',
  },
  MENUS: {
    BASE: '/menus',
    CATEGORIES: '/menus/categories',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (orderId: string) => `/orders/${orderId}`,
  },
  SETTINGS: {
    BASE: '/settings',
  },
  DASHBOARD: {
    BASE: '/',
  },
  ALMACEN: {
    BASE: '/almacen',
  },
  PRINTER: {
    BASE: '/printer',
  },
}
