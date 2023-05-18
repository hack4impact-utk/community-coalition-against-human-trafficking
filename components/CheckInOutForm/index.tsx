import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import React, { useEffect } from 'react'
import {
  ItemDefinitionResponse,
  UserResponse,
  CategoryResponse,
  InventoryItemResponse,
  CheckInOutFormData,
  TextFieldAttributesInternalRepresentation,
  InventoryItemExistingAttributeValuesResponse,
} from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete, {
  AutocompleteAttributeOption,
} from 'components/AttributeAutocomplete'
import {
  separateAttributeResponses,
  SeparatedAttributeResponses,
} from 'utils/attribute'
import { usePrevious } from 'utils/hooks/usePrevious'
import { useSession } from 'next-auth/react'
import urls from 'utils/urls'

interface Props {
  kioskMode: boolean
  users: UserResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  categories: CategoryResponse[]
  inventoryItem?: InventoryItemResponse
  itemDefinition?: ItemDefinitionResponse
  formData: CheckInOutFormData
  setFormData: React.Dispatch<React.SetStateAction<CheckInOutFormData>>
  errors: Record<keyof CheckInOutFormData, string>
}

function blankFormData(): CheckInOutFormData {
  return {
    user: {} as UserResponse,
    date: new Date(),
    category: {} as CategoryResponse,
    itemDefinition: {} as ItemDefinitionResponse,
    attributes: [],
    textFieldAttributes: {} as TextFieldAttributesInternalRepresentation,
    quantityDelta: 0,
  }
}

