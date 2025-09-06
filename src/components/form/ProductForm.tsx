// components/ProductForm.tsx
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  productSchema,
  type ProductFormData,
  //   type ProductStatus,
} from '../../schemas/productSchema'
// Ui components
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
  Textarea,
  Checkbox,
} from 'flowbite-react'
import supabase from '../../utils/supabase'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
  defaultValues?: ProductFormData
  isDisabled?: boolean
}

interface Category {
  id: number
  name: string
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isDisabled,
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [showStock, setShowStock] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (!error && data) {
        setCategories(data)
      }
    }

    fetchCategories()
  }, [])

  // Reset form cuando cambian los defaultValues
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
      // Determinar si mostrar u ocultar el campo stock basado en los valores por defecto
      setShowStock(typeof defaultValues.stock === 'number')
    } else {
      reset({
        name: '',
        description: '',
        base_price: 0,
        status: 'activo',
        category_id: undefined,
        stock: undefined,
        url_image: '',
      })
      setShowStock(false)
    }
  }, [defaultValues, reset, open])

  return (
    <Modal show={open} onClose={onClose}>
      <ModalHeader>
        {defaultValues ? 'Editar Producto' : 'Agregar Producto'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-base">
              Nombre
            </Label>
            <TextInput
              id="name"
              {...register('name')}
              placeholder="Nombre del producto"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="block text-base">
              Descripción
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción del producto"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price" className="block text-base">
                Precio
              </Label>
              <TextInput
                id="base_price"
                type="number"
                min={0}
                step="0.01"
                {...register('base_price', { valueAsNumber: true })}
              />
              {errors.base_price && (
                <p className="text-red-500 text-sm">
                  {errors.base_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="add_stock"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                />
                <Label htmlFor="add_stock" className="cursor-pointer">
                  Agregar stock
                </Label>
              </div>

              {showStock && (
                <>
                  <Label htmlFor="stock" className="block text-base">
                    Cantidad de stock
                  </Label>
                  <TextInput
                    id="stock"
                    type="number"
                    {...register('stock', {
                      valueAsNumber: true,
                      setValueAs: (v) => (v === '' ? undefined : Number(v)),
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">
                      {errors.stock.message}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id" className="block text-base">
              Categoría
            </Label>
            <Select
              id="category_id"
              {...register('category_id', { valueAsNumber: true })}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {errors.category_id && (
              <p className="text-red-500 text-sm">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_image" className="block text-base">
              URL de la imagen
            </Label>
            <TextInput
              id="url_image"
              {...register('url_image')}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {errors.url_image && (
              <p className="text-red-500 text-sm">{errors.url_image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="block text-base">
              Estado
            </Label>
            <Select id="status" {...register('status')}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" color="light" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isDisabled}
            >
              Guardar
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default ProductForm
