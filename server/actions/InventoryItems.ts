import InventoryItemSchema from 'server/models/InventoryItem'
import AppConfigSchema from 'server/models/AppConfig'
import * as MongoDriver from 'server/actions/MongoDriver'
import {
  InventoryItem,
  InventoryItemPostRequest,
  InventoryItemPutRequest,
  InventoryItemResponse,
} from 'utils/types'
import { ApiError } from 'utils/types'
import { apiInventoryItemValidation } from 'utils/apiValidators'
import { PipelineStage } from 'mongoose'
import { errors } from 'utils/constants/errors'
import deepCopy from 'utils/deepCopy'
import { createTransport } from 'nodemailer'
import { constructQueryString } from 'utils/constructQueryString'
import urls from 'utils/urls'

// aggregate pipeline does the following:
// looks up itemDefinition _id in inventoryItem
// looks up categroy _id in itemDefinition
// looks up attribute _ids in itemDefinition
// looks up attribte _ids in inventoryItem
// looks up user _ids in inventoryItem
function requestPipeline(lowStockOnly: boolean): PipelineStage[] {
  const itemDefinitionPipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'itemDefinitions',
        let: { itemDefinitions: '$itemDefinitions' },
        pipeline: [
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $lookup: {
              from: 'attributes',
              localField: 'attributes',
              foreignField: '_id',
              as: 'attributes',
            },
          },
          {
            $set: {
              category: { $arrayElemAt: ['$category', 0] },
            },
          },
        ],
        localField: 'itemDefinition',
        foreignField: '_id',
        as: 'itemDefinition',
      },
    },
    // itemDefinition was being returned as an array, so extract it from the array
    {
      $set: {
        itemDefinition: { $arrayElemAt: ['$itemDefinition', 0] },
      },
    },
  ]
  if (lowStockOnly)
    itemDefinitionPipeline.push({
      $match: {
        $expr: {
          $lt: ['$quantity', '$itemDefinition.lowStockThreshold'],
        },
      },
    })

  return [
    ...itemDefinitionPipeline,

    // creates a temporary array of attribute documents called 'attributeDocs' containing all relevant attribute documents
    {
      $lookup: {
        from: 'attributes',
        localField: 'attributes.attribute',
        foreignField: '_id',
        as: 'attributeDocs',
      },
    },
    // the above lookup only gets the attribute docs from the 'attributes' collection.
    // It does not generate the inventoryItem attribute/value pairs.
    {
      $addFields: {
        // builds out the inventoryItem.attributes array from scratch
        attributes: {
          // for every attribute in inventoryItem.attributes object, create an attribute/value pair
          $map: {
            input: '$attributes',
            as: 'attr', // attribute from the inventoryItem.attributes array
            in: {
              attribute: {
                // find the corresponding document from the attributes collection with the same _id
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$attributeDocs',
                      as: 'doc', // document from the attributes collection
                      cond: { $eq: ['$$doc._id', '$$attr.attribute'] },
                    },
                  },
                  0,
                ],
              },
              // set the inventoryItem.attributes[i].value to its original value
              value: '$$attr.value',
            },
          },
        },
      },
    },
    // delete the temporary array of attribute documents
    {
      $project: {
        attributeDocs: 0,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignee',
        foreignField: '_id',
        as: 'assignee',
      },
    },
    {
      $set: {
        assignee: { $arrayElemAt: ['$assignee', 0] },
      },
    },
  ]
}

function softDeleteRequestPipeline(lowStockOnly: boolean): PipelineStage[] {
  return [
    ...requestPipeline(lowStockOnly),
    {
      $match: {
        softDelete: { $exists: false },
      },
    },
  ]
}

