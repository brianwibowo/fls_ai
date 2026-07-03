import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'

type InventoryIconsViewProps = {
  paginatedInventory: any[]
  onEditImageClick: (product: { id: string; name: string; imageUrl: string }) => void
  formatRupiah: (val: number) => string
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
      return 'text-green-600 font-semibold'
    case 'Low':
      return 'text-orange-600 font-semibold'
    case 'Overstock':
      return 'text-blue-600 font-semibold'
    default:
      return ''
  }
}

function getDaysLeftColor(daysLeft: number) {
  if (daysLeft <= 2) return 'text-red-600 font-semibold'
  if (daysLeft <= 5) return 'text-orange-600'
  return 'text-green-600'
}

export function InventoryIconsView({
  paginatedInventory,
  onEditImageClick,
  formatRupiah,
}: InventoryIconsViewProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {paginatedInventory.map((item) => (
        <Card key={`${item.productId}-${item.batchCode}`} className='overflow-hidden group flex flex-col justify-between'>
          <div className='relative h-44 bg-muted/20 flex items-center justify-center overflow-hidden border-b'>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.product}
                className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-200'
              />
            ) : (
              <Package className='h-12 w-12 text-muted-foreground/20' />
            )}
            <div className='absolute top-2 right-2 flex flex-col gap-1 items-end'>
              <Badge variant={getRiskBadgeVariant(item.risk)}>{item.risk} Risk</Badge>
              <Badge variant='outline' className='bg-background/80 backdrop-blur-xs'>
                {item.category}
              </Badge>
            </div>
            <button
              onClick={() =>
                onEditImageClick({
                  id: item.productId,
                  name: item.product,
                  imageUrl: item.imageUrl || '',
                })
              }
              className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200 cursor-pointer'
            >
              Ubah Gambar
            </button>
          </div>
          <CardContent className='p-4 text-start flex-1 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-start mb-1'>
                <h3 className='font-bold text-sm leading-tight text-foreground'>{item.product}</h3>
                <code className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>
                  {item.batchCode}
                </code>
              </div>
              <p className='text-[10px] text-muted-foreground mb-3'>SKU: {item.sku}</p>

              <div className='grid grid-cols-2 gap-2 text-xs border-t pt-2.5'>
                <div>
                  <span className='text-[10px] text-muted-foreground block'>Stok Aktif</span>
                  <span className='font-bold text-sm'>{item.stock}</span>
                </div>
                <div>
                  <span className='text-[10px] text-muted-foreground block'>Estimasi Demand</span>
                  <span className='font-medium text-sm'>{item.demand}</span>
                </div>
              </div>
            </div>

            <div className='border-t pt-2.5 mt-3 grid grid-cols-2 gap-2 text-xs'>
              <div>
                <span className='text-[10px] text-muted-foreground block'>Kadaluarsa</span>
                <span className={getDaysLeftColor(item.daysLeft)}>{item.daysLeft} hari</span>
              </div>
              <div>
                <span className='text-[10px] text-muted-foreground block'>Status / Loss</span>
                <span className={`block text-[11px] truncate ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className='text-[10px] text-red-600 font-medium block truncate'>
                  -{formatRupiah(item.estimatedLoss)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
