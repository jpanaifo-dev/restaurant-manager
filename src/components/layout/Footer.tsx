// src/components/Footer.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Logout,
  BrandAirtable,
  Checklist,
  Dashboard,
  LayoutGrid,
  Printer,
  Soup,
} from 'tabler-icons-react'
import { cn } from '../../libs/utils'
import { APP_URL } from '../../libs/config.url'
import { useLocation } from 'react-router-dom'

const navItems = [
  { to: APP_URL.TABLES.BASE, label: 'Mesas', Icon: BrandAirtable },
  { to: APP_URL.MENUS.BASE, label: 'Menus', Icon: Soup },
  { to: APP_URL.ORDERS.BASE, label: 'Pedidos', Icon: Checklist },
  { to: APP_URL.DASHBOARD.BASE, label: 'Dashboard', Icon: Dashboard },
  { to: APP_URL.ALMACEN.BASE, label: 'Almacen', Icon: LayoutGrid },
  { to: APP_URL.PRINTER.BASE, label: 'Imprimir', Icon: Printer },
]

const Footer: React.FC = () => {
  const location = useLocation()

  return (
    <footer className="fixed inset-x-0 bottom-4 z-50">
      <div className="mx-auto px-4">
        {/*Section logout*/}
        <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 min-h-24 min-w-32 flex items-center justify-center">
          <button className="flex flex-col items-center bg-gray-600 text-white px-4 py-6 rounded-lg hover:bg-gray-700 transition gap-3">
            <Logout size={24} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
        {/*Section navigation*/}
        <nav
          style={{ left: 'calc(8rem + 4rem)' }}
          className="fixed bottom-4 right-4 transform
        bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 min-h-32 min-w-32 flex items-center justify-center gap-6"
        >
          <ul className="grid grid-cols-6 gap-4">
            {navItems.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={cn(
                    'flex flex-col gap-3 items-center bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition px-4 py-6 rounded-lg min-w-40 md:min-w-48 w-full',
                    location.pathname === to
                      ? 'bg-gray-200 text-gray-800 font-semibold shadow'
                      : ''
                  )}
                >
                  <Icon size={24} />
                  <span className="text-sm mt-1">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
