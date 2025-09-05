// src/components/Navbar.tsx
import React from 'react'
import { Dropdown, DropdownItem, Avatar } from 'flowbite-react'
import { DateTimeClock } from '../miscellaneous'

type MenuItem = {
  key: string
  label: string
  href?: string
  onClick?: () => void
}

interface Props {
  brand?: string
  logoSrc?: string
  /** Color de fondo del navbar (ej. '#2b3b55' azul marino) */
  navColor?: string
  /** Color de la línea superior del navbar */
  accentTopColor?: string
  userName?: string
  userEmail?: string
  avatarSrc?: string
  menuItems?: MenuItem[]
  className?: string
}

const Navbar: React.FC<Props> = ({
  brand = 'Restaurante',
  logoSrc,
  navColor = '#2b3b55', // azul marino por defecto
  accentTopColor = '#133a6a', // azul más oscuro para la línea superior
  userName = 'Usuario',
  userEmail,
  avatarSrc,
  menuItems = [
    { key: 'profile', label: 'Perfil', href: '/perfil' },
    { key: 'settings', label: 'Configuración', href: '/configuracion' },
    { key: 'logout', label: 'Salir', onClick: () => {} },
  ],
  className = '',
}) => {
  return (
    <header
      className={`w-full
    fixed top-0 z-50
    shadow-sm ${className}`}
    >
      {/* Línea superior fina (como en la imagen) */}
      <div className="h-1 w-full" style={{ backgroundColor: accentTopColor }} />

      {/* Barra principal */}
      <div
        className="w-full border-b border-white/30 text-white"
        style={{ backgroundColor: navColor }}
      >
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          {/* Izquierda: logo + nombre */}
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={brand}
                className="h-7 w-7 rounded-md object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-md bg-white/20" />
            )}
            <span className="text-xl font-extrabold tracking-wide">
              {brand}
            </span>
          </div>

          {/* Center: reloj */}
          <DateTimeClock className="text-sm sm:text-base" />

          {/* Derecha: título + usuario con dropdown */}
          <div className="flex items-center gap-4">
            <Dropdown
              placement="bottom-end"
              inline
              arrowIcon={false}
              label={
                <div className="flex cursor-pointer items-center gap-2">
                  <Avatar img={avatarSrc} rounded size="sm" />
                  <div className="hidden sm:flex flex-col leading-none text-left">
                    <span className="font-semibold">{userName}</span>
                    {userEmail ? (
                      <span className="text-xs opacity-80">{userEmail}</span>
                    ) : null}
                  </div>
                </div>
              }
            >
              {menuItems.map((item) =>
                item.href ? (
                  <DropdownItem key={item.key} as="a" href={item.href}>
                    {item.label}
                  </DropdownItem>
                ) : (
                  <DropdownItem key={item.key} onClick={item.onClick}>
                    {item.label}
                  </DropdownItem>
                )
              )}
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
