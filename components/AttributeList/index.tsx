import { useMediaQuery, useTheme } from '@mui/material'
import { AttributeResponse } from 'utils/types'
import DesktopAttributeList from './DesktopAttributeList'
import MobileAttributeList from './MobileAttributeList'

interface AttributeListProps {
  attributes: AttributeResponse[]
  search: string
}

export default function AttributeList(props: AttributeListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      {isMobileView ? (
        <MobileAttributeList {...props} />
      ) : (
        <DesktopAttributeList {...props} />
      )}
    </>
  )
}
