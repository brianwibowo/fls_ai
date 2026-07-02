import { useState, useEffect } from 'react'
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search as SearchIcon,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useInventoryQuery, useInventorySummaryQuery, useUpdateProductMutation, useCreateBatchMutation, useProductsQuery, useCreateProductMutation } from '@/hooks/use-api'
import { TableSkeleton } from '@/components/page-skeletons'

// --- Helpers ---

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
      return 'text-green-600'
    case 'Low':
      return 'text-orange-600'
    case 'Overstock':
      return 'text-blue-600'
    default:
      return ''
  }
}

function getDaysLeftColor(daysLeft: number) {
  if (daysLeft <= 2) return 'text-red-600 font-semibold'
  if (daysLeft <= 5) return 'text-orange-600'
  return 'text-green-600'
}

// --- Main Component ---

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list')
  const [editingProduct, setEditingProduct] = useState<{ id: string; name: string; imageUrl: string } | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  const updateProduct = useUpdateProductMutation()

  const { data: rawInventory, isLoading } = useInventoryQuery({
    category: categoryFilter,
    risk: riskFilter,
    search: searchQuery,
  })

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, riskFilter])

  // Prefill image URL when editing product
  useEffect(() => {
    if (editingProduct) {
      setNewImageUrl(editingProduct.imageUrl)
    } else {
      setNewImageUrl('')
    }
  }, [editingProduct])

  const handleUpdateImage = async () => {
    if (!editingProduct) return
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        imageUrl: newImageUrl,
      })
      toast.success('Gambar produk berhasil diperbarui!')
      setEditingProduct(null)
    } catch {
      toast.error('Gagal memperbarui gambar produk.')
    }
  }

  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [newBatchData, setNewBatchData] = useState({
    productName: '',
    categoryName: 'Produce',
    batchCode: '',
    quantityReceived: 50,
    receivedDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const createBatch = useCreateBatchMutation()
  const createProduct = useCreateProductMutation()
  const { data: products } = useProductsQuery()

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleCreateBatch = async () => {
    if (!newBatchData.productName || !newBatchData.batchCode || !newBatchData.quantityReceived) {
      toast.error('Harap isi semua kolom.')
      return
    }
    try {
      // Find category ID from category name
      const categoryMap: Record<string, string> = {}
      products?.forEach((p: any) => {
        if (p.category && p.categoryId) {
          categoryMap[p.category.name] = p.categoryId
        }
      })

      const targetCategoryId = categoryMap[newBatchData.categoryName]
      if (!targetCategoryId) {
        toast.error('Kategori tidak valid.')
        return
      }

      // Check if product already exists
      const existingProduct = products?.find(
        (p: any) => p.name.toLowerCase() === newBatchData.productName.toLowerCase()
      )

      let targetProductId = existingProduct?.id

      // If product does not exist, create it first
      if (!targetProductId) {
        const prefix = newBatchData.categoryName.substring(0, 3).toUpperCase()
        const randomNum = Math.floor(100 + Math.random() * 900)
        const generatedSku = `${prefix}-${randomNum}`

        const createdProduct = await createProduct.mutateAsync({
          sku: generatedSku,
          name: newBatchData.productName,
          categoryId: targetCategoryId,
          unit: 'pcs',
          shelfLifeDays: 7,
          unitCost: 10000,
          unitPrice: 15000,
        })
        targetProductId = createdProduct.id
      }

      // Create batch
      await createBatch.mutateAsync({
        productId: targetProductId,
        batchCode: newBatchData.batchCode,
        quantityReceived: Number(newBatchData.quantityReceived),
        receivedDate: new Date(newBatchData.receivedDate).toISOString(),
        expiryDate: new Date(newBatchData.expiryDate).toISOString(),
      })

      toast.success('Batch baru berhasil ditambahkan!')
      setBatchDialogOpen(false)
      // Reset form
      setNewBatchData({
        productName: '',
        categoryName: 'Produce',
        batchCode: '',
        quantityReceived: 50,
        receivedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menyimpan batch baru.'
      toast.error(message)
    }
  }

  const { data: summaryData } = useInventorySummaryQuery()

  const summaryCards = [
    { title: 'Total Stock', value: summaryData?.totalStock ?? 0, icon: Package, color: 'text-blue-600' },
    { title: 'High Risk Items', value: summaryData?.highRiskItems ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Expiring Today', value: summaryData?.expiringToday ?? 0, icon: Clock, color: 'text-orange-600' },
    { title: 'Overstock Items', value: summaryData?.overstockItems ?? 0, icon: TrendingUp, color: 'text-purple-600' },
  ]

  const mappedInventory = (rawInventory || []).map((batch: any) => {
    const quantity = batch.quantityCurrent
    let status: 'Optimal' | 'Low' | 'Overstock' = 'Optimal'
    if (quantity > 150) status = 'Overstock'
    else if (quantity < 50) status = 'Low'

    const risk = batch.riskLevel === 'HIGH' ? 'High' : batch.riskLevel === 'MEDIUM' ? 'Medium' : 'Low'

    return {
      id: batch.id,
      productId: batch.productId,
      product: batch.product.name,
      sku: batch.product.sku,
      category: batch.product.category.name,
      stock: quantity,
      demand: Math.floor(quantity * 0.8), // mock relative demand for visual consistency
      status,
      daysLeft: batch.daysLeft,
      risk,
      image: batch.product.imageUrl,
    }
  })

  const totalItems = mappedInventory.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedInventory = mappedInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Inventory Management
            </h1>
            <p className='text-sm text-muted-foreground'>
              Pemantauan stok, kategori produk, dan status risiko kadaluarsa
            </p>
          </div>
           <Button onClick={() => setBatchDialogOpen(true)} className='cursor-pointer'>
            <Plus className='mr-2 h-4 w-4' />
            Tambah Batch
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{card.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <div className='mt-4 flex flex-wrap items-center gap-3'>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => {
              setItemsPerPage(Number(val))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className='w-[110px]'>
              <SelectValue placeholder='Tampilkan' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10 Baris</SelectItem>
              <SelectItem value='25'>25 Baris</SelectItem>
              <SelectItem value='50'>50 Baris</SelectItem>
              <SelectItem value='100'>100 Baris</SelectItem>
            </SelectContent>
          </Select>

          <div className='relative flex-1 sm:max-w-xs'>
            <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Cari produk atau SKU...'
              className='pl-9'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-[170px]'>
              <SelectValue placeholder='Kategori' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Kategori</SelectItem>
              <SelectItem value='Dairy'>Dairy</SelectItem>
              <SelectItem value='Bakery'>Bakery</SelectItem>
              <SelectItem value='Produce'>Produce</SelectItem>
              <SelectItem value='Protein'>Protein</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Risk Level' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Risk</SelectItem>
              <SelectItem value='High'>High</SelectItem>
              <SelectItem value='Medium'>Medium</SelectItem>
              <SelectItem value='Low'>Low</SelectItem>
            </SelectContent>
          </Select>

          <div className='ms-auto flex items-center border rounded-md p-0.5 bg-card gap-1'>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => setViewMode('list')}
              title='Show as list'
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'icons' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => setViewMode('icons')}
              title='Show as icons'
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Inventory View */}
        {isLoading ? (
          <Card className='mt-4'>
            <CardContent className='p-0'>
              <TableSkeleton cols={9} rows={6} />
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <Card className='mt-4'>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[80px]'>Gambar</TableHead>
                    <TableHead>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Product <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className='text-right'>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Stock <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead className='text-right'>Demand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-center'>
                      <Button variant='ghost' size='sm' className='p-0 font-medium'>
                        Days Left <ArrowUpDown className='ml-1 h-3 w-3' />
                      </Button>
                    </TableHead>
                    <TableHead className='text-center'>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInventory.length ? (
                    paginatedInventory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div
                            className='h-10 w-10 rounded-md bg-muted/40 overflow-hidden flex items-center justify-center border cursor-pointer hover:border-primary/50 transition-colors'
                            onClick={() => setEditingProduct({ id: item.productId, name: item.product, imageUrl: item.image || '' })}
                            title='Klik untuk ubah gambar'
                          >
                            {item.image ? (
                              <img src={item.image} alt={item.product} className='h-full w-full object-cover animate-fade-in' />
                            ) : (
                              <Package className='h-5 w-5 text-muted-foreground/50' />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {item.product}
                        </TableCell>
                        <TableCell>
                          <code className='text-xs'>{item.sku}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{item.category}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>{item.stock}</TableCell>
                        <TableCell className='text-right'>{item.demand}</TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <span className={getDaysLeftColor(item.daysLeft)}>
                            {item.daysLeft}d
                          </span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Badge variant={getRiskBadgeVariant(item.risk)}>
                            {item.risk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
                        Tidak ada data stok ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          /* Icons / Grid View */
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4'>
            {paginatedInventory.length ? (
              paginatedInventory.map((item: any) => (
                <Card key={item.id} className='overflow-hidden group border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-card flex flex-col justify-between'>
                  <div
                    className='relative flex h-40 w-full items-center justify-center bg-muted/30 overflow-hidden cursor-pointer'
                    onClick={() => setEditingProduct({ id: item.productId, name: item.product, imageUrl: item.image || '' })}
                    title='Klik untuk ubah gambar'
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <Package className='h-12 w-12 text-muted-foreground/40 group-hover:scale-110 transition-transform duration-300' />
                    )}
                    {/* Absolute Badges Overlay */}
                    <div className='absolute top-2 left-2'>
                      <Badge variant={getRiskBadgeVariant(item.risk)}>{item.risk} Risk</Badge>
                    </div>
                    <div className='absolute top-2 right-2'>
                      <Badge variant='outline' className='bg-background/80 backdrop-blur-xs'>{item.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className='pb-2 pt-4 px-4'>
                    <div className='flex justify-between items-start gap-1'>
                      <CardTitle className='text-sm font-semibold line-clamp-1'>{item.product}</CardTitle>
                      <code className='text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground'>{item.sku}</code>
                    </div>
                  </CardHeader>
                  <CardContent className='pb-4 pt-0 px-4 flex-1 flex flex-col justify-end space-y-3'>
                    <div className='grid grid-cols-2 gap-2 text-xs border-y py-2 border-border/40'>
                      <div>
                        <span className='text-muted-foreground block text-[10px]'>Stok Aktif</span>
                        <span className='font-bold text-xs'>{item.stock}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground block text-[10px]'>Estimasi Demand</span>
                        <span className='font-semibold text-xs'>{item.demand}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center text-xs'>
                      <span className={`font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                      <span className={`text-[11px] ${getDaysLeftColor(item.daysLeft)}`}>{item.daysLeft} hari lagi</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='col-span-full h-40 text-center text-muted-foreground flex items-center justify-center border rounded-lg bg-muted/10'>
                Tidak ada data stok ditemukan.
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-between px-2'>
            <div className='text-xs text-muted-foreground'>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} item
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className='text-xs text-muted-foreground min-w-8 text-center'>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}

        {/* Dialog Edit Gambar */}
        <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Ubah Gambar Produk</DialogTitle>
              <DialogDescription>
                Masukkan tautan URL baru untuk gambar produk <strong>{editingProduct?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col space-y-4 py-4'>
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
              <Button onClick={handleUpdateImage} disabled={updateProduct.isPending}>
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Tambah Batch */}
        <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Tambah Batch Baru</DialogTitle>
              <DialogDescription>
                Masukkan rincian batch baru untuk produk pangan segar di inventaris.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col space-y-4 py-4 text-start'>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-muted-foreground'>Nama Produk</label>
                <Input
                  placeholder='Contoh: Tomat Cherry Segar'
                  value={newBatchData.productName}
                  onChange={(e) => {
                    setNewBatchData(p => ({
                      ...p,
                      productName: capitalizeWords(e.target.value)
                    }))
                  }}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-muted-foreground'>Kategori</label>
                <Select value={newBatchData.categoryName} onValueChange={(val) => setNewBatchData(p => ({ ...p, categoryName: val }))}>
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
                    onChange={(e) => setNewBatchData(p => ({ ...p, batchCode: e.target.value }))}
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground'>Kuantitas Diterima</label>
                  <Input
                    type='number'
                    placeholder='100'
                    value={newBatchData.quantityReceived || ''}
                    onChange={(e) => setNewBatchData(p => ({ ...p, quantityReceived: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground'>Tanggal Masuk</label>
                  <Input
                    type='date'
                    value={newBatchData.receivedDate}
                    onChange={(e) => setNewBatchData(p => ({ ...p, receivedDate: e.target.value }))}
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground'>Tanggal Kadaluarsa</label>
                  <Input
                    type='date'
                    value={newBatchData.expiryDate}
                    onChange={(e) => setNewBatchData(p => ({ ...p, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className='sm:justify-end gap-2'>
              <Button variant='outline' onClick={() => setBatchDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateBatch} disabled={createBatch.isPending} className='cursor-pointer'>
                Simpan Batch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}
