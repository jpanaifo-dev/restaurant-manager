/* eslint-disable react-hooks/exhaustive-deps */
// components/TableCard.tsx
import React, { useState, useEffect } from 'react'
import { Badge, Card, Button } from 'flowbite-react'
import { Clock, CurrencyDollar, Edit } from 'tabler-icons-react'
import { useNavigate } from 'react-router-dom'
import type { OrderItem, Product, TableWithDetails } from '../../types/supabase'
import { APP_URL } from '../../libs/config.url'
import { TABLE_ORDER } from '../../assets'

interface TableCardProps {
  table: TableWithDetails
  currentTime: Date
  onRefresh?: () => void
}

const TableCardOrder: React.FC<TableCardProps> = ({ table, currentTime }) => {
  const router = useNavigate()
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00')
  const [, setSeconds] = useState<number>(0)

  // Calcular tiempo transcurrido en formato HH:MM:SS
  const calculateElapsedTime = (startTime: string): number => {
    const start = new Date(startTime)
    const diff = Math.max(0, currentTime.getTime() - start.getTime())
    return Math.floor(diff / 1000) // Devuelve segundos
  }

  // Formatear segundos a formato legible
  const formatElapsedTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h : ${minutes}m : ${seconds}s`
    } else if (minutes > 0) {
      return `00h: ${minutes}m : ${seconds}s`
    } else {
      return `00h: 00m: ${seconds}s`
    }
  }

  // Actualizar el tiempo transcurrido cada segundo
  useEffect(() => {
    if (table.current_order) {
      // Calcular tiempo inicial en segundos
      const initialSeconds = calculateElapsedTime(
        table.current_order.start_time
      )
      setSeconds(initialSeconds)
      setElapsedTime(formatElapsedTime(initialSeconds))

      // Configurar intervalo para actualizar cada segundo
      const interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          setElapsedTime(formatElapsedTime(newSeconds))
          return newSeconds
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [table.current_order])

  // Calcular total de la orden
  const calculateOrderTotal = (
    orderItems: (OrderItem & { product: Product })[]
  ): number => {
    return orderItems.reduce((total, item) => {
      return total + item.quantity * (item.product?.base_price || 0)
    }, 0)
  }

  // Obtener icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'libre':
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>
      case 'ocupada':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      case 'reservada':
        return <div className="w-3 h-3 rounded-full bg-purple-500"></div>
      case 'en mantenimiento':
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>
    }
  }

  // Obtener color para el estado de la orden
  const getOrderStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'info'
      case 'preparing':
        return 'warning'
      case 'served':
        return 'success'
      case 'pending_payment':
        return 'purple'
      default:
        return 'gray'
    }
  }

  // Obtener el estado de la orden y convertirlo a español
  const getOrderStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'En proceso'
      case 'preparing':
        return 'En preparación'
      case 'served':
        return 'Servido'
      case 'pending_payment':
        return 'Pendiente de pago'
      default:
        return status
    }
  }

  // Manejar redirección a la orden
  const handleOrderRedirect = () => {
    if (table.current_order) {
      router(APP_URL.ORDERS.DETAIL(table.id.toString()))
    }
  }

  return (
    <Card
      className={`relative overflow-hidden hover:shadow-xl transform hover:cursor-pointer border-2 ${
        table.status === 'ocupada'
          ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100/60'
          : table.status === 'reservada'
          ? 'border-purple-400 bg-purple-100 hover:bg-purple-200/60'
          : 'border-green-400 bg-green-100 hover:bg-green-200/60'
      }`}
      onClick={handleOrderRedirect}
    >
      {/* Indicador de estado */}
      <div className="absolute top-2 right-2">
        {getStatusIcon(table.status)}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{table.name}</h3>
        </div>
      </div>

      {table.current_order ? (
        <div className="space-y-2">
          {/* Contador en tiempo real - Estilo mejorado */}
          <div className="flex items-center justify-center text-2xl font-bold">
            <Clock size={24} className="mr-2" />
            <span className="font-mono">{elapsedTime}</span>
          </div>

          {/* Información del pedido - Minimalista sin bordes */}
          <div className="space-y-2">
            {/* Usuario y Número de Orden */}
            <div className="flex justify-between items-center flex-col">
              <div className="flex items-center text-sm">
                <span className="font-semibold truncate max-w-[100px] text-sm">
                  {table.current_order.user
                    ? `${table.current_order.user.first_name} ${table.current_order.user.last_name}`
                    : 'Usuario desconocido'}
                </span>
              </div>
            </div>

            {/* Monto y Estado */}
            <div className="flex justify-between items-center flex-col gap-1">
              <span className="text-2xl font-extrabold text-orange-600">
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN',
                  minimumFractionDigits: 2,
                }).format(
                  calculateOrderTotal(table.current_order.order_items || [])
                )}
              </span>
              <Badge
                color={getOrderStatusColor(table.current_order.status)}
                className="text-xs rounded-full"
              >
                {getOrderStatusText(table.current_order.status)}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center my-3 bg-gray-100/70 rounded-lg">
          <p className="text-gray-400 text-sm">Mesa disponible</p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex justify-center opacity-10">
        <img src={TABLE_ORDER} className="w-60" />
      </div>

      <div className="mt-4 flex space-x-2">
        {table.status === 'libre' && (
          <Button
            size="sm"
            className="flex-1 rounded-full bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 text-white"
            onClick={(e) => {
              e.stopPropagation()
              router(APP_URL.ORDERS.CREATE(table.id.toString()))
            }}
          >
            Crear Orden
          </Button>
        )}

        {table.status === 'ocupada' && table.current_order && (
          <>
            <Button
              color="warning"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                router(APP_URL.ORDERS.DETAIL(table.id.toString()))
              }}
            >
              <Edit size={16} />
              Editar
            </Button>
            <Button
              color="success"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                router(APP_URL.ORDERS.DETAIL(table.id.toString()))
              }}
            >
              <CurrencyDollar size={16} />
              Cobrar
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

export default TableCardOrder
