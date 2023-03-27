import InventoryItemList from 'components/InventoryItemList'
import { InventoryItemResponse } from 'utils/types'
import { useState, useEffect } from 'react'

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemResponse[]>(
    []
  )

  useEffect(() => {
    // TODO in the future, get a better way of constructing this URL. Perhaps a utils/urls.ts
    fetch(`http://localhost:3000/api/inventoryItems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setInventoryItems(res.payload as InventoryItemResponse[]))
  }, [])
  return (
    <>
      {inventoryItems != null && (
        <InventoryItemList
          inventoryItems={inventoryItems}
          search={''}
          category={''}
        />
      )}
    </>
  )
}
