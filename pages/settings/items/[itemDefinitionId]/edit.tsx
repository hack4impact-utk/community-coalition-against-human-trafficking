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
  itemDefinitionFormSchema,
} from 'utils/types'
import urls from 'utils/urls'
import transformZodErrors from 'utils/transformZodErrors'

export default function ItemDefinitionEditForm() {
  const [itemDefinition, setItemDefinition] = useState<ItemDefinitionResponse>()
  const [categories, setCategories] = React.useState<CategoryResponse[]>([])
  const [attributes, setAttributes] = React.useState<AttributeResponse[]>([])
  const [itemDefinitionFormData, setItemDefinitionFormData] =
    useState<ItemDefinitionFormData>({} as ItemDefinitionFormData)
  const [errors, setErrors] = useState<
    Record<keyof ItemDefinitionFormData, string>
  >({} as Record<keyof ItemDefinitionFormData, string>)

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await fetch(urls.api.categories.categories, {
        method: 'GET',
      })
      const data = await response.json()
      setCategories(data.payload)
    }
    const getAttributes = async () => {
      const response = await fetch(urls.api.attributes.attributes, {
        method: 'GET',
      })
      const data = await response.json()
      setAttributes(data.payload)
    }

    getCategories()
    getAttributes()
  }, [])

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
    const zodResponse = itemDefinitionFormSchema.safeParse(
      itemDefinitionFormData
    )
    if (!zodResponse.success) {
      setErrors(transformZodErrors(zodResponse.error))
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
          category: itemDefinitionFormData.category?._id,
          attributes: itemDefinitionFormData.attributes?.map(
            (attribute) => attribute._id
          ),
          internal: itemDefinitionFormData.internal,
          lowStockThreshold: itemDefinitionFormData.lowStockThreshold,
          criticalStockThreshold: itemDefinitionFormData.criticalStockThreshold,
        }),
      }
    )

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
    await handleClose()
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
          errors={errors as Record<keyof ItemDefinitionFormData, string>}
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
