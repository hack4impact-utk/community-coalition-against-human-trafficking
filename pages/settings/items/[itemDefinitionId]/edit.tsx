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
import { LoadingButton } from '@mui/lab'

let categories: CategoryResponse[]
let attributes: AttributeResponse[] = [] as AttributeResponse[]
fetch('http://localhost:3000/api/categories', {
  method: 'GET',
}).then((response) => {
  response.json().then((data) => {
    categories = data.payload
  })
})
fetch('http://localhost:3000/api/attributes', {
  method: 'GET',
}).then((response) => {
  response.json().then((data) => {
    attributes = data.payload
  })
})

export default function ItemDefinitionEditForm() {
  const [itemDefintion, setItemDefinition] = useState<ItemDefinitionResponse>()
  const [itemDefinitionFormData, setItemDefinitionFormData] =
    useState<ItemDefinitionFormData>({} as ItemDefinitionFormData)

  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    const fetchItemDefinition = async () => {
      if (!id) return
      const res = await fetch(`/api/itemDefinitions/${id}`, { method: 'GET' })
      res.json().then((data) => setItemDefinition(data.payload))
    }
    fetchItemDefinition()
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
