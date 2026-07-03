import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

type InventoryTableViewProps = {
  paginatedInventory: any[]
  onViewDetail: (item: any) => void
  formatRupiah: (val: number) => string
  sortByDaysLeft: () => void
}

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

export function InventoryTableView({
  paginatedInventory,
  onViewDetail,
  formatRupiah,
  sortByDaysLeft,
}: InventoryTableViewProps) {
  return (
    <div className='overflow-x-auto w-full'>
      <Table className='min-w-[900px]'>
        <TableHeader>
          <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className='text-right'>Stok Aktif</TableHead>
            <TableHead className='text-right'>Estimasi Demand</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-center cursor-pointer select-none' onClick={sortByDaysLeft}>
              Sisa Umur Simpan <ArrowUpDown className='inline-block h-3.5 w-3.5 ms-1' />
            </TableHead>
            <TableHead className='text-center'>Tingkat Risiko</TableHead>
            <TableHead className='text-right'>Estimasi Loss</TableHead>
            <TableHead className='text-center w-[80px]'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedInventory.map((item) => (
            <TableRow key={`${item.productId}-${item.batchCode}`}>
              <TableCell 
                className='font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer'
                onClick={() => onViewDetail(item)}
              >
                {item.product}
              </TableCell>
              <TableCell>
                <code className='text-xs'>{item.sku}</code>
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{item.category}</Badge>
              </TableCell>
              <TableCell className='text-right font-semibold'>{item.stock}</TableCell>
              <TableCell className='text-right'>{item.demand}</TableCell>
              <TableCell className='text-center'>
                <span className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className='text-center font-medium'>
                <span className={getDaysLeftColor(item.daysLeft)}>{item.daysLeft} hari lagi</span>
              </TableCell>
              <TableCell className='text-center'>
                <Badge variant={getRiskBadgeVariant(item.risk)}>{item.risk}</Badge>
              </TableCell>
              <TableCell className='text-right font-medium text-red-600'>
                {formatRupiah(item.estimatedLoss)}
              </TableCell>
              <TableCell className='text-center'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground'
                  onClick={() => onViewDetail(item)}
                  title='Lihat Detail'
                >
                  <Eye className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
