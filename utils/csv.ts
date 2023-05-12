import { LogResponse } from './types'

export interface CsvRow {
  Item: string
  Attributes: string
  Category: string
  Quantity: number
  Staff: string
  Date: string
}
export function createLogsCsvAsString(logs: LogResponse[]) {
  /* Creates CSV-formatted string by:
   * 1. Create the header row
   * 2. creating a CsvRow obj
   * 3. converted obj to string by separating the object values by with a comma
   * 4. creating an array of CsvRow obj converted strings
   * 5. joining each array element with a newline
   */
  const csvKeys: (keyof CsvRow)[] = [
    'Item',
    'Attributes',
    'Category',
    'Quantity',
    'Staff',
    'Date',
  ]

  const csvKeysString: string = csvKeys.join(',')

  const csvData: CsvRow[] = logs.map((log) => {
    const csvRow: CsvRow = {
      Item: log.item.itemDefinition.name,
      Attributes:
        log.item.attributes
          ?.map((attr) => `${attr.attribute.name}: ${attr.value}`)
          .join('; ') ?? '',
      Category: log.item.itemDefinition.category?.name ?? '',
      Quantity: log.quantityDelta,
      Staff: log.staff.name,
      Date: new Date(log.date).toISOString(),
    }
    return csvRow
  })

  // sort rows by date
  const compareFn = (d1: Date, d2: Date) => {
    if (d1 < d2) {
      return -1
    }

    if (d1 > d2) {
      return 1
    }

    return 0
  }

  csvData.sort((row1: CsvRow, row2: CsvRow) =>
    compareFn(new Date(row2.Date), new Date(row1.Date))
  )

  const csvDataString: string = csvData
    .map((data) => Object.values(data).join(','))
    .join('\n')

  return `${csvKeysString}\n${csvDataString}`
}
