// types/supabase.ts
export interface Table {
  id: number
  name: string
  capacity: number
  status: 'libre' | 'ocupada' | 'reservada' | 'en mantenimiento'
  code: string
  shape: 'rectangle' | 'circle' | 'square'
  created_at?: string
}

export interface User {
  id: number
  name: string
  role: 'mesero' | 'cajero' | 'administrador'
  email?: string
  phone?: string
}

export interface Order {
  id: number
  table_id: number
  status: 'en preparación' | 'servido' | 'pendiente de pago' | 'cerrado'
  created_at: string
  user_id: number
  start_time: string
  end_time?: string
  user?: User
}

export interface Product {
  id: number
  name: string
  base_price: number
  // ... otros campos de producto
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  notes?: string
  url_image?: string
  product?: Product
}
