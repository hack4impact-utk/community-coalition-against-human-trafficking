import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import React from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SettingsIcon from '@mui/icons-material/Settings'

export default function NavigationDrawer() {
  // Params for the Drawer
  const drawerWidth = 280
  // Logo definition //TODO placeholder
  const logo = (
    <Image
      src="/../public/images/CCAHT-Logo.png"
      alt="CCAHT-logo"
      height="70"
      width="239"
    />
  )
  // state handlers for expandable lists in drawer
  const [open, setOpen] = React.useState(true)
  const handleClick = () => {
    setOpen(!open)
  }
  // Drawer setup
  const drawer = (
    <Box>
      <Box sx={{ pr: 3, mt: 5 }}>{logo}</Box>
      <br />
      <ListItemButton>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Check In" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Inventory" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 9 }}>
            <ListItemText primary="General" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 9 }}>
            <ListItemText primary="Categories" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 9 }}>
            <ListItemText primary="Items" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 9 }}>
            <ListItemText primary="Item Attributes" />
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  )
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
