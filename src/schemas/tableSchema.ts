import { z } from 'zod'

export const tableSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  capacity: z
    .number('La capacidad debe ser un número')
    .int('Debe ser un número entero')
    .positive('La capacidad debe ser mayor a 0'),
  start_time: z.date().optional().nullable(),
  end_time: z.date().optional().nullable(),
  status: z.enum(['libre', 'ocupada', 'reservada', 'en mantenimiento']),
  code: z.string().min(1, 'El código es obligatorio'),
  shape: z.enum(['circle', 'square', 'oval', 'rectangle', 'diamond']),
})

export type TableFormData = z.infer<typeof tableSchema>
