import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type CreateNudgeDialogProps = {
  nudgeDialogOpen: boolean
  setNudgeDialogOpen: (open: boolean) => void
  newNudgeData: {
    name: string
    type: string
    discountPercentage: number
    startDate: string
    endDate: string
    productId: string
  }
  setNewNudgeData: React.Dispatch<React.SetStateAction<{
    name: string
    type: string
    discountPercentage: number
    startDate: string
    endDate: string
    productId: string
  }>>
  products: any[] | undefined
  handleCreateNudge: () => void
  isPending: boolean
}

export function CreateNudgeDialog({
  nudgeDialogOpen,
  setNudgeDialogOpen,
  newNudgeData,
  setNewNudgeData,
  products,
  handleCreateNudge,
  isPending,
}: CreateNudgeDialogProps) {
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Dialog open={nudgeDialogOpen} onOpenChange={setNudgeDialogOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Buat Strategi Baru</DialogTitle>
          <DialogDescription>
            Rancang strategi digital nudging untuk mengurangi risiko pemborosan produk near-expiry.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4 py-4 text-start'>
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>Nama Strategi</label>
            <Input
              placeholder='Contoh: Diskon Sore Roti Manis'
              value={newNudgeData.name}
              onChange={(e) => {
                setNewNudgeData((p) => ({
                  ...p,
                  name: capitalizeWords(e.target.value),
                }))
              }}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>Tipe Nudge</label>
            <Select
              value={newNudgeData.type}
              onValueChange={(val) => setNewNudgeData((p) => ({ ...p, type: val }))}
            >
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder='Pilih tipe...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='DISCOUNT' className='cursor-pointer'>Diskon Harga</SelectItem>
                <SelectItem value='BUNDLING' className='cursor-pointer'>Bundling Produk</SelectItem>
                <SelectItem value='URGENCY_LABEL' className='cursor-pointer'>Label Urgensi (Stok Terbatas)</SelectItem>
                <SelectItem value='GAMIFICATION_BADGE' className='cursor-pointer'>Badge Gamifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newNudgeData.type === 'DISCOUNT' && (
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Persentase Diskon (%)</label>
              <Input
                type='number'
                min='1'
                max='100'
                value={newNudgeData.discountPercentage}
                onChange={(e) =>
                  setNewNudgeData((p) => ({ ...p, discountPercentage: Number(e.target.value) }))
                }
              />
            </div>
          )}
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>Pilih Produk Sasaran</label>
            <Select
              value={newNudgeData.productId}
              onValueChange={(val) => setNewNudgeData((p) => ({ ...p, productId: val }))}
            >
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder='Pilih produk...' />
              </SelectTrigger>
              <SelectContent>
                {products?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id} className='cursor-pointer'>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Tanggal Mulai</label>
              <Input
                type='date'
                value={newNudgeData.startDate}
                onChange={(e) => setNewNudgeData((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground'>Tanggal Berakhir</label>
              <Input
                type='date'
                value={newNudgeData.endDate}
                onChange={(e) => setNewNudgeData((p) => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button variant='outline' onClick={() => setNudgeDialogOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleCreateNudge} disabled={isPending} className='cursor-pointer'>
            Simpan Strategi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
