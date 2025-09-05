/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tableSchema, type TableFormData } from '../../schemas/tableSchema'
//Ui components
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
} from 'flowbite-react'

interface TableFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TableFormData) => void
  defaultValues?: Partial<TableFormData>
}

const TableForm: React.FC<TableFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      capacity: defaultValues?.capacity,
      status: defaultValues?.status || 'libre',
      name: defaultValues?.name || '',
      code: defaultValues?.code || '',
    },
  })

  useEffect(() => {
    // Reset form when defaultValues change
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(
          key as keyof TableFormData,
          defaultValues[key as keyof TableFormData]
        )
      })
    }
  }, [defaultValues, register])

  return (
    <Modal show={open} onClose={onClose}>
      <ModalHeader>
        {defaultValues ? 'Editar Mesa' : 'Agregar Mesa'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="block text-base">Nombre</Label>
            <TextInput {...register('name')} placeholder="Mesa 1" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="block text-base">
              Capacidad (número de personas)
            </Label>
            <TextInput
              type="number"
              {...register('capacity', { valueAsNumber: true })}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="block text-base">Código</Label>
            <TextInput {...register('code')} placeholder="T-001" />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-base">Estado</Label>
            <Select {...register('status')}>
              <option value="libre">Libre</option>
              <option value="ocupada">Ocupada</option>
              <option value="reservada">Reservada</option>
              <option value="en mantenimiento">En mantenimiento</option>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </Button>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default TableForm
