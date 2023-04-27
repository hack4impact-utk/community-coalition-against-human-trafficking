import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { ItemDefinitionResponse } from "utils/types"
import ItemDefinitionListItem from "components/ItemDefinitionList/ItemDefinitionListItem"

function ItemDefinitionListHeader() {
  interface HeaderCellData {
    key: string,
    labels: string[]
  }

  const headerCells: HeaderCellData[] = [
    {
      key: 'name',
      labels: ['Name']
    },
    {
      key: 'item attributes',
      labels: ['Item Attributes']
    },
    {
      key: 'category',
      labels: ['Category']
    },
    {
      key: 'internal',
      labels: ['Consumer']
    },
    {
      key: 'threshold',
      labels: ['Low quantity', 'Critically low quantity']
    }
  ]

  return (
    <TableHead>
      <TableRow>
        {headerCells.map(headerCell => (
          <TableCell key={headerCell.key}>
            <Stack direction='column'>
              {headerCell.labels.map((label, index) => (
                <Typography key={index} variant='body2' fontWeight='bold'>{label}</Typography>
              ))}
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface Props {
  itemDefinitions: ItemDefinitionResponse[],
  search: string
}

export default function ItemDefinitionList({ itemDefinitions, search }: Props) {
  let searchableData = itemDefinitions.map(itemDefinition => (
    {
      id: itemDefinition._id,
      name: itemDefinition.name,
      attributes: itemDefinition.attributes,
      category: itemDefinition.category?.name,
      internal: itemDefinition.internal ? 'Staff' : 'Client',
      itemDefinitionResponse: itemDefinition
    }
  ))

  if (search) {
    const _search = search.toLowerCase()
    searchableData = [
      ...searchableData.filter((itemDefinition) => (
        itemDefinition.name.toLowerCase().includes(_search)
        || (itemDefinition.attributes 
          && itemDefinition.attributes.join(' ').includes(_search))
        || (itemDefinition.category 
          && itemDefinition.category.toLowerCase().includes(_search))
        || itemDefinition.internal.toLowerCase().includes(_search)
      ))
    ]
  }

  return (
    <Box width={'100%'}>
      <TableContainer>
        <Table>
          <ItemDefinitionListHeader/>
          <TableBody>
            {
              searchableData
              && searchableData.map(itemDefinition => (
                <ItemDefinitionListItem
                  itemDefinition={itemDefinition.itemDefinitionResponse}
                />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}