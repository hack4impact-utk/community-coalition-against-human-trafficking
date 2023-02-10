import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import Link from 'next/link'
import { useRouter } from 'next/router'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
  collapsable?: boolean
  route: string
}

function NavigationDrawerListItem({
  collapsable,
  icon,
  text,
  route,
}: ListProps) {
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
        primaryTypographyProps={{ variant: collapsable ? 'body2' : 'body1' }}
      />
    </ListItemButton>
  )
}
export default NavigationDrawerListItem
