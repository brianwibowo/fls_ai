import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { toast } from 'sonner'

type EditImageDialogProps = {
  editingProduct: { id: string; name: string; imageUrl: string } | null
  setEditingProduct: (val: { id: string; name: string; imageUrl: string } | null) => void
  newImageUrl: string
  setNewImageUrl: (val: string) => void
  handleUpdateImage: () => void
  isPending: boolean
}

export function EditImageDialog({
  editingProduct,
  setEditingProduct,
  newImageUrl,
  setNewImageUrl,
  handleUpdateImage,
  isPending,
}: EditImageDialogProps) {
  return (
    <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Ubah Gambar Produk</DialogTitle>
          <DialogDescription>
            Masukkan tautan URL baru untuk gambar produk <strong>{editingProduct?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4 py-4 text-start'>
          <div className='flex items-center justify-center h-40 w-full rounded-md border bg-muted/10 overflow-hidden'>
            {newImageUrl ? (
              <img
                src={newImageUrl}
                alt='Preview'
                className='h-full w-full object-cover'
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = ''
                  toast.error('Gagal memuat preview gambar. Pastikan URL valid.')
                }}
              />
            ) : (
              <Package className='h-12 w-12 text-muted-foreground/30' />
            )}
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>URL Gambar</label>
            <Input
              placeholder='https://images.unsplash.com/...'
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button variant='outline' onClick={() => setEditingProduct(null)}>
            Batal
          </Button>
          <Button onClick={handleUpdateImage} disabled={isPending} className='cursor-pointer'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
