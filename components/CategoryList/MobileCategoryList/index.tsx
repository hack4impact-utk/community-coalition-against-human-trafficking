import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { CategoryResponse } from 'utils/types'
import CategoryListItem from 'components/CategoryList/CategoryListItem'
import deepCopy from 'utils/deepCopy'

interface Props {
  categories: CategoryResponse[]
  search: string
}

export default function MobileCategoryList(props: Props) {
  const [tableData, setTableData] = React.useState<CategoryResponse[]>([])

  React.useEffect(() => {
    let newTableData: CategoryResponse[] = deepCopy(props.categories)
    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = [
        ...newTableData.filter((category) => {
          return category.name.toLowerCase().includes(search)
        }),
      ]
    }
    setTableData(newTableData)
  }, [props.search])

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <TableBody>
            {tableData.map((category) => (
              <CategoryListItem category={category} key={category._id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
