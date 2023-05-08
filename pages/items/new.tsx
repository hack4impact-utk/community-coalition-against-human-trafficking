import { LoadingButton } from '@mui/lab'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertItemForm, {
  ItemDefinitionFormData,
} from 'components/UpsertItemForm'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'
import { itemDefinitionFormDataToItemDefinitionRequest } from 'utils/transformations'
import { AttributeResponse, CategoryResponse } from 'utils/types'
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

let itemDefinitionFormData: ItemDefinitionFormData

async function createItem(formData: ItemDefinitionFormData) {
  const itemDefReq = itemDefinitionFormDataToItemDefinitionRequest(formData)

  const response = await fetch('http://localhost:3000/api/itemDefinitions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemDefReq),
  })

  const data = await response.json()

  return data.payload
}

interface Props {
  redirectBack: (router: NextRouter, itemId?: string) => void
}

export default function NewItemPage({ redirectBack }: Props) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => redirectBack(router)} color="inherit">
          Close
        </Button>
        <LoadingButton
          onClick={async () => {
            setLoading(true)
            const itemId = await createItem(itemDefinitionFormData)
            setLoading(false)

            // todo: router.back() will leave the app if a page is accessed by entering the url. figure this out
            redirectBack(router, itemId)
          }}
          loading={loading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
