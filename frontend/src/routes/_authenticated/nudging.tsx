import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Nudging } from '@/features/nudging'

const searchSchema = z.object({
  createNudgeForProductId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/nudging')({
  component: Nudging,
  validateSearch: searchSchema,
})
