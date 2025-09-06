// components/TablesView.tsx
import React, { useEffect, useState } from 'react'
import type {
  Table,
  Order,
  User,
  OrderItem,
  Product,
} from '../../types/supabase'
import supabase from '../../utils/supabase'
import { Badge, Card, Button } from 'flowbite-react'
import { Clock, Users, User as UserIcon, Plus } from 'tabler-icons-react'

interface TableWithDetails extends Table {
  current_order?: Order & {
    user: User
    order_items: (OrderItem & { product: Product })[]
  }
}

const TablesView: React.FC = () => {
  const [tables, setTables] = useState<TableWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Actualizar el tiempo cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Actualizar cada minuto

    return () => clearInterval(timer)
  }, [])

  // Cargar mesas y órdenes activas
  useEffect(() => {
    fetchTablesWithOrders()
  }, [])

  const fetchTablesWithOrders = async () => {
    setLoading(true)
    try {
      // Obtener mesas que no están en mantenimiento
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .neq('status', 'en mantenimiento')
        .order('name')

      if (tablesError) throw tablesError

      // Obtener órdenes activas (que no están cerradas)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(
          `
          *,
          user:users(*),
          order_items(
            *,
            product:products(*)
          )
        `
        )
        .in('status', ['en preparación', 'servido', 'pendiente de pago'])
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Combinar mesas con sus órdenes activas
      const tablesWithOrders = tablesData.map((table) => {
        const tableOrder = ordersData.find(
          (order) => order.table_id === table.id && order.status !== 'cerrado'
        )

        return {
          ...table,
          current_order: tableOrder || undefined,
        }
      })

      setTables(tablesWithOrders)
    } catch (error) {
      console.error('Error cargando mesas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular tiempo transcurrido
  const calculateElapsedTime = (startTime: string): string => {
    const start = new Date(startTime)
    const diff = currentTime.getTime() - start.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Calcular total de la orden
  const calculateOrderTotal = (
    orderItems: (OrderItem & { product: Product })[]
  ): number => {
    return orderItems.reduce((total, item) => {
      return total + item.quantity * (item.product?.base_price || 0)
    }, 0)
  }

  // Obtener color según el estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'libre':
        return 'success'
      case 'ocupada':
        return 'warning'
      case 'reservada':
        return 'purple'
      case 'en mantenimiento':
        return 'failure'
      default:
        return 'gray'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Mesas</h1>
        <Button color="blue">
          <Plus size={16} className="mr-2" />
          Nueva Mesa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              table.status === 'ocupada' ? 'border-yellow-300 border-2' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{table.name}</h3>
                <p className="text-sm text-gray-600">Código: {table.code}</p>
              </div>
              <Badge color={getStatusColor(table.status)}>
                {table.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center mb-2">
              <Users size={16} className="mr-2 text-gray-600" />
              <span className="text-sm">
                Capacidad: {table.capacity} personas
              </span>
            </div>

            {table.current_order && (
              <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserIcon size={14} className="mr-1 text-gray-600" />
                    <span className="text-sm font-medium">
                      {table.current_order.user?.name || 'Sin asignar'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-600" />
                    <span className="text-sm">
                      {calculateElapsedTime(table.current_order.start_time)}
                    </span>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium">
                    Orden #{table.current_order.id}
                  </div>
                  <div className="text-gray-600">
                    {table.current_order.order_items?.length || 0} items
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-sm font-bold">
                    $
                    {calculateOrderTotal(
                      table.current_order.order_items || []
                    ).toFixed(2)}
                  </span>
                </div>

                <Badge
                  color={
                    table.current_order.status === 'en preparación'
                      ? 'warning'
                      : table.current_order.status === 'servido'
                      ? 'success'
                      : table.current_order.status === 'pendiente de pago'
                      ? 'purple'
                      : 'gray'
                  }
                  className="text-xs"
                >
                  {table.current_order.status.toUpperCase()}
                </Badge>
              </div>
            )}

            {table.status === 'libre' && (
              <Button color="blue" size="sm" className="mt-3">
                Crear Orden
              </Button>
            )}

            {table.status === 'ocupada' && table.current_order && (
              <div className="flex space-x-2 mt-3">
                <Button color="warning" size="sm" className="flex-1">
                  Editar Orden
                </Button>
                <Button color="success" size="sm" className="flex-1">
                  Cobrar
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TablesView
