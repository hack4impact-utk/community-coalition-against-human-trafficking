import React from 'react'
import Image from 'next/image'
// MUI //
import Drawer from '@mui/material/Drawer'
import { Box } from '@mui/system'
import { useMediaQuery, useTheme } from '@mui/material'
// icons and text
// import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
// List component
import NavigationDrawerListItem from 'components/NavigationDrawer/NavigationDrawerListItem'

interface NavigationDrawerItem {
  text: string
  icon: React.ReactNode
  route: string
  subItems?: Omit<NavigationDrawerItem, 'icon' | 'subItems'>[]
}

const navigationDrawerItems: NavigationDrawerItem[] = [
  {
    text: 'Dashboard',
    icon: <AssignmentLateOutlinedIcon />,
    route: '/',
  },
  {
    text: 'Check In',
    icon: <ArchiveOutlinedIcon />,
    route: '/checkIn',
  },
  {
    text: 'Check Out',
    icon: <UnarchiveOutlinedIcon />,
    route: '/checkOut',
  },
  {
    text: 'Inventory',
    icon: <AssignmentOutlinedIcon />,
    route: '/inventory',
  },
  {
    text: 'History',
    icon: <AccessTimeIcon />,
    route: '/history',
  },
  {
    text: 'Settings',
    route: '',
    icon: <SettingsIcon />,
    subItems: [
      {
        text: 'General',
        route: '/settings',
      },
      {
        text: 'Categories',
        route: '/settings/categories',
      },
      {
        text: 'Items',
        route: '/settings/items',
      },
      {
        text: 'Item Attributes',
        route: '/settings/attributes',
      },
    ],
  },
]

interface NavigationDrawerProps {
  open: boolean
  setDrawerOpen: (status: boolean) => void
}
export default function NavigationDrawer({
  open,
  setDrawerOpen,
}: NavigationDrawerProps) {
  // Params for the Drawer
  const drawerWidth = 280
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  // Logo definition
  const logo = (
    <Image
      src="/images/CCAHT-Logo.png"
      alt="CCAHT-logo"
      height="70"
      width="239"
      style={{ objectFit: 'contain' }}
      priority
    />
  )

  // Drawer setup
  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={open}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: drawerWidth }}>
        <Box
          sx={{
            display: 'flex',
            px: 2,
            pt: 2,
            justifyContent: 'center',
          }}
        >
          {logo}
        </Box>
        <br />
        {/* Drawer using ListItem functional component*/}
        {navigationDrawerItems.map((item) => (
          <NavigationDrawerListItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            route={item.route}
            subItems={item.subItems}
          />
        ))}
      </Box>
    </Drawer>
  )
}
