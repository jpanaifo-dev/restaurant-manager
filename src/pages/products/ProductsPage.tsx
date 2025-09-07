/* eslint-disable react-hooks/exhaustive-deps */
// pages/ProductsPage.tsx
import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
import {
  type ProductFormData,
  type ProductStatus,
} from '../../schemas/productSchema'
import { type ProductOptionFormData } from '../../schemas/productOptionSchema'
import { ExternalLink, Plus } from 'tabler-icons-react'
import { ProductForm, ProductOptionForm } from '../../components/form'
import { Button } from 'flowbite-react'
import { ProductCard } from '../../components/app'
import { useCategories } from '../../hooks/useCategories'
import { Link, useSearchParams } from 'react-router-dom'
import { APP_URL } from '../../libs/config.url'

interface Product {
  id: number
  name: string
  description: string | null
  base_price: number
  status: string
  category_id: number | null
  stock: number
  url_image: string | null
  categories?: {
    name: string
  }
}

interface ProductOption {
  id: number
  name: string
  additional_price: number
  product_id: number | null
  is_available: boolean
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showOptionForm, setShowOptionForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOptionSubmitting, setIsOptionSubmitting] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    categories,
    fetchCategories,
    // loading: loadCategories,
  } = useCategories()

  // Obtener categoría actual de la URL
  const currentCategory = searchParams.get('category') || 'all'

  // 🔹 Cargar productos desde Supabase
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories (name)
      `
      )
      .order('id', { ascending: true })

    if (error) console.error('Error cargando productos:', error.message)
    else {
      setProducts(data as Product[])
      setFilteredProducts(data as Product[])
    }
    setLoading(false)
  }

  // 🔹 Filtrar productos por categoría
  useEffect(() => {
    if (currentCategory === 'all') {
      setFilteredProducts(products)
    } else {
      const categoryId = parseInt(currentCategory)
      const filtered = products.filter(
        (product) => product.category_id === categoryId
      )
      setFilteredProducts(filtered)
    }
  }, [currentCategory, products])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // 🔹 Crear / actualizar producto
  const handleAddOrEditProduct = async (data: ProductFormData) => {
    setIsSubmitting(true)
    if (editingProduct) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', editingProduct.id)
      if (error) console.error('Error actualizando producto:', error.message)
    } else {
      // Insert
      const { error } = await supabase.from('products').insert([data])
      if (error) console.error('Error insertando producto:', error.message)
    }
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
    setIsSubmitting(false)
  }

  // 🔹 Crear / actualizar opción de producto
  const handleAddOrEditOption = async (data: ProductOptionFormData) => {
    setIsOptionSubmitting(true)
    if (data.id) {
      const { id: dataOptionId, ...dataUpdate } = data
      // Update
      const { error } = await supabase
        .from('product_options')
        .update(dataUpdate)
        .eq('id', dataOptionId)
      if (error) console.error('Error actualizando opción:', error.message)
    } else {
      const dataUpdate = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'id')
      )
      // Insert
      const { error } = await supabase
        .from('product_options')
        .insert([dataUpdate])
      if (error) console.error('Error insertando opción:', error.message)
    }
    setShowOptionForm(false)
    setEditingOption(null)
    setSelectedProductId(undefined)
    setIsOptionSubmitting(false)
  }

  // 🔹 Manejar cambio de categoría
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', categoryId)
    }
    setSearchParams(searchParams)
  }

  // 🔹 Abrir formulario de opciones para un producto específico
  const handleAddOption = (productId: number) => {
    setSelectedProductId(productId)
    setEditingOption(null)
    setShowOptionForm(true)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      <Button
        onClick={() => {
          setShowForm(true)
          setEditingProduct(null)
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        <Plus size={16} className="mr-2" />
        Agregar Producto
      </Button>

      {/* Filtros de categoría */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-lg font-semibold">Filtrar por categoría</h2>
          <span className="mx-1 text-gray-400">|</span>
          <Link
            to={APP_URL.MENUS.CATEGORIES}
            className="text-blue-600 hover:underline text-sm"
            target="_blank"
          >
            Gestionar Categorías
            <ExternalLink size={14} className="inline-block ml-1" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Card para "Todos" */}
          <div
            className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
              currentCategory === 'all'
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            <div>
              <span className="text-3xl">{'📦'}</span>
            </div>
            <span className="text-center font-medium">Todos</span>
          </div>

          {/* Cards para cada categoría */}
          {categories.map((category) => (
            <div
              key={category.id}
              className={`px-4 h-24 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                currentCategory === category.id.toString()
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleCategoryChange(category.id.toString())}
            >
              <div>
                <span className="text-3xl">{category.icon || '📦'}</span>
              </div>
              <span className="text-center font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      <ProductForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
        isDisabled={isSubmitting}
        onSubmit={handleAddOrEditProduct}
        defaultValues={
          editingProduct
            ? {
                name: editingProduct.name,
                description: editingProduct.description || '',
                base_price: editingProduct.base_price,
                status: editingProduct.status as ProductStatus,
                category_id: editingProduct.category_id || undefined,
                stock: editingProduct.stock,
                url_image: editingProduct.url_image || '',
              }
            : undefined
        }
      />

      <ProductOptionForm
        open={showOptionForm}
        onClose={() => {
          setShowOptionForm(false)
          setEditingOption(null)
          setSelectedProductId(undefined)
        }}
        isDisabled={isOptionSubmitting}
        onSubmit={handleAddOrEditOption}
        defaultValues={editingOption || undefined}
        productId={selectedProductId}
      />

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-gray-200 rounded-lg h-60 w-full flex flex-col justify-center items-center"
            >
              <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-300 rounded mb-1" />
              <div className="h-4 w-1/3 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              base_price={product.base_price}
              status={product.status as ProductStatus}
              category_id={product.category_id}
              category_name={product.categories?.name}
              stock={product.stock}
              url_image={product.url_image}
              onEdit={() => {
                setEditingProduct(product)
                setShowForm(true)
              }}
              onAddSideDish={() => handleAddOption(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage
