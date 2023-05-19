import { List } from '@mui/material'
import NoResultsText from 'components/NoResultsText'
import React from 'react'
import { AttributeResponse } from 'utils/types'
import { AttributeContext, AttributeContextType } from '../AttributeContext'
import MobileAttributeListItem from './MobileAttributeListItem'

interface AttributeListProps {
  search: string
}

function attributeComparator(a: AttributeResponse, b: AttributeResponse) {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

export default function MobileAttributeList({ search }: AttributeListProps) {
  const [tableData, setTableData] = React.useState<AttributeResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  const { attributes } = React.useContext(
    AttributeContext
  ) as AttributeContextType
  React.useEffect(() => {
    if (!search) {
      setTableData(attributes.sort(attributeComparator))
      setLoading(false)
      return
    }
    const lowercaseSearch = search.toLowerCase()
    const filteredAttributes = attributes
      .filter((attribute) => {
        return (
          attribute.name.toLowerCase().includes(lowercaseSearch) ||
          (typeof attribute.possibleValues === 'string' &&
            attribute.possibleValues.includes(lowercaseSearch)) ||
          (typeof attribute.possibleValues === 'object' &&
            attribute.possibleValues
              .map((value) => value.toLowerCase())
              .join(' ')
              .includes(lowercaseSearch))
        )
      })
      .sort(attributeComparator)
    setTableData(filteredAttributes)
    setLoading(false)
  }, [search, attributes])

  React.useEffect(() => {
    setTableData(tableData.sort(attributeComparator))
  }, [tableData])
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {tableData.length || loading ? (
        tableData.map((attribute) => (
          <MobileAttributeListItem attribute={attribute} key={attribute._id} />
        ))
      ) : (
        <NoResultsText />
      )}
    </List>
  )
}
