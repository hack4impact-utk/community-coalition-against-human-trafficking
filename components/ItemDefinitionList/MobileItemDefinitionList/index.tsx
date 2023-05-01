import { List } from '@mui/material'
import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import React from 'react'
import MobileItemDefinitionListItem from 'components/ItemDefinitionList/MobileItemDefinitionList/MobileItemDefinitionListItem'

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

  React.useEffect(() => {
    let filteredData = itemDefinitions.map(
      (itemDefinition) =>
        ({
          id: itemDefinition._id,
          name: itemDefinition.name,
          attributes: itemDefinition.attributes,
          category: itemDefinition.category?.name,
          internal: itemDefinition.internal ? 'Staff' : 'Clients',
          itemDefinitionResponse: itemDefinition,
        } as SearchableData)
    )

    if (search) {
      const searchLowerCase = search.toLowerCase()
      filteredData = [
        ...filteredData.filter(
          (itemDefinition) =>
            itemDefinition.name.toLowerCase().includes(searchLowerCase) ||
            (itemDefinition.attributes &&
              itemDefinition.attributes
                .map((attr) => attr.name.toLowerCase())
                .join(' ')
                .includes(searchLowerCase)) ||
            (itemDefinition.category &&
              itemDefinition.category
                .toLowerCase()
                .includes(searchLowerCase)) ||
            itemDefinition.internal.toLowerCase().includes(searchLowerCase)
        ),
      ]
    }

    setTableData(filteredData)
  }, [search])

  return (
    <List sx={{ width: '100%' }}>
      {tableData.map((itemDefinition) => (
        <MobileItemDefinitionListItem
          itemDefinition={itemDefinition.itemDefinitionResponse}
        />
      ))}
    </List>
  )
}
