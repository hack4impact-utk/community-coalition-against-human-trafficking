import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
  collapsable?: boolean
}

function NavigationDrawerListItem({
  collapsable = false,
  icon,
  text,
}: ListProps) {
  return collapsable ? (
    <div>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{ variant: 'body2' }}
        />
      </ListItemButton>
    </div>
  ) : (
    <ListItemButton>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />{' '}
    </ListItemButton>
  )
}
export default NavigationDrawerListItem
