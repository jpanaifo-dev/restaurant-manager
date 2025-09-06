/* eslint-disable react-hooks/exhaustive-deps */
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
  Alert,
} from 'flowbite-react'
import { Edit, Trash, Plus, ExclamationMark } from 'tabler-icons-react'
import supabase from '../../utils/supabase'

interface ProductOptionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductOptionFormData) => void
  defaultValues?: ProductOptionFormData & { id?: number }
  isDisabled?: boolean
  productId?: number
  productName?: string
}

interface Product {
  id: number
  name: string
}

interface ProductOption {
  id: number
  name: string
  additional_price: number
  product_id: number | null
  is_available: boolean
}

const ProductOptionForm: React.FC<ProductOptionFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isDisabled,
  productId,
  productName,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [options, setOptions] = useState<ProductOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(
    null
  )

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

  // Cargar opciones del producto
  useEffect(() => {
    if (open && productId) {
      fetchProductOptions()
    }
  }, [open, productId])

  const fetchProductOptions = async () => {
    setLoadingOptions(true)
    const { data, error } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', productId)
      .order('name')

    if (!error && data) {
      setOptions(data as ProductOption[])
    } else {
      console.error('Error cargando opciones:', error?.message)
    }
    setLoadingOptions(false)
  }

  // Reset form cuando cambian los defaultValues
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
      setIsEditing(true)
    } else {
      reset({
        name: '',
        additional_price: 0,
        product_id: productId || undefined,
        is_available: true,
      })
      setIsEditing(false)
      setSelectedOption(null)
    }
  }, [defaultValues, reset, open, productId])

  const handleFormSubmit = async (data: ProductOptionFormData) => {
    const dataToSubmit = {
      ...data,
      id: isEditing && selectedOption ? selectedOption.id : undefined,
    }
    await onSubmit(dataToSubmit)
    // Recargar la lista después de guardar
    if (productId) {
      fetchProductOptions()
    }
  }

  const handleEditOption = (option: ProductOption) => {
    setSelectedOption(option)
    reset({
      name: option.name,
      additional_price: option.additional_price,
      product_id: option.product_id || undefined,
      is_available: option.is_available,
    })
    setIsEditing(true)
  }

  const handleDeleteOption = async (optionId: number) => {
    const { error } = await supabase
      .from('product_options')
      .delete()
      .eq('id', optionId)

    if (error) {
      console.error('Error eliminando opción:', error.message)
      alert('Error al eliminar la opción')
    } else {
      // Recargar la lista después de eliminar
      fetchProductOptions()
      // Si estábamos editando la opción eliminada, resetear el formulario
      if (selectedOption?.id === optionId) {
        reset({
          name: '',
          additional_price: 0,
          product_id: productId || undefined,
          is_available: true,
        })
        setIsEditing(false)
        setSelectedOption(null)
      }
    }
  }

  const handleNewOption = () => {
    reset({
      name: '',
      additional_price: 0,
      product_id: productId || undefined,
      is_available: true,
    })
    setIsEditing(false)
    setSelectedOption(null)
  }

  return (
    <>
      <Modal show={open} onClose={onClose} size="3xl">
        <ModalHeader>
          {productName
            ? `Opciones de ${productName}`
            : 'Gestión de Acompañamientos'}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de opciones existentes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Opciones existentes
                {productName && ` para ${productName}`}
              </h3>

              {loadingOptions ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-200 rounded p-3 h-16"
                    ></div>
                  ))}
                </div>
              ) : options.length === 0 ? (
                <Alert color="info" className="mb-4">
                  No hay opciones configuradas para este producto.
                </Alert>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded p-3 flex justify-between items-center ${
                        selectedOption?.id === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-600">
                          {new Intl.NumberFormat('es-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          }).format(option.additional_price)}
                          {!option.is_available && (
                            <span className="ml-2 text-red-500">
                              (No disponible)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleEditOption(option)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => {
                            setSelectedOption(option)
                            setIsConfirmingDelete(true)
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario para agregar/editar opciones */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {isEditing ? 'Editar Opción' : 'Agregar Nueva Opción'}
              </h3>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
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
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
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
                  {isEditing && (
                    <Button
                      type="button"
                      color="light"
                      onClick={handleNewOption}
                    >
                      <Plus size={14} className="mr-1" />
                      Nueva
                    </Button>
                  )}
                  <Button type="button" color="light" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={isDisabled}
                  >
                    {isEditing ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={isConfirmingDelete}
        size="md"
        onClose={() => setIsConfirmingDelete(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <ExclamationMark className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={() => {
                  if (selectedOption) {
                    handleDeleteOption(selectedOption.id)
                  }
                  setIsConfirmingDelete(false)
                }}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="alternative"
                onClick={() => setIsConfirmingDelete(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ProductOptionForm
