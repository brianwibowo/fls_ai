import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsersQuery } from '@/hooks/use-api'
import { Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [roleInfoOpen, setRoleInfoOpen] = useState(false)

  const { data: rawUsers, isLoading } = useUsersQuery(search.username)

  const mappedUsers = (rawUsers || []).map((user: any) => {
    const emailParts = user.email.split('@')
    const username = emailParts[0]
    
    const nameParts = user.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    return {
      id: user.id,
      firstName,
      lastName,
      username,
      email: user.email,
      phoneNumber: '-',
      status: user.isActive ? 'active' : 'inactive',
      role: user.role.toLowerCase(),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.createdAt),
    }
  })

  return (
    <UsersProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Manajemen User</h2>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0'
                onClick={() => setRoleInfoOpen(true)}
                title='Informasi Peran (Role)'
              >
                <Info className='h-4 w-4' />
              </Button>
            </div>
            <p className='text-muted-foreground'>
              Kelola data pengguna sistem dan hak akses mereka di sini.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-green-600' />
          </div>
        ) : (
          <UsersTable data={mappedUsers} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />

      {/* Dialog Info Role */}
      <Dialog open={roleInfoOpen} onOpenChange={setRoleInfoOpen}>
        <DialogContent className='sm:max-w-[480px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-lg font-bold'>
              <Info className='h-5 w-5 text-primary' />
              Panduan Peran & Hak Akses (Roles)
            </DialogTitle>
            <DialogDescription>
              Penjelasan peran pengguna dan hak akses operasional di dalam platform <strong>Freashday</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-3'>
            {/* Admin */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0'>
                AD
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Administrator
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-red-500/30 text-red-500 bg-red-500/5'>Superuser</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Memiliki akses penuh tanpa batas ke seluruh modul sistem. Mengelola akun pengguna (tambah/edit/hapus user), konfigurasi umum sistem, log nudging, analisis performa, dan inventaris.
                </p>
              </div>
            </div>

            {/* Logistics Manager */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0'>
                LM
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Logistics Manager
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-blue-500/30 text-blue-500 bg-blue-500/5'>Operasional</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Berfokus pada pengelolaan pasokan dan inventaris. Memiliki otorisasi untuk menambah batch stok produk, memantau level risiko kedaluwarsa produk, serta menyetujui rekomendasi reorder otomatis.
                </p>
              </div>
            </div>

            {/* Marketing Manager */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs shrink-0'>
                MM
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Marketing Manager
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-green-500/30 text-green-500 bg-green-500/5'>Strategi</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Berperan untuk menyelamatkan produk yang mendekati masa expired (food loss mitigation). Mengelola dan mengaktifkan strategi digital nudging seperti penawaran diskon kilat, paket bundling, maupun label urgensi di katalog.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRoleInfoOpen(false)} className='w-full sm:w-auto'>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UsersProvider>
  )
}
