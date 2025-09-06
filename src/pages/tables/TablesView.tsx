// components/TablesView.tsx
import React, { useEffect, useState } from 'react'
import type { TableWithDetails } from '../../types/supabase'
import supabase from '../../utils/supabase'
import { TableCardOrder } from '../../components/app'

const TablesView: React.FC = () => {
  const [tables, setTables] = useState<TableWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Actualizar el tiempo cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col my-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido al Panel de Mesas
        </h1>
        <p className="text-gray-600">
          Aquí puedes gestionar las mesas y sus órdenes de manera eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <TableCardOrder
            key={table.id}
            table={table}
            currentTime={currentTime}
            onRefresh={fetchTablesWithOrders}
          />
        ))}
      </div>
    </div>
  )
}

export default TablesView
