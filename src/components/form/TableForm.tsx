import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tableSchema, type TableFormData } from '../../schemas/tableSchema'

interface TableFormProps {
  onSubmit: (data: TableFormData) => void
  defaultValues?: Partial<TableFormData>
}

const TableForm: React.FC<TableFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg bg-white shadow"
    >
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          {...register('name')}
          className="w-full border p-2 rounded"
          placeholder="Mesa 1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Capacidad</label>
        <input
          type="number"
          {...register('capacity', { valueAsNumber: true })}
          className="w-full border p-2 rounded"
        />
        {errors.capacity && (
          <p className="text-red-500 text-sm">{errors.capacity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Código</label>
        <input
          {...register('code')}
          className="w-full border p-2 rounded"
          placeholder="T-001"
        />
        {errors.code && (
          <p className="text-red-500 text-sm">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select {...register('status')} className="w-full border p-2 rounded">
          <option value="libre">Libre</option>
          <option value="ocupada">Ocupada</option>
          <option value="reservada">Reservada</option>
          <option value="en mantenimiento">En mantenimiento</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  )
}

export default TableForm
