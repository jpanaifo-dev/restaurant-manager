// components/ProductCard.tsx
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
  onAddSideDish?: () => void
}

export default function ProductCard({
  name,
  description,
  base_price,
  status,
  category_name,
  url_image,
  onEdit,
  onAddSideDish,
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
      className={`relative w-full rounded-xl border-2 ${
        statusConfig.border
      } shadow-lg bg-white flex flex-col overflow-hidden transition-all duration-300 transform ${
        isHovered ? 'shadow-xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="h-48 bg-gray-200 overflow-hidden min-h-48">
        {url_image ? (
          <img
            src={url_image}
            alt={name}
            className="w-full h-full object-cover min-h-40"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Chip de Estado (arriba der) */}
      <span
        className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.light} ${statusConfig.text} border ${statusConfig.border} uppercase`}
      >
        {status}
      </span>

      {/* Contenido del producto */}
      <div className="p-4 flex flex-col flex-grow">
        {category_name && (
          <div>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {category_name}
            </span>
          </div>
        )}
        <h3 className="text-lg font-extrabold text-gray-800 mb-1 line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto">
          <p className="text-2xl font-bold text-orange-600">
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
              minimumFractionDigits: 2,
            }).format(base_price)}
          </p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 z-30">
          <button
            onClick={onEdit}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm hover:cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={onAddSideDish}
            className="border border-blue-600 text-blue-700 w-full py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm hover:cursor-pointer"
          >
            Acompañamientos
          </button>
        </div>
      </div>

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
