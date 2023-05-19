import { useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { CategoryResponse } from 'utils/types'
import CategoryProvider from './CategoryContext'
import DesktopCategoryList from './DesktopCategoryList'
import MobileCategoryList from './MobileCategoryList'

interface CategoryListProps {
  category: CategoryResponse[]
  search: string
}

export default function CategoryList({
  search,
  category: categories,
}: CategoryListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <CategoryProvider initialCategories={categories}>
      {isMobileView ? (
        <MobileCategoryList search={search} />
      ) : (
        <DesktopCategoryList search={search} />
      )}
    </CategoryProvider>
  )
}
