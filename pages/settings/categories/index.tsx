import categoriesHandler from '@api/categories'
import { Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Grid2 from '@mui/material/Unstable_Grid2'
import CategoryList from 'components/CategoryList'
import DialogLink from 'components/DialogLink'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { CategoryResponse } from 'utils/types'
import RoutableDialog from 'components/RoutableDialog'
import CategoryEditForm from './[categoryId]/edit'
import CategoryCreateForm from './create'
import { useRouter } from 'next/router'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { categories: await apiWrapper(categoriesHandler, context) },
  }
}

interface CategoriesPageProps {
  categories: CategoryResponse[]
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const router = useRouter()
  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1, px: 2 }} gap={2}>
        <Grid2 xs={12} container direction={'row'}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Categories
          </Typography>
          <Grid2 ml="auto" mr={6}>
            <DialogLink href="/settings/categories/create">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ width: '100%' }}
              >
                Create New Category
              </Button>
            </DialogLink>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} md={5} lg={4} sx={{ px: 2 }}>
          <SearchField />
        </Grid2>
        <CategoryList
          categories={categories}
          search={router.query.search as string}
        />
      </Grid2>

      <RoutableDialog name="editCategory">
        <CategoryEditForm />
      </RoutableDialog>
      <RoutableDialog name="createCategory">
        <CategoryCreateForm />
      </RoutableDialog>
    </>
  )
}
