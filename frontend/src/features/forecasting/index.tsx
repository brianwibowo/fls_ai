import { useNavigate } from '@tanstack/react-router'
import {
  Target,
  TrendingUp,
  Bell,
  DollarSign,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useForecastDemandQuery,
  useReorderQuery,
  useWasteRiskQuery,
  useForecastingSummaryQuery,
  useGenerateForecastMutation,
  useUpdateReorderStatusMutation,
} from '@/hooks/use-api'
import { toast } from 'sonner'

// --- Helpers ---

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

function getUrgencyVariant(urgency: string) {
  switch (urgency) {
    case 'High':
    case 'HIGH':
      return 'destructive' as const
    case 'Medium':
    case 'MEDIUM':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

// --- Main Component ---

export function Forecasting() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.auth.user)
  const userRole = user?.role?.[0] // 'admin', 'logistics_manager', 'marketing_manager'
  const { data: forecastDemandData, isLoading: isDemandLoading, refetch: refetchDemand, isRefetching: isRefetchingDemand } = useForecastDemandQuery()
  const { data: reorderData, isLoading: isReorderLoading, refetch: refetchReorder, isRefetching: isRefetchingReorder } = useReorderQuery()
  const { data: wasteRiskData, isLoading: isWasteLoading, refetch: refetchWaste, isRefetching: isRefetchingWaste } = useWasteRiskQuery()
  const { data: summaryData, refetch: refetchSummary, isRefetching: isRefetchingSummary } = useForecastingSummaryQuery()

  const isRefreshing = isRefetchingDemand || isRefetchingReorder || isRefetchingWaste || isRefetchingSummary

  const handleRefresh = () => {
    refetchDemand()
    refetchReorder()
    refetchWaste()
    refetchSummary()
  }

  const generateForecast = useGenerateForecastMutation()
  const updateReorderStatus = useUpdateReorderStatusMutation()

  const wasteRiskValue = summaryData?.wasteRisk ?? 0
  const formattedWasteRisk = formatRupiah(wasteRiskValue)

  const summaryCards = [
    { title: 'Forecast Accuracy', value: `${summaryData?.forecastAccuracy ?? 91.2}%`, icon: Target, trend: '+1.8%' },
    { title: 'Demand Variance', value: `${summaryData?.demandVariance ?? 8.5}%`, icon: TrendingUp, trend: '-1.2%' },
    { title: 'Reorder Alerts', value: summaryData?.reorderAlerts ?? 0, icon: Bell, trend: '+3' },
    { title: 'Waste Risk', value: formattedWasteRisk, icon: DollarSign, trend: '-Rp 500K' },
  ]

  const handleGenerate = async () => {
    try {
      await generateForecast.mutateAsync()
      toast.success('AI Forecasting berhasil digenerate ulang!')
    } catch {
      toast.error('Gagal generate forecasting.')
    }
  }

  const handleOrder = async (id: string) => {
    try {
      await updateReorderStatus.mutateAsync({ id, status: 'ORDERED' })
      toast.success('Status rekomendasi diubah menjadi dipesan!')
    } catch {
      toast.error('Gagal memproses reorder.')
    }
  }

  // Map charts data
  const chartData = (forecastDemandData || []).map((fd: any) => ({
    date: new Date(fd.forecastDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    predicted: fd.predictedDemand,
    actual: fd.actualDemand,
  }))

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              AI Forecasting
            </h1>
            <p className='text-sm text-muted-foreground'>
              Prediksi permintaan & rekomendasi reorder berbasis data historis
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              className='cursor-pointer gap-1.5'
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Perbarui Data
            </Button>
            <Button size='sm' onClick={handleGenerate} disabled={generateForecast.isPending}>
              {generateForecast.isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : null}
              Generate Forecast
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {card.title}
                  </CardTitle>
                  <Icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{card.value}</div>
                  <p className='flex items-center text-xs text-green-600'>
                    <ArrowUpRight className='mr-1 h-3 w-3' />
                    {card.trend} vs minggu lalu
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue='overview' className='mt-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview Risiko</TabsTrigger>
            <TabsTrigger value='reorder'>Rekomendasi Reorder</TabsTrigger>
          </TabsList>

          {/* Overview Tab (Demand Forecast + Waste Risk) */}
          <TabsContent value='overview' className='space-y-4'>
            {/* Chart: Prediksi vs Aktual Demand */}
            <Card>
              <CardHeader className='text-start'>
                <CardTitle className='text-base font-bold'>Prediksi vs Aktual Demand</CardTitle>
                <CardDescription className='text-xs'>
                  Perbandingan prediksi demand (garis hijau putus-putus) dengan
                  aktual demand (bar hijau) — 7 hari terakhir + 2 hari prediksi
                </CardDescription>
              </CardHeader>
               <CardContent>
                {isDemandLoading || isRefreshing ? (
                  <div className='flex h-[300px] items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={300}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
                      <XAxis dataKey='date' className='text-xs' />
                      <YAxis className='text-xs' />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey='actual'
                        name='Aktual'
                        fill='#16a34a'
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                      />
                      <Line
                        type='monotone'
                        dataKey='predicted'
                        name='Prediksi'
                        stroke='#16a34a'
                        strokeDasharray='5 5'
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Table: Waste Risk Analysis */}
            <Card>
              <CardHeader className='text-start pb-2'>
                <CardTitle className='text-base font-bold'>Analisis Risiko Food Loss (Waste Risk)</CardTitle>
                <CardDescription className='text-xs'>
                  Daftar produk dengan risiko pembusukan tinggi berdasarkan sisa umur simpan dan tren penjualan.
                </CardDescription>
              </CardHeader>
               <CardContent className='p-0'>
                {isWasteLoading || isRefreshing ? (
                  <div className='flex h-40 items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                  </div>
                ) : (
                  <>
                    <div className='overflow-x-auto w-full'>
                      <Table className='min-w-[800px]'>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className='text-right'>Stock</TableHead>
                            <TableHead className='text-right'>Demand</TableHead>
                            <TableHead className='text-center'>Days Left</TableHead>
                            <TableHead className='text-center'>Risk</TableHead>
                            <TableHead className='text-right'>Estimated Loss</TableHead>
                            {userRole === 'admin' && <TableHead className='text-center w-[120px]'>Action</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wasteRiskData && wasteRiskData.length ? (
                            wasteRiskData.map((item: any) => (
                              <TableRow key={item.sku}>
                                <TableCell className='font-medium text-start'>
                                  {item.product}
                                </TableCell>
                                <TableCell className='text-start'>
                                  <code className='text-xs'>{item.sku}</code>
                                </TableCell>
                                <TableCell className='text-right'>{item.stock}</TableCell>
                                <TableCell className='text-right'>{item.demand}</TableCell>
                                <TableCell className='text-center'>
                                  <span className={item.daysLeft <= 2 ? 'font-semibold text-red-600' : 'text-orange-600'}>
                                    {item.daysLeft} hari lagi
                                  </span>
                                </TableCell>
                                <TableCell className='text-center'>
                                  <Badge variant={getUrgencyVariant(item.risk)}>
                                    {item.risk}
                                  </Badge>
                                </TableCell>
                                <TableCell className='text-right font-medium text-red-600'>
                                  {formatRupiah(item.estimatedLoss)}
                                </TableCell>
                                {userRole === 'admin' && (
                                  <TableCell className='text-center'>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='cursor-pointer h-8 text-xs'
                                      onClick={() => navigate({ to: '/nudging', search: { createNudgeForProductId: item.id } })}
                                    >
                                      Buat Nudge
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                                Tidak ada produk berisiko food loss tinggi terdeteksi.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className='border-t px-4 py-3 text-right bg-muted/5'>
                      <span className='text-xs text-muted-foreground'>
                        Total Estimated Loss:{' '}
                      </span>
                      <span className='text-base font-bold text-red-600'>
                        {formatRupiah(wasteRiskValue)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reorder Recommendations Tab */}
          <TabsContent value='reorder'>
            <Card>
               <CardContent className='p-0'>
                {isReorderLoading || isRefreshing ? (
                  <div className='flex h-40 items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                  </div>
                ) : (
                  <div className='overflow-x-auto w-full'>
                    <Table className='min-w-[800px]'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className='text-right'>Current Stock</TableHead>
                          <TableHead className='text-right'>Recommended</TableHead>
                          <TableHead className='text-center'>Urgency</TableHead>
                          <TableHead className='max-w-[320px]'>AI Reasoning</TableHead>
                          <TableHead className='text-center w-[130px]'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reorderData && reorderData.length ? (
                          reorderData.map((rec: any) => (
                            <TableRow key={rec.id}>
                              <TableCell className='font-medium text-start'>
                                {rec.product.name}
                              </TableCell>
                              <TableCell className='text-start'>
                                <code className='text-xs'>{rec.product.sku}</code>
                              </TableCell>
                              <TableCell className='text-right'>
                                {rec.currentStock}
                              </TableCell>
                              <TableCell className='text-right font-semibold text-emerald-600'>
                                +{rec.recommendedQuantity}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Badge variant={getUrgencyVariant(rec.urgency)}>
                                  {rec.urgency}
                                </Badge>
                              </TableCell>
                              <TableCell className='max-w-[320px] whitespace-normal break-words text-xs text-muted-foreground text-start leading-relaxed'>
                                {rec.aiReasoning}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  className='h-8 text-xs cursor-pointer'
                                  onClick={() => handleOrder(rec.id)}
                                >
                                  Pesan Sekarang
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                              Tidak ada rekomendasi reorder pending saat ini.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
