import {
  TrendingDown,
  ShoppingCart,
  RefreshCw,
  Smile,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
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
import { Progress } from '@/components/ui/progress'
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
  AreaChart,
  Area,
  BarChart,
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
  useAnalyticsOverviewQuery,
  useAnalyticsTrendsQuery,
  useAnalyticsCategoryQuery,
  useAnalyticsInsightsQuery,
} from '@/hooks/use-api'

// --- Helpers ---

function getInsightIcon(type: string) {
  switch (type) {
    case 'warning':
      return <AlertTriangle className='h-5 w-5 text-orange-500' />
    case 'success':
      return <CheckCircle className='h-5 w-5 text-green-500' />
    default:
      return <Lightbulb className='h-5 w-5 text-blue-500' />
  }
}

function getInsightBorder(type: string) {
  switch (type) {
    case 'warning':
      return 'border-l-orange-500'
    case 'success':
      return 'border-l-green-500'
    default:
      return 'border-l-blue-500'
  }
}

// --- Main Component ---

export function Analytics() {
  const { data: overview, isLoading: isOverviewLoading } = useAnalyticsOverviewQuery()
  const { data: trendsData, isLoading: isTrendsLoading } = useAnalyticsTrendsQuery()
  const { data: categoryData, isLoading: isCategoryLoading } = useAnalyticsCategoryQuery()
  const { data: insightsData, isLoading: isInsightsLoading } = useAnalyticsInsightsQuery()

  const kpiCards = [
    { title: 'Waste Reduction', value: overview?.wasteReduction ?? 87.5, target: 90, icon: TrendingDown },
    { title: 'Sell-Through Rate', value: overview?.sellThroughRate ?? 78.4, target: 85, icon: ShoppingCart },
    { title: 'Inventory Turnover', value: overview?.inventoryTurnover ?? 4.8, target: 5.0, icon: RefreshCw },
    { title: 'Customer Satisfaction', value: overview?.customerSatisfaction ?? 4.2, target: 4.5, icon: Smile },
  ]

  // Chart data mapping
  const parsedTrends = (trendsData || []).map((t: any) => ({
    week: t.week,
    wasteReduction: t.wasteReduction,
    turnover: t.turnover,
  }))

  const categoryChartData = (categoryData || []).map((c: any) => ({
    name: c.category,
    'Food Loss %': c.foodLoss,
    'Nudge Effect. %': c.nudgeEffectiveness,
    'Sell-Through %': c.sellThrough,
  }))

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Analytics & Performance
          </h1>
          <p className='text-sm text-muted-foreground'>
            Evaluasi dampak sistem terhadap efisiensi logistik dan reduksi food loss
          </p>
        </div>

        {/* KPI Cards with Progress */}
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {isOverviewLoading ? (
            <div className='col-span-full flex h-20 items-center justify-center'>
              <Loader2 className='h-6 w-6 animate-spin text-green-600' />
            </div>
          ) : (
            kpiCards.map((kpi) => {
              const Icon = kpi.icon
              const percentage =
                kpi.title === 'Inventory Turnover'
                  ? (kpi.value / kpi.target) * 100
                  : kpi.title === 'Customer Satisfaction'
                    ? (kpi.value / kpi.target) * 100
                    : kpi.value
              const displayValue =
                kpi.title === 'Inventory Turnover'
                  ? `${kpi.value}x`
                  : kpi.title === 'Customer Satisfaction'
                    ? `${kpi.value}/5`
                    : `${kpi.value}%`
              const displayTarget =
                kpi.title === 'Inventory Turnover'
                  ? `${kpi.target}x`
                  : kpi.title === 'Customer Satisfaction'
                    ? `${kpi.target}/5`
                    : `${kpi.target}%`

              return (
                <Card key={kpi.title}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {kpi.title}
                    </CardTitle>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{displayValue}</div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className='mt-2 h-2'
                    />
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Target: {displayTarget}
                    </p>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue='trends' className='mt-4'>
          <TabsList>
            <TabsTrigger value='trends'>Trend Analysis</TabsTrigger>
            <TabsTrigger value='category'>Category Performance</TabsTrigger>
            <TabsTrigger value='insights'>AI Insights</TabsTrigger>
          </TabsList>

          {/* Trend Analysis Tab */}
          <TabsContent value='trends'>
            {isTrendsLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-green-600' />
              </div>
            ) : (
              <div className='grid gap-4 lg:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Waste Reduction Trend</CardTitle>
                    <CardDescription>
                      Tren persentase pengurangan food waste (mingguan)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={280}>
                      <AreaChart data={parsedTrends}>
                        <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
                        <XAxis dataKey='week' className='text-xs' />
                        <YAxis domain={[75, 95]} className='text-xs' />
                        <Tooltip />
                        <Area
                          type='monotone'
                          dataKey='wasteReduction'
                          name='Waste Reduction %'
                          stroke='#16a34a'
                          fill='#16a34a'
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Turnover Trend</CardTitle>
                    <CardDescription>
                      Tren perputaran stok (mingguan)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={280}>
                      <AreaChart data={parsedTrends}>
                        <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
                        <XAxis dataKey='week' className='text-xs' />
                        <YAxis domain={[3.5, 5.5]} className='text-xs' />
                        <Tooltip />
                        <Area
                          type='monotone'
                          dataKey='turnover'
                          name='Turnover (x)'
                          stroke='#0ea5e9'
                          fill='#0ea5e9'
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Category Performance Tab */}
          <TabsContent value='category'>
            {isCategoryLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-green-600' />
              </div>
            ) : (
              <>
                <Card className='mb-4'>
                  <CardHeader>
                    <CardTitle>Performa per Kategori</CardTitle>
                    <CardDescription>
                      Breakdown food loss, efektivitas nudging, dan sell-through rate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={categoryChartData} layout='vertical'>
                        <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
                        <XAxis type='number' domain={[0, 100]} className='text-xs' />
                        <YAxis dataKey='name' type='category' className='text-xs' width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='Food Loss %' fill='#ef4444' radius={[0, 4, 4, 0]} />
                        <Bar dataKey='Nudge Effect. %' fill='#16a34a' radius={[0, 4, 4, 0]} />
                        <Bar dataKey='Sell-Through %' fill='#0ea5e9' radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-0'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kategori</TableHead>
                          <TableHead className='text-center'>Total Produk</TableHead>
                          <TableHead className='text-center'>Disposed</TableHead>
                          <TableHead className='text-center'>Food Loss %</TableHead>
                          <TableHead className='text-center'>Nudge Effect. %</TableHead>
                          <TableHead className='text-center'>Sell-Through %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData && categoryData.map((cat: any) => (
                          <TableRow key={cat.category}>
                            <TableCell className='font-medium'>
                              <Badge variant='outline'>{cat.category}</Badge>
                            </TableCell>
                            <TableCell className='text-center'>
                              {cat.totalProducts}
                            </TableCell>
                            <TableCell className='text-center text-red-600'>
                              {cat.disposed}
                            </TableCell>
                            <TableCell className='text-center'>
                              <span className={cat.foodLoss > 15 ? 'font-semibold text-red-600' : 'text-orange-600'}>
                                {cat.foodLoss}%
                              </span>
                            </TableCell>
                            <TableCell className='text-center text-green-600'>
                              {cat.nudgeEffectiveness}%
                            </TableCell>
                            <TableCell className='text-center'>
                              {cat.sellThrough}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value='insights'>
            <div className='space-y-3'>
              {isInsightsLoading ? (
                <div className='flex h-40 items-center justify-center'>
                  <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                </div>
              ) : (
                insightsData && insightsData.map((insight: any) => (
                  <Card
                    key={insight.id}
                    className={`border-l-4 ${getInsightBorder(insight.type)}`}
                  >
                    <CardContent className='flex items-start gap-3 py-4'>
                      {getInsightIcon(insight.type)}
                      <div className='flex-1 text-start'>
                        <p className='text-sm'>{insight.text}</p>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Kategori: {insight.category}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
