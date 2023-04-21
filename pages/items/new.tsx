import attributesHandler from '@api/attributes'
import categoriesHandler from '@api/categories'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertItemForm, {
  ItemDefinitionFormData,
} from 'components/UpsertItemForm'
import { useRouter } from 'next/router'
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
  backHref?: string
}

export default function NewItemPage({backHref}: Props) {
  const router = useRouter()

  const redirectBack = (queryStr?: string) => {
    if (backHref) {
      router.push(`${backHref}${queryStr}`)
    } else {
      router.reload()

    }
  }

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
        <Button onClick={() => redirectBack()} color="inherit">
          Close
        </Button>
        <Button
          onClick={async () => {
            const itemId = await createItem(itemDefinitionFormData)
            // todo: router.back() will leave the app if a page is accessed by entering the url. figure this out
            redirectBack(`?item=${itemId}`)
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  )
}
