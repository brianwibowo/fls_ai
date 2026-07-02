import {
  Eye,
  TrendingUp,
  BellRing,
  ShoppingBag,
  Plus,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useNudgeStrategiesQuery,
  useNudgePreviewsQuery,
  useNudgeLogsQuery,
  useNudgingSummaryQuery,
  useUpdateNudgeMutation,
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

function getNudgeTypeLabel(type: string) {
  switch (type.toLowerCase()) {
    case 'discount':
      return 'Diskon'
    case 'bundling':
      return 'Bundling'
    case 'urgency_label':
      return 'Label Urgensi'
    case 'gamification_badge':
      return 'Badge Gamifikasi'
    default:
      return type
  }
}

function getEventBadgeVariant(eventType: string) {
  switch (eventType) {
    case 'CONVERSION':
    case 'Conversion':
      return 'default' as const
    case 'CLICK':
    case 'Click':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

// --- Main Component ---

export function Nudging() {
  const { data: strategiesData, isLoading: isStrategiesLoading } = useNudgeStrategiesQuery()
  const { data: previewData, isLoading: isPreviewLoading } = useNudgePreviewsQuery()
  const { data: logsData, isLoading: isLogsLoading } = useNudgeLogsQuery()
  const { data: summaryData } = useNudgingSummaryQuery()

  const updateNudge = useUpdateNudgeMutation()

  const summaryCards = [
    { title: 'Total Impressions', value: summaryData?.totalImpressions ?? '12,450', icon: Eye, trend: '+1,200' },
    { title: 'Avg Conversion', value: `${summaryData?.avgConversion ?? 18.7}%`, icon: TrendingUp, trend: '+2.1%' },
    { title: 'Active Nudges', value: summaryData?.activeNudges ?? '5/5', icon: BellRing, trend: '+2' },
    { title: 'Products Nudged', value: summaryData?.productsNudged ?? '8', icon: ShoppingBag, trend: '+3' },
  ]

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateNudge.mutateAsync({
        id,
        status: currentStatus ? 'ENDED' : 'ACTIVE',
      })
      toast.success('Status strategi nudge berhasil diubah!')
    } catch {
      toast.error('Gagal mengubah status strategi nudge.')
    }
  }

  return (
    <>
      <Header>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Digital Nudging
            </h1>
            <p className='text-sm text-muted-foreground'>
              Strategi promosi produk near-expiry untuk mendorong pembelian secara etis
            </p>
          </div>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Buat Strategi Baru
          </Button>
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
        <Tabs defaultValue='strategies' className='mt-4'>
          <TabsList>
            <TabsTrigger value='strategies'>Nudge Strategies</TabsTrigger>
            <TabsTrigger value='preview'>Product Preview</TabsTrigger>
            <TabsTrigger value='logs'>Activity Logs</TabsTrigger>
          </TabsList>

          {/* Strategies Tab */}
          <TabsContent value='strategies'>
            <Card>
              <CardContent className='p-0'>
                {isStrategiesLoading ? (
                  <div className='flex h-40 items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Strategi</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead className='text-center'>Produk</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead className='text-center'>Conversion</TableHead>
                        <TableHead className='text-center'>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {strategiesData && strategiesData.length ? (
                        strategiesData.map((strategy: any) => {
                          const start = new Date(strategy.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                          const end = new Date(strategy.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                          const isActive = strategy.status === 'ACTIVE'

                          return (
                            <TableRow key={strategy.id}>
                              <TableCell className='font-medium'>
                                {strategy.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant='outline'>
                                  {getNudgeTypeLabel(strategy.type)}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-center'>
                                {strategy.products?.length ?? 0}
                              </TableCell>
                              <TableCell className='text-sm text-muted-foreground'>
                                {start} - {end}
                              </TableCell>
                              <TableCell className='text-center font-medium text-green-600'>
                                18.7%
                              </TableCell>
                              <TableCell className='text-center'>
                                <Switch
                                  checked={isActive}
                                  onCheckedChange={() => handleToggleStatus(strategy.id, isActive)}
                                  disabled={updateNudge.isPending}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                            Belum ada strategi nudge dikonfigurasi.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Preview Tab */}
          <TabsContent value='preview'>
            {isPreviewLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-green-600' />
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {previewData && previewData.length ? (
                  previewData.map((product: any) => (
                    <Card key={product.productId} className='overflow-hidden'>
                      <div className='flex h-40 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'>
                        <ShoppingBag className='h-12 w-12 text-green-300' />
                      </div>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base'>{product.productName}</CardTitle>
                        <CardDescription className='flex items-center gap-2'>
                          {product.originalPrice !== product.discountedPrice && (
                            <span className='text-sm text-muted-foreground line-through'>
                              {formatRupiah(product.originalPrice)}
                            </span>
                          )}
                          <span className='text-lg font-bold text-green-600'>
                            {formatRupiah(product.discountedPrice)}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-1.5'>
                          {product.labels.map((label: string) => (
                            <Badge
                              key={label}
                              variant={
                                label.includes('Save') ? 'default' : 
                                label.includes('left') ? 'destructive' : 'secondary'
                              }
                              className='text-xs'
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className='col-span-full h-24 text-center text-muted-foreground flex items-center justify-center'>
                    Tidak ada preview produk near-expiry aktif.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value='logs'>
            <Card>
              <CardContent className='p-0'>
                {isLogsLoading ? (
                  <div className='flex h-40 items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Strategi</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead className='text-center'>Event</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsData && logsData.length ? (
                        logsData.map((log: any) => {
                          const date = new Date(log.occurredAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })

                          return (
                            <TableRow key={log.id}>
                              <TableCell className='text-sm text-muted-foreground'>
                                {date}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {log.nudge?.name ?? '-'}
                              </TableCell>
                              <TableCell>{log.product?.name ?? '-'}</TableCell>
                              <TableCell className='text-center'>
                                <Badge variant={getEventBadgeVariant(log.eventType)}>
                                  {log.eventType}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                            Belum ada log aktivitas event.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
