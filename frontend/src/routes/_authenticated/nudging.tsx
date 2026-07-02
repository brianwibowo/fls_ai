import { createFileRoute } from '@tanstack/react-router'
import { Nudging } from '@/features/nudging'

export const Route = createFileRoute('/_authenticated/nudging')({
  component: Nudging,
})
