import { ItemDefinitionResponse } from 'utils/types'
import { useMediaQuery } from '@mui/material'
import theme from 'utils/theme'
import dynamic from 'next/dynamic'

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

export default function ItemDefinitionList({ itemDefinitions, search }: Props) {
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const Mobile = dynamic(
    () => import('components/ItemDefinitionList/MobileItemDefinitionList')
  )
  const Desktop = dynamic(
    () => import('components/ItemDefinitionList/DesktopItemDefinitionList')
  )

  return (
    <>
      {isMobileView ? (
        <Mobile itemDefinitions={itemDefinitions} search={search} />
      ) : (
        <Desktop itemDefinitions={itemDefinitions} search={search} />
      )}
    </>
  )
}
