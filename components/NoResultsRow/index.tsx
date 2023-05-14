import { MoreVert } from '@mui/icons-material'
import { TableRow, TableCell, IconButton } from '@mui/material'
import { errors } from 'utils/constants'

interface Props {
  numCols: number
}

export default function NoResultsRow({ numCols }: Props) {
  return (
    <TableRow>
      <TableCell sx={{ alignItems: 'center' }}>
        {errors.noResultsFound}
        <IconButton sx={{ visibility: 'hidden' }}>
          <MoreVert />
        </IconButton>
      </TableCell>
      {Array(numCols)
        .fill(0)
        .map(() => (
          <TableCell />
        ))}
    </TableRow>
  )
}
