import attributesHandler from '@api/attributes'
import categoriesHandler from '@api/categories'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertItemForm from 'components/UpsertItemForm'
import { useRouter } from 'next/router'
import React from 'react'
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

export default function NewItemPage() {
  const router = useRouter()

  return (
    <>
      <DialogTitle>Create New Item</DialogTitle>
      <DialogContent>
        <UpsertItemForm categories={categories} attributes={attributes} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => router.back()} color="inherit">
          Close
        </Button>
        <Button onClick={() => router.back()}>Submit</Button>
      </DialogActions>
    </>
  )
}
