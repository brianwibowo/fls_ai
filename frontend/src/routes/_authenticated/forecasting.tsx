import { createFileRoute } from '@tanstack/react-router'
import { Forecasting } from '@/features/forecasting'

export const Route = createFileRoute('/_authenticated/forecasting')({
  component: Forecasting,
})
