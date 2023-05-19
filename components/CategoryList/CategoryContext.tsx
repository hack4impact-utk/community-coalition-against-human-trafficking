import React from 'react'
import { createContext } from 'react'
import { CategoryResponse } from 'utils/types'

export type CategoryContextType = {
  categories: CategoryResponse[]
  deleteCategory: (id: string) => void
  setcategories: (categories: CategoryResponse[]) => void
}

export const CategoryContext = createContext<CategoryContextType | null>(null)

type CategoryProviderProps = {
  initialCategories: CategoryResponse[]
  children: React.ReactNode
}

const CategoryProvider = ({
  initialCategories,
  children,
}: CategoryProviderProps) => {
  const [categories, setcategories] =
    React.useState<CategoryResponse[]>(initialCategories)

  React.useEffect(() => {
    setcategories(initialCategories)
  }, [initialCategories])

  const deleteCategory = (id: string) => {
    setcategories((attrs) => attrs.filter((attr) => attr._id !== id))
  }

  return (
    <CategoryContext.Provider
      value={{ categories, deleteCategory, setcategories }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
