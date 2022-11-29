import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import Link from 'next/link'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
  collapsable?: boolean
  route: string
}

function NavigationDrawerListItem({
  collapsable = false,
  icon,
  text,
  route,
}: ListProps) {
  return collapsable ? (
    <ListItemButton>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{ variant: 'body2' }}
      />
    </ListItemButton>
  ) : (
    <ListItemButton component={Link} href={route}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  )
}
export default NavigationDrawerListItem
