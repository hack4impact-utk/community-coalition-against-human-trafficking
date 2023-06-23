import { LoadingButton } from '@mui/lab'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import { bulkRemoveURLQueryParams } from 'utils/queryParams'
import { InventoryItemResponse, UserResponse } from 'utils/types'
import urls from 'utils/urls'

interface Props {
  refetch: () => Promise<void>
}

export default function AssignItemDialog({ refetch }: Props) {
  const [assignee, setAssignee] = React.useState<UserResponse | undefined>(
    undefined
  )
  const [inventoryItem, setInventoryItem] =
    React.useState<InventoryItemResponse>({} as InventoryItemResponse)
  const [users, setUsers] = React.useState<UserResponse[]>()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query as { id: string }

  const handleClose = async () => {
    await bulkRemoveURLQueryParams(router, ['showDialog', 'id'])
  }

  React.useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(urls.api.users.users, {
        method: 'GET',
      })
      const data = await response.json()
      setUsers(data.payload)
    }
    const getItem = async () => {
      const response = await fetch(urls.api.inventoryItems.inventoryItem(id), {
        method: 'GET',
      })
      const data = await response.json()
      setInventoryItem(data.payload)
    }
    getUsers()
    getItem()
  }, [id])

  React.useEffect(() => {
    if (inventoryItem.assignee) setAssignee(inventoryItem.assignee)
  }, [inventoryItem.assignee])

  const handleSubmit = React.useCallback(async () => {
    const response = await fetch(urls.api.inventoryItems.assign(id), {
      method: 'PUT',
      body: JSON.stringify({
        assignee: assignee?._id,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (data.success) {
      // close dialog
      await handleClose()
      dispatch(
        showSnackbar({
          message: 'Item successfully assigned',
          severity: 'success',
        })
      )
      refetch()
    } else {
      dispatch(
        showSnackbar({
          message: data.message,
          severity: 'error',
        })
      )
    }
  }, [id, assignee])

  return (
    <>
      <DialogTitle>Assign Item</DialogTitle>
      <DialogContent sx={{ overflowY: 'visible' }}>
        <Autocomplete
          options={users || []}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={(_e, newValue) => {
            setAssignee(newValue || undefined)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assignee"
              helperText="Leave field blank to clear assignee"
            />
          )}
          value={assignee || null}
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
            await handleSubmit()
            setLoading(false)
          }}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
