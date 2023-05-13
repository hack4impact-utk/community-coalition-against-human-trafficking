import { Skeleton, TableCell, TableRow, Typography } from '@mui/material'

export default function DesktopInventoryItemListItemSkeleton() {
  return (
    <TableRow sx={{ width: '100%' }}>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h4">
          <Skeleton animation="wave" />
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h4">
          <Skeleton animation="wave" />
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h4">
          <Skeleton animation="wave" />
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h4">
          <Skeleton animation="wave" />
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h4">
          <Skeleton animation="wave" />
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      ></TableCell>
    </TableRow>
  )
}
