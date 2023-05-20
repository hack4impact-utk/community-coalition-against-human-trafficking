import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { CategoryResponse } from 'utils/types'
import CategoryListItem from 'components/CategoryList/CategoryListItem'
import NoResultsText from 'components/NoResultsText'
import { CategoryContext, CategoryContextType } from '../CategoryContext'

interface Props {
  search: string
}

function categoryComparator(a: CategoryResponse, b: CategoryResponse) {
  const name1 = a.name.toLowerCase()
  const name2 = b.name.toLowerCase()
  if (name1 < name2) {
    return -1
  }
  if (name1 > name2) {
    return 1
  }
  return 0
}

export default function MobileCategoryList(props: Props) {
  const [tableData, setTableData] = React.useState<CategoryResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  const { categories } = React.useContext(
    CategoryContext
  ) as CategoryContextType

  React.useEffect(() => {
    let newTableData: CategoryResponse[] = categories
    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = newTableData.filter((category) =>
        category.name.toLowerCase().includes(search)
      )
    }
    setTableData(newTableData.sort(categoryComparator))
    setLoading(false)
  }, [props.search, categories])

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
      {!tableData.length && !loading && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <NoResultsText />
        </Box>
      )}
    </Box>
  )
}
