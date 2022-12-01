import React from 'react'
import Image from 'next/image'
// MUI //
import Drawer from '@mui/material/Drawer'
import { Box } from '@mui/system'
import Collapse from '@mui/material/Collapse'
// other mui dependencies
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
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
import NavigationDrawerListItem from './NavigationDrawerListItem'
// List components from MUI
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

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
      src="/../public/images/CCAHT-Logo.png"
      alt="CCAHT-logo"
      height="70"
      width="239"
      style={{ objectFit: 'contain' }}
    />
  )
  // state handlers for expandable lists in drawer
  const [collapseOpen, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(!collapseOpen)
  }
  // Drawer setup
  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        width: drawerWidth,
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
        <NavigationDrawerListItem
          icon={<AssignmentLateOutlinedIcon />}
          text="Dashboard"
        />
        <NavigationDrawerListItem
          icon={<ArchiveOutlinedIcon />}
          text="Check In"
        />
        <NavigationDrawerListItem
          icon={<UnarchiveOutlinedIcon />}
          text="Check Out"
        />
        <NavigationDrawerListItem
          icon={<AssignmentOutlinedIcon />}
          text="Inventory"
        />
        <NavigationDrawerListItem icon={<AccessTimeIcon />} text="History" />

        {/* Collapsable Drawer using ListItem functional component*/}
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {collapseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 0.8 }}>
            <NavigationDrawerListItem text="General" collapsable />
            <NavigationDrawerListItem text="Categories" collapsable />
            <NavigationDrawerListItem text="Items" collapsable />
            <NavigationDrawerListItem
              text="Item Attributes"
              collapsable={true}
            />
          </List>
        </Collapse>
      </Box>
    </Drawer>
  )
}
