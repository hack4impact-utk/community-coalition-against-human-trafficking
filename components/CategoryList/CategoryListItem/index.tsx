import {
  TableRow,
  TableCell,
  Box,
  useMediaQuery,
  Typography,
} from '@mui/material'
import { CategoryResponse } from 'utils/types'
import CategoryListItemKebab from 'components/CategoryList/CategoryListItemKebab'
import Grid2 from '@mui/material/Unstable_Grid2'
import theme from 'utils/theme'

interface CategoryListItemProps {
  category: CategoryResponse
}

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <TableRow>
      <TableCell>
        <Grid2 container direction={isMobileView ? 'column' : 'row'}>
          <Grid2 md={12} lg={4}>
            <Typography
              sx={{
                fontWeight: isMobileView ? 'bold' : 'normal',
              }}
              component="span"
              variant="body1"
            >
              {category.name}
            </Typography>
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
