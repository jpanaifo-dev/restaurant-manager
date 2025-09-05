import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
import { type TableFormData } from '../../schemas/tableSchema'
import { Plus } from 'tabler-icons-react'
import { TableForm } from '../../components/form'
import { Button } from 'flowbite-react'
import TableCard from './TableCard'

interface Table {
  id: number
  name: string
  capacity: number
  status: string
  code: string
}

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)

  // 🔹 Cargar mesas desde Supabase
  const fetchTables = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('id', { ascending: true })
    if (error) console.error('Error cargando mesas:', error.message)
    else setTables(data as Table[])
    setLoading(false)
  }

  useEffect(() => {
    fetchTables()
  }, [])

  // 🔹 Crear / actualizar mesa
  const handleAddOrEditTable = async (data: TableFormData) => {
    if (editingTable) {
      // Update
      const { error } = await supabase
        .from('tables')
        .update(data)
        .eq('id', editingTable.id)
      if (error) console.error('Error actualizando mesa:', error.message)
    } else {
      // Insert
      const { error } = await supabase.from('tables').insert([data])
      if (error) console.error('Error insertando mesa:', error.message)
    }
    setShowForm(false)
    setEditingTable(null)
    fetchTables()
  }

  // 🔹 Cambiar estado de mesa
  const toggleStatus = async (table: Table) => {
    const nextStatus = table.status === 'libre' ? 'ocupada' : 'libre' // ejemplo básico
    const { error } = await supabase
      .from('tables')
      .update({ status: nextStatus })
      .eq('id', table.id)
    if (error) console.error('Error cambiando estado:', error.message)
    fetchTables()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Mesas</h1>

      <Button
        onClick={() => {
          setShowForm(true)
          setEditingTable(null)
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        <Plus size={16} className="mr-2" />
        Agregar Mesa
      </Button>

      <TableForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingTable(null)
        }}
        onSubmit={handleAddOrEditTable}
        defaultValues={{
          name: editingTable ? editingTable.name : '',
          capacity: editingTable ? editingTable.capacity : 1,
          status: editingTable
            ? (editingTable.status as
                | 'libre'
                | 'ocupada'
                | 'reservada'
                | 'en mantenimiento')
            : 'libre',
          code: editingTable ? editingTable.code : '',
        }}
      />

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-gray-200 rounded-lg h-32 w-full flex flex-col justify-center items-center"
            >
              <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-300 rounded mb-1" />
              <div className="h-4 w-1/3 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              capacity={table.capacity}
              code={table.code}
              id={table.id}
              name={table.name}
              onEdit={() => {
                setEditingTable(table)
                setShowForm(true)
              }}
              onToggle={() => toggleStatus(table)}
              status={
                table.status as
                  | 'libre'
                  | 'ocupada'
                  | 'reservada'
                  | 'en mantenimiento'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TablesPage
