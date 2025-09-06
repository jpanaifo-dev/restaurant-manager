export interface Order {
  id: number
  table_id: number | null
  created_at: string
  start_time: string | null
  end_time: string | null
  user_id: string | null
  status: string | null
  tables?: {
    id: number
    name: string
    code: string
  }
  users?: {
    id: string
    email: string
  }
  order_items?: Array<{
    id: number
    quantity: number
    products: {
      name: string
      price: number
    }
  }>
}
