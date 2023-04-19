import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  Unstable_Grid2 as Grid2,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AttributeResponse, CategoryResponse } from 'utils/types'
import React from 'react'
import { attributeFormDataToAttributeRequest } from 'utils/transformations'
import UpsertAttributeForm, {
  AttributeFormData,
} from 'components/UpsertAttributeForm'

interface Props {
  categories: CategoryResponse[]
  attributes: AttributeResponse[]
  onChange: (formData: ItemDefinitionFormData) => void
}

export interface ItemDefinitionFormData {
  category: CategoryResponse
  internal: boolean
  name: string
  attributes: AttributeResponse[]
  lowStockThreshold: number
  criticalStockThreshold: number
}

export default function UpsertItemForm({
  categories,
  attributes,
  onChange,
}: Props) {
  const [showAttributeForm, setShowAttributeForm] = React.useState(false)
  const [attrFormData, setAttrFormData] = React.useState(
    {} as AttributeFormData
  )
  const [formData, setFormData] = React.useState({
    internal: false,
  } as ItemDefinitionFormData)

  // this is here to support adding newly created attributes to the create new item form attributes list options after they are created
  const [proxyAttributes, setProxyAttributes] = React.useState(attributes)

  const createNewAttribute = async (fd: AttributeFormData) => {
    // TODO better way of coding URLs
    const attrReq = attributeFormDataToAttributeRequest(fd)
    const response = await fetch(`http://localhost:3000/api/attributes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attrReq),
    })
    const data = await response.json()

    // creates AttributeResponse object that can be used in the form
    const newAttr: AttributeResponse = {
      ...attrReq,
      _id: data.payload,
    }

    setFormData((fd) => {
      return {
        ...fd,
        attributes: [...(fd.attributes ?? []), newAttr],
      }
    })
    setProxyAttributes((pa) => {
      return [...pa, newAttr]
    })
  }

  React.useEffect(() => {
    onChange(formData)
  }, [formData, onChange])

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Category" />}
        sx={{ marginTop: 4 }}
        onChange={(_e, val) => {
          setFormData((fd) => ({
            ...fd,
            category: val as CategoryResponse,
          }))
        }}
      />

      <FormControlLabel
        control={<Checkbox checked={!formData.internal} />}
        label="Check out to clients?"
        sx={{ marginTop: 4 }}
        onChange={(_e, val) => {
          setFormData((fd) => ({
            ...fd,
            internal: !val,
          }))
        }}
      />

      <TextField
        label="Item Name"
        variant="outlined"
        sx={{ marginTop: 4 }}
        onChange={(e) => {
          setFormData((fd) => ({
            ...fd,
            name: e.target.value,
          }))
        }}
      />

      {/* Attribute Autocomplete and Create Attribute Button */}
      <Box
        sx={{
          display: 'flex',
          alignSelf: 'flex-start',
          marginTop: 4,
          width: '100%',
        }}
      >
        <Autocomplete
          multiple
          options={proxyAttributes}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Attributes" />}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option.name}
                style={{ backgroundColor: option.color }}
                {...getTagProps({ index })}
                key={option._id}
              />
            ))
          }
          value={formData.attributes || []}
          onChange={(_e, val) => {
            setFormData((fd) => ({
              ...fd,
              attributes: val,
            }))
          }}
          sx={{ marginRight: 2, alignSelf: 'center' }}
          fullWidth
        />
        <IconButton
          onClick={() => {
            setShowAttributeForm(true)
          }}
          size="large"
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      {showAttributeForm && (
        <Box
          sx={{
            width: '80%',
            mt: 4,
          }}
        >
          <UpsertAttributeForm
            onChange={(attrFD) => {
              setAttrFormData(attrFD)
            }}
          >
            <Grid2
              xs={12}
              sx={{ mt: 2 }}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setShowAttributeForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  createNewAttribute(attrFormData)
                  setShowAttributeForm(false)
                }}
              >
                Add Attribute
              </Button>
            </Grid2>
          </UpsertAttributeForm>
        </Box>
      )}

      {/* Low Stock Threshold Prompt */}
      <Box sx={{ display: 'flex', alignSelf: 'flex-start', marginTop: 4 }}>
        <Typography
          variant="body1"
          sx={{ marginRight: 2, alignSelf: 'center' }}
        >
          Display warning on dashboard when quantity drops below
        </Typography>
        <TextField
          sx={{
            width: 76,
            marginRight: 1.5,
          }}
          onChange={(e) => {
            const num = Number(e.target.value) < 0 ? 0 : Number(e.target.value)
            setFormData((fd) => ({
              ...fd,
              lowStockThreshold: num,
            }))
          }}
          type="number"
          InputProps={{
            inputProps: { min: 1, style: { textAlign: 'center' } },
          }}
        />
      </Box>

      {/* Critical Stock Threshold Prompt */}
      <Box sx={{ display: 'flex', alignSelf: 'flex-start', marginTop: 4 }}>
        <Typography
          variant="body1"
          sx={{ marginRight: 2, alignSelf: 'center' }}
        >
          Send email notification when quantity drops below
        </Typography>
        <TextField
          sx={{
            width: 76,
            marginRight: 1.5,
          }}
          onChange={(e) => {
            const num = Number(e.target.value) < 0 ? 0 : Number(e.target.value)
            setFormData((fd) => ({
              ...fd,
              criticalStockThreshold: num,
            }))
          }}
          type="number"
          InputProps={{
            inputProps: { min: 1, style: { textAlign: 'center' } },
          }}
        />
      </Box>
    </FormControl>
  )
}
