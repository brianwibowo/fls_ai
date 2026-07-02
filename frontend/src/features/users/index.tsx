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
import { Loader2 } from 'lucide-react'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

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
            <h2 className='text-2xl font-bold tracking-tight'>Manajemen User</h2>
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
    </UsersProvider>
  )
}
