import React, { useEffect, useState } from 'react'
import supabase from '../../utils/supabase'
import { type CategoryFormData } from '../../schemas/categorySchema'
import { Plus } from 'tabler-icons-react'
import { CategoryForm } from '../../components/form'
import { Button } from 'flowbite-react'
import { CategoryCard } from '../../components/app'

interface Category {
  id: number
  name: string
  status: 'activa' | 'inactiva'
  color: string
  icon: string
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // 🔹 Cargar categorías desde Supabase
  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error cargando categorías:', error.message)
    } else {
      setCategories(data as Category[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // 🔹 Crear / actualizar categoría
  const handleAddOrEditCategory = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        const { error } = await supabase
          .from('categories')
          .update(data)
          .eq('id', editingCategory.id)

        if (error) throw error
      } else {
        // Insertar nueva categoría
        const { error } = await supabase.from('categories').insert([data])
        if (error) throw error
      }

      setShowForm(false)
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error('Error guardando categoría:', error)
    }
  }

  // 🔹 Eliminar categoría
  const handleDeleteCategory = async (id: number) => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')
    ) {
      return
    }

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (error) throw error

      fetchCategories()
    } catch (error) {
      console.error('Error eliminando categoría:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>

        <Button
          onClick={() => {
            setShowForm(true)
            setEditingCategory(null)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus size={16} className="mr-2" />
          Agregar Categoría
        </Button>
      </div>

      <CategoryForm
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingCategory(null)
        }}
        onSubmit={handleAddOrEditCategory}
        defaultValues={editingCategory || undefined}
      />

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-gray-200 rounded-xl h-44 w-full"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
          <p className="text-gray-500">No hay categorías registradas</p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Crear primera categoría
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              status={category.status}
              color={category.color}
              icon={category.icon}
              onEdit={() => {
                setEditingCategory(category)
                setShowForm(true)
              }}
              onDelete={() => handleDeleteCategory(category.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
