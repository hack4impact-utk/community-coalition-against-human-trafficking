import { TableRow, TableCell, Box, useMediaQuery } from '@mui/material'
import { CategoryResponse } from 'utils/types'
import CategoryListItemKebab from 'components/CategoryList/CategoryListItemKebab'
import Grid2 from '@mui/material/Unstable_Grid2'
import theme from 'utils/theme'

interface CategoryListItemProps {
  category: CategoryResponse
}

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const isMediumView = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <TableRow>
      <TableCell>
        <Grid2 container direction={isMediumView ? 'column' : 'row'}>
          <Grid2 md={12} lg={4}>
            {category.name}
          </Grid2>
        </Grid2>
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <CategoryListItemKebab category={category} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
