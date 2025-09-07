/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
// import { Plus } from 'tabler-icons-react'
import { Button } from 'flowbite-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '../../types/order'
import { type Table as TableType } from '../../types/supabase'

interface FilterState {
  status: string | null
  dateFrom: string | null
  dateTo: string | null
  tableId: string | null
}

const OrdersHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tableList, setTableList] = useState<TableType[]>([])
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    dateFrom: null,
    dateTo: null,
    tableId: null,
  })
  const navigate = useNavigate()

  // 🔹 Cargar órdenes desde Supabase con filtros y ordenamiento
  const fetchOrders = async () => {
    setLoading(true)

    let query = supabase.from('orders').select(`
        *,
        tables (id, name, code),
        users (id, email)
      `)

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo + 'T23:59:59')
    }

    if (filters.tableId) {
      query = query.eq('table_id', filters.tableId)
    }

    // Aplicar ordenamiento
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Error cargando órdenes:', error.message)
    } else {
      setOrders(data as Order[])
    }

    setLoading(false)
  }

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from('tables')
      .select('id, name, code')
      .order('name')
    if (error) {
      console.error('Error cargando mesas:', error.message)
    } else {
      setTableList(data as TableType[])
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [sortField, sortOrder, filters])

  useEffect(() => {
    fetchTables()
  }, [])
  // 🔹 Cambiar campo de ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // 🔹 Aplicar filtros
  const handleFilter = (newFilters: Partial<FilterState>) => {
    setFilters({ ...filters, ...newFilters })
  }

  // 🔹 Calcular el total de una orden
  const calculateTotal = (order: Order): number => {
    if (!order.order_items) return 0

    return order.order_items.reduce((total, item) => {
      return total + item.quantity * (item.products?.price || 0)
    }, 0)
  }

  // 🔹 Obtener el nombre de la mesa
  const getTableName = (order: Order): string => {
    if (order.table_id === null) return 'Takeaway'
    return order.tables?.name || `Mesa ${order.table_id}`
  }

  // 🔹 Formatear fecha
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-'

    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de Órdenes</h1>
        {/* <Button
          onClick={() => navigate('/orders/create')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus size={16} className="mr-2" />
          Crear Pedido
        </Button> */}
      </div>

      {/* Filtros */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full p-2 border rounded"
              value={filters.status || ''}
              onChange={(e) => handleFilter({ status: e.target.value || null })}
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En preparación</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Desde</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={filters.dateFrom || ''}
              onChange={(e) =>
                handleFilter({ dateFrom: e.target.value || null })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hasta</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilter({ dateTo: e.target.value || null })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mesa</label>
            <select
              className="w-full p-2 border rounded"
              value={filters.tableId || ''}
              onChange={(e) =>
                handleFilter({ tableId: e.target.value || null })
              }
            >
              <option value="">Todas</option>
              {tableList.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name} ({table.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de órdenes */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-16 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Fecha{' '}
                {sortField === 'created_at' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHeadCell>
              <TableHeadCell>Mesa</TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Estado{' '}
                {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHeadCell>
              <TableHeadCell>Items</TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort('start_time')}
              >
                Total{' '}
                {sortField === 'start_time' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHeadCell>
              <TableHeadCell>Acciones</TableHeadCell>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{getTableName(order)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status === 'pending' && 'Pendiente'}
                      {order.status === 'in_progress' && 'En preparación'}
                      {order.status === 'completed' && 'Completado'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </TableCell>
                  <TableCell>{order.order_items?.length || 0} items</TableCell>
                  <TableCell className="font-medium">
                    ${calculateTotal(order).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => navigate(`/orders/edit/${order.id}`)}
                      >
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron órdenes con los filtros aplicados
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrdersHistoryPage
