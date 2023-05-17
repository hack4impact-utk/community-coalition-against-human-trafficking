import { Skeleton, TableCell, TableRow, Typography } from '@mui/material'

// an array of all the cells in the row, if true, then it will render a skeleton
const skeletonCell = [true, true, true, true, true, false]

export default function DesktopHistoryListItemSkeleton() {
  return (
    <TableRow>
      {skeletonCell.map((cell, index) => (
        <TableCell
          key={index}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            wordBreak: 'break-word',
          }}
        >
          {cell && (
            <Typography variant="h4">
              <Skeleton animation="wave" />
            </Typography>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
