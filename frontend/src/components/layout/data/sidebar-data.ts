import {
  LayoutDashboard,
  Package,
  Brain,
  BellRing,
  BarChart3,
  Users,
  Settings,
  Leaf,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@freashday.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Freashday',
      logo: Leaf,
      plan: 'Food Logistic System',
    },
  ],
  navGroups: [
    {
      title: 'Menu Utama',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Inventory',
          url: '/inventory',
          icon: Package,
        },
        {
          title: 'AI Forecasting',
          url: '/forecasting',
          icon: Brain,
        },
        {
          title: 'Digital Nudging',
          url: '/nudging',
          icon: BellRing,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Administrasi',
      items: [
        {
          title: 'Manajemen User',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Pengaturan',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Pusat Bantuan',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
