import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, BarChart3, AlertTriangle, Calendar, Tag, ShieldAlert, Sparkles, ShoppingCart } from 'lucide-react'

type ProductDetailModalProps = {
  item: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  formatRupiah: (val: number) => string
}

function getRiskBadgeVariant(risk: string) {
  switch (risk) {
    case 'High':
    case 'HIGH':
      return 'destructive' as const
    case 'Medium':
    case 'MEDIUM':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

export function ProductDetailModal({
  item,
  open,
  onOpenChange,
  formatRupiah,
}: ProductDetailModalProps) {
  if (!item) return null

  // Check if this item is a Reorder Recommendation or a Waste Risk product
  const isReorder = 'recommendedQuantity' in item
  
  // Normalize fields based on type
  const productName = isReorder ? item.product?.name : item.product
  const productSku = isReorder ? item.product?.sku : item.sku
  const productCategory = isReorder 
    ? item.product?.category?.name || 'Makanan'
    : item.category || 'Makanan'
  const productImage = isReorder ? item.product?.imageUrl : item.imageUrl
  const stock = isReorder ? item.currentStock : item.stock
  const demand = isReorder ? Math.round(item.currentStock * 1.5) : item.demand // Reorder doesn't have demand directly, mock it or estimate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden rounded-xl border shadow-lg bg-card text-card-foreground'>
        {/* Top Image Banner */}
        <div className='relative h-44 w-full bg-muted/20 flex items-center justify-center border-b overflow-hidden'>
          {productImage ? (
            <img src={productImage} alt={productName} className='h-full w-full object-cover' />
          ) : (
            <div className='flex flex-col items-center gap-2 text-muted-foreground/30'>
              <Package className='h-14 w-16' />
              <span className='text-xs'>Belum ada foto produk</span>
            </div>
          )}
          
          <div className='absolute top-3 left-3 flex gap-1.5 z-10'>
            <Badge 
              variant={getRiskBadgeVariant(isReorder ? item.urgency : item.risk)} 
              className='rounded-full px-2.5 py-0.5 font-semibold uppercase text-[10px] tracking-wide shadow-xs'
            >
              {isReorder ? `Urgensi: ${item.urgency}` : `Risiko ${item.risk}`}
            </Badge>
          </div>
        </div>

        <div className='p-6'>
          <DialogHeader className='text-start pb-4 border-b'>
            <div className='flex items-center gap-2 mb-1'>
              <Badge variant='outline' className='text-xs font-semibold'>
                {productCategory}
              </Badge>
              {isReorder && (
                <Badge variant='outline' className='bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 text-xs font-semibold'>
                  {item.status === 'ORDERED' ? 'Dipesan' : 'Butuh Reorder'}
                </Badge>
              )}
            </div>
            <DialogTitle className='text-lg font-bold tracking-tight text-foreground leading-snug'>
              {productName}
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground font-mono mt-1'>
              SKU: {productSku}
            </DialogDescription>
          </DialogHeader>

          {/* Details Grid */}
          <div className='grid grid-cols-2 gap-x-4 gap-y-4 py-5 text-start text-xs border-b'>
            <div className='flex items-start gap-2.5'>
              <Package className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Stok Gudang</span>
                <span className='font-bold text-sm text-foreground'>{stock} unit</span>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <BarChart3 className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Estimasi Demand</span>
                <span className='font-semibold text-foreground'>{demand} unit</span>
              </div>
            </div>

            {!isReorder ? (
              // Waste Risk specific fields
              <>
                <div className='flex items-start gap-2.5'>
                  <Tag className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                  <div>
                    <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Kode Batch</span>
                    <code className='font-semibold text-blue-600 dark:text-blue-400 font-mono'>{item.batchCode || '-'}</code>
                  </div>
                </div>

                <div className='flex items-start gap-2.5'>
                  <Calendar className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                  <div>
                    <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Umur Simpan</span>
                    <span className={`font-semibold ${item.daysLeft <= 2 ? 'text-red-600' : 'text-orange-600'}`}>
                      {item.daysLeft} hari lagi
                    </span>
                  </div>
                </div>

                <div className='flex items-start gap-2.5 col-span-2 pt-1'>
                  <ShieldAlert className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                  <div>
                    <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Potensi Kerugian (Waste Risk)</span>
                    <span className='font-bold text-red-600 text-sm'>-{formatRupiah(item.estimatedLoss)}</span>
                  </div>
                </div>
              </>
            ) : (
              // Reorder Recommendation specific fields
              <>
                <div className='flex items-start gap-2.5'>
                  <ShoppingCart className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                  <div>
                    <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Rekomendasi Pesanan</span>
                    <span className='font-bold text-emerald-600 text-sm'>+{item.recommendedQuantity} unit</span>
                  </div>
                </div>

                <div className='flex items-start gap-2.5'>
                  <AlertTriangle className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                  <div>
                    <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Urgensi</span>
                    <span className='font-semibold text-foreground'>{item.urgency}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Reasoning Section for Reorder */}
          {isReorder && item.aiReasoning && (
            <div className='mt-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-start'>
              <div className='flex items-center gap-1.5 mb-1.5'>
                <Sparkles className='h-4 w-4 text-emerald-600' />
                <span className='text-xs font-bold text-emerald-950 dark:text-emerald-50'>Analisis Prediksi AI</span>
              </div>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                {item.aiReasoning}
              </p>
            </div>
          )}

          {!isReorder && (
            <div className='mt-4 p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-start'>
              <div className='flex items-center gap-1.5 mb-1.5'>
                <AlertTriangle className='h-4 w-4 text-red-600' />
                <span className='text-xs font-bold text-red-950 dark:text-red-50'>Tindakan Direkomendasikan</span>
              </div>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Produk ini berisiko terbuang karena stok melampaui estimasi permintaan. Disarankan untuk segera membuat strategi digital nudging promo guna mempercepat penjualan.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className='p-6 pt-0'>
          <Button
            onClick={() => onOpenChange(false)}
            className='w-full cursor-pointer h-9 text-xs font-semibold'
          >
            Tutup Detail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
