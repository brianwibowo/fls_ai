import { Link } from '@tanstack/react-router'
import { Leaf } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='hover:bg-transparent active:bg-transparent cursor-pointer'
          asChild
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='flex items-center gap-3'
          >
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <Leaf className='h-5 w-5' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='truncate font-bold text-foreground'>Freashday</span>
              <span className='truncate text-xs text-muted-foreground'>Food Logistic System</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
