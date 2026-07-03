import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type EditBatchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any | null
  onSave: (id: string, payload: { quantityCurrent: number; expiryDate: string }) => Promise<void>
  isPending: boolean
}

export function EditBatchDialog({
  open,
  onOpenChange,
  item,
  onSave,
  isPending,
}: EditBatchDialogProps) {
  const [quantity, setQuantity] = useState<number>(0)
  const [expiryDate, setExpiryDate] = useState<string>('')

  useEffect(() => {
    if (item) {
      setQuantity(item.stock)
      if (item.expiryDate) {
        try {
          const dateOnly = new Date(item.expiryDate).toISOString().split('T')[0]
          setExpiryDate(dateOnly)
        } catch {
          setExpiryDate('')
        }
      } else {
        setExpiryDate('')
      }
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return
    await onSave(item.id, {
      quantityCurrent: Number(quantity),
      expiryDate: new Date(expiryDate).toISOString(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-card border text-card-foreground shadow-lg rounded-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle className='text-lg font-bold tracking-tight'>Ubah Detail Batch</DialogTitle>
          <DialogDescription className='text-xs text-muted-foreground'>
            Perbarui data stok aktif atau tanggal kadaluarsa untuk kode batch <code className='font-semibold text-blue-600 dark:text-blue-400'>{item?.batchCode}</code>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 py-4 text-start text-xs font-semibold'>
          <div className='space-y-1.5'>
            <label className='text-muted-foreground'>Stok Aktif (Unit)</label>
            <Input
              type='number'
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder='Masukkan jumlah stok aktif'
              className='h-9 text-xs'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-muted-foreground'>Tanggal Kadaluarsa</label>
            <Input
              type='date'
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className='h-9 text-xs'
            />
          </div>

          <DialogFooter className='pt-4 gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='cursor-pointer text-xs h-9'
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9'
            >
              {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
