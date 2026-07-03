import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ActivityLogsTableProps = {
  paginatedLogs: any[]
  logsPage: number
  totalLogsPages: number
  setLogsPage: React.Dispatch<React.SetStateAction<number>>
  totalLogs: number
  itemsPerPage: number
}

function getEventBadgeVariant(eventType: string) {
  switch (eventType) {
    case 'CONVERSION':
      return 'default' as const
    case 'CLICK':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

export function ActivityLogsTable({
  paginatedLogs,
  logsPage,
  totalLogsPages,
  setLogsPage,
  totalLogs,
  itemsPerPage,
}: ActivityLogsTableProps) {
  return (
    <div className='p-0 border rounded-lg overflow-hidden bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>Strategi</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead className='text-center'>Event</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLogs.length ? (
            paginatedLogs.map((log: any) => {
              const date = new Date(log.occurredAt).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <TableRow key={log.id}>
                  <TableCell className='text-sm text-muted-foreground'>{date}</TableCell>
                  <TableCell className='font-medium'>{log.nudge?.name ?? '-'}</TableCell>
                  <TableCell>{log.product?.name ?? '-'}</TableCell>
                  <TableCell className='text-center'>
                    <Badge variant={getEventBadgeVariant(log.eventType)}>{log.eventType}</Badge>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                Belum ada rekaman aktivitas nudge log.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalLogsPages > 1 && (
        <div className='p-4 border-t flex items-center justify-between px-4'>
          <div className='text-xs text-muted-foreground'>
            Menampilkan {((logsPage - 1) * itemsPerPage) + 1} -{' '}
            {Math.min(logsPage * itemsPerPage, totalLogs)} dari {totalLogs} log
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setLogsPage((prev) => Math.max(prev - 1, 1))}
              disabled={logsPage === 1}
            >
              Sebelumnya
            </Button>
            <span className='text-xs text-muted-foreground min-w-8 text-center'>
              {logsPage} / {totalLogsPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setLogsPage((prev) => Math.min(prev + 1, totalLogsPages))}
              disabled={logsPage === totalLogsPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
