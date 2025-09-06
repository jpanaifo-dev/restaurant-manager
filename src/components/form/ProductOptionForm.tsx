// components/ProductOptionForm.tsx
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  productOptionSchema,
  type ProductOptionFormData,
} from '../../schemas/productOptionSchema'
// Ui components
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
  Checkbox,
} from 'flowbite-react'
import supabase from '../../utils/supabase'

interface ProductOptionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductOptionFormData) => void
  defaultValues?: ProductOptionFormData & { id?: number }
  isDisabled?: boolean
  productId?: number
}

interface Product {
  id: number
  name: string
}

const ProductOptionForm: React.FC<ProductOptionFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isDisabled,
  productId,
}) => {
  const [products, setProducts] = useState<Product[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductOptionFormData>({
    resolver: zodResolver(productOptionSchema),
  })

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name')

      if (!error && data) {
        setProducts(data)
      }
    }

    fetchProducts()
  }, [])

  // Reset form cuando cambian los defaultValues
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    } else {
      reset({
        name: '',
        additional_price: 0,
        product_id: productId || undefined,
        is_available: true,
      })
    }
  }, [defaultValues, reset, open, productId])

  return (
    <Modal show={open} onClose={onClose}>
      <ModalHeader>
        {defaultValues?.id ? 'Editar Acompañamiento' : 'Agregar Acompañamiento'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-base">
              Nombre del Acompañamiento
            </Label>
            <TextInput
              id="name"
              {...register('name')}
              placeholder="Ej: Queso extra, Tocino, etc."
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_price" className="block text-base">
              Precio Adicional
            </Label>
            <TextInput
              id="additional_price"
              type="number"
              min={0}
              step="0.01"
              {...register('additional_price', { valueAsNumber: true })}
            />
            {errors.additional_price && (
              <p className="text-red-500 text-sm">
                {errors.additional_price.message}
              </p>
            )}
          </div>

          {!productId && (
            <div className="space-y-2">
              <Label htmlFor="product_id" className="block text-base">
                Producto Asociado
              </Label>
              <Select
                id="product_id"
                {...register('product_id', { valueAsNumber: true })}
              >
                <option value="">Seleccionar producto (opcional)</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>
              {errors.product_id && (
                <p className="text-red-500 text-sm">
                  {errors.product_id.message}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_available"
              {...register('is_available')}
              defaultChecked={defaultValues?.is_available ?? true}
            />
            <Label htmlFor="is_available" className="cursor-pointer">
              Disponible
            </Label>
            {errors.is_available && (
              <p className="text-red-500 text-sm">
                {errors.is_available.message}
              </p>
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
              {defaultValues?.id ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default ProductOptionForm
