export const APP_URL = {
  TABLES: {
    BASE: '/tables',
  },
  MENUS: {
    BASE: '/menus',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (orderId: string) => `/orders/${orderId}`,
  },
  SETTINGS: {
    BASE: '/settings',
  },
  DASHBOARD: {
    BASE: '/dashboard',
  },
  ALMACEN: {
    BASE: '/almacen',
  },
  PRINTER: {
    BASE: '/printer',
  },
}
