import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function MetricCardsSkeleton() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-4 rounded-full' />
          </CardHeader>
          <CardContent className='space-y-2'>
            <Skeleton className='h-8 w-20' />
            <Skeleton className='h-3 w-32' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className='w-full space-y-3 p-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 w-24' />
      </div>
      <div className='rounded-md border'>
        <div className='border-b p-3 bg-muted/45 flex items-center justify-between gap-4'>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className='h-5 flex-1' />
          ))}
        </div>
        <div className='divide-y'>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className='p-3 flex items-center justify-between gap-4'>
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className='h-5 flex-1' />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-4 w-72' />
      </CardHeader>
      <CardContent className='flex h-[300px] items-end justify-between gap-4 pt-10'>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className='w-full rounded-t-sm'
            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='col-span-2'>
          <CardHeader>
            <Skeleton className='h-6 w-36' />
            <Skeleton className='h-4 w-48' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[90%]' />
            <Skeleton className='h-4 w-[85%]' />
          </CardContent>
        </Card>
        <Card className='flex flex-col items-center justify-center p-6'>
          <Skeleton className='h-5 w-32 mb-4' />
          <Skeleton className='h-28 w-28 rounded-full' />
          <Skeleton className='h-3 w-24 mt-4' />
        </Card>
      </div>
      <MetricCardsSkeleton />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className='p-4 space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-6 w-12' />
            <Skeleton className='h-3 w-16' />
          </Card>
        ))}
      </div>
    </div>
  )
}
