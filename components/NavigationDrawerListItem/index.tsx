import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
// props for the list
interface ListProps {
  text: string
  icon?: React.ReactNode
}

function NavigationDrawerListItem({ icon, text }: ListProps) {
  return (
    <div>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </div>
  )
}

export default NavigationDrawerListItem
