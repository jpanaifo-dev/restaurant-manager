// schemas/productSchema.ts
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional().nullable(),
  base_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  status: z.enum(['activo', 'inactivo']),
  category_id: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),
  url_image: z.string().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductStatus = 'activo' | 'inactivo'
