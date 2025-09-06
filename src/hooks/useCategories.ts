import { useEffect, useState } from 'react'
import supabase from '../utils/supabase'

export interface Category {
  id: number
  name: string
  status: 'activa' | 'inactiva'
  color: string
  icon: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error cargando categorías:', error.message)
      setError(error.message)
    } else {
      setCategories(data as Category[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { fetchCategories, categories, loading, error }
}
