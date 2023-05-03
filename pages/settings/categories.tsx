import categoriesHandler from '@api/categories'
import CategoryList from 'components/CategoryList'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { CategoryResponse } from 'utils/types'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { categories: await apiWrapper(categoriesHandler, context) },
  }
}

interface CategoriesPageProps {
  categories: CategoryResponse[]
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  return (
    <>
      <h1>Categories</h1>
      <CategoryList categories={categories} search={''} />
    </>
  )
}