function updateFormData(
  formData: CheckInOutFormData,
  update: Partial<CheckInOutFormData>
): CheckInOutFormData {
  return {
    ...formData,
    ...update,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultSplitAttrs = separateAttributeResponses()

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  categories,
  inventoryItem,
  itemDefinition,
  formData,
  setFormData,
  errors,
}: Props) {
  const [filteredItemDefinitions, setFilteredItemDefinitions] =
    React.useState<ItemDefinitionResponse[]>(itemDefinitions)
  const [splitAttrs, setSplitAttrs] =
    React.useState<SeparatedAttributeResponses>(
      separateAttributeResponses(inventoryItem?.itemDefinition.attributes)
    )
  const [existingNumAttrVals, setExistingNumAttrVals] =
    React.useState<InventoryItemExistingAttributeValuesResponse[]>()
  const [existingTextAttrVals, setExistingTextAttrVals] =
    React.useState<InventoryItemExistingAttributeValuesResponse[]>()
  const session = useSession()

  const initialFormData: Partial<CheckInOutFormData> = {
    category: inventoryItem?.itemDefinition?.category,
    itemDefinition: inventoryItem?.itemDefinition,
    assignee: inventoryItem?.assignee,
    attributes: inventoryItem?.attributes
      ?.filter((attr) => attr.attribute.possibleValues instanceof Array)
      .map((attr) => ({
        id: attr.attribute._id,
        label: attr.attribute.name,
        value: String(attr.value),
        color: attr.attribute.color,
      })),
    textFieldAttributes: inventoryItem?.attributes?.reduce(
      (acc, attr) =>
        !(attr.attribute.possibleValues instanceof Array)
          ? { ...acc, [attr.attribute._id]: attr.value }
          : acc,
      {} as TextFieldAttributesInternalRepresentation
    ),
  }

  const [aaSelected, setAaSelected] = React.useState<
    AutocompleteAttributeOption[]
  >(initialFormData.attributes || [])

  useEffect(() => {
    setFormData({
      ...blankFormData(),
      ...initialFormData,
    })
  }, [setFormData])

  React.useEffect(() => {
    if (inventoryItem) return // don't update if we're editing an existing item
    setFormData((fd) => {
      return updateFormData(fd, { itemDefinition })
    })
  }, [itemDefinition, inventoryItem])

  useEffect(() => {
    // check if kiosk mode
    if (!kioskMode) {
      setFormData((fd) => {
        return updateFormData(fd, {
          user: session.data?.user as UserResponse,
        })
      })
    }
  }, [kioskMode, session, setFormData])

  const updateTextFieldAttributes = (
    e: string | number,
    attributeId: string
  ) => {
    const attributeValue: string | number = e

    setFormData((formData) =>
      updateFormData(formData, {
        textFieldAttributes: {
          ...formData.textFieldAttributes,
          [attributeId]: attributeValue,
        },
      })
    )
  }
  const prevFormData = usePrevious(formData)

  // if you select an item definition without selecting a category, infer the category
  React.useEffect(() => {
    const onItemDefinitionUpdate = async () => {
      if (formData.itemDefinition) {
        const res = await fetch(
          urls.api.itemDefinitions.attributeValues(formData.itemDefinition._id)
        )
        const resJson = await res.json()
        const existingInventoryItemAttributeValues: InventoryItemExistingAttributeValuesResponse[] =
          resJson.payload

        const numAttrVals: InventoryItemExistingAttributeValuesResponse[] = []
        const textAttrVals: InventoryItemExistingAttributeValuesResponse[] = []

        existingInventoryItemAttributeValues.forEach((attrVal) => {
          if (attrVal.values.length) {
            if (typeof attrVal.values[0] === 'number') {
              numAttrVals.push(attrVal)
            } else {
              textAttrVals.push(attrVal)
            }
          }
        })

        setExistingNumAttrVals(numAttrVals)
        setExistingTextAttrVals(textAttrVals)
      }

      setFormData((formData) =>
        updateFormData(formData, {
          category: formData.itemDefinition?.category,
        })
      )
    }
    onItemDefinitionUpdate()
  }, [formData.itemDefinition, setFormData])

  // Update filtered item defs when category changes
  React.useEffect(() => {
    if (formData.category && !formData.itemDefinition) {
      setFilteredItemDefinitions(
        itemDefinitions.filter((itemDefinition) => {
          if (itemDefinition.category) {
            return itemDefinition.category._id === formData.category?._id
          }
        })
      )
    } else {
      setFilteredItemDefinitions(itemDefinitions)
    }
  }, [formData.category, formData.itemDefinition, itemDefinitions])

  // Update split attributes and attr form data when item definition changes
  React.useEffect(() => {
    if (formData.itemDefinition) {
      setSplitAttrs(
        separateAttributeResponses(formData.itemDefinition.attributes)
      )
    }

    if (
      formData.itemDefinition !== prevFormData?.itemDefinition &&
      prevFormData?.itemDefinition
    ) {
      setAaSelected([])
      setFormData((formData) => {
        const fd = updateFormData(formData, {
          attributes: undefined,
          textFieldAttributes: {},
        })
        return fd
      })
    }
  }, [formData.itemDefinition, prevFormData?.itemDefinition, setFormData])

  React.useEffect(() => {
    if (!formData.itemDefinition) {
      setSplitAttrs(defaultSplitAttrs)
    }
  }, [formData.attributes, formData.textFieldAttributes])

  return (
    <FormControl fullWidth>
      {/* Staff member, Date, and Item input fields */}
      {kioskMode && (
        <Autocomplete
          autoHighlight
          options={users}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Staff Member"
              error={!!errors['user']}
              helperText={errors['user'] ? errors['user'] : ''}
            />
          )}
          getOptionLabel={(user) => user.name}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )
          }}
          onChange={(_e, user) => {
            setFormData((formData) =>
              updateFormData(formData, {
                user: user || undefined,
              })
            )
          }}
        />
      )}
      <Box sx={{ marginTop: 4 }}>
        <DateTimePicker
          label="Date"
          value={formData.date}
          onChange={(date) => {
            setFormData((formData) =>
              updateFormData(formData, {
                date: date ? new Date(date) : undefined,
              })
            )
          }}
          disableFuture
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
      <Autocomplete
        autoHighlight
        options={categories}
        sx={{ marginTop: 4 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Category"
            error={!!errors['category']}
            helperText={errors['category'] ? errors['category'] : ''}
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(_e, category) => {
          setFormData((formData) =>
            updateFormData(formData, {
              category: category || undefined,
            })
          )
        }}
        getOptionLabel={(category) => category.name}
        value={formData.category || null}
        disabled={!!formData.itemDefinition}
      />
      <Autocomplete
        autoHighlight
        options={filteredItemDefinitions}
        sx={{ marginTop: 4 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Item"
            error={!!errors['itemDefinition']}
            helperText={
              errors['itemDefinition'] ? errors['itemDefinition'] : ''
            }
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(_e, itemDefinition) => {
          setFormData((formData) =>
            updateFormData(formData, {
              itemDefinition: itemDefinition || undefined,
            })
          )
        }}
        getOptionLabel={(itemDefinition) => itemDefinition.name}
        value={formData.itemDefinition || null}
      />

      {/* Assignee Autocomplete */}
      {formData.itemDefinition?.internal && (
        <Autocomplete
          options={users}
          sx={{ mt: 4 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assignee"
              error={!!errors['assignee']}
              helperText={errors['assignee'] || ''}
            />
          )}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          getOptionLabel={(user) => user.name}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )
          }}
          onChange={(_e, user) => {
            setFormData((formData) =>
              updateFormData(formData, {
                assignee: user || undefined,
              })
            )
          }}
          value={formData.assignee || null}
        />
      )}

      {/* Attribute Autocomplete */}
      {splitAttrs.list.length > 0 && (
        <AttributeAutocomplete
          attributes={splitAttrs.list}
          sx={{ mt: 4 }}
          onChange={(_e, attributes) => {
            setFormData((formData) =>
              updateFormData(formData, {
                attributes: attributes || undefined,
              })
            )
          }}
          value={aaSelected}
          setValue={setAaSelected}
          error={errors['attributes']}
        />
      )}
      {/* Text Fields */}
      {splitAttrs.text.map((textAttr) => (
        <Autocomplete
          key={textAttr._id}
          options={
            existingTextAttrVals
              ?.find((val) => val._id === textAttr._id)
              ?.values.sort() || []
          }
          sx={{ marginTop: 4 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={textAttr.name}
              error={!!errors['textFieldAttributes']}
              helperText={errors['textFieldAttributes']}
            />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(_e, textAttrVal) => {
            updateTextFieldAttributes(textAttrVal as string, textAttr._id)
          }}
          getOptionLabel={(attrValue) => attrValue as string}
          value={formData.textFieldAttributes?.[textAttr._id] || ''}
          freeSolo
          autoSelect
        />
      ))}

      {/* Number Fields */}
      {splitAttrs.number.map((numAttr) => (
        <Autocomplete
          key={numAttr._id}
          options={
            existingNumAttrVals
              ?.find((val) => val._id === numAttr._id)
              ?.values.sort((v1, v2) => Number(v1) - Number(v2)) || []
          }
          sx={{ marginTop: 4 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={numAttr.name}
              error={!!errors['textFieldAttributes']}
              helperText={errors['textFieldAttributes']}
            />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(_e, numAttrVal) => {
            updateTextFieldAttributes(Number(numAttrVal), numAttr._id)
          }}
          getOptionLabel={(attrValue) => String(attrValue)}
          value={formData.textFieldAttributes?.[numAttr._id] || ''}
          freeSolo
          autoSelect
        />
      ))}

      <QuantityForm
        setQuantity={(quantity) => {
          setFormData((formData) =>
            updateFormData(formData, {
              quantityDelta: quantity,
            })
          )
        }}
        quantity={formData.quantityDelta || 0}
        error={errors['quantityDelta']}
      />
    </FormControl>
  )
}

export default CheckInOutForm
