/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  categorySchema,
  type CategoryFormData,
} from '../../schemas/categorySchema'
// Ui components
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
} from 'flowbite-react'

// Lista de iconos disponibles (puedes expandir esta lista)
const availableIcons = [
  '🍕',
  '🍔',
  '🍟',
  '🌭',
  '🍿',
  '🥓',
  '🥚',
  '🍳',
  '🥞',
  '🧇',
  '🧀',
  '🍖',
  '🍗',
  '🥩',
  '🍠',
  '🍣',
  '🍤',
  '🍥',
  '🥮',
  '🍡',
  '🥟',
  '🥠',
  '🥡',
  '🍦',
  '🍧',
  '🍨',
  '🍩',
  '🍪',
  '🎂',
  '🍰',
  '🧁',
  '🥧',
  '🍫',
  '🍬',
  '🍭',
  '🍮',
  '🍯',
  '🥛',
  '🍼',
  '☕',
  '🍵',
  '🍶',
  '🍾',
  '🍷',
  '🍸',
  '🍹',
  '🍺',
  '🍻',
  '🥂',
  '🥃',
]

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => void
  defaultValues?: Partial<CategoryFormData>
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: defaultValues?.status || 'activa',
      name: defaultValues?.name || '',
      color: defaultValues?.color || '#3B82F6',
      icon: defaultValues?.icon || '🍕',
    },
  })

  useEffect(() => {
    // Reset form when defaultValues change
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(
          key as keyof CategoryFormData,
          (defaultValues[key as keyof CategoryFormData] ?? '') as string
        )
      })
    }
  }, [defaultValues, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal show={open} onClose={handleClose}>
      <ModalHeader>
        {defaultValues?.name ? 'Editar Categoría' : 'Agregar Categoría'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="block text-base">Nombre</Label>
            <TextInput {...register('name')} placeholder="Pizzas" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="block text-base">Icono</Label>
            <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
              {availableIcons.map((icon) => (
                <label
                  key={icon}
                  className={`flex items-center justify-center text-2xl p-2 rounded cursor-pointer border hover:bg-gray-100`}
                >
                  <input
                    type="radio"
                    value={icon}
                    {...register('icon')}
                    className="hidden"
                  />
                  {icon}
                </label>
              ))}
            </div>
            {errors.icon && (
              <p className="text-red-500 text-sm">{errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="block text-base">Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...register('color')}
                className="w-10 h-10 rounded border"
              />
              <TextInput
                {...register('color')}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-base">Estado</Label>
            <Select {...register('status')}>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button color="gray" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Guardar
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default CategoryForm
