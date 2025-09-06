// pages/ProductsPage.tsx
import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
import {
  type ProductFormData,
  type ProductStatus,
} from '../../schemas/productSchema'
import { Plus } from 'tabler-icons-react'
import { ProductForm } from '../../components/form'
import { Button } from 'flowbite-react'
import { ProductCard } from '../../components/app'

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

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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
    else setProducts(data as Product[])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // 🔹 Crear / actualizar producto
  const handleAddOrEditProduct = async (data: ProductFormData) => {
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
  }

  // 🔹 Cambiar estado de producto
  const toggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'activo' ? 'inactivo' : 'activo'
    const { error } = await supabase
      .from('products')
      .update({ status: nextStatus })
      .eq('id', product.id)
    if (error) console.error('Error cambiando estado:', error.message)
    fetchProducts()
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

      <ProductForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
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
          {products.map((product) => (
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
              onToggle={() => toggleStatus(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage
