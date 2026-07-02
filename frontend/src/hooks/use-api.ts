import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// --- Inventory Hooks ---
export function useInventoryQuery(filters: { category?: string; risk?: string; search?: string } = {}) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/inventory', { params: filters })
      return data
    },
  })
}

export function useInventorySummaryQuery() {
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/inventory/summary')
      return data
    },
  })
}

export function useCreateBatchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { productId: string; batchCode: string; quantityReceived: number; receivedDate: string; expiryDate: string }) => {
      const { data } = await apiClient.post('/inventory/batches', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
    },
  })
}

// --- Forecasting Hooks ---
export function useForecastDemandQuery() {
  return useQuery({
    queryKey: ['forecast-demand'],
    queryFn: async () => {
      const { data } = await apiClient.get('/forecasting/demand')
      return data
    },
  })
}

export function useReorderQuery() {
  return useQuery({
    queryKey: ['forecast-reorders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/forecasting/reorder')
      return data
    },
  })
}

export function useWasteRiskQuery() {
  return useQuery({
    queryKey: ['forecast-waste-risk'],
    queryFn: async () => {
      const { data } = await apiClient.get('/forecasting/waste-risk')
      return data
    },
  })
}

export function useForecastingSummaryQuery() {
  return useQuery({
    queryKey: ['forecasting-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/forecasting/summary')
      return data
    },
  })
}

export function useGenerateForecastMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/forecasting/generate')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forecast-demand'] })
      queryClient.invalidateQueries({ queryKey: ['forecast-reorders'] })
      queryClient.invalidateQueries({ queryKey: ['forecast-waste-risk'] })
      queryClient.invalidateQueries({ queryKey: ['forecasting-summary'] })
    },
  })
}

export function useUpdateReorderStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/forecasting/reorder/${id}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forecast-reorders'] })
      queryClient.invalidateQueries({ queryKey: ['forecasting-summary'] })
    },
  })
}

// --- Nudging Hooks ---
export function useNudgeStrategiesQuery() {
  return useQuery({
    queryKey: ['nudge-strategies'],
    queryFn: async () => {
      const { data } = await apiClient.get('/nudging/strategies')
      return data
    },
  })
}

export function useNudgePreviewsQuery() {
  return useQuery({
    queryKey: ['nudge-previews'],
    queryFn: async () => {
      const { data } = await apiClient.get('/nudging/preview')
      return data
    },
  })
}

export function useNudgeLogsQuery() {
  return useQuery({
    queryKey: ['nudge-logs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/nudging/logs')
      return data
    },
  })
}

export function useNudgingSummaryQuery() {
  return useQuery({
    queryKey: ['nudging-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/nudging/summary')
      return data
    },
  })
}

export function useCreateNudgeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; type: string; discountPercentage?: number; startDate: string; endDate: string; productIds: string[] }) => {
      const { data } = await apiClient.post('/nudging/strategies', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nudge-strategies'] })
      queryClient.invalidateQueries({ queryKey: ['nudging-summary'] })
    },
  })
}

export function useUpdateNudgeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/nudging/strategies/${id}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nudge-strategies'] })
      queryClient.invalidateQueries({ queryKey: ['nudging-summary'] })
    },
  })
}

// --- Analytics Hooks ---
export function useAnalyticsOverviewQuery() {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/overview')
      return data
    },
  })
}

export function useAnalyticsTrendsQuery() {
  return useQuery({
    queryKey: ['analytics-trends'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/trends')
      return data
    },
  })
}

export function useAnalyticsCategoryQuery() {
  return useQuery({
    queryKey: ['analytics-category'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/category-performance')
      return data
    },
  })
}

export function useAnalyticsInsightsQuery() {
  return useQuery({
    queryKey: ['analytics-insights'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/insights')
      return data
    },
  })
}

// --- User Management Hooks ---
export function useUsersQuery(search?: string) {
  return useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const { data } = await apiClient.get('/users')
      return data
    },
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; email: string; role: string; password?: string }) => {
      const { data } = await apiClient.post('/users', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { name?: string; role?: string; isActive?: boolean } }) => {
      const { data } = await apiClient.patch(`/users/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/users/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
