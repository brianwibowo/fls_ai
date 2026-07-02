import { useState } from 'react'
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search as SearchIcon,
  Plus,
  ArrowUpDown,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useInventoryQuery, useInventorySummaryQuery } from '@/hooks/use-api'
import { TableSkeleton } from '@/components/page-skeletons'

// --- Helpers ---

function getRiskBadgeVariant(risk: string) {
  switch (risk) {
    case 'High':
      return 'destructive' as const
    case 'Medium':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Optimal':
      return 'text-green-600'
    case 'Low':
      return 'text-orange-600'
    case 'Overstock':
      return 'text-blue-600'
    default:
      return ''
  }
}

function getDaysLeftColor(daysLeft: number) {
  if (daysLeft <= 2) return 'text-red-600 font-semibold'
  if (daysLeft <= 5) return 'text-orange-600'
  return 'text-green-600'
}

// --- Main Component ---

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')

  const { data: rawInventory, isLoading } = useInventoryQuery({
    category: categoryFilter,
    risk: riskFilter,
    search: searchQuery,
  })

  const { data: summaryData } = useInventorySummaryQuery()

  const summaryCards = [
    { title: 'Total Stock', value: summaryData?.totalStock ?? 0, icon: Package, color: 'text-blue-600' },
    { title: 'High Risk Items', value: summaryData?.highRiskItems ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Expiring Today', value: summaryData?.expiringToday ?? 0, icon: Clock, color: 'text-orange-600' },
    { title: 'Overstock Items', value: summaryData?.overstockItems ?? 0, icon: TrendingUp, color: 'text-purple-600' },
  ]

  const mappedInventory = (rawInventory || []).map((batch: any) => {
    const quantity = batch.quantityCurrent
    let status: 'Optimal' | 'Low' | 'Overstock' = 'Optimal'
    if (quantity > 150) status = 'Overstock'
    else if (quantity < 50) status = 'Low'

    const risk = batch.riskLevel === 'HIGH' ? 'High' : batch.riskLevel === 'MEDIUM' ? 'Medium' : 'Low'

    return {
      id: batch.id,
      product: batch.product.name,
      sku: batch.product.sku,
      category: batch.product.category.name,
      stock: quantity,
      demand: Math.floor(quantity * 0.8), // mock relative demand for visual consistency
      status,
      daysLeft: batch.daysLeft,
      risk,
    }
  })

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
              Inventory Management
            </h1>
            <p className='text-sm text-muted-foreground'>
              Pemantauan stok, kategori produk, dan status risiko kadaluarsa
            </p>
          </div>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Tambah Batch
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
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{card.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <div className='mt-4 flex flex-wrap items-center gap-3'>
          <div className='relative flex-1 sm:max-w-xs'>
            <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Cari produk atau SKU...'
              className='pl-9'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Kategori' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Kategori</SelectItem>
              <SelectItem value='Dairy'>Dairy</SelectItem>
              <SelectItem value='Bakery'>Bakery</SelectItem>
              <SelectItem value='Produce'>Produce</SelectItem>
              <SelectItem value='Protein'>Protein</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Risk Level' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Risk</SelectItem>
              <SelectItem value='High'>High</SelectItem>
              <SelectItem value='Medium'>Medium</SelectItem>
              <SelectItem value='Low'>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card className='mt-4'>
          <CardContent className='p-0'>
            {isLoading ? (
              <TableSkeleton cols={8} rows={6} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Product <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className='text-right'>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Stock <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead className='text-right'>Demand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-center'>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Days Left <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead className='text-center'>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedInventory.length ? (
                    mappedInventory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className='font-medium'>
                          {item.product}
                        </TableCell>
                        <TableCell>
                          <code className='text-xs'>{item.sku}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{item.category}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>{item.stock}</TableCell>
                        <TableCell className='text-right'>{item.demand}</TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <span className={getDaysLeftColor(item.daysLeft)}>
                            {item.daysLeft}d
                          </span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Badge variant={getRiskBadgeVariant(item.risk)}>
                            {item.risk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                        Tidak ada data stok ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
