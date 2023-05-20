import { ItemDefinitionResponse } from 'utils/types'
import { useMediaQuery } from '@mui/material'
import theme from 'utils/theme'
import DesktopItemDefinitionList from 'components/ItemDefinitionList/DesktopItemDefinitionList'
import MobileItemDefinitionList from 'components/ItemDefinitionList/MobileItemDefinitionList'
import ItemDefinitionProvider from './ItemDefintionContext'

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

export default function ItemDefinitionList({ itemDefinitions, search }: Props) {
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <ItemDefinitionProvider initialItemDefinitions={itemDefinitions}>
      {isMobileView ? (
        <MobileItemDefinitionList search={search} />
      ) : (
        <DesktopItemDefinitionList search={search} />
      )}
    </ItemDefinitionProvider>
  )
}
