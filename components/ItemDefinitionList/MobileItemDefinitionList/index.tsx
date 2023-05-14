import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import React from 'react'
import MobileItemDefinitionListItem from 'components/ItemDefinitionList/MobileItemDefinitionList/MobileItemDefinitionListItem'
import { errors } from 'utils/constants'
import theme from 'utils/theme'

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

    setTableData(filteredData)
  }, [search])

  return (
    <List sx={{ width: '100%' }}>
      {tableData.length ? (
        tableData.map((itemDefinition) => (
          <MobileItemDefinitionListItem
            key={itemDefinition.id}
            itemDefinition={itemDefinition.itemDefinitionResponse}
          />
        ))
      ) : (
        <ListItem divider>
          <ListItemText
            primary={<Typography sx={{ visibility: 'hidden' }}>_</Typography>}
            secondary={
              <Typography
                component="span"
                variant="body2"
                sx={{ display: 'block', mt: theme.spacing(1) }}
              >
                <Stack>
                  <Stack spacing={1}>
                    <Typography>{errors.noResultsFound}</Typography>
                    <Typography sx={{ visibility: 'hidden' }}>_</Typography>
                  </Stack>
                </Stack>
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  )
}
