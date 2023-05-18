import { List } from '@mui/material'
import NoResultsText from 'components/NoResultsText'
import React from 'react'
import { AttributeResponse } from 'utils/types'
import MobileAttributeListItem from './MobileAttributeListItem'

interface AttributeListProps {
  attributes: AttributeResponse[]
  search: string
}

export default function MobileAttributeList({
  attributes,
  search,
}: AttributeListProps) {
  const [tableData, setTableData] = React.useState<AttributeResponse[]>([])
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    if (!search) {
      setTableData(attributes)
      setLoading(false)
      return
    }
    const lowercaseSearch = search.toLowerCase()
    const filteredAttributes = attributes.filter((attribute) => {
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
    setTableData(filteredAttributes)
    setLoading(false)
  }, [search])
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
