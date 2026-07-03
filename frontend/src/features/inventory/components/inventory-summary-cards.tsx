import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react'

type InventorySummaryCardsProps = {
  summaryData?: {
    totalStock: number
    highRiskItems: number
    expiringToday: number
    overstockItems: number
  }
}

export function InventorySummaryCards({ summaryData }: InventorySummaryCardsProps) {
  const summaryCards = [
    { title: 'Total Stock', value: summaryData?.totalStock ?? 0, icon: Package, color: 'text-blue-600' },
    { title: 'High Risk Items', value: summaryData?.highRiskItems ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Expiring Today', value: summaryData?.expiringToday ?? 0, icon: Clock, color: 'text-orange-600' },
    { title: 'Overstock Items', value: summaryData?.overstockItems ?? 0, icon: TrendingUp, color: 'text-purple-600' },
  ]

  return (
    <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {summaryCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
