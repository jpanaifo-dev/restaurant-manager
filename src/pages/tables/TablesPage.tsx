import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
import { type TableFormData } from '../../schemas/tableSchema'
import { Pencil, Plus, Refresh } from 'tabler-icons-react'
import { TableForm } from '../../components/form'
import { Button } from 'flowbite-react'

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
        <p>Cargando mesas...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {tables.map((table) => (
            <div
              key={table.id}
              className="p-4 border rounded-xl shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold">{table.name}</h2>
                <p className="text-sm text-gray-500">
                  Capacidad: {table.capacity}
                </p>
                <p className="text-sm text-gray-500">Código: {table.code}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    table.status === 'libre'
                      ? 'bg-green-100 text-green-800'
                      : table.status === 'ocupada'
                      ? 'bg-red-100 text-red-800'
                      : table.status === 'reservada'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {table.status}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    setEditingTable(table)
                    setShowForm(true)
                  }}
                >
                  <Pencil size={16} /> Editar
                </Button>
                <Button onClick={() => toggleStatus(table)} color="alternative">
                  <Refresh size={16} /> Cambiar Estado
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TablesPage
