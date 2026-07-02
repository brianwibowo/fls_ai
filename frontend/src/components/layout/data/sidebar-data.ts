import {
  LayoutDashboard,
  Package,
  Brain,
  BellRing,
  BarChart3,
  Users,
  Settings,
  UserCog,
  Palette,
  Bell,
  Monitor,
  Wrench,
  Leaf,
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
          icon: Settings,
          items: [
            {
              title: 'Profil',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Akun',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Tampilan',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifikasi',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
