import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useNudgeStrategiesQuery,
  useNudgePreviewsQuery,
  useNudgeLogsQuery,
  useNudgingSummaryQuery,
  useUpdateNudgeMutation,
  useCreateNudgeMutation,
  useProductsQuery,
  useCreateSaleMutation,
} from '@/hooks/use-api'
import { toast } from 'sonner'

// Sub-components
import { NudgingSummaryCards } from './components/nudging-summary-cards'
import { StrategiesTable } from './components/strategies-table'
import { ProductPreviewGrid } from './components/product-preview-grid'
import { ActivityLogsTable } from './components/activity-logs-table'
import { CreateNudgeDialog } from './components/create-nudge-dialog'

// Helpers
function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const route = getRouteApi('/_authenticated/nudging')

export function Nudging() {
  const search = route.useSearch()
  const { data: strategiesData, isLoading: isStrategiesLoading } = useNudgeStrategiesQuery()
  const { data: previewData, isLoading: isPreviewLoading } = useNudgePreviewsQuery()
  const { data: logsData, isLoading: isLogsLoading } = useNudgeLogsQuery()
  const { data: summaryData } = useNudgingSummaryQuery()

  const updateNudge = useUpdateNudgeMutation()
  const createNudge = useCreateNudgeMutation()
  const createSale = useCreateSaleMutation()
  const { data: products } = useProductsQuery()

  const handleSimulateSale = async (productPreview: any) => {
    const quantity = Math.floor(Math.random() * 4) + 2
    const hasNudge = productPreview.originalPrice !== productPreview.discountedPrice
    try {
      await createSale.mutateAsync({
        productId: productPreview.productId,
        quantitySold: quantity,
        saleDate: new Date().toISOString(),
        salePrice: productPreview.discountedPrice,
        wasNudged: hasNudge,
        nudgeId: productPreview.nudgeId || undefined
      })
      toast.success(
        `Simulasi Pembelian Berhasil: Terjual ${quantity} unit ${productPreview.productName} (FEFO Terpotong & Log Tercatat)!`
      )
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menjalankan simulasi transaksi.'
      toast.error(message)
    }
  }

  const [nudgeDialogOpen, setNudgeDialogOpen] = useState(false)
  const [newNudgeData, setNewNudgeData] = useState({
    name: '',
    type: 'DISCOUNT',
    discountPercentage: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    productId: '',
  })

  // Auto-open and prefill if navigated with query param
  useEffect(() => {
    if (search.createNudgeForProductId) {
      setNewNudgeData((p) => ({ ...p, productId: search.createNudgeForProductId! }))
      setNudgeDialogOpen(true)
    }
  }, [search.createNudgeForProductId])

  const handleCreateNudge = async () => {
    if (!newNudgeData.name || !newNudgeData.productId) {
      toast.error('Harap lengkapi nama strategi dan produk sasaran.')
      return
    }

    try {
      await createNudge.mutateAsync({
        name: newNudgeData.name,
        type: newNudgeData.type,
        discountPercentage: newNudgeData.type === 'DISCOUNT' ? Number(newNudgeData.discountPercentage) : 0,
        startDate: new Date(newNudgeData.startDate).toISOString(),
        endDate: new Date(newNudgeData.endDate).toISOString(),
        productIds: [newNudgeData.productId],
      })

      toast.success('Strategi nudging baru berhasil ditambahkan!')
      setNudgeDialogOpen(false)
      setNewNudgeData({
        name: '',
        type: 'DISCOUNT',
        discountPercentage: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        productId: '',
      })
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menyimpan strategi nudging.'
      toast.error(message)
    }
  }

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      await updateNudge.mutateAsync({
        id,
        status: currentActive ? 'ENDED' : 'ACTIVE',
      })
      toast.success(`Strategi berhasil ${currentActive ? 'dinonaktifkan' : 'diaktifkan'}!`)
    } catch {
      toast.error('Gagal memperbarui status strategi.')
    }
  }

  // Pagination states
  const [strategiesPage, setStrategiesPage] = useState(1)
  const [logsPage, setLogsPage] = useState(1)
  const itemsPerPage = 10

  const totalStrategies = strategiesData?.length ?? 0
  const totalStrategiesPages = Math.ceil(totalStrategies / itemsPerPage)
  const paginatedStrategies = (strategiesData || []).slice(
    (strategiesPage - 1) * itemsPerPage,
    strategiesPage * itemsPerPage
  )

  const totalLogs = logsData?.length ?? 0
  const totalLogsPages = Math.ceil(totalLogs / itemsPerPage)
  const paginatedLogs = (logsData || []).slice(
    (logsPage - 1) * itemsPerPage,
    logsPage * itemsPerPage
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
            <h1 className='text-2xl font-bold tracking-tight'>Digital Nudging</h1>
            <p className='text-sm text-muted-foreground'>
              Rancang promosi pintar dan label urgensi berbasis sisa umur simpan produk
            </p>
          </div>
          <Button onClick={() => setNudgeDialogOpen(true)} className='cursor-pointer bg-green-600 hover:bg-green-700 text-white'>
            <Plus className='mr-2 h-4 w-4' />
            Buat Strategi
          </Button>
        </div>

        {/* Summary Cards */}
        <NudgingSummaryCards summaryData={summaryData} />

        {/* Tabs */}
        <Tabs defaultValue='strategies' className='mt-4'>
          <TabsList>
            <TabsTrigger value='strategies'>Nudge Strategies</TabsTrigger>
            <TabsTrigger value='logs'>Activity Logs</TabsTrigger>
          </TabsList>

          {/* Strategies Tab */}
          <TabsContent value='strategies'>
            {isStrategiesLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <span className='text-sm text-muted-foreground'>Memuat data...</span>
              </div>
            ) : (
              <StrategiesTable
                paginatedStrategies={paginatedStrategies}
                handleToggleStatus={handleToggleStatus}
                isPending={updateNudge.isPending}
                strategiesPage={strategiesPage}
                totalStrategiesPages={totalStrategiesPages}
                setStrategiesPage={setStrategiesPage}
                totalStrategies={totalStrategies}
                itemsPerPage={itemsPerPage}
              />
            )}
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value='logs'>
            {isLogsLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <span className='text-sm text-muted-foreground'>Memuat data...</span>
              </div>
            ) : (
              <ActivityLogsTable
                paginatedLogs={paginatedLogs}
                logsPage={logsPage}
                totalLogsPages={totalLogsPages}
                setLogsPage={setLogsPage}
                totalLogs={totalLogs}
                itemsPerPage={itemsPerPage}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Section Bawah: Simulasi & Preview Produk Retail */}
        <div className='mt-8 pt-8 border-t text-start'>
          <div className='mb-4'>
            <h2 className='text-lg font-bold tracking-tight text-foreground flex items-center gap-2'>
              <span>🛒 Preview Produk di Aplikasi Retail</span>
            </h2>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Simulasi tampilan real-time promo FEFO (First-Expired, First-Out) yang langsung dilihat oleh pelanggan di toko online.
            </p>
          </div>

          {isPreviewLoading ? (
            <div className='flex h-40 items-center justify-center border rounded-lg bg-muted/5'>
              <span className='text-sm text-muted-foreground'>Memuat pratinjau...</span>
            </div>
          ) : (
            <ProductPreviewGrid
              previewData={previewData}
              handleSimulateSale={handleSimulateSale}
              isPending={createSale.isPending}
              formatRupiah={formatRupiah}
            />
          )}
        </div>

        {/* Dialogs */}
        <CreateNudgeDialog
          nudgeDialogOpen={nudgeDialogOpen}
          setNudgeDialogOpen={setNudgeDialogOpen}
          newNudgeData={newNudgeData}
          setNewNudgeData={setNewNudgeData}
          products={products}
          handleCreateNudge={handleCreateNudge}
          isPending={createNudge.isPending}
        />
      </Main>
    </>
  )
}
