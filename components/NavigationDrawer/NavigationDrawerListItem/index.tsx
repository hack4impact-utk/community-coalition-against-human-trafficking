import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
  collapsable?: boolean
}

function NavigationDrawerListItem({ collapsable, icon, text }: ListProps) {
  return (
    <ListItemButton>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{ variant: collapsable ? 'body2' : 'body1' }}
      />
    </ListItemButton>
  )
}
export default NavigationDrawerListItem
