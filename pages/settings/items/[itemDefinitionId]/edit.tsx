import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  AttributeResponse,
  CategoryResponse,
  ItemDefinitionResponse,
} from 'utils/types'
import UpsertItemForm, {
  ItemDefinitionFormData,
} from 'components/UpsertItemForm'
import { useRouter } from 'next/router'
import { apiWrapper } from 'utils/apiWrappers'
import categoriesHandler from '@api/categories'
import attributesHandler from '@api/attributes'
import { GetServerSidePropsContext } from 'next'
import { LoadingButton } from '@mui/lab'

interface Props {
  categories: CategoryResponse[]
  attributes: AttributeResponse[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: await apiWrapper(categoriesHandler, context),
      attributes: await apiWrapper(attributesHandler, context),
    },
  }
}

export default function ItemDefinitionEditForm({
  categories,
  attributes,
}: Props) {
  const [itemDefintion, setItemDefinition] = useState<ItemDefinitionResponse>()
  const [itemDefinitionFormData, setItemDefinitionFormData] =
    useState<ItemDefinitionFormData>({} as ItemDefinitionFormData)

  const router = useRouter()
  const id = router.query.id
  useEffect(() => {
    async () => {
      if (!id) return
      const res = await fetch(`/api/itemDefinitions/${id}`, { method: 'GET' })
      res.json().then((data) => setItemDefinition(data.payload))
    }
  }, [id])

  const handleSubmit = async (
    itemDefinitionFormData: ItemDefinitionFormData
  ) => {
    await fetch(`/api/itemDefinitions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: id,
        name: itemDefinitionFormData.name,
        category: itemDefinitionFormData.category,
        attributes: itemDefinitionFormData.attributes,
        internal: itemDefinitionFormData.internal,
        lowStockThreshold: itemDefinitionFormData.lowStockThreshold,
        criticalStockThreshold: itemDefinitionFormData.criticalStockThreshold,
      }),
    })

    await router.push('/settings/items')
    router.reload()
  }

  const handleClose = () => router.push('/settings/items')

  return (
    <>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <UpsertItemForm
          categories={categories}
          attributes={attributes}
          itemDefinition={itemDefintion}
          onChange={(itemDefinitionFormData) =>
            setItemDefinitionFormData(itemDefinitionFormData)
          }
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton onClick={() => handleSubmit(itemDefinitionFormData)}>
            Submit
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </>
  )
}
