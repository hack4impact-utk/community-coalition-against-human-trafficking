import { ItemDefinitionResponse } from 'utils/types'
import { useMediaQuery } from '@mui/material'
import theme from 'utils/theme'
import DesktopItemDefinitionList from 'components/ItemDefinitionList/DesktopItemDefinitionList'

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

export default function ItemDefinitionList({ itemDefinitions, search }: Props) {
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      {isMobileView ? (
        <p>temp</p>
      ) : (
        <DesktopItemDefinitionList
          itemDefinitions={itemDefinitions}
          search={search}
        />
      )}
    </>
  )
}
