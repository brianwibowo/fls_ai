import {
  Leaf,
  TrendingDown,
  Target,
  ShoppingCart,
  RefreshCw,
  AlertTriangle,
  Recycle,
  BellRing,
  Smile,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DashboardSkeleton } from '@/components/page-skeletons'
import { useAnalyticsOverviewQuery } from '@/hooks/use-api'

// --- Types ---

interface MetricCardData {
  title: string
  value: string
  icon: React.ElementType
  trend: {
    direction: 'up' | 'down'
    value: string
    isPositive: boolean
  }
}

// --- Components ---

function MetricCard({ data }: { data: MetricCardData }) {
  const Icon = data.icon
  const TrendIcon = data.trend.direction === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor = data.trend.isPositive
    ? 'text-green-600'
    : 'text-red-600'

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{data.title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{data.value}</div>
        <p className={`flex items-center text-xs ${trendColor}`}>
          <TrendIcon className='mr-1 h-3 w-3' />
          {data.trend.value} vs minggu lalu
        </p>
      </CardContent>
    </Card>
  )
}

function SustainabilityScoreCard({ score }: { score: number }) {
  return (
    <Card className='flex flex-col justify-between h-full'>
      <CardHeader className='pb-2 text-start'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Leaf className='h-4 w-4 text-green-600' />
          Sustainability Score
        </CardTitle>
        <CardDescription>Skor keberlanjutan keseluruhan</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col items-center justify-center py-6'>
        <div className='relative flex h-28 w-28 items-center justify-center mb-4'>
          <svg className='h-28 w-28 -rotate-90' viewBox='0 0 100 100'>
            <circle
              cx='50'
              cy='50'
              r='40'
              fill='none'
              stroke='currentColor'
              strokeWidth='8'
              className='text-muted/30'
            />
            <circle
              cx='50'
              cy='50'
              r='40'
              fill='none'
              stroke='currentColor'
              strokeWidth='8'
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              strokeLinecap='round'
              className='text-green-600 transition-all duration-1000'
            />
          </svg>
          <div className='absolute flex flex-col items-center'>
            <span className='text-xl font-bold tracking-tight'>{score}%</span>
          </div>
        </div>
        <p className='flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full font-medium'>
          <ArrowUpRight className='mr-1 h-3.5 w-3.5' />
          +1.5% vs bulan lalu
        </p>
      </CardContent>
    </Card>
  )
}

function ExecutiveSummaryCard() {
  return (
    <Card className='col-span-1 lg:col-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Leaf className='h-5 w-5 text-green-600' />
          Executive Summary
        </CardTitle>
        <CardDescription>Ringkasan real-time kondisi logistik</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3 text-sm text-start'>
        <p>
          <strong>Stok keseluruhan</strong> berada di level{' '}
          <span className='font-semibold text-green-600'>optimal</span>. Kategori{' '}
          <span className='font-medium'>Dairy</span> memiliki risiko tertinggi
          dengan beberapa item mendekati expired.
        </p>
        <p>
          <strong>AI Forecasting</strong> mendeteksi tren peningkatan demand
          untuk kategori <span className='font-medium'>Produce</span> sebesar
          12% pada minggu ini. Disarankan untuk menambah stok sayuran.
        </p>
        <p>
          <strong>Digital Nudging</strong> berhasil menyelamatkan{' '}
          <span className='font-semibold text-green-600'>156 item</span> dari
          potensi food loss bulan ini melalui 5 strategi promosi aktif.
        </p>
      </CardContent>
    </Card>
  )
}

function FoodSavedWidget({ value }: { value: number }) {
  return (
    <Card className='border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'>
      <CardContent className='flex flex-col items-center justify-center py-6'>
        <Leaf className='mb-2 h-8 w-8 text-green-600' />
        <p className='text-sm font-medium text-muted-foreground'>
          Food Saved This Month
        </p>
        <p className='text-3xl font-bold text-green-600'>{value}</p>
        <p className='text-xs text-muted-foreground'>
          item berhasil diselamatkan
        </p>
      </CardContent>
    </Card>
  )
}

// --- Main Dashboard ---

export function Dashboard() {
  const { data: overview, isLoading } = useAnalyticsOverviewQuery()

  const dashboardMetrics: MetricCardData[] = [
    {
      title: 'Waste Reduction',
      value: `${overview?.wasteReduction ?? 87.5}%`,
      icon: TrendingDown,
      trend: { direction: 'up', value: '+2.3%', isPositive: true },
    },
    {
      title: 'Demand Accuracy',
      value: `${overview?.demandAccuracy ?? 91.2}%`,
      icon: Target,
      trend: { direction: 'up', value: '+1.8%', isPositive: true },
    },
    {
      title: 'Sell-Through Rate',
      value: `${overview?.sellThroughRate ?? 78.4}%`,
      icon: ShoppingCart,
      trend: { direction: 'up', value: '+3.1%', isPositive: true },
    },
    {
      title: 'Inventory Turnover',
      value: `${overview?.inventoryTurnover ?? 4.8}x`,
      icon: RefreshCw,
      trend: { direction: 'up', value: '+0.3x', isPositive: true },
    },
  ]

  const secondaryMetrics: MetricCardData[] = [
    {
      title: 'Active Nudges',
      value: String(overview?.activeNudges ?? 5),
      icon: BellRing,
      trend: { direction: 'up', value: '+2', isPositive: true },
    },
    {
      title: 'Risk Items',
      value: String(overview?.riskItems ?? 12),
      icon: AlertTriangle,
      trend: { direction: 'down', value: '-3', isPositive: true },
    },
    {
      title: 'Items Recovered',
      value: String(overview?.itemsRecovered ?? 156),
      icon: Recycle,
      trend: { direction: 'up', value: '+24', isPositive: true },
    },
    {
      title: 'Nudge Conversion',
      value: `${overview?.nudgeConversion ?? 18.7}%`,
      icon: Smile,
      trend: { direction: 'up', value: '+2.1%', isPositive: true },
    },
  ]

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
              Smart Logistics Dashboard
            </h1>
            <p className='text-sm text-muted-foreground'>
              Ringkasan kondisi logistik pangan segar
            </p>
          </div>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Executive Summary + Sustainability Score */}
            <div className='mt-4 grid gap-4 lg:grid-cols-3'>
              <ExecutiveSummaryCard />
              <SustainabilityScoreCard score={overview?.sustainabilityScore ?? 82.3} />
            </div>

            {/* Primary Metrics */}
            <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {dashboardMetrics.map((metric) => (
                <MetricCard key={metric.title} data={metric} />
              ))}
            </div>

            {/* Secondary Metrics + Food Saved Widget */}
            <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
              {secondaryMetrics.slice(0, 4).map((metric) => (
                <MetricCard key={metric.title} data={metric} />
              ))}
              <FoodSavedWidget value={overview?.foodSavedThisMonth ?? 156} />
            </div>
          </>
        )}
      </Main>
    </>
  )
}
