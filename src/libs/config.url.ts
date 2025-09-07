export const APP_URL = {
  AUTH: {
    LOGIN: '/login',
  },
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
    CREATE: (tableId: string) => `/orders/create/${tableId}`,
    PATH_CREATE: '/orders/create/:id',
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
