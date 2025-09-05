import React, { useState } from 'react'
import { TableForm } from '../../components/form'
import { type TableFormData } from '../../schemas/tableSchema'

interface Table {
  id: number
  name: string
  capacity: number
  status: string
  code: string
}

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleAddTable = (data: TableFormData) => {
    const newTable: Table = {
      id: Date.now(), // en producción vendrá del backend
      ...data,
    }
    setTables((prev) => [...prev, newTable])
    setShowForm(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Mesas</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {showForm ? 'Cancelar' : 'Agregar Mesa'}
      </button>

      {showForm && (
        <div className="mb-6">
          <TableForm onSubmit={handleAddTable} />
        </div>
      )}

      <table className="w-full border-collapse border shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Capacidad</th>
            <th className="border p-2">Código</th>
            <th className="border p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td className="border p-2">{table.id}</td>
              <td className="border p-2">{table.name}</td>
              <td className="border p-2">{table.capacity}</td>
              <td className="border p-2">{table.code}</td>
              <td className="border p-2">{table.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablesPage
