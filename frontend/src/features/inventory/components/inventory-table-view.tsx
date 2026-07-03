import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Package, ArrowUpDown } from 'lucide-react'

type InventoryTableViewProps = {
  paginatedInventory: any[]
  onEditImageClick: (product: { id: string; name: string; imageUrl: string }) => void
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
  onEditImageClick,
  formatRupiah,
  sortByDaysLeft,
}: InventoryTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[80px]'>Foto</TableHead>
          <TableHead>Produk</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Kode Batch</TableHead>
          <TableHead className='text-right'>Stok Aktif</TableHead>
          <TableHead className='text-right'>Estimasi Demand</TableHead>
          <TableHead className='text-center'>Status</TableHead>
          <TableHead className='text-center cursor-pointer select-none' onClick={sortByDaysLeft}>
            Sisa Umur Simpan <ArrowUpDown className='inline-block h-3.5 w-3.5 ms-1' />
          </TableHead>
          <TableHead className='text-center'>Tingkat Risiko</TableHead>
          <TableHead className='text-right'>Estimasi Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedInventory.map((item) => (
          <TableRow key={`${item.productId}-${item.batchCode}`}>
            <TableCell>
              <div
                className='h-10 w-10 rounded-md border bg-muted/20 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-85 transition-opacity'
                title='Edit URL Gambar'
                onClick={() =>
                  onEditImageClick({
                    id: item.productId,
                    name: item.product,
                    imageUrl: item.imageUrl || '',
                  })
                }
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.product} className='h-full w-full object-cover' />
                ) : (
                  <Package className='h-5 w-5 text-muted-foreground/30' />
                )}
              </div>
            </TableCell>
            <TableCell className='font-medium'>{item.product}</TableCell>
            <TableCell>
              <code className='text-xs'>{item.sku}</code>
            </TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              <code className='text-xs font-semibold text-blue-600 dark:text-blue-400'>
                {item.batchCode}
              </code>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
