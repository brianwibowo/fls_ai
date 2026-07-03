import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type AddBatchDialogProps = {
  batchDialogOpen: boolean
  setBatchDialogOpen: (open: boolean) => void
  newBatchData: {
    productName: string
    categoryName: string
    batchCode: string
    quantityReceived: number
    receivedDate: string
    expiryDate: string
  }
  setNewBatchData: React.Dispatch<React.SetStateAction<{
    productName: string
    categoryName: string
    batchCode: string
    quantityReceived: number
    receivedDate: string
    expiryDate: string
  }>>
  products: any[] | undefined
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  suggestions: any[]
  handleCreateBatch: () => void
  isPending: boolean
}

export function AddBatchDialog({
  batchDialogOpen,
  setBatchDialogOpen,
  newBatchData,
  setNewBatchData,
  products,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleCreateBatch,
  isPending,
}: AddBatchDialogProps) {
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const fillExpiryDate = (receivedStr: string, shelfLife: number) => {
    const d = new Date(receivedStr)
    d.setDate(d.getDate() + shelfLife)
    return d.toISOString().split('T')[0]
  }

  return (
    <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Tambah Batch Baru</DialogTitle>
          <DialogDescription>
            Masukkan rincian batch baru untuk produk pangan segar di inventaris.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4 py-4 text-start'>
          <div className='space-y-1 relative'>
            <label className='text-xs font-semibold text-muted-foreground'>Nama Produk</label>
            <div className='flex gap-1 items-center'>
              <Input
                placeholder='Contoh: Tomat Cherry Segar'
                value={newBatchData.productName}
                onChange={(e) => {
                  const val = capitalizeWords(e.target.value)
                  setNewBatchData((p) => {
                    const matching = products?.find((prod: any) => prod.name.toLowerCase() === val.toLowerCase())
                    const newExpiry = matching
                      ? fillExpiryDate(p.receivedDate, matching.shelfLifeDays)
                      : p.expiryDate
                    return {
                      ...p,
                      productName: val,
                      categoryName: matching?.category?.name || p.categoryName,
                      expiryDate: newExpiry,
                    }
                  })
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {newBatchData.productName && !products?.some((p: any) => p.name.toLowerCase() === newBatchData.productName.toLowerCase()) && (
                <Badge variant='outline' className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shrink-0 border-emerald-500/20'>
                  Baru
                </Badge>
              )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className='absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md'>
                {suggestions.map((p: any) => (
                  <div
                    key={p.id}
                    className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent hover:text-accent-foreground text-start'
                    onClick={() => {
                      setNewBatchData((prev) => ({
                        ...prev,
                        productName: p.name,
                        categoryName: p.category?.name || prev.categoryName,
                        expiryDate: fillExpiryDate(prev.receivedDate, p.shelfLifeDays),
                      }))
                      setShowSuggestions(false)
                    }}
                  >
                    <div className='flex-1'>
                      <span className='font-medium text-xs sm:text-sm'>{p.name}</span>
                      <span className='text-[10px] text-muted-foreground ml-2'>({p.category?.name || 'Kategori'})</span>
                    </div>
                    <span className='text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground'>
                      {p.sku}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>Kategori</label>
            <Select value={newBatchData.categoryName} onValueChange={(val) => setNewBatchData((p) => ({ ...p, categoryName: val }))}>
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder='Pilih kategori...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Produce' className='cursor-pointer'>Produce (Sayuran & Buah)</SelectItem>
                <SelectItem value='Dairy' className='cursor-pointer'>Dairy (Susu & Telur)</SelectItem>
                <SelectItem value='Bakery' className='cursor-pointer'>Bakery (Roti & Kue)</SelectItem>
                <SelectItem value='Protein' className='cursor-pointer'>Protein (Daging & Ayam)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Kode Batch</label>
              <Input
                placeholder='BTC-001'
                value={newBatchData.batchCode}
                onChange={(e) => setNewBatchData((p) => ({ ...p, batchCode: e.target.value }))}
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Kuantitas Diterima</label>
              <Input
                type='number'
                placeholder='100'
                value={newBatchData.quantityReceived || ''}
                onChange={(e) => setNewBatchData((p) => ({ ...p, quantityReceived: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Tanggal Masuk</label>
              <Input
                type='date'
                value={newBatchData.receivedDate}
                onChange={(e) => {
                  const val = e.target.value
                  setNewBatchData((p) => {
                    const matching = products?.find((prod: any) => prod.name.toLowerCase() === p.productName.toLowerCase())
                    const newExpiry = matching
                      ? fillExpiryDate(val, matching.shelfLifeDays)
                      : p.expiryDate
                    return {
                      ...p,
                      receivedDate: val,
                      expiryDate: newExpiry,
                    }
                  })
                }}
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Tanggal Kadaluarsa</label>
              <Input
                type='date'
                value={newBatchData.expiryDate}
                onChange={(e) => setNewBatchData((p) => ({ ...p, expiryDate: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button variant='outline' onClick={() => setBatchDialogOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleCreateBatch} disabled={isPending} className='cursor-pointer'>
            Simpan Batch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
