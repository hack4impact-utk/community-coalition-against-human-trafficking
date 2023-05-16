import { LoadingButton } from '@mui/lab'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertItemForm from 'components/UpsertItemForm'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import {
  AttributeResponse,
  CategoryResponse,
  ItemDefinitionFormData,
  ItemDefinitionResponse,
} from 'utils/types'
import urls from 'utils/urls'

let categories: CategoryResponse[]
let attributes: AttributeResponse[] = [] as AttributeResponse[]
fetch(urls.api.categories.categories, {
  method: 'GET',
}).then((response) => {
  response.json().then((data) => {
    categories = data.payload
  })
})
fetch(urls.api.attributes.attributes, {
  method: 'GET',
}).then((response) => {
  response.json().then((data) => {
    attributes = data.payload
  })
})

export default function ItemDefinitionEditForm() {
  const [itemDefinition, setItemDefinition] = useState<ItemDefinitionResponse>()
  const [itemDefinitionFormData, setItemDefinitionFormData] =
    useState<ItemDefinitionFormData>({} as ItemDefinitionFormData)

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const { id } = router.query
  useEffect(() => {
    const fetchItemDefinition = async () => {
      if (!id) return
      const response = await fetch(
        urls.api.itemDefinitions.itemDefinition(id as string),
        {
          method: 'GET',
        }
      )
      const data = await response.json()
      setItemDefinition(data.payload)
    }
    fetchItemDefinition()
  }, [id])

  const handleSubmit = async (
    itemDefinitionFormData: ItemDefinitionFormData
  ) => {
    if (!itemDefinitionFormData.name) {
      dispatch(
        showSnackbar({
          message: 'You must give the item a name.',
          severity: 'error',
        })
      )
      return
    }

    const response = await fetch(
      urls.api.itemDefinitions.itemDefinition(id as string),
      {
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
      }
    )

    await handleClose()

    const data = await response.json()
    if (data.success) {
      dispatch(
        showSnackbar({
          message: 'Item successfully edited',
          severity: 'success',
        })
      )
    } else {
      dispatch(
        showSnackbar({
          message: data.message,
          severity: 'error',
        })
      )
    }
  }

  const handleClose = async () => {
    await router.push(urls.pages.settings.itemDefinitions)
  }

  return (
    <>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <UpsertItemForm
          itemDefinition={itemDefinition}
          attributes={attributes}
          categories={categories}
          onChange={(itemDefinitionFormData) =>
            setItemDefinitionFormData(itemDefinitionFormData)
          }
          errors={{} as Record<keyof ItemDefinitionFormData, string>}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          onClick={async () => {
            setLoading(true)
            await handleSubmit(itemDefinitionFormData)
            setLoading(false)
          }}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
