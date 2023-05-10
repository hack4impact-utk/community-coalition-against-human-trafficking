import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Collapse, List } from '@mui/material'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
  route: string
  subItems?: Omit<ListProps, 'icon' | 'subItems'>[]
}

interface ListItemBaseProps {
  text: string
  icon?: React.ReactNode
  collapsable?: boolean
  route: string
}

function ListItemBase({ text, icon, collapsable, route }: ListItemBaseProps) {
  const router = useRouter()
  return (
    <ListItemButton
      component={Link}
      href={route}
      selected={router.pathname === route}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: collapsable ? 'body2' : 'body1',
        }}
      />
    </ListItemButton>
  )
}

export default function NavigationDrawerListItem({
  icon,
  text,
  route,
  subItems,
}: ListProps) {
  const [collapsed, setCollapsed] = React.useState(true)
  return (
    <>
      {subItems ? (
        <>
          <ListItemButton
            onClick={() => setCollapsed((collapsed) => !collapsed)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary="Settings" />
            {collapsed ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={!collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 0.8 }}>
              {subItems.map((item) => (
                <ListItemBase
                  key={item.text}
                  text={item.text}
                  collapsable
                  route={item.route}
                />
              ))}
            </List>
          </Collapse>
        </>
      ) : (
        <ListItemBase text={text} icon={icon} route={route} />
      )}
    </>
  )
}
