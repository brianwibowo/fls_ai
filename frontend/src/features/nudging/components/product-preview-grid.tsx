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
          <Card key={product.productId} className='overflow-hidden flex flex-col justify-between text-start'>
            <div>
              <div className='flex h-40 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-b'>
                <ShoppingBag className='h-12 w-12 text-green-300 dark:text-green-700' />
              </div>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base'>{product.productName}</CardTitle>
                <div className='flex items-center gap-2 mt-1'>
                  {product.originalPrice !== product.discountedPrice && (
                    <span className='text-xs text-muted-foreground line-through'>
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                  <span className='text-base font-bold text-green-600 dark:text-green-400'>
                    {formatRupiah(product.discountedPrice)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className='pb-3'>
                <div className='flex flex-wrap gap-1.5'>
                  {product.labels.map((label: string) => (
                    <Badge
                      key={label}
                      variant={
                        label.includes('Save') ? 'default' : 
                        label.includes('left') ? 'destructive' : 'secondary'
                      }
                      className='text-xs'
                    >
                      {label}
                    </Badge>
                  ))}
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
