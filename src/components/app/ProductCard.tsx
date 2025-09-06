// components/ProductCard.tsx
import { Pencil, Refresh } from 'tabler-icons-react'
import { useState } from 'react'

interface ProductCardProps {
  id: number
  name: string
  description: string | null
  base_price: number
  status: 'activo' | 'inactivo'
  category_id: number | null
  category_name?: string
  stock: number
  url_image: string | null
  onEdit: () => void
  onToggle: () => void
}

export default function ProductCard({
  name,
  description,
  base_price,
  status,
  category_name,
  stock,
  url_image,
  onEdit,
  onToggle,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors: Record<
    string,
    { bg: string; text: string; border: string; light: string }
  > = {
    activo: {
      bg: 'bg-green-500',
      text: 'text-green-700',
      border: 'border-green-400',
      light: 'bg-green-100',
    },
    inactivo: {
      bg: 'bg-gray-500',
      text: 'text-gray-700',
      border: 'border-gray-400',
      light: 'bg-gray-100',
    },
  }

  const statusConfig = statusColors[status]

  return (
    <div
      className={`relative w-full h-80 rounded-xl border-2 ${
        statusConfig.border
      } shadow-lg bg-white flex flex-col overflow-hidden transition-all duration-300 transform ${
        isHovered ? 'shadow-xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="h-40 bg-gray-200 overflow-hidden">
        {url_image ? (
          <img
            src={url_image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Botón de Editar (arriba izq) */}
      <button
        onClick={onEdit}
        className="absolute top-3 left-3 p-2 px-4 hover:cursor-pointer rounded-full flex items-center justify-center gap-2 bg-white shadow-md hover:bg-gray-50 transition-colors duration-200 z-10 group/edit"
        aria-label="Editar producto"
      >
        <Pencil
          size={18}
          className="text-gray-600 group-hover/edit:text-blue-600 transition-colors"
        />{' '}
        <span className="hidden sm:inline text-sm font-medium text-gray-700 group-hover/edit:text-blue-600 transition-colors">
          Editar
        </span>
      </button>

      {/* Chip de Estado (arriba der) */}
      <span
        className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.light} ${statusConfig.text} border ${statusConfig.border} uppercase`}
      >
        {status}
      </span>

      {/* Contenido del producto */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto">
          <p className="text-lg font-bold text-blue-600">
            ${base_price.toFixed(2)}
          </p>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">
              Stock: <span className="font-semibold">{stock}</span>
            </span>

            {category_name && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {category_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón Cambiar Estado (solo icono, abajo der) */}
      <button
        onClick={onToggle}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200 z-10 group/refresh"
        aria-label="Cambiar estado"
      >
        <Refresh
          size={18}
          className="text-gray-600 group-hover/refresh:rotate-180 transition-transform group-hover/refresh:text-blue-600"
        />
      </button>

      {/* Efecto de superposición al pasar el mouse */}
      {isHovered && (
        <div
          className={`absolute inset-0 opacity-10 ${statusConfig.bg.replace(
            '500',
            '400'
          )} rounded-xl`}
        ></div>
      )}
    </div>
  )
}
