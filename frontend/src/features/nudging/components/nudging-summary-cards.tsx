import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, TrendingUp, BellRing, ShoppingBag } from 'lucide-react'

type NudgingSummaryCardsProps = {
  summaryData?: {
    totalImpressions: number
    totalConversions: number
    activeCampaigns: number
    productsNudged: number
  }
}

export function NudgingSummaryCards({ summaryData }: NudgingSummaryCardsProps) {
  const summaryCards = [
    { title: 'Total Impressions', value: summaryData?.totalImpressions ?? 0, icon: Eye, color: 'text-blue-600' },
    { title: 'Total Conversions', value: summaryData?.totalConversions ?? 0, icon: TrendingUp, color: 'text-green-600' },
    { title: 'Active Campaigns', value: summaryData?.activeCampaigns ?? 0, icon: BellRing, color: 'text-orange-600' },
    { title: 'Products Nudged', value: summaryData?.productsNudged ?? 0, icon: ShoppingBag, color: 'text-purple-600' },
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
