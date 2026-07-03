import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

type StrategiesTableProps = {
  paginatedStrategies: any[]
  handleToggleStatus: (id: string, active: boolean) => void
  isPending: boolean
  strategiesPage: number
  totalStrategiesPages: number
  setStrategiesPage: React.Dispatch<React.SetStateAction<number>>
  totalStrategies: number
  itemsPerPage: number
}

function getNudgeTypeLabel(type: string) {
  switch (type.toLowerCase()) {
    case 'discount':
      return 'Diskon'
    case 'bundling':
      return 'Bundling'
    case 'urgency_label':
      return 'Label Urgensi'
    case 'gamification_badge':
      return 'Badge Gamifikasi'
    default:
      return type
  }
}

export function StrategiesTable({
  paginatedStrategies,
  handleToggleStatus,
  isPending,
  strategiesPage,
  totalStrategiesPages,
  setStrategiesPage,
  totalStrategies,
  itemsPerPage,
}: StrategiesTableProps) {
  return (
    <div className='p-0 border rounded-lg overflow-hidden bg-card'>
      <div className='overflow-x-auto w-full'>
        <Table className='min-w-[800px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Strategi</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className='text-center'>Produk</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead className='text-center'>Conversion</TableHead>
              <TableHead className='text-center'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStrategies.length ? (
              paginatedStrategies.map((strategy: any) => {
                const start = new Date(strategy.startDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })
                const end = new Date(strategy.endDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })
                const isActive = strategy.status === 'ACTIVE'

                return (
                  <TableRow key={strategy.id}>
                    <TableCell className='font-medium text-start'>{strategy.name}</TableCell>
                    <TableCell className='text-start'>
                      <Badge variant='outline'>{getNudgeTypeLabel(strategy.type)}</Badge>
                    </TableCell>
                    <TableCell className='text-center'>{strategy.products?.length ?? 0}</TableCell>
                    <TableCell className='text-sm text-muted-foreground text-start'>
                      {start} - {end}
                    </TableCell>
                    <TableCell className='text-center font-medium text-green-600'>18.7%</TableCell>
                    <TableCell className='text-center'>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => handleToggleStatus(strategy.id, isActive)}
                        disabled={isPending}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                  Belum ada strategi nudge dikonfigurasi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalStrategiesPages > 1 && (
        <div className='p-4 border-t flex items-center justify-between px-4'>
          <div className='text-xs text-muted-foreground'>
            Menampilkan {((strategiesPage - 1) * itemsPerPage) + 1} -{' '}
            {Math.min(strategiesPage * itemsPerPage, totalStrategies)} dari {totalStrategies} strategi
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setStrategiesPage((prev) => Math.max(prev - 1, 1))}
              disabled={strategiesPage === 1}
            >
              Sebelumnya
            </Button>
            <span className='text-xs text-muted-foreground min-w-8 text-center'>
              {strategiesPage} / {totalStrategiesPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setStrategiesPage((prev) => Math.min(prev + 1, totalStrategiesPages))}
              disabled={strategiesPage === totalStrategiesPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
