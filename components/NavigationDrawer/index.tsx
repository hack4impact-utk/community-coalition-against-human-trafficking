import React from 'react'
import Image from 'next/image'
// MUI //
import Drawer from '@mui/material/Drawer'
import { Box } from '@mui/system'
import Collapse from '@mui/material/Collapse'
// other mui dependencies
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
// icons and text
// import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SettingsIcon from '@mui/icons-material/Settings'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
// List component
import ListItem from '../ListItem/'
// List components from MUI
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

export default function NavigationDrawer() {
  // Params for the Drawer
  const drawerWidth = 280
  // Logo definition
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
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
        }}
      >
        <Box>
          <Box sx={{ pr: 3, mt: 5 }}>{logo}</Box>
          <br />
          {/* Drawer using ListItem functional component*/}
          <ListItem icon={<AssignmentLateOutlinedIcon />} text="Dashboard" />
          <ListItem icon={<UnarchiveOutlinedIcon />} text="Check In" />
          <ListItem icon={<ArchiveOutlinedIcon />} text="Check Out" />
          <ListItem icon={<AssignmentOutlinedIcon />} text="Inventory" />
          <ListItem icon={<AccessTimeIcon />} text="History" />

          {/* Collapsable Drawer using ListItem functional component*/}
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* <Typography font-size="0.1rem"> */}
            <List component="div" disablePadding sx={{ pl: 0.8 }}>
              <ListItem text="General" />
              <ListItem text="Categories" />
              <ListItem text="Items" />
              <ListItem text="Item Attributes" />
            </List>
            {/*</Typography>*/}
          </Collapse>
        </Box>
      </Drawer>
    </Box>
  )
}
