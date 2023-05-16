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
import {
  attributeFormSchema,
  AttributeResponse,
  CategoryResponse,
  ItemDefinitionFormData,
  ItemDefinitionResponse,
  AttributeFormData,
} from 'utils/types'
import React from 'react'
import { attributeFormDataToAttributeRequest } from 'utils/transformations'
import UpsertAttributeForm from 'components/UpsertAttributeForm'
import getContrastYIQ from 'utils/getContrastYIQ'
import theme from 'utils/theme'
import transformZodErrors from 'utils/transformZodErrors'

interface Props {
  itemDefinition?: ItemDefinitionResponse
  categories: CategoryResponse[]
  attributes: AttributeResponse[]
  onChange: (formData: ItemDefinitionFormData) => void
  errors: Record<keyof ItemDefinitionFormData, string>
}

function transformItemDefinitionToFormData(
  item?: ItemDefinitionResponse
): ItemDefinitionFormData {
  return item
    ? ({
        name: item.name,
        category: item.category ? item.category : undefined,
        attributes: item.attributes ? item.attributes : undefined,
        internal: item.internal,
        lowStockThreshold: item.lowStockThreshold,
        criticalStockThreshold: item.criticalStockThreshold,
      } as ItemDefinitionFormData)
    : ({
        name: '',
        category: undefined,
        attributes: [],
        internal: false,
        lowStockThreshold: 0,
        criticalStockThreshold: 0,
      } as ItemDefinitionFormData)
}

export default function UpsertItemForm({
  itemDefinition,
  categories,
  attributes,
  onChange,
  errors,
}: Props) {
  const [showAttributeForm, setShowAttributeForm] = React.useState(false)
  const [attributeErrors, setAttributeErrors] = React.useState<
    Record<keyof AttributeFormData, string>
  >({} as Record<keyof AttributeFormData, string>)
  const [attrFormData, setAttrFormData] = React.useState(
    {} as AttributeFormData
  )
  const [formData, setFormData] = React.useState<ItemDefinitionFormData>(
    transformItemDefinitionToFormData(itemDefinition)
  )

  React.useEffect(() => {
    setFormData(transformItemDefinitionToFormData(itemDefinition))
  }, [itemDefinition])

  // this is here to support adding newly created attributes to the create new item form attributes list options after they are created
  const [proxyAttributes, setProxyAttributes] = React.useState(attributes)

  React.useEffect(() => {
    setProxyAttributes(attributes)
  }, [attributes])

  const createNewAttribute = async (fd: AttributeFormData) => {
    // TODO better way of coding URLs
    const zodResult = attributeFormSchema.safeParse(fd)
    if (!zodResult.success) {
      setAttributeErrors(transformZodErrors(zodResult.error))
      return
    }

    const attrReq = attributeFormDataToAttributeRequest(fd)
    const response = await fetch(`/api/attributes`, {
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
    setShowAttributeForm(false)
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
        value={formData.category}
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
        value={formData.internal}
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
        value={formData.name}
        error={!!errors.name}
        helperText={errors.name}
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
                style={{
                  backgroundColor: option.color,
                  color: getContrastYIQ(option.color),
                }}
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
            errors={attributeErrors}
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
          value={formData.lowStockThreshold}
          error={!!errors['lowStockThreshold']}
        />
      </Box>
      {errors['lowStockThreshold'] && (
        <Typography variant="caption" color={theme.palette.error.main}>
          {errors['lowStockThreshold']}
        </Typography>
      )}

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
          value={formData.criticalStockThreshold}
          error={
            !!errors['criticalStockThreshold'] || !!errors['lowStockThreshold']
          }
        />
      </Box>
      {errors['criticalStockThreshold'] && (
        <Typography variant="caption" color={theme.palette.error.main}>
          {errors['criticalStockThreshold']}
        </Typography>
      )}
    </FormControl>
  )
}
