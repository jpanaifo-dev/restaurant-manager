import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  status: z.enum(['activa', 'inactiva']),
  color: z.string().min(1, 'El color es requerido'),
  icon: z.string().min(1, 'El icono es requerido'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
