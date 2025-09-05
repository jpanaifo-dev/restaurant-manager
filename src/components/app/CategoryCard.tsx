import { Pencil, Trash } from 'tabler-icons-react'
import { useState } from 'react'

interface CategoryCardProps {
  id: number
  name: string
  status: 'activa' | 'inactiva'
  color: string
  icon: string
  onEdit: () => void
  onDelete: () => void
}

export default function CategoryCard({
  name,
  status,
  color,
  icon,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative w-full h-44 rounded-xl border shadow bg-white flex flex-col items-center justify-center overflow-hidden group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderColor: color }}
    >
      {/* Botones de acción */}
      <div
        className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={onEdit}
          className="p-1.5 rounded-full bg-white shadow hover:bg-gray-50"
          aria-label="Editar categoría"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full bg-white shadow hover:bg-gray-50"
          aria-label="Eliminar categoría"
        >
          <Trash size={16} className="text-red-600" />
        </button>
      </div>

      {/* Chip de Estado */}
      <span
        className={`absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full border ${
          status === 'activa'
            ? 'bg-green-100 text-green-700 border-green-400'
            : 'bg-gray-100 text-gray-700 border-gray-400'
        }`}
      >
        {status}
      </span>

      {/* Icono de la categoría */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
        style={{ backgroundColor: `${color}20` }} // 20 es para opacidad (12% aprox)
      >
        {icon}
      </div>

      {/* Nombre de la categoría */}
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>

      {/* Efecto de superposición al pasar el mouse */}
      {isHovered && (
        <div
          className="absolute inset-0 opacity-10 rounded-xl"
          style={{ backgroundColor: color }}
        ></div>
      )}
    </div>
  )
}
