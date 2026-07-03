import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { Nudging } from '@/features/nudging'
import { useAuthStore } from '@/stores/auth-store'

const searchSchema = z.object({
  createNudgeForProductId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/nudging')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    const role = useAuthStore.getState().auth.user?.role?.[0]
    if (role === 'logistics_manager') {
      throw redirect({ to: '/403' })
    }
  },
  component: Nudging,
})
