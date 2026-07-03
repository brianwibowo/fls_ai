import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

type ProductPreviewGridProps = {
  previewData: any[]
  handleSimulateSale: (product: any) => void
  isPending: boolean
  formatRupiah: (val: number) => string
}

export function ProductPreviewGrid({
  previewData,
  handleSimulateSale,
  isPending,
  formatRupiah,
}: ProductPreviewGridProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {previewData && previewData.length ? (
        previewData.map((product: any) => (
          <Card key={product.productId} className='p-0 overflow-hidden flex flex-col justify-between text-start border hover:shadow-md transition-shadow duration-200'>
            <div>
              <div className='relative flex h-44 items-center justify-center bg-muted/20 border-b overflow-hidden'>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ''
                    }}
                  />
                ) : (
                  <ShoppingBag className='h-12 w-12 text-muted-foreground/30' />
                )}
              </div>
              <CardHeader className='pb-2 pt-4 px-4'>
                <CardTitle className='text-base font-bold tracking-tight line-clamp-1'>{product.productName}</CardTitle>
                <div className='flex items-baseline gap-2 mt-1.5'>
                  {product.originalPrice !== product.discountedPrice && (
                    <span className='text-xs text-muted-foreground line-through mr-1'>
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                  <span className='text-lg font-extrabold text-emerald-600 dark:text-emerald-400'>
                    {formatRupiah(product.discountedPrice)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className='pb-4 px-4'>
                <div className='flex flex-wrap gap-1.5'>
                  {product.labels.map((label: string) => {
                    // Translate labels beautifully to Indonesian
                    let displayLabel = label
                    let isSave = false
                    let isExpiry = false

                    if (label.includes('Save')) {
                      displayLabel = label.replace('Save', 'Hemat').replace('!', '')
                      isSave = true
                    } else if (label.includes('left')) {
                      const matches = label.match(/\d+/)
                      const days = matches ? matches[0] : '0'
                      displayLabel = days === '0' ? 'Kadaluarsa Hari Ini' : `Sisa ${days} Hari`
                      isExpiry = true
                    } else if (label === 'Fresh & Ready Today') {
                      displayLabel = 'Segar & Siap Hari Ini'
                    } else if (label === 'Popular Choice Today') {
                      displayLabel = 'Pilihan Populer Hari Ini'
                    }

                    return (
                      <Badge
                        key={label}
                        variant={isSave ? 'default' : isExpiry ? 'destructive' : 'secondary'}
                        className='text-[10px] font-semibold tracking-wide py-0.5 px-2 rounded-full uppercase'
                      >
                        {displayLabel}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </div>
            <CardFooter className='p-4 pt-0'>
              <Button
                size='sm'
                className='w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold'
                disabled={isPending}
                onClick={() => handleSimulateSale(product)}
              >
                {isPending ? 'Memproses...' : 'Simulasikan Pembelian'}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className='col-span-full h-40 text-center text-muted-foreground flex items-center justify-center border rounded-lg bg-muted/10'>
          Tidak ada preview produk near-expiry aktif.
        </div>
      )}
    </div>
  )
}