function searchAggregate(search: string): PipelineStage[] {
  return [
    // pull each attributes.attribute out of the array into its own document
    {
      $unwind: {
        path: '$attributes',
        preserveNullAndEmptyArrays: true,
      },
    },

    // create a new field as "attributeSearch": `${attributeName}: ${attributeValue}`
    {
      $set: {
        attributeSearch: {
          $concat: [
            '$attributes.attribute.name',
            ': ',
            { $toString: '$attributes.value' },
          ],
        },
      },
    },

    // recombine the documents from the unwind (most fields remain untouched),
    // adding the attributeSearch values as an array
    {
      $group: {
        _id: '$_id',
        itemDefinition: { $first: '$itemDefinition' },
        attributes: { $addToSet: '$attributes' },
        quantity: { $first: '$quantity' },
        attributeSearch: { $addToSet: '$attributeSearch' },
        assignee: { $first: '$assignee' },
      },
    },

    {
      $match: {
        $or: [
          { 'itemDefinition.name': { $regex: search, $options: 'i' } },
          {
            'itemDefinition.category.name': {
              $regex: search,
              $options: 'i',
            },
          },
          { 'assignee.name': { $regex: search, $options: 'i' } },
          { attributeSearch: { $regex: search, $options: 'i' } },
        ],
      },
    },

    // removes the attributeSearch array
    {
      $unset: 'attributeSearch',
    },
  ]
}

function categorySearchAggregate(category: string): PipelineStage {
  return {
    $match: {
      'itemDefinition.category.name': category,
    },
  }
}

/**
 * Finds all inventoryItems that do not have the softDelete flag
 * @returns All inventoryItems that do not have the softDelete flag
 */
export async function getInventoryItems() {
  return await MongoDriver.getEntities(
    InventoryItemSchema,
    softDeleteRequestPipeline(false)
  )
}

/**
 * Filter and sort inventory items by params and return the filtered inventory items
 * @param orderBy The string to sort the inventory item by
 * @param order The order to sort the inventory items by
 * @param search The string to search the inventory items by
 * @param categorySearch The string to search the inventory items by category
 * @returns Filtered inventory items
 */
export async function getFilteredInventoryItems(
  orderBy: string,
  order: string,
  search?: string,
  categorySearch?: string,
  lowStockOnly = false
) {
  let pipeline = [...softDeleteRequestPipeline(lowStockOnly)]
  if (search) {
    pipeline = pipeline.concat(searchAggregate(search))
  }
  if (categorySearch) {
    pipeline.push(categorySearchAggregate(categorySearch))
  }

  pipeline.push({
    $sort: {
      [orderBy]: order === 'asc' ? 1 : -1,
    },
  })

  return await MongoDriver.getEntities(InventoryItemSchema, pipeline)
}

/**
 * Finds inventory items for the current page with the given page size and sorting
 * @param page The current page to get
 * @param pageSize The number of inventory items to get per page
 * @param orderBy The string to sort the inventory items by
 * @param order The order to sort the inventory items by
 * @param search The string to search the inventory items by
 * @param categorySearch The string to search the inventory items by category
 * @returns The inventory items for the current page
 */
export async function getPaginatedInventoryItems(
  page: number,
  limit: number,
  orderBy: string,
  order: string,
  search?: string,
  categorySearch?: string,
  lowStockOnly = false
) {
  const filteredItems = await getFilteredInventoryItems(
    orderBy,
    order,
    search,
    categorySearch,
    lowStockOnly
  )
  const startIndex = page * limit
  const endIndex = page * limit + limit
  const items = filteredItems.slice(startIndex, endIndex)
  return {
    data: items,
    total: filteredItems.length,
  }
}

/**
 * Finds an itemDefinition by its id
 * @id The id of the InventoryItem object to find
 * @returns The InventoryItem with the given _id
 */
export async function getInventoryItem(id: string) {
  return await MongoDriver.getEntity(
    InventoryItemSchema,
    id,
    requestPipeline(false)
  )
}

/**
 * Checks to see if an item is in the inventory and will add to the quantity or
 * create the item if needed.
 * @param item the item that will be added (checkedIn) to db
 * @param quantity of item to add
 */
export async function checkInInventoryItem(
  item: Partial<InventoryItem>,
  itemQuantity: number
) {
  if (itemQuantity < 1) {
    throw new ApiError(400, 'Check in quantity should be greater than 0')
  }
  item.attributes?.sort((a, b) => (a.attribute > b.attribute ? 1 : -1))

  let res

  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity += itemQuantity
    item = deepCopy(itemMatches[0])
    apiInventoryItemValidation(item, 'PUT')
    res = await MongoDriver.updateEntity(
      InventoryItemSchema,
      item._id as string,
      item as InventoryItemPutRequest
    )
  } else {
    item.quantity = itemQuantity
    apiInventoryItemValidation(item, 'POST')
    res = await MongoDriver.createEntity(
      InventoryItemSchema,
      item as InventoryItemPostRequest
    )
  }
  return res._id
}

