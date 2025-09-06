import { Pencil, Refresh } from 'tabler-icons-react'
import { useState } from 'react'
import { TABLE_ROUNDED } from '../../assets'

interface TableCardProps {
  id: number
  name: string
  code: string
  capacity: number
  status: 'libre' | 'ocupada' | 'reservada' | 'en mantenimiento'
  shape?: 'circle' | 'square' | 'oval' | 'rectangle' | 'diamond' // más formas
  onEdit: () => void
  onToggle: () => void
}

export default function TableCard({
  name,
  code,
  capacity,
  status,
  shape = 'circle',
  onEdit,
  onToggle,
}: TableCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors: Record<
    string,
    { bg: string; text: string; border: string; light: string }
  > = {
    libre: {
      bg: 'bg-green-500',
      text: 'text-green-700',
      border: 'border-green-400',
      light: 'bg-green-100',
    },
    ocupada: {
      bg: 'bg-red-500',
      text: 'text-red-700',
      border: 'border-red-400',
      light: 'bg-red-100',
    },
    reservada: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-700',
      border: 'border-yellow-400',
      light: 'bg-yellow-100',
    },
    'en mantenimiento': {
      bg: 'bg-gray-500',
      text: 'text-gray-700',
      border: 'border-gray-400',
      light: 'bg-gray-100',
    },
  }

  const statusConfig = statusColors[status]

  return (
    <div
      className={`relative w-full h-52 rounded-xl border-2 ${
        statusConfig.border
      } shadow-lg bg-white flex items-center justify-center overflow-hidden transition-all duration-300 transform ${
        isHovered ? 'shadow-xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botón de Editar (arriba izq) */}
      <button
        onClick={onEdit}
        className="absolute top-3 left-3 p-2  px-4 hover:cursor-pointer rounded-full flex items-center justify-center gap-2 bg-white shadow-md hover:bg-gray-50 transition-colors duration-200 z-10 group/edit"
        aria-label="Editar mesa"
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

      {/* SVG de la mesa como fondo con color según estado */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {shape === 'circle' && <img src={TABLE_ROUNDED} className="w-60" />}
        {shape === 'square' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-28"
            fill="none"
            viewBox="0 0 100 100"
          >
            <rect
              x="15"
              y="15"
              width="70"
              height="70"
              rx="12"
              stroke="currentColor"
              strokeWidth="8"
              className={statusConfig.text}
            />
          </svg>
        )}
        {shape === 'oval' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-28"
            fill="none"
            viewBox="0 0 100 100"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="35"
              stroke="currentColor"
              strokeWidth="8"
              className={statusConfig.text}
            />
          </svg>
        )}
        {shape === 'rectangle' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-28"
            fill="none"
            viewBox="0 0 100 100"
          >
            <rect
              x="10"
              y="20"
              width="80"
              height="60"
              rx="8"
              stroke="currentColor"
              strokeWidth="8"
              className={statusConfig.text}
            />
          </svg>
        )}
        {shape === 'diamond' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-28"
            fill="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M50 15 L85 50 L50 85 L15 50 Z"
              stroke="currentColor"
              strokeWidth="8"
              className={statusConfig.text}
            />
          </svg>
        )}
      </div>

      {/* Contenido principal - Número de mesa destacado */}
      <div className="relative text-center z-10">
        <h3 className="text-2xl font-extrabold text-gray-800 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className=" text-gray-800 text-base">
          Código: <span className="font-semibold ">{code}</span>
        </p>

        <p className=" text-gray-800 mt-1 text-base">
          Capacidad:{' '}
          <span className="font-semibold ">{capacity} persona(s)</span>
        </p>
      </div>

      {/* Botón Cambiar Estado (solo icono, abajo centro) */}
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
