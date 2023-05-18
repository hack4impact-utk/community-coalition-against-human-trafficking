import { useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { CategoryResponse } from 'utils/types'
import DesktopCategoryList from './DesktopCategoryList'
import MobileCategoryList from './MobileCategoryList'

interface CategoryListProps {
  category: CategoryResponse[]
  search: string
}

export default function CategoryList({ search, category }: CategoryListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      {isMobileView ? (
        <MobileCategoryList categories={category} search={search} />
      ) : (
        <DesktopCategoryList categories={category} search={search} />
      )}
    </>
  )
}
