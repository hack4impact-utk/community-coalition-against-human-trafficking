import attributeHandler from '@api/attributes/[attributeId]'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import AttributeForm, { AttributeFormData } from 'components/AttributeForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AttributeResponse } from 'utils/types'

export default function AttributeEditForm() {
  const router = useRouter()
  const { attributeId } = router.query
  const [attribute, setAttribute] = useState<AttributeResponse>()

  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  useEffect(() => {
    const fetchAttribute = async () => {
      if (!attributeId) return // on page load, attributeId is undefined, resulting in bad requests
      await fetch(`/api/attributes/${attributeId}`, { method: 'GET' }).then(
        (response) => {
          response.json().then((data) => {
            setAttribute(data.payload)
          })
        }
      )
    }

    fetchAttribute()
  }, [attributeId])

  const handleSubmit = async (
    e: React.SyntheticEvent,
    attributeFormData: AttributeFormData
  ) => {
    await fetch(`/api/attributes/${attributeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: attributeId,
        name: attributeFormData.name,
        color: attributeFormData.color,
        possibleValues: attributeFormData.valueType === "list" ? attributeFormData.listOptions : attributeFormData.valueType
      }),
      // router.back(), uncomment when done testing
    })
  }
  return (
    <>
      <DialogTitle>Create New Attribute</DialogTitle>
      <DialogContent>
        <AttributeForm
          attribute={attribute}
          onSubmit={handleSubmit}
          submitBtnText="Update Attribute"
        />
      </DialogContent>
    </>
  )
}
