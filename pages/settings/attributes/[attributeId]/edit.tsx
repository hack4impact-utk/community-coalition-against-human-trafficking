import attributeHandler from '@api/attributes/[attributeId]'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import AttributeForm, { AttributeFormData } from 'components/AttributeForm'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { apiWrapper } from 'utils/apiWrappers'
import { DialogProps } from 'utils/constants'
import { AttributeResponse } from 'utils/types'

interface Props {
  attribute: AttributeResponse
}

const getAttribute = async (): Promise<AttributeResponse> => {
  const params = new URLSearchParams(document.location.search)
  const id = params.get('id')
  const response = await fetch(`/api/attributes/${id}`, { method: 'GET' })
  const data = await response.json()
  return data.payload
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { attribute: await apiWrapper(attributeHandler, context) },
  }
}

export default function AttributeEditForm() {
  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  const [attribute, setAttribute] = useState<AttributeResponse>()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    const fetchAttribute = async () => {
      if (!id) return // on page load, id is undefined, resulting in bad requests
      fetch(`/api/attributes/${id}`, { method: 'GET' }).then((response) => {
        response.json().then((data) => {
          setAttribute(data.payload)
        })
      })
    }
    fetchAttribute()
  }, [id])

  // React.useEffect(() => {
  //   getAttribute().then((data) => {
  //     setDialogState({ ...dialogState, attribute: data })
  //   })
  // }, [])

  const handleSubmit = async (
    e: React.SyntheticEvent,
    attributeFormData: AttributeFormData
  ) => {
    await fetch(`/api/attributes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: id,
        name: attributeFormData.name,
        color: attributeFormData.color,
        possibleValues:
          attributeFormData.valueType === 'list'
            ? attributeFormData.listOptions
            : attributeFormData.valueType,
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
