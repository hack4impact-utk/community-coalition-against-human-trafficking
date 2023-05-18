import { List } from '@mui/material'
import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import React from 'react'
import MobileItemDefinitionListItem from 'components/ItemDefinitionList/MobileItemDefinitionList/MobileItemDefinitionListItem'
import NoResultsText from 'components/NoResultsText'

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

interface SearchableData {
  id: string
  name: string
  attributes?: AttributeResponse[]
  category: string
  internal: string
  itemDefinitionResponse: ItemDefinitionResponse
}

export default function MobileItemDefinitionList({
  itemDefinitions,
  search,
}: Props) {
  const [tableData, setTableData] = React.useState<SearchableData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let filteredData = itemDefinitions.map(
      (itemDefinition) =>
        ({
          id: itemDefinition._id,
          name: itemDefinition.name.toLowerCase(),
          attributes: itemDefinition.attributes,
          category: itemDefinition.category?.name.toLowerCase(),
          internal: itemDefinition.internal ? 'staff' : 'clients',
          itemDefinitionResponse: itemDefinition,
        } as SearchableData)
    )

    if (search) {
      const searchLowerCase = search.toLowerCase()
      filteredData = [
        ...filteredData.filter(
          (itemDefinition) =>
            itemDefinition.name.includes(searchLowerCase) ||
            (itemDefinition.attributes &&
              itemDefinition.attributes
                .map((attr) => attr.name.toLowerCase())
                .join(' ')
                .includes(searchLowerCase)) ||
            (itemDefinition.category &&
              itemDefinition.category.includes(searchLowerCase)) ||
            itemDefinition.internal.includes(searchLowerCase)
        ),
      ]
    }

    filteredData.sort((a, b) => (a.name > b.name ? 1 : -1))
    setLoading(false)
    setTableData(filteredData)
  }, [search])

  return (
    <List sx={{ width: '100%' }}>
      {tableData.length || loading ? (
        tableData.map((itemDefinition) => (
          <MobileItemDefinitionListItem
            key={itemDefinition.id}
            itemDefinition={itemDefinition.itemDefinitionResponse}
          />
        ))
      ) : (
        <NoResultsText />
      )}
    </List>
  )
}
