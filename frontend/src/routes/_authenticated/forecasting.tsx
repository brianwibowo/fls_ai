import { createFileRoute, redirect } from '@tanstack/react-router'
import { Forecasting } from '@/features/forecasting'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/forecasting')({
  beforeLoad: () => {
    const role = useAuthStore.getState().auth.user?.role?.[0]
    if (role === 'marketing_manager') {
      throw redirect({ to: '/403' })
    }
  },
  component: Forecasting,
})
