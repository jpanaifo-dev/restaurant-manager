// schemas/productOptionSchema.ts
import { z } from 'zod'

export const productOptionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  additional_price: z
    .number()
    .min(0, 'El precio adicional debe ser mayor o igual a 0'),
  product_id: z.number().optional().nullable(),
  is_available: z.boolean(),
})

export type ProductOptionFormData = z.infer<typeof productOptionSchema>
