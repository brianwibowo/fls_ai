import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Package, BarChart3, AlertTriangle, RefreshCw, Calendar, Tag, ShieldAlert, Sparkles, Edit, Trash2, Pencil } from 'lucide-react'

type InventoryDetailModalProps = {
  item: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditImageClick: (product: { id: string; name: string; imageUrl: string }) => void
  onEditBatchClick: (item: any) => void
  onDeleteBatchClick: (id: string) => void
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
      return 'text-green-600 bg-green-50 dark:bg-green-950/30'
    case 'Low':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-950/30'
    case 'Overstock':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-950/30'
    default:
      return ''
  }
}

export function InventoryDetailModal({
  item,
  open,
  onOpenChange,
  onEditImageClick,
  onEditBatchClick,
  onDeleteBatchClick,
  formatRupiah,
}: InventoryDetailModalProps) {
  const navigate = useNavigate()

  if (!item) return null

  const handleEditImage = () => {
    onOpenChange(false)
    onEditImageClick({
      id: item.productId,
      name: item.product,
      imageUrl: item.imageUrl || '',
    })
  }

  const handleEditBatch = () => {
    onOpenChange(false)
    onEditBatchClick(item)
  }

  const handleDeleteBatch = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus/men-dispose batch ${item.batchCode}?`)) {
      onOpenChange(false)
      onDeleteBatchClick(item.id)
    }
  }

  const handleCreateNudge = () => {
    onOpenChange(false)
    navigate({
      to: '/nudging',
      search: { createNudgeForProductId: item.productId },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden rounded-xl border shadow-lg bg-card text-card-foreground'>
        {/* Top Product Image banner */}
        <div className='relative h-48 w-full bg-muted/20 flex items-center justify-center border-b overflow-hidden'>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.product} className='h-full w-full object-cover' />
          ) : (
            <div className='flex flex-col items-center gap-2 text-muted-foreground/30'>
              <Package className='h-16 w-16' />
              <span className='text-xs'>Belum ada foto produk</span>
            </div>
          )}
          {/* Risiko badge moved to absolute top-3 left-3 to not overlap close button */}
          <div className='absolute top-3 left-3 flex gap-1.5 z-10'>
            <Badge variant={getRiskBadgeVariant(item.risk)} className='rounded-full px-2.5 py-0.5 font-semibold uppercase text-[10px] tracking-wide shadow-xs'>
              Risiko {item.risk}
            </Badge>
          </div>
        </div>

        <div className='p-6'>
          <DialogHeader className='text-start pb-4 border-b'>
            <div className='flex items-center gap-2 mb-1.5'>
              <Badge variant='outline' className='text-xs font-semibold'>
                {item.category}
              </Badge>
            </div>
            <DialogTitle className='text-lg font-bold tracking-tight text-foreground leading-snug'>
              {item.product}
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground font-mono mt-1'>
              SKU: {item.sku}
            </DialogDescription>
          </DialogHeader>

          {/* Details Grid */}
          <div className='grid grid-cols-2 gap-x-4 gap-y-4 py-6 text-start text-xs border-b'>
            <div className='flex items-start gap-2.5'>
              <Tag className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Kode Batch</span>
                <code className='font-semibold text-blue-600 dark:text-blue-400 font-mono'>{item.batchCode}</code>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <RefreshCw className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Stok Aktif</span>
                <span className='font-bold text-sm text-foreground'>{item.stock} unit</span>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <BarChart3 className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Estimasi Demand</span>
                <span className='font-semibold text-foreground'>{item.demand} unit</span>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <Calendar className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Umur Simpan</span>
                <span className={`font-semibold ${item.daysLeft <= 2 ? 'text-red-600' : item.daysLeft <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {item.daysLeft} hari lagi
                </span>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <AlertTriangle className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Status Stok</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mt-0.5 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div className='flex items-start gap-2.5'>
              <ShieldAlert className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
              <div>
                <span className='text-[10px] text-muted-foreground block font-medium uppercase tracking-wider'>Estimasi Loss</span>
                <span className='font-bold text-red-600 text-sm'>-{formatRupiah(item.estimatedLoss)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions featuring Edit and Delete buttons */}
        <DialogFooter className='p-6 pt-0 flex flex-wrap gap-2 justify-between items-center w-full'>
          <div className='flex gap-1.5'>
            <Button
              variant='outline'
              onClick={handleEditImage}
              className='cursor-pointer text-xs h-9 px-3'
              title='Ubah Foto Produk'
            >
              <Edit className='h-3.5 w-3.5' />
            </Button>
            <Button
              variant='outline'
              onClick={handleEditBatch}
              className='cursor-pointer text-xs h-9 px-3 gap-1.5'
            >
              <Pencil className='h-3.5 w-3.5' />
              Ubah
            </Button>
          </div>

          <div className='flex gap-1.5'>
            <Button
              variant='outline'
              onClick={handleDeleteBatch}
              className='cursor-pointer border-destructive/30 hover:border-destructive text-destructive hover:bg-destructive/5 text-xs h-9 px-3 gap-1.5'
            >
              <Trash2 className='h-3.5 w-3.5' />
              Hapus
            </Button>
            <Button
              onClick={handleCreateNudge}
              className='cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9 px-4.5 gap-1.5'
            >
              <Sparkles className='h-3.5 w-3.5' />
              Buat Nudge
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
