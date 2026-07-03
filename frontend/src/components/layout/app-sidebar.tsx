import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useAuthStore } from '@/stores/auth-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const user = useAuthStore((state) => state.auth.user)
  const userRole = user?.role?.[0] // 'admin', 'logistics_manager', 'marketing_manager'

  const activeUser = {
    name: user?.name || 'User',
    email: user?.email || '',
    avatar: '',
  }

  // Filter groups and items based on role permissions
  const filteredNavGroups = sidebarData.navGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        // Hide User Management for non-admins
        if (item.url === '/users' && userRole !== 'admin') {
          return false
        }
        // Hide Forecasting for marketing managers
        if (item.url === '/forecasting' && userRole === 'marketing_manager') {
          return false
        }
        // Hide Digital Nudging for logistics managers
        if (item.url === '/nudging' && userRole === 'logistics_manager') {
          return false
        }
        return true
      })
      return { ...group, items: filteredItems }
    })
    .filter((group) => group.items.length > 0)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={activeUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