/**
 * Checks to see if an item is in the inventory and will remove an amount or
 * 400 error if it does not exist.
 * @param item the item that will be removed (checkOut) from db
 * @param quantity of item to remove
 * @throws ApiError: 400 when checking out an item would result a negative quantity in the db
 * @throws ApiError: 404 when attempting to check out an item that is not in the db
 */
export async function checkOutInventoryItem(
  item: Partial<InventoryItem>,
  quantityRemoved: number
) {
  item.attributes?.sort((a, b) => (a.attribute > b.attribute ? 1 : -1))
  if (quantityRemoved < 1) {
    throw new ApiError(400, 'Check out quantity should be greater than 0')
  }

  let res

  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity -= quantityRemoved
    item = deepCopy(itemMatches[0])
    if (item.quantity! < 0) {
      throw new ApiError(400, 'Check out would result in negative quantity.')
    } else {
      item = deepCopy(itemMatches[0])
      apiInventoryItemValidation(item, 'PUT')
      res = await MongoDriver.updateEntity(
        InventoryItemSchema,
        item._id as string,
        item as InventoryItemPutRequest
      )
    }
    return res._id
  } else {
    throw new ApiError(404, errors.notFound)
  }
}

/**
 * Sends an email to everyone in the email list. The email contains
 * 1. what item needs to be stocked due to critically low status
 * 2. what the critically low stock threshold is
 * 3. what is the quantity of the item is now
 * 4. the category of the critically low stock item
 * 5. The assignee of the critically low stock item
 * @param inventoryItem the item in the inventory that is of critically low stock
 */

export async function sendCriticallyLowStockEmail(
  inventoryItem: InventoryItemResponse
) {
  //get email list using mongo driver
  const appConfig = await MongoDriver.getEntities(AppConfigSchema)
  const emailList = appConfig[0].emails
  //create the email body
  const emailBody = createEmailBody(inventoryItem)

  const transporter = createTransport({
    /*TODO: change service when deploying*/
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL_ADDRESS,
      pass: process.env.FROM_EMAIL_PASSWORD,
    },
  })

  //put email credentials in env.local
  //email options
  const emailOptions = {
    from: `"CCAHT" <${process.env.FROM_EMAIL_ADDRESS || ''}>`,
    to: emailList.join(','),
    subject: `Critically Low Stock: ${inventoryItem.itemDefinition.name}`,
    text: emailBody,
  }

  await transporter.sendMail(emailOptions)
}

function createEmailBody(inventoryItem: InventoryItemResponse) {
  return `The following item is critically low in stock: \n
Name: ${inventoryItem.itemDefinition.name}
Category: ${inventoryItem.itemDefinition.category?.name || '—'}
Attributes: \n    ${
    inventoryItem.attributes
      ?.map(
        (inventoryItemAttribute) =>
          `${inventoryItemAttribute.attribute.name}: ${inventoryItemAttribute.value}`
      )
      .join('\n    ') || '—'
  }\n 
Assignee: ${inventoryItem.assignee?.name || '—'}
Current Quantity: ${inventoryItem.quantity} \n
Low Stock Threshold: ${
    inventoryItem.itemDefinition.lowStockThreshold === 0
      ? '—'
      : inventoryItem.itemDefinition.lowStockThreshold
  }
Critically Low Stock Threshold: ${
    inventoryItem.itemDefinition.criticalStockThreshold === 0
      ? '—'
      : inventoryItem.itemDefinition.criticalStockThreshold
  }\n
View here: ${process.env.NEXTAUTH_URL}${
    urls.pages.inventory
  }${constructQueryString(
    {
      search: inventoryItem.itemDefinition.name,
      category: inventoryItem.itemDefinition.category?.name || '',
      orderBy: 'quantity',
    },
    true
  )}`
}
