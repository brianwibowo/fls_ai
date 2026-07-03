import { useState, useEffect } from 'react'
import { Plus, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useInventoryQuery,
  useInventorySummaryQuery,
  useUpdateProductMutation,
  useCreateBatchMutation,
  useProductsQuery,
  useCreateProductMutation,
} from '@/hooks/use-api'
import { TableSkeleton } from '@/components/page-skeletons'

// Sub-components
import { InventorySummaryCards } from './components/inventory-summary-cards'
import { InventoryFilters } from './components/inventory-filters'
import { InventoryTableView } from './components/inventory-table-view'
import { InventoryIconsView } from './components/inventory-icons-view'
import { EditImageDialog } from './components/edit-image-dialog'
import { AddBatchDialog } from './components/add-batch-dialog'
import { InventoryDetailModal } from './components/inventory-detail-modal'

// Helpers
function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list')
  const [editingProduct, setEditingProduct] = useState<{ id: string; name: string; imageUrl: string } | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [sortByDaysLeftVal, setSortByDaysLeftVal] = useState<boolean>(false)
  const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const updateProduct = useUpdateProductMutation()

  const { data: rawInventory, isLoading } = useInventoryQuery({
    category: categoryFilter,
    risk: riskFilter,
    search: searchQuery,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, riskFilter])

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
  const [showSuggestions, setShowSuggestions] = useState(false)
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

  const handleCreateBatch = async () => {
    if (!newBatchData.productName || !newBatchData.batchCode || !newBatchData.quantityReceived) {
      toast.error('Harap isi semua kolom.')
      return
    }
    try {
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

      const existingProduct = products?.find(
        (p: any) => p.name.toLowerCase() === newBatchData.productName.toLowerCase()
      )

      let targetProductId = existingProduct?.id

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

      await createBatch.mutateAsync({
        productId: targetProductId,
        batchCode: newBatchData.batchCode,
        quantityReceived: Number(newBatchData.quantityReceived),
        receivedDate: new Date(newBatchData.receivedDate).toISOString(),
        expiryDate: new Date(newBatchData.expiryDate).toISOString(),
      })

      toast.success('Batch baru berhasil ditambahkan!')
      setBatchDialogOpen(false)
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

  const suggestions = newBatchData.productName
    ? products?.filter((p: any) =>
        p.name.toLowerCase().includes(newBatchData.productName.toLowerCase()) &&
        p.name.toLowerCase() !== newBatchData.productName.toLowerCase()
      ) || []
    : []

  const mappedInventory = (rawInventory || []).map((batch: any) => {
    const quantity = batch.quantityCurrent
    let status: 'Optimal' | 'Low' | 'Overstock' = 'Optimal'
    if (quantity > 150) status = 'Overstock'
    else if (quantity < 50) status = 'Low'

    const risk = batch.riskLevel === 'HIGH' ? 'High' : batch.riskLevel === 'MEDIUM' ? 'Medium' : 'Low'
    const estimatedLoss = quantity * (batch.product?.unitCost || 10000)

    return {
      id: batch.id,
      productId: batch.productId,
      product: batch.product?.name || '',
      sku: batch.product?.sku || '',
      category: batch.product?.category?.name || '',
      stock: quantity,
      demand: Math.floor(quantity * 0.8),
      status,
      daysLeft: batch.daysLeft,
      risk,
      imageUrl: batch.product?.imageUrl || '',
      batchCode: batch.batchCode,
      estimatedLoss,
    }
  })

  const processedInventory = [...mappedInventory]
  if (sortByDaysLeftVal) {
    processedInventory.sort((a, b) => a.daysLeft - b.daysLeft)
  }

  const totalItems = processedInventory.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedInventory = processedInventory.slice(
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
            <h1 className='text-2xl font-bold tracking-tight'>Inventory Management</h1>
            <p className='text-sm text-muted-foreground'>
              Pemantauan stok, kategori produk, dan status risiko kadaluarsa
            </p>
          </div>
          <Button onClick={() => setBatchDialogOpen(true)} className='cursor-pointer'>
            <Plus className='mr-2 h-4 w-4' />
            Tambah Batch
          </Button>
        </div>

        <InventorySummaryCards summaryData={summaryData} />

        <InventoryFilters
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className='mt-4 rounded-xl border bg-card p-4 text-card-foreground shadow-xs'>
          {isLoading ? (
            <TableSkeleton cols={viewMode === 'list' ? 10 : 4} rows={itemsPerPage} />
          ) : paginatedInventory.length > 0 ? (
            viewMode === 'list' ? (
              <InventoryTableView
                paginatedInventory={paginatedInventory}
                onViewDetail={(item) => {
                  setSelectedDetailItem(item)
                  setDetailModalOpen(true)
                }}
                formatRupiah={formatRupiah}
                sortByDaysLeft={() => setSortByDaysLeftVal(!sortByDaysLeftVal)}
              />
            ) : (
              <InventoryIconsView
                paginatedInventory={paginatedInventory}
                onViewDetail={(item) => {
                  setSelectedDetailItem(item)
                  setDetailModalOpen(true)
                }}
                formatRupiah={formatRupiah}
              />
            )
          ) : (
            <div className='flex h-60 flex-col items-center justify-center text-center text-muted-foreground'>
              <Package className='mb-2 h-10 w-10 opacity-30' />
              <p className='text-sm'>Tidak ada produk dalam inventaris yang cocok dengan filter aktif Anda.</p>
            </div>
          )}

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
        </div>

        <EditImageDialog
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          handleUpdateImage={handleUpdateImage}
          isPending={updateProduct.isPending}
        />

        <InventoryDetailModal
          item={selectedDetailItem}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onEditImageClick={setEditingProduct}
          formatRupiah={formatRupiah}
        />

        <AddBatchDialog
          batchDialogOpen={batchDialogOpen}
          setBatchDialogOpen={setBatchDialogOpen}
          newBatchData={newBatchData}
          setNewBatchData={setNewBatchData}
          products={products}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestions={suggestions}
          handleCreateBatch={handleCreateBatch}
          isPending={createBatch.isPending}
        />
      </Main>
    </>
  )
}
