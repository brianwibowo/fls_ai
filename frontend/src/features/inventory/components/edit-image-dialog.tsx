import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Package, UploadCloud, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { compressAndConvertToWebp } from '@/lib/image-upload'

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
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      toast.info('Sedang mengonversi dan mengompresi gambar ke WebP...')
      const webpUrl = await compressAndConvertToWebp(file)
      setNewImageUrl(webpUrl)
      toast.success('Gambar berhasil dikompresi ke WebP (HD & Ringan)!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Gagal memproses gambar.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Ubah Gambar Produk</DialogTitle>
          <DialogDescription>
            Unggah file foto baru (.jpg, .png, .heic) atau masukkan tautan URL gambar.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4 py-4 text-start'>
          <div className='flex items-center justify-center h-40 w-full rounded-md border bg-muted/10 overflow-hidden relative'>
            {isProcessing ? (
              <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-green-600' />
                <span className='text-xs text-muted-foreground'>Mengonversi ke WebP...</span>
              </div>
            ) : newImageUrl ? (
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

          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-muted-foreground flex items-center gap-1'>
              <UploadCloud className='h-3.5 w-3.5' /> Unggah File Gambar (Mendukung .heic, .jpg, .png)
            </label>
            <Input
              type='file'
              accept='image/*,.heic,.heif'
              onChange={handleFileChange}
              disabled={isProcessing || isPending}
              className='cursor-pointer'
            />
          </div>

          <div className='relative flex py-1 items-center'>
            <div className='flex-grow border-t border-muted' />
            <span className='flex-shrink mx-4 text-muted-foreground text-xs font-semibold'>ATAU</span>
            <div className='flex-grow border-t border-muted' />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground'>URL Gambar</label>
            <Input
              placeholder='https://images.unsplash.com/...'
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              disabled={isProcessing || isPending}
            />
          </div>
        </div>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button variant='outline' onClick={() => setEditingProduct(null)} disabled={isProcessing || isPending}>
            Batal
          </Button>
          <Button onClick={handleUpdateImage} disabled={isProcessing || isPending} className='cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold'>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
