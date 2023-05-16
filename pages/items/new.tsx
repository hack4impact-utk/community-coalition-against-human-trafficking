import { LoadingButton } from '@mui/lab'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertItemForm from 'components/UpsertItemForm'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'
import { useAppDispatch } from 'store'
import { showSnackbar } from 'store/snackbar'
import { itemDefinitionFormDataToItemDefinitionRequest } from 'utils/transformations'
import transformZodErrors from 'utils/transformZodErrors'
import {
  AttributeResponse,
  CategoryResponse,
  ItemDefinitionFormData,
  itemDefinitionFormSchema,
} from 'utils/types'
import urls from 'utils/urls'

let itemDefinitionFormData: ItemDefinitionFormData

interface Props {
  redirectBack: (router: NextRouter, itemId?: string) => Promise<void>
}

export default function NewItemPage({ redirectBack }: Props) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<CategoryResponse[]>([])
  const [attributes, setAttributes] = React.useState<AttributeResponse[]>([])
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const dispatch = useAppDispatch()

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

  const createItem = React.useCallback(
    async (formData: ItemDefinitionFormData) => {
      const zodResult = itemDefinitionFormSchema.safeParse(formData)
      if (!zodResult.success) {
        setErrors(transformZodErrors(zodResult.error))
        return
      }
      setLoading(true)
      const itemDefReq = itemDefinitionFormDataToItemDefinitionRequest(formData)

      const response = await fetch(urls.api.itemDefinitions.itemDefinitions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemDefReq),
      })

      const data = await response.json()
      await redirectBack(router, data.payload)
      setLoading(false)
      // @ts-ignore
      dispatch(
        showSnackbar({
          message: 'Item successfully created.',
          severity: 'success',
        })
      )
    },
    [router, redirectBack, setLoading, dispatch]
  )

  return (
    <>
      <DialogTitle>Create New Item</DialogTitle>
      <DialogContent>
        <UpsertItemForm
          categories={categories}
          attributes={attributes}
          onChange={(formData) => {
            itemDefinitionFormData = formData
          }}
          errors={errors}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => redirectBack(router)} color="inherit">
          Close
        </Button>
        <LoadingButton
          onClick={() => {
            createItem(itemDefinitionFormData)
          }}
          loading={loading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
